import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { DEFAULT_RATING, updateRating } from './rating';
import { CEFR_RATING } from './plan';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState(null); // { listening: {rating, placement_done, ...}, ... }
  const [plan, setPlan] = useState(null); // undefined-free: null = no plan yet (or not loaded)
  const [planChecked, setPlanChecked] = useState(false); // true once we know whether a plan exists
  const [theme, setTheme] = useState(() => localStorage.getItem('ia-theme') || 'light');
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('ia-theme', theme);
  }, [theme]);

  const loadProfileAndRatings = useCallback(async (userId) => {
    const [{ data: p }, { data: r }, { data: pl }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('skill_ratings').select('*').eq('user_id', userId),
      supabase.from('study_plans').select('*').eq('user_id', userId).maybeSingle(),
    ]);
    setProfile(p || null);
    const map = {};
    (r || []).forEach((row) => { map[row.skill] = row; });
    setRatings(map);
    setPlan(pl || null);
    setPlanChecked(true);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      if (data.session) loadProfileAndRatings(data.session.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      setSession(sess || null);
      if (sess) loadProfileAndRatings(sess.user.id);
      else { setProfile(null); setRatings(null); }
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfileAndRatings]);

  const signUp = useCallback(async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, display_name: username } },
    });
    if (error) throw error;
    return data;
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + import.meta.env.BASE_URL },
    });
    if (error) throw error;
  }, []);

  const signInAsGuest = useCallback(async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data;
  }, []);

  const sendPasswordReset = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + import.meta.env.BASE_URL,
    });
    if (error) throw error;
  }, []);

  const updatePassword = useCallback(async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    setRecovery(false);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // Record one finished practice session: updates rating + logs an attempt row.
  const recordAttempt = useCallback(async ({ skill, exerciseType, difficulty, scoreFraction, correct, meta, k }) => {
    if (!session) return null;
    const userId = session.user.id;
    const current = ratings?.[skill];
    const before = current?.rating ?? DEFAULT_RATING;
    const after = updateRating(before, difficulty, scoreFraction, k ?? (current?.placement_done ? 40 : 240));

    await supabase.from('attempts').insert({
      user_id: userId,
      skill,
      exercise_type: exerciseType,
      difficulty,
      correct: !!correct,
      rating_before: before,
      rating_after: after,
      meta: meta || null,
    });

    const placementDone = current?.placement_done ?? false;
    await supabase.from('skill_ratings').update({
      rating: after,
      attempts_count: (current?.attempts_count ?? 0) + 1,
      placement_done: true,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId).eq('skill', skill);

    setRatings((prev) => ({
      ...prev,
      [skill]: {
        ...(prev?.[skill] || {}),
        rating: after,
        attempts_count: (current?.attempts_count ?? 0) + 1,
        placement_done: true,
      },
    }));

    return { before, after, delta: after - before, placementDone };
  }, [session, ratings]);

  // Onboarding: optional CEFR self-report per skill, then a day/time-budget plan.
  const createPlan = useCallback(async ({ referral, totalDays, dailyMinutes, cefrBySkill }) => {
    if (!session) return null;
    const userId = session.user.id;
    const cefrEntries = Object.entries(cefrBySkill || {}).filter(([, v]) => v);
    await Promise.all(cefrEntries.map(([skill, level]) =>
      supabase.from('skill_ratings').update({
        rating: CEFR_RATING[level],
        placement_done: true,
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId).eq('skill', skill),
    ));
    const { data: pl, error } = await supabase.from('study_plans').insert({
      user_id: userId,
      referral_source: referral || null,
      total_days: totalDays,
      daily_minutes: dailyMinutes,
    }).select().single();
    if (error) throw error;

    setRatings((prev) => {
      const next = { ...prev };
      cefrEntries.forEach(([skill, level]) => {
        next[skill] = { ...(next[skill] || {}), rating: CEFR_RATING[level], placement_done: true };
      });
      return next;
    });
    setPlan(pl);
    return pl;
  }, [session]);

  const completeDay = useCallback(async () => {
    if (!session || !plan) return null;
    const next = Math.min(plan.days_completed + 1, plan.total_days);
    const { data, error } = await supabase.from('study_plans')
      .update({ days_completed: next })
      .eq('user_id', session.user.id)
      .select().single();
    if (error) throw error;
    setPlan(data);
    return data;
  }, [session, plan]);

  // Spaced-repetition error bank: wrong items come back after 1, then 3, 7, 14 days.
  const pushToReviewBank = useCallback(async ({ skill, exerciseType, item }) => {
    if (!session) return;
    await supabase.from('review_items').insert({
      user_id: session.user.id,
      skill,
      exercise_type: exerciseType,
      item,
      streak: 0,
      due_at: new Date(Date.now() + 86400000).toISOString(),
    });
  }, [session]);

  const fetchDueReviews = useCallback(async (skill, limit = 8) => {
    if (!session) return [];
    const { data } = await supabase.from('review_items')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('skill', skill)
      .lte('due_at', new Date().toISOString())
      .order('due_at', { ascending: true })
      .limit(limit);
    return data || [];
  }, [session]);

  const countDueReviews = useCallback(async (skill) => {
    if (!session) return 0;
    const { count } = await supabase.from('review_items')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('skill', skill)
      .lte('due_at', new Date().toISOString());
    return count || 0;
  }, [session]);

  const INTERVALS_DAYS = [3, 7, 14];
  const resolveReview = useCallback(async (reviewId, good) => {
    if (!session) return;
    if (!good) {
      await supabase.from('review_items').update({
        streak: 0,
        due_at: new Date(Date.now() + 86400000).toISOString(),
      }).eq('id', reviewId).eq('user_id', session.user.id);
      return;
    }
    const { data } = await supabase.from('review_items').select('streak').eq('id', reviewId).maybeSingle();
    const nextStreak = (data?.streak ?? 0) + 1;
    if (nextStreak >= 4) {
      await supabase.from('review_items').delete().eq('id', reviewId).eq('user_id', session.user.id);
    } else {
      await supabase.from('review_items').update({
        streak: nextStreak,
        due_at: new Date(Date.now() + INTERVALS_DAYS[nextStreak - 1] * 86400000).toISOString(),
      }).eq('id', reviewId).eq('user_id', session.user.id);
    }
  }, [session]);

  const value = useMemo(() => ({
    session, profile, ratings, theme, setTheme, recovery, plan, planChecked,
    loading: session === undefined,
    isGuest: !!session?.user?.is_anonymous,
    signUp, signIn, signInWithGoogle, signInAsGuest, signOut, recordAttempt,
    sendPasswordReset, updatePassword, createPlan, completeDay,
    pushToReviewBank, fetchDueReviews, countDueReviews, resolveReview,
    refresh: () => session && loadProfileAndRatings(session.user.id),
  }), [session, profile, ratings, plan, planChecked, theme, recovery, signUp, signIn, signInWithGoogle, signInAsGuest, signOut, recordAttempt, sendPasswordReset, updatePassword, createPlan, completeDay, pushToReviewBank, fetchDueReviews, countDueReviews, resolveReview, loadProfileAndRatings]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

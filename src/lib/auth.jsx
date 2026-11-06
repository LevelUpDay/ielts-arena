import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { DEFAULT_RATING, updateRating } from './rating';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState(null); // { listening: {rating, placement_done, ...}, ... }
  const [theme, setTheme] = useState(() => localStorage.getItem('ia-theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('ia-theme', theme);
  }, [theme]);

  const loadProfileAndRatings = useCallback(async (userId) => {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('skill_ratings').select('*').eq('user_id', userId),
    ]);
    setProfile(p || null);
    const map = {};
    (r || []).forEach((row) => { map[row.skill] = row; });
    setRatings(map);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      if (data.session) loadProfileAndRatings(data.session.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
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

  const value = useMemo(() => ({
    session, profile, ratings, theme, setTheme,
    loading: session === undefined,
    isGuest: !!session?.user?.is_anonymous,
    signUp, signIn, signInWithGoogle, signInAsGuest, signOut, recordAttempt,
    refresh: () => session && loadProfileAndRatings(session.user.id),
  }), [session, profile, ratings, theme, signUp, signIn, signInWithGoogle, signInAsGuest, signOut, recordAttempt, loadProfileAndRatings]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

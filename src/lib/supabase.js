import { createClient } from '@supabase/supabase-js';

// Public project URL + publishable (anon) key — safe to expose client-side.
const SUPABASE_URL = 'https://vlzsqfmqsfpafqfjgjmo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_GDTtIOzSSIjJM9s23iulYQ_P3Y_imaf';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

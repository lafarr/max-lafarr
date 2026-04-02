import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
if (supabaseUrl === undefined) {
  throw new Error('Missing SUPABASE_URL');
}

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (supabaseServiceRoleKey === undefined) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

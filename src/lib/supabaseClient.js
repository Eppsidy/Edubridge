import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const serviceRoleKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oknfigpjexiyudhbddry.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbmZpZ3BqZXhpeXVkaGJkZHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NTY1NDQsImV4cCI6MjA2NzAzMjU0NH0._f5W8G9t2x5bLzIWEnA0hkIktnJB6oUfnLrYFm29hF8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
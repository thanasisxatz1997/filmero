import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://vaqzgpnwmmlzdzfokmgx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhcXpncG53bW1semR6Zm9rbWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyODk1ODEsImV4cCI6MjA0Nzg2NTU4MX0.PRV8rNE4O5wNrAHXYaSgi_ffo3YcG5R3gkC3koCIBhM";
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabaseUrl };

export default supabase;

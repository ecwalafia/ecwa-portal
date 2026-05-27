import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.REACT_APP_SUPABASE_URL || "https://ttlfxmutfzdajgfryesn.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bGZ4bXV0ZnpkYWpnZnJ5ZXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDI2NzUsImV4cCI6MjA4ODM3ODY3NX0.zMriVY2bOMpg5FHrMF2ll7PIuOlJ0imLCjU_Nhhe-z0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

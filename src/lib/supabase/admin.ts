import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseAdminAuthClient: SupabaseClient | null = null;

export default function createSupabaseAdminAuthClient() {
  if (supabaseAdminAuthClient) {
    return supabaseAdminAuthClient;
  }

  supabaseAdminAuthClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return supabaseAdminAuthClient;
}

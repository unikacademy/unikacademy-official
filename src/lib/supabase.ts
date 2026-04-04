import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Browser / client-component client — uses the public anon key.
// Lazily created so missing env vars during build don't throw at module load.
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _client;
}

// Named export kept for convenience in client components
export const supabase = {
  get auth() {
    return getSupabase().auth;
  },
};

import { createBrowserClient } from "@supabase/ssr";

// Browser / client-component client — uses the public anon key.
// Uses @supabase/ssr so the session is cookie-based and readable by middleware.
export function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// Named export kept for convenience in client components
export const supabase = {
  get auth() {
    return getSupabase().auth;
  },
};

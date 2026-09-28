import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server client (route handlers, server components) — uses the anon key and
// the request's auth cookies, so it acts as the logged-in user and RLS applies.
// For full-access queries use `supabaseAdmin` instead.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a server component, where cookies are read-only.
            // Safe to ignore — middleware refreshes the session cookies.
          }
        },
      },
    },
  );
}

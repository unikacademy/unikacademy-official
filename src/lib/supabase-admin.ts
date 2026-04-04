import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only client — uses service role key, bypasses RLS.
// Lazily created so missing env vars during build don't throw at module load.
// Never import this in client components.
let _admin: SupabaseClient | null = null;

function getAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _admin;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getAdmin() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

/**
 * Converts a Supabase row (snake_case) to the shape the rest of the app
 * expects (camelCase + `_id` alias for the `id` UUID field).
 */
function camelize(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function toRecord(
  row: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    result[camelize(key)] = value;
  }
  result._id = result.id;
  return result;
}

export function toRecords(
  rows: Record<string, unknown>[],
): Record<string, unknown>[] {
  return rows.map(toRecord);
}

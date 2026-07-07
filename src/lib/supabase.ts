import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

function isPublishableKey(key: string): boolean {
  return key.startsWith("sb_publishable_");
}

/**
 * Publishable keys are not JWTs. supabase-js sends them as Bearer by default,
 * which causes 401. Strip that header when it matches the publishable key.
 */
function createPublishableKeyFetch(key: string): typeof fetch {
  return async (input, init) => {
    const headers = new Headers(init?.headers);

    if (isPublishableKey(key)) {
      const auth = headers.get("Authorization");
      if (auth === `Bearer ${key}`) {
        headers.delete("Authorization");
      }
    }

    return fetch(input, { ...init, headers });
  };
}

function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: createPublishableKeyFetch(supabaseAnonKey),
    },
  });
}

export const supabase = createSupabaseClient();

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

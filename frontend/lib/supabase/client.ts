import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowser() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    "";

  if (!url || !key) {
    throw new Error("Missing Supabase configuration");
  }

  const storageKey = `sb-${new URL(url).hostname}-auth-token`;

  if (!browserClient) {
    browserClient = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storageKey,
        storage: typeof window === "undefined" ? undefined : window.localStorage,
      },
    });
  }

  return browserClient;
}

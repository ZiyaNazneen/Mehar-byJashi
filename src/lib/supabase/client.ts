import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates or retrieves a singleton typed Supabase browser client.
 * Returns null if Supabase environment variables are not yet configured.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project-id")) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return clientInstance;
}

/**
 * Checks whether Supabase credentials have been configured in environment variables.
 */
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("your-project-id") &&
      !supabaseAnonKey.includes("your-supabase-anon-key")
  );
}

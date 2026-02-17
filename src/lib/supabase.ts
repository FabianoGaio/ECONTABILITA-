import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ─── Browser client (singleton) ───────────────────────────
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowser() {
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

// ─── Server admin client: bypassa RLS. Usare SOLO nelle API route. ────
// Creato solo lato server dove SUPABASE_SERVICE_ROLE_KEY e' disponibile.
// Nel browser la variabile e' vuota, quindi evitiamo di chiamare createClient.
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : (null as unknown as ReturnType<typeof createClient>);

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-'));
}

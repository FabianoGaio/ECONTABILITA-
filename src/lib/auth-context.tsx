'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { isDemoMode } from './demo-data';

/**
 * Auth semplificata: l'utente inserisce solo NomeCognome.
 * Internamente usiamo Supabase Auth con email fittizia e password fissa.
 */
const FIXED_PASSWORD = 'econtabilita2026!';

function nameToEmail(nomeCognome: string): string {
  const slug = nomeCognome
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '');
  return `${slug}@econtabilita.local`;
}

interface Profilo {
  id: string;
  nome: string;
  cognome: string;
  ruolo: string;
}

interface Esercizio {
  id: string;
  user_id: string;
  anno: number;
  descrizione: string;
}

interface AuthContextType {
  user: User | null;
  profilo: Profilo | null;
  esercizi: Esercizio[];
  esercizioAttivo: Esercizio | null;
  setEsercizioAttivo: (e: Esercizio) => void;
  loading: boolean;
  isDemo: boolean;
  accedi: (nomeCognome: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshEsercizi: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isDemo = isDemoMode();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profilo, setProfilo] = useState<Profilo | null>(null);
  const [esercizi, setEsercizi] = useState<Esercizio[]>([]);
  const [esercizioAttivo, setEsercizioAttivoState] = useState<Esercizio | null>(null);
  const [loading, setLoading] = useState(!isDemo);

  const setEsercizioAttivo = useCallback((e: Esercizio) => {
    setEsercizioAttivoState(e);
    if (typeof window !== 'undefined') {
      localStorage.setItem('esercizio_attivo_id', e.id);
    }
  }, []);

  const fetchProfilo = useCallback(async (userId: string) => {
    try {
      const { createSupabaseBrowser } = await import('./supabase');
      const sb = createSupabaseBrowser();
      const { data } = await sb.from('profili').select('*').eq('id', userId).single();
      if (data) setProfilo(data);
    } catch {
      // profilo non ancora creato
    }
  }, []);

  const refreshEsercizi = useCallback(async () => {
    if (!user) return;
    try {
      const { createSupabaseBrowser } = await import('./supabase');
      const sb = createSupabaseBrowser();

      await sb.rpc('setup_nuovo_utente', { p_user_id: user.id });

      const { data } = await sb.from('esercizi').select('*').eq('user_id', user.id).order('anno');
      if (data && data.length > 0) {
        setEsercizi(data);
        const savedId = typeof window !== 'undefined' ? localStorage.getItem('esercizio_attivo_id') : null;
        const saved = savedId ? data.find((e: Esercizio) => e.id === savedId) : null;
        setEsercizioAttivoState(saved || data[data.length - 1]);
      }
    } catch (err) {
      console.error('Errore caricamento esercizi:', err);
    }
  }, [user]);

  useEffect(() => {
    if (isDemo) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const initAuth = async () => {
      try {
        const { createSupabaseBrowser } = await import('./supabase');
        const sb = createSupabaseBrowser();

        const { data: { session: currentSession } } = await sb.auth.getSession();
        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
        }
        setLoading(false);

        const { data: { subscription } } = sb.auth.onAuthStateChange((_event, newSession) => {
          if (!mounted) return;
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (!newSession?.user) {
            setProfilo(null);
            setEsercizi([]);
            setEsercizioAttivoState(null);
          }
        });

        return () => subscription.unsubscribe();
      } catch {
        if (mounted) setLoading(false);
      }
    };

    initAuth();
    return () => { mounted = false; };
  }, [isDemo]);

  useEffect(() => {
    if (user && !isDemo) {
      fetchProfilo(user.id);
      refreshEsercizi();
    }
  }, [user, isDemo, fetchProfilo, refreshEsercizi]);

  const accedi = async (nomeCognome: string) => {
    const trimmed = nomeCognome.trim();
    if (trimmed.length < 2) {
      return { error: 'Inserisci il tuo Nome e Cognome' };
    }

    try {
      const { createSupabaseBrowser } = await import('./supabase');
      const sb = createSupabaseBrowser();
      const email = nameToEmail(trimmed);

      // Prova login diretto
      const { error: loginErr } = await sb.auth.signInWithPassword({
        email,
        password: FIXED_PASSWORD,
      });

      if (!loginErr) return {};

      // Se non esiste, crea utente via API server-side (bypassa rate limit ed email)
      if (loginErr.message === 'Invalid login credentials') {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nomeCognome: trimmed }),
        });

        const data = await res.json();
        if (data.error) return { error: data.error };

        // Ora fai login con le credenziali create
        const { error: loginErr2 } = await sb.auth.signInWithPassword({
          email,
          password: FIXED_PASSWORD,
        });

        if (loginErr2) {
          return { error: 'Account creato. Riprova ad accedere.' };
        }

        return {};
      }

      return { error: loginErr.message };
    } catch (err: unknown) {
      console.error('accedi error:', err);
      const msg = err instanceof Error ? err.message : 'Errore di connessione';
      return { error: msg };
    }
  };

  const signOut = async () => {
    try {
      const { createSupabaseBrowser } = await import('./supabase');
      const sb = createSupabaseBrowser();
      await sb.auth.signOut();
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profilo,
        esercizi,
        esercizioAttivo,
        setEsercizioAttivo,
        loading,
        isDemo,
        accedi,
        signOut,
        refreshEsercizi,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

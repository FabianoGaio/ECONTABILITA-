import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const FIXED_PASSWORD = 'econtabilita2026!';

function nameToEmail(nomeCognome: string): string {
  const slug = nomeCognome
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '');
  return `${slug}@econtabilita.local`;
}

export async function POST(req: NextRequest) {
  try {
    const { nomeCognome } = await req.json();
    const trimmed = (nomeCognome || '').trim();

    if (trimmed.length < 2) {
      return NextResponse.json({ error: 'Inserisci il tuo Nome e Cognome' }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const email = nameToEmail(trimmed);
    const parts = trimmed.split(/\s+/);
    const nome = parts[0] || trimmed;
    const cognome = parts.slice(1).join(' ') || '';

    // Controlla se l'utente esiste gia'
    const { data: existingUsers } = await admin.auth.admin.listUsers({ perPage: 1 });
    const allUsers = existingUsers?.users || [];

    // Cerca per email tra tutti gli utenti
    const { data: userData } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const found = (userData?.users || []).find(u => u.email === email);

    if (found) {
      // Utente esiste, il client fara' login direttamente
      return NextResponse.json({ exists: true, email });
    }

    // Crea utente via admin API: bypassa email, rate limit, e conferma automaticamente
    const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: FIXED_PASSWORD,
      email_confirm: true,
      user_metadata: { nome, cognome },
    });

    if (createErr) {
      console.error('Admin createUser error:', createErr);
      return NextResponse.json({ error: createErr.message }, { status: 500 });
    }

    return NextResponse.json({ exists: false, email, userId: newUser.user.id });
  } catch (err) {
    console.error('Auth API error:', err);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

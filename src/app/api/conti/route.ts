import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode, PIANO_CONTI } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const esercizioId = searchParams.get('esercizio_id');

  if (isDemoMode()) {
    return NextResponse.json([...PIANO_CONTI].sort((a, b) => a.codice.localeCompare(b.codice)));
  }

  const { supabaseAdmin } = await import('@/lib/supabase');
  let query = supabaseAdmin.from('piano_conti').select('*').order('codice');
  if (esercizioId) query = query.eq('esercizio_id', esercizioId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.json({ error: 'Modalita demo: inserimento non disponibile. Configura Supabase.' }, { status: 400 });
  }

  const { supabaseAdmin } = await import('@/lib/supabase');
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from('piano_conti').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode, BUDGET_DEMO } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const esercizio = parseInt(searchParams.get('esercizio') || '2025');
  const esercizioId = searchParams.get('esercizio_id');

  if (isDemoMode()) {
    return NextResponse.json(BUDGET_DEMO.filter(b => b.esercizio === esercizio));
  }

  const { supabaseAdmin } = await import('@/lib/supabase');
  let query = supabaseAdmin.from('budget').select('*').order('mese');
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
  const { data, error } = await supabaseAdmin.from('budget').upsert(body).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

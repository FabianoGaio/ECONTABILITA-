import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode, getScrittureConConto } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const esercizio = parseInt(searchParams.get('esercizio') || '2025');
  const esercizioId = searchParams.get('esercizio_id');

  if (isDemoMode()) {
    return NextResponse.json(getScrittureConConto(esercizio));
  }

  const { supabaseAdmin } = await import('@/lib/supabase');
  let query = supabaseAdmin
    .from('scritture_assestamento')
    .select('*, conto_dare_rel:piano_conti!conto_dare(*), conto_avere_rel:piano_conti!conto_avere(*)')
    .order('data', { ascending: true });
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
  const { data, error } = await supabaseAdmin
    .from('scritture_assestamento')
    .insert(body)
    .select('*, conto_dare_rel:piano_conti!conto_dare(*), conto_avere_rel:piano_conti!conto_avere(*)')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.json({ error: 'Modalita demo' }, { status: 400 });
  }
  const { supabaseAdmin } = await import('@/lib/supabase');
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 });
  const { error } = await supabaseAdmin.from('scritture_assestamento').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

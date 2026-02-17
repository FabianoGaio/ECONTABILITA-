import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode, getOperazioniConConto } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const esercizio = parseInt(searchParams.get('esercizio') || '2025');
  const esercizioId = searchParams.get('esercizio_id');

  if (isDemoMode()) {
    return NextResponse.json(getOperazioniConConto(esercizio));
  }

  const { supabaseAdmin } = await import('@/lib/supabase');
  const conto_id = searchParams.get('conto_id');
  let query = supabaseAdmin.from('operazioni').select('*, conto:piano_conti(*)').order('data', { ascending: true });
  if (esercizioId) query = query.eq('esercizio_id', esercizioId);
  if (conto_id) query = query.eq('conto_id', conto_id);
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
  if (Array.isArray(body)) {
    let totaleDare = 0, totaleAvere = 0;
    body.forEach((op: { dare_avere: string; importo: number }) => {
      if (op.dare_avere === 'dare') totaleDare += op.importo;
      else totaleAvere += op.importo;
    });
    if (Math.abs(totaleDare - totaleAvere) > 0.01) {
      return NextResponse.json({ error: 'La scrittura non quadra: dare e avere devono essere uguali' }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin.from('operazioni').insert(body).select('*, conto:piano_conti(*)');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  }
  const { data, error } = await supabaseAdmin.from('operazioni').insert(body).select('*, conto:piano_conti(*)').single();
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
  const { error } = await supabaseAdmin.from('operazioni').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from 'next/server';
import {
  calcolaSaldi,
  calcolaStatoPatrimoniale,
  calcolaContoEconomico,
  calcolaRendicontoFinanziario,
  calcolaRiclassificazione,
  calcolaIndici,
  calcolaAnalisiGestionale,
} from '@/lib/calcoli';
import {
  isDemoMode,
  PIANO_CONTI,
  OPERAZIONI_DEMO,
  SCRITTURE_DEMO,
} from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const esercizio = parseInt(searchParams.get('esercizio') || '2025');
  const esercizioId = searchParams.get('esercizio_id');

  let conti, operazioni, scritture;

  if (isDemoMode()) {
    conti = PIANO_CONTI;
    operazioni = OPERAZIONI_DEMO.filter(o => o.esercizio === esercizio);
    scritture = SCRITTURE_DEMO.filter(s => s.esercizio === esercizio);
  } else {
    const { supabaseAdmin } = await import('@/lib/supabase');

    const contiQuery = supabaseAdmin.from('piano_conti').select('*').order('codice');
    const opQuery = supabaseAdmin.from('operazioni').select('*');
    const scrQuery = supabaseAdmin.from('scritture_assestamento').select('*');

    if (esercizioId) {
      contiQuery.eq('esercizio_id', esercizioId);
      opQuery.eq('esercizio_id', esercizioId);
      scrQuery.eq('esercizio_id', esercizioId);
    }

    const [contiRes, opRes, scrRes] = await Promise.all([contiQuery, opQuery, scrQuery]);

    if (contiRes.error || opRes.error || scrRes.error) {
      return NextResponse.json({ error: 'Errore nel caricamento dati' }, { status: 500 });
    }
    conti = contiRes.data || [];
    operazioni = opRes.data || [];
    scritture = scrRes.data || [];
  }

  const saldi = calcolaSaldi(conti, operazioni, scritture);
  const sp = calcolaStatoPatrimoniale(saldi);
  const ce = calcolaContoEconomico(saldi);
  const rf = calcolaRendicontoFinanziario(saldi);
  const ricl = calcolaRiclassificazione(sp);
  const indici = calcolaIndici(sp, ce, ricl);
  const gestionale = calcolaAnalisiGestionale(ce);

  return NextResponse.json({
    esercizio,
    saldi,
    stato_patrimoniale: sp,
    conto_economico: ce,
    rendiconto_finanziario: rf,
    riclassificazione: ricl,
    indici,
    gestionale,
    scritture,
    conti,
  });
}

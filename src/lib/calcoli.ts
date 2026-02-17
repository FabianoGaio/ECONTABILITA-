/**
 * MOTORE DI CALCOLO CONTABILE
 * Tutte le funzioni di calcolo per bilancio, riclassificazione, indici
 */

import type {
  PianoConto,
  Operazione,
  ScritturaAssestamento,
  SaldoConto,
  StatoPatrimoniale,
  ContoEconomico,
  RendicontoFinanziario,
  Riclassificazione,
  IndiciAnalisi,
  AnalisiGestionale,
} from '@/types';

// ─── CALCOLO SALDI ────────────────────────────────────────

export function calcolaSaldi(
  conti: PianoConto[],
  operazioni: Operazione[],
  scritture: ScritturaAssestamento[]
): SaldoConto[] {
  const saldi = new Map<string, { dare: number; avere: number }>();

  conti.forEach((c) => saldi.set(c.id, { dare: 0, avere: 0 }));

  operazioni.forEach((op) => {
    const s = saldi.get(op.conto_id);
    if (s) {
      if (op.dare_avere === 'dare') s.dare += op.importo;
      else s.avere += op.importo;
    }
  });

  scritture.forEach((sc) => {
    const sd = saldi.get(sc.conto_dare);
    const sa = saldi.get(sc.conto_avere);
    if (sd) sd.dare += sc.importo;
    if (sa) sa.avere += sc.importo;
  });

  return conti.map((conto) => {
    const s = saldi.get(conto.id) || { dare: 0, avere: 0 };
    let saldo = 0;

    if (conto.categoria === 'attivo' || conto.categoria === 'costi') {
      saldo = s.dare - s.avere;
    } else {
      saldo = s.avere - s.dare;
    }

    return { conto, dare: s.dare, avere: s.avere, saldo };
  });
}

// ─── QUADRATURA PARTITA DOPPIA ────────────────────────────

export function verificaQuadratura(operazioni: Operazione[]): {
  totaleDare: number;
  totaleAvere: number;
  quadra: boolean;
} {
  let totaleDare = 0;
  let totaleAvere = 0;

  operazioni.forEach((op) => {
    if (op.dare_avere === 'dare') totaleDare += op.importo;
    else totaleAvere += op.importo;
  });

  return {
    totaleDare: Math.round(totaleDare * 100) / 100,
    totaleAvere: Math.round(totaleAvere * 100) / 100,
    quadra: Math.abs(totaleDare - totaleAvere) < 0.01,
  };
}

// ─── STATO PATRIMONIALE ───────────────────────────────────

export function calcolaStatoPatrimoniale(saldi: SaldoConto[]): StatoPatrimoniale {
  const sommaSottocategoria = (sottocategorie: string[]) =>
    saldi
      .filter((s) => sottocategorie.includes(s.conto.sottocategoria))
      .reduce((sum, s) => sum + s.saldo, 0);

  const immobilizzazioni_immateriali = sommaSottocategoria(['immobilizzazioni_immateriali']);
  const immobilizzazioni_materiali = sommaSottocategoria(['immobilizzazioni_materiali']);
  const immobilizzazioni_finanziarie = sommaSottocategoria(['immobilizzazioni_finanziarie']);
  const totale_immobilizzazioni =
    immobilizzazioni_immateriali + immobilizzazioni_materiali + immobilizzazioni_finanziarie;

  const rimanenze = sommaSottocategoria(['rimanenze']);
  const crediti = sommaSottocategoria(['crediti']);
  const disponibilita_liquide = sommaSottocategoria(['disponibilita_liquide']);
  const ratei_risconti_attivi = sommaSottocategoria(['ratei_risconti_attivi']);
  const totale_attivo_circolante = rimanenze + crediti + disponibilita_liquide + ratei_risconti_attivi;
  const totale_attivo = totale_immobilizzazioni + totale_attivo_circolante;

  const pn_conti = saldi.filter((s) => s.conto.sottocategoria === 'patrimonio_netto');
  const capitale_sociale = pn_conti
    .filter((s) => s.conto.codice === '3.1.01')
    .reduce((sum, s) => sum + s.saldo, 0);
  const riserve = pn_conti
    .filter((s) => ['3.1.02', '3.1.03'].includes(s.conto.codice))
    .reduce((sum, s) => sum + s.saldo, 0);
  const utile_riportato = pn_conti
    .filter((s) => s.conto.codice === '3.1.04')
    .reduce((sum, s) => sum + s.saldo, 0);

  const ce = calcolaContoEconomico(saldi);
  const utile_esercizio = ce.utile_netto;

  const totale_patrimonio_netto = capitale_sociale + riserve + utile_riportato + utile_esercizio;

  const fondi_rischi = sommaSottocategoria(['fondi_rischi']);
  const tfr = sommaSottocategoria(['tfr']);
  const debiti_finanziari = sommaSottocategoria(['debiti_finanziari']);
  const debiti_commerciali = sommaSottocategoria(['debiti_commerciali']);
  const ratei_risconti_passivi = sommaSottocategoria(['ratei_risconti_passivi']);
  const totale_debiti = fondi_rischi + tfr + debiti_finanziari + debiti_commerciali + ratei_risconti_passivi;
  const totale_passivo = totale_patrimonio_netto + totale_debiti;

  return {
    attivo: {
      immobilizzazioni_immateriali,
      immobilizzazioni_materiali,
      immobilizzazioni_finanziarie,
      totale_immobilizzazioni,
      rimanenze,
      crediti,
      disponibilita_liquide,
      ratei_risconti_attivi,
      totale_attivo_circolante,
      totale_attivo,
    },
    passivo: {
      capitale_sociale,
      riserve,
      utile_esercizio,
      totale_patrimonio_netto,
      fondi_rischi,
      tfr,
      debiti_finanziari,
      debiti_commerciali,
      ratei_risconti_passivi,
      totale_debiti,
      totale_passivo,
    },
    quadratura: Math.abs(totale_attivo - totale_passivo) < 0.01,
  };
}

// ─── CONTO ECONOMICO ──────────────────────────────────────

export function calcolaContoEconomico(saldi: SaldoConto[]): ContoEconomico {
  const sommaSotto = (sotto: string[]) =>
    saldi.filter((s) => sotto.includes(s.conto.sottocategoria)).reduce((sum, s) => sum + s.saldo, 0);

  const ricavi_vendite = sommaSotto(['ricavi_vendite']);
  const variazione_rimanenze = sommaSotto(['variazione_rimanenze']);
  const altri_ricavi = sommaSotto(['altri_ricavi']);
  const valore_produzione = ricavi_vendite + variazione_rimanenze + altri_ricavi;

  const costi_acquisti = sommaSotto(['costi_acquisti']);
  const costi_servizi = sommaSotto(['costi_servizi']);
  const godimento_beni_terzi = sommaSotto(['godimento_beni_terzi']);
  const costi_personale = sommaSotto(['personale']);
  const ammortamenti = sommaSotto(['ammortamenti']);
  const altri_costi = sommaSotto(['altri_costi']);
  const totale_costi_operativi =
    costi_acquisti + costi_servizi + godimento_beni_terzi + costi_personale + ammortamenti + altri_costi;

  const ebitda = valore_produzione - costi_acquisti - costi_servizi - godimento_beni_terzi - costi_personale - altri_costi;
  const ebit = ebitda - ammortamenti;

  const oneri_finanziari = sommaSotto(['oneri_finanziari']);
  const proventi_finanziari = sommaSotto(['proventi_finanziari']);

  const utile_ante_imposte = ebit - oneri_finanziari + proventi_finanziari;

  const imposte = sommaSotto(['imposte']);
  const utile_netto = utile_ante_imposte - imposte;

  return {
    ricavi_vendite,
    variazione_rimanenze,
    altri_ricavi,
    valore_produzione,
    costi_acquisti,
    costi_servizi,
    godimento_beni_terzi,
    costi_personale,
    ammortamenti,
    altri_costi,
    totale_costi_operativi,
    ebitda,
    ebit,
    oneri_finanziari,
    proventi_finanziari,
    utile_ante_imposte,
    imposte,
    utile_netto,
  };
}

// ─── RENDICONTO FINANZIARIO (Metodo Indiretto) ───────────

export function calcolaRendicontoFinanziario(
  saldi: SaldoConto[],
  saldiPrecedente?: SaldoConto[]
): RendicontoFinanziario {
  const ce = calcolaContoEconomico(saldi);
  const sp = calcolaStatoPatrimoniale(saldi);

  const getSaldoSottocategoria = (list: SaldoConto[], sotto: string) =>
    list.filter((s) => s.conto.sottocategoria === sotto).reduce((sum, s) => sum + s.saldo, 0);

  const creditiPrec = saldiPrecedente ? getSaldoSottocategoria(saldiPrecedente, 'crediti') : 0;
  const rimanenzePrec = saldiPrecedente ? getSaldoSottocategoria(saldiPrecedente, 'rimanenze') : 0;
  const debitiCommPrec = saldiPrecedente ? getSaldoSottocategoria(saldiPrecedente, 'debiti_commerciali') : 0;
  const tfrPrec = saldiPrecedente ? getSaldoSottocategoria(saldiPrecedente, 'tfr') : 0;
  const fondiPrec = saldiPrecedente ? getSaldoSottocategoria(saldiPrecedente, 'fondi_rischi') : 0;

  const variazione_crediti = sp.attivo.crediti - creditiPrec;
  const variazione_rimanenze = sp.attivo.rimanenze - rimanenzePrec;
  const variazione_debiti = sp.passivo.debiti_commerciali - debitiCommPrec;
  const variazione_tfr = sp.passivo.tfr - tfrPrec;
  const variazione_fondi = sp.passivo.fondi_rischi - fondiPrec;

  const cash_flow_operativo =
    ce.utile_netto +
    ce.ammortamenti -
    variazione_crediti -
    variazione_rimanenze +
    variazione_debiti +
    variazione_tfr +
    variazione_fondi;

  const immobPrec = saldiPrecedente
    ? saldiPrecedente
        .filter((s) =>
          ['immobilizzazioni_immateriali', 'immobilizzazioni_materiali', 'immobilizzazioni_finanziarie'].includes(
            s.conto.sottocategoria
          )
        )
        .reduce((sum, s) => sum + s.saldo, 0)
    : 0;
  const investimenti_immobilizzazioni = sp.attivo.totale_immobilizzazioni - immobPrec + ce.ammortamenti;
  const cash_flow_investimenti = -investimenti_immobilizzazioni;

  const debFinPrec = saldiPrecedente ? getSaldoSottocategoria(saldiPrecedente, 'debiti_finanziari') : 0;
  const pnPrec = saldiPrecedente
    ? saldiPrecedente
        .filter((s) => s.conto.sottocategoria === 'patrimonio_netto')
        .reduce((sum, s) => sum + s.saldo, 0)
    : 0;

  const variazione_debiti_finanziari = sp.passivo.debiti_finanziari - debFinPrec;
  const variazione_patrimonio = sp.passivo.totale_patrimonio_netto - ce.utile_netto - pnPrec;
  const cash_flow_finanziamenti = variazione_debiti_finanziari + variazione_patrimonio;

  const variazione_liquidita = cash_flow_operativo + cash_flow_investimenti + cash_flow_finanziamenti;

  return {
    utile_netto: ce.utile_netto,
    ammortamenti: ce.ammortamenti,
    variazione_crediti,
    variazione_rimanenze,
    variazione_debiti,
    variazione_tfr,
    variazione_fondi,
    cash_flow_operativo,
    investimenti_immobilizzazioni,
    cash_flow_investimenti,
    variazione_debiti_finanziari,
    variazione_patrimonio,
    cash_flow_finanziamenti,
    variazione_liquidita,
  };
}

// ─── RICLASSIFICAZIONE ────────────────────────────────────

export function calcolaRiclassificazione(sp: StatoPatrimoniale): Riclassificazione {
  const attivo_fisso = sp.attivo.totale_immobilizzazioni;
  const capitale_circolante_lordo = sp.attivo.rimanenze + sp.attivo.crediti + sp.attivo.ratei_risconti_attivi;
  const liquidita_immediate = sp.attivo.disponibilita_liquide;
  const totale_impieghi = attivo_fisso + capitale_circolante_lordo + liquidita_immediate;

  const patrimonio_netto = sp.passivo.totale_patrimonio_netto;
  const passivita_consolidate = sp.passivo.fondi_rischi + sp.passivo.tfr + sp.passivo.debiti_finanziari;
  const passivita_correnti =
    sp.passivo.debiti_commerciali + sp.passivo.ratei_risconti_passivi;
  const totale_fonti = patrimonio_netto + passivita_consolidate + passivita_correnti;

  const capitale_circolante_netto = capitale_circolante_lordo + liquidita_immediate - passivita_correnti;
  const margine_struttura = patrimonio_netto + passivita_consolidate - attivo_fisso;

  return {
    attivo_fisso,
    capitale_circolante_lordo,
    liquidita_immediate,
    totale_impieghi,
    patrimonio_netto,
    passivita_consolidate,
    passivita_correnti,
    totale_fonti,
    capitale_circolante_netto,
    margine_struttura,
  };
}

// ─── ANALISI PER INDICI ──────────────────────────────────

export function calcolaIndici(
  sp: StatoPatrimoniale,
  ce: ContoEconomico,
  ricl: Riclassificazione
): IndiciAnalisi {
  const safe = (n: number, d: number) => (d !== 0 ? (n / d) * 100 : 0);

  const autonomia_finanziaria = safe(sp.passivo.totale_patrimonio_netto, sp.attivo.totale_attivo);
  const leverage = sp.passivo.totale_patrimonio_netto !== 0
    ? sp.attivo.totale_attivo / sp.passivo.totale_patrimonio_netto
    : 0;
  const copertura_immobilizzazioni = safe(
    sp.passivo.totale_patrimonio_netto + sp.passivo.fondi_rischi + sp.passivo.tfr + sp.passivo.debiti_finanziari,
    sp.attivo.totale_immobilizzazioni
  );

  const attivo_corrente = sp.attivo.totale_attivo_circolante;
  const passivo_corrente = ricl.passivita_correnti;

  const current_ratio = passivo_corrente !== 0 ? attivo_corrente / passivo_corrente : 0;
  const quick_ratio =
    passivo_corrente !== 0
      ? (attivo_corrente - sp.attivo.rimanenze) / passivo_corrente
      : 0;
  const cash_ratio =
    passivo_corrente !== 0 ? sp.attivo.disponibilita_liquide / passivo_corrente : 0;

  const roe = safe(ce.utile_netto, sp.passivo.totale_patrimonio_netto);
  const roi = safe(ce.ebit, sp.attivo.totale_attivo);
  const ros = safe(ce.ebit, ce.ricavi_vendite);
  const roa = safe(ce.utile_netto, sp.attivo.totale_attivo);

  const rotazione_magazzino =
    sp.attivo.rimanenze !== 0 ? ce.costi_acquisti / sp.attivo.rimanenze : 0;
  const dso =
    ce.ricavi_vendite !== 0 ? (sp.attivo.crediti / ce.ricavi_vendite) * 365 : 0;
  const dpo =
    ce.costi_acquisti !== 0 ? (sp.passivo.debiti_commerciali / ce.costi_acquisti) * 365 : 0;
  const ciclo_monetario = dso + (rotazione_magazzino !== 0 ? 365 / rotazione_magazzino : 0) - dpo;

  return {
    solidita: {
      autonomia_finanziaria: Math.round(autonomia_finanziaria * 100) / 100,
      leverage: Math.round(leverage * 100) / 100,
      copertura_immobilizzazioni: Math.round(copertura_immobilizzazioni * 100) / 100,
    },
    liquidita: {
      current_ratio: Math.round(current_ratio * 100) / 100,
      quick_ratio: Math.round(quick_ratio * 100) / 100,
      cash_ratio: Math.round(cash_ratio * 100) / 100,
    },
    redditivita: {
      roe: Math.round(roe * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      ros: Math.round(ros * 100) / 100,
      roa: Math.round(roa * 100) / 100,
    },
    efficienza: {
      rotazione_magazzino: Math.round(rotazione_magazzino * 100) / 100,
      dso: Math.round(dso),
      dpo: Math.round(dpo),
      ciclo_monetario: Math.round(ciclo_monetario),
    },
  };
}

// ─── ANALISI GESTIONALE ──────────────────────────────────

export function calcolaAnalisiGestionale(
  ce: ContoEconomico,
  percentualeCostiFissi: number = 60
): AnalisiGestionale {
  const costi_totali = ce.totale_costi_operativi;
  const costi_fissi = (costi_totali * percentualeCostiFissi) / 100;
  const costi_variabili = costi_totali - costi_fissi;
  const ricavi_totali = ce.valore_produzione;

  const margine_contribuzione = ricavi_totali - costi_variabili;
  const margine_contribuzione_percentuale =
    ricavi_totali !== 0 ? (margine_contribuzione / ricavi_totali) * 100 : 0;

  const break_even_point =
    margine_contribuzione_percentuale !== 0
      ? (costi_fissi / margine_contribuzione_percentuale) * 100
      : 0;

  const margine_sicurezza =
    ricavi_totali !== 0 ? ((ricavi_totali - break_even_point) / ricavi_totali) * 100 : 0;

  return {
    costi_fissi: Math.round(costi_fissi * 100) / 100,
    costi_variabili: Math.round(costi_variabili * 100) / 100,
    ricavi_totali: Math.round(ricavi_totali * 100) / 100,
    margine_contribuzione: Math.round(margine_contribuzione * 100) / 100,
    margine_contribuzione_percentuale: Math.round(margine_contribuzione_percentuale * 100) / 100,
    break_even_point: Math.round(break_even_point * 100) / 100,
    margine_sicurezza: Math.round(margine_sicurezza * 100) / 100,
  };
}

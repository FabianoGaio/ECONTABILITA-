/**
 * GENERAZIONE PDF FAC-SIMILE BILANCIO UFFICIALE
 * Layout stile bilancio depositato CCIAA
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type {
  StatoPatrimoniale,
  ContoEconomico,
  RendicontoFinanziario,
  Riclassificazione,
  IndiciAnalisi,
  ScritturaAssestamento,
  PianoConto,
} from '@/types';
import { formatCurrency, formatPercentage } from './utils';

interface BilancioData {
  esercizio: number;
  ragioneSociale: string;
  sp: StatoPatrimoniale;
  ce: ContoEconomico;
  rf: RendicontoFinanziario;
  ricl: Riclassificazione;
  indici: IndiciAnalisi;
  scritture: ScritturaAssestamento[];
  conti: PianoConto[];
}

function fmtEur(n: number): string {
  return new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function generaBilancioPDF(data: BilancioData): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  const addHeader = () => {
    doc.setFillColor(26, 54, 93);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('BILANCIO DI ESERCIZIO', pageWidth / 2, 14, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Esercizio chiuso al 31/12/${data.esercizio}`, pageWidth / 2, 22, { align: 'center' });
    doc.setFontSize(10);
    doc.text(data.ragioneSociale || 'Società Didattica S.r.l.', pageWidth / 2, 30, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y = 45;
  };

  const addSectionTitle = (title: string) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(41, 82, 138);
    doc.rect(10, y - 5, pageWidth - 20, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
  };

  const addSubTitle = (title: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, y);
    y += 6;
  };

  // ─── COPERTINA ──────────────────────────────────────

  addHeader();

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('FAC-SIMILE a scopo didattico - Conforme allo schema civilistico ex art. 2424/2425 c.c.', pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.setFontSize(8);
  doc.text('Principi contabili OIC', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // ─── STATO PATRIMONIALE ─────────────────────────────

  addSectionTitle('STATO PATRIMONIALE - ATTIVO (art. 2424 c.c.)');

  autoTable(doc, {
    startY: y,
    head: [['Voce', 'Importo €']],
    body: [
      ['B) IMMOBILIZZAZIONI', ''],
      ['  B.I - Immobilizzazioni immateriali', fmtEur(data.sp.attivo.immobilizzazioni_immateriali)],
      ['  B.II - Immobilizzazioni materiali', fmtEur(data.sp.attivo.immobilizzazioni_materiali)],
      ['  B.III - Immobilizzazioni finanziarie', fmtEur(data.sp.attivo.immobilizzazioni_finanziarie)],
      [{ content: 'Totale immobilizzazioni (B)', styles: { fontStyle: 'bold' } }, { content: fmtEur(data.sp.attivo.totale_immobilizzazioni), styles: { fontStyle: 'bold' } }],
      ['C) ATTIVO CIRCOLANTE', ''],
      ['  C.I - Rimanenze', fmtEur(data.sp.attivo.rimanenze)],
      ['  C.II - Crediti', fmtEur(data.sp.attivo.crediti)],
      ['  C.IV - Disponibilità liquide', fmtEur(data.sp.attivo.disponibilita_liquide)],
      [{ content: 'Totale attivo circolante (C)', styles: { fontStyle: 'bold' } }, { content: fmtEur(data.sp.attivo.totale_attivo_circolante), styles: { fontStyle: 'bold' } }],
      ['D) RATEI E RISCONTI ATTIVI', fmtEur(data.sp.attivo.ratei_risconti_attivi)],
      [{ content: 'TOTALE ATTIVO', styles: { fontStyle: 'bold', fillColor: [230, 240, 250] } }, { content: fmtEur(data.sp.attivo.totale_attivo), styles: { fontStyle: 'bold', fillColor: [230, 240, 250] } }],
    ],
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 82, 138] },
    margin: { left: 10, right: 10 },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  addSectionTitle('STATO PATRIMONIALE - PASSIVO (art. 2424 c.c.)');

  autoTable(doc, {
    startY: y,
    head: [['Voce', 'Importo €']],
    body: [
      ['A) PATRIMONIO NETTO', ''],
      ['  A.I - Capitale', fmtEur(data.sp.passivo.capitale_sociale)],
      ['  A.IV/VII - Riserve', fmtEur(data.sp.passivo.riserve)],
      ['  A.IX - Utile (perdita) d\'esercizio', fmtEur(data.sp.passivo.utile_esercizio)],
      [{ content: 'Totale patrimonio netto (A)', styles: { fontStyle: 'bold' } }, { content: fmtEur(data.sp.passivo.totale_patrimonio_netto), styles: { fontStyle: 'bold' } }],
      ['B) FONDI PER RISCHI E ONERI', fmtEur(data.sp.passivo.fondi_rischi)],
      ['C) TFR', fmtEur(data.sp.passivo.tfr)],
      ['D) DEBITI', ''],
      ['  Debiti finanziari', fmtEur(data.sp.passivo.debiti_finanziari)],
      ['  Debiti commerciali e altri', fmtEur(data.sp.passivo.debiti_commerciali)],
      [{ content: 'Totale debiti (D)', styles: { fontStyle: 'bold' } }, { content: fmtEur(data.sp.passivo.debiti_finanziari + data.sp.passivo.debiti_commerciali), styles: { fontStyle: 'bold' } }],
      ['E) RATEI E RISCONTI PASSIVI', fmtEur(data.sp.passivo.ratei_risconti_passivi)],
      [{ content: 'TOTALE PASSIVO', styles: { fontStyle: 'bold', fillColor: [230, 240, 250] } }, { content: fmtEur(data.sp.passivo.totale_passivo), styles: { fontStyle: 'bold', fillColor: [230, 240, 250] } }],
    ],
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 82, 138] },
    margin: { left: 10, right: 10 },
  });

  // ─── CONTO ECONOMICO ────────────────────────────────

  doc.addPage();
  y = 20;
  addSectionTitle('CONTO ECONOMICO (art. 2425 c.c.)');

  autoTable(doc, {
    startY: y,
    head: [['Voce', 'Importo €']],
    body: [
      ['A) VALORE DELLA PRODUZIONE', ''],
      ['  1) Ricavi vendite e prestazioni', fmtEur(data.ce.ricavi_vendite)],
      ['  2) Variazioni rimanenze', fmtEur(data.ce.variazione_rimanenze)],
      ['  5) Altri ricavi e proventi', fmtEur(data.ce.altri_ricavi)],
      [{ content: 'Totale valore della produzione (A)', styles: { fontStyle: 'bold' } }, { content: fmtEur(data.ce.valore_produzione), styles: { fontStyle: 'bold' } }],
      ['B) COSTI DELLA PRODUZIONE', ''],
      ['  6) Per materie prime', fmtEur(data.ce.costi_acquisti)],
      ['  7) Per servizi', fmtEur(data.ce.costi_servizi)],
      ['  8) Per godimento beni di terzi', fmtEur(data.ce.godimento_beni_terzi)],
      ['  9) Per il personale', fmtEur(data.ce.costi_personale)],
      ['  10) Ammortamenti e svalutazioni', fmtEur(data.ce.ammortamenti)],
      ['  12-14) Altri costi', fmtEur(data.ce.altri_costi)],
      [{ content: 'Totale costi produzione (B)', styles: { fontStyle: 'bold' } }, { content: fmtEur(data.ce.totale_costi_operativi), styles: { fontStyle: 'bold' } }],
      [{ content: 'Differenza (A-B) = EBIT', styles: { fontStyle: 'bold', fillColor: [255, 250, 230] } }, { content: fmtEur(data.ce.ebit), styles: { fontStyle: 'bold', fillColor: [255, 250, 230] } }],
      ['C) PROVENTI E ONERI FINANZIARI', ''],
      ['  16) Proventi finanziari', fmtEur(data.ce.proventi_finanziari)],
      ['  17) Oneri finanziari', fmtEur(data.ce.oneri_finanziari)],
      [{ content: 'Risultato prima delle imposte', styles: { fontStyle: 'bold' } }, { content: fmtEur(data.ce.utile_ante_imposte), styles: { fontStyle: 'bold' } }],
      ['20) Imposte sul reddito', fmtEur(data.ce.imposte)],
      [{ content: '21) UTILE (PERDITA) DELL\'ESERCIZIO', styles: { fontStyle: 'bold', fillColor: [230, 250, 230] } }, { content: fmtEur(data.ce.utile_netto), styles: { fontStyle: 'bold', fillColor: [230, 250, 230] } }],
    ],
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 82, 138] },
    margin: { left: 10, right: 10 },
  });

  // ─── MARGINI INTERMEDI ──────────────────────────────

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  addSubTitle('Margini intermedi di gestione');

  autoTable(doc, {
    startY: y,
    body: [
      ['EBITDA (Margine Operativo Lordo)', fmtEur(data.ce.ebitda)],
      ['EBIT (Margine Operativo Netto)', fmtEur(data.ce.ebit)],
      ['Utile ante imposte', fmtEur(data.ce.utile_ante_imposte)],
      [{ content: 'Utile netto', styles: { fontStyle: 'bold' } }, { content: fmtEur(data.ce.utile_netto), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    margin: { left: 10, right: 10 },
  });

  // ─── RENDICONTO FINANZIARIO ─────────────────────────

  doc.addPage();
  y = 20;
  addSectionTitle('RENDICONTO FINANZIARIO (Metodo Indiretto - OIC 10)');

  autoTable(doc, {
    startY: y,
    head: [['Voce', 'Importo €']],
    body: [
      ['A) FLUSSI FINANZIARI DA ATTIVITÀ OPERATIVA', ''],
      ['  Utile dell\'esercizio', fmtEur(data.rf.utile_netto)],
      ['  Ammortamenti', fmtEur(data.rf.ammortamenti)],
      ['  Variazione crediti commerciali', fmtEur(-data.rf.variazione_crediti)],
      ['  Variazione rimanenze', fmtEur(-data.rf.variazione_rimanenze)],
      ['  Variazione debiti commerciali', fmtEur(data.rf.variazione_debiti)],
      ['  Variazione TFR', fmtEur(data.rf.variazione_tfr)],
      ['  Variazione fondi rischi', fmtEur(data.rf.variazione_fondi)],
      [{ content: 'Cash flow operativo (A)', styles: { fontStyle: 'bold' } }, { content: fmtEur(data.rf.cash_flow_operativo), styles: { fontStyle: 'bold' } }],
      ['B) FLUSSI DA ATTIVITÀ DI INVESTIMENTO', ''],
      ['  Investimenti in immobilizzazioni', fmtEur(-data.rf.investimenti_immobilizzazioni)],
      [{ content: 'Cash flow investimenti (B)', styles: { fontStyle: 'bold' } }, { content: fmtEur(data.rf.cash_flow_investimenti), styles: { fontStyle: 'bold' } }],
      ['C) FLUSSI DA ATTIVITÀ DI FINANZIAMENTO', ''],
      ['  Variazione debiti finanziari', fmtEur(data.rf.variazione_debiti_finanziari)],
      ['  Variazione patrimonio netto', fmtEur(data.rf.variazione_patrimonio)],
      [{ content: 'Cash flow finanziamenti (C)', styles: { fontStyle: 'bold' } }, { content: fmtEur(data.rf.cash_flow_finanziamenti), styles: { fontStyle: 'bold' } }],
      [{ content: 'VARIAZIONE NETTA LIQUIDITÀ (A+B+C)', styles: { fontStyle: 'bold', fillColor: [230, 240, 250] } }, { content: fmtEur(data.rf.variazione_liquidita), styles: { fontStyle: 'bold', fillColor: [230, 240, 250] } }],
    ],
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 82, 138] },
    margin: { left: 10, right: 10 },
  });

  // ─── RICLASSIFICAZIONE ──────────────────────────────

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  addSectionTitle('PROSPETTO RICLASSIFICATO');

  autoTable(doc, {
    startY: y,
    head: [['IMPIEGHI', '€', 'FONTI', '€']],
    body: [
      ['Attivo fisso', fmtEur(data.ricl.attivo_fisso), 'Patrimonio netto', fmtEur(data.ricl.patrimonio_netto)],
      ['Capitale circolante', fmtEur(data.ricl.capitale_circolante_lordo), 'Passività consolidate', fmtEur(data.ricl.passivita_consolidate)],
      ['Liquidità immediate', fmtEur(data.ricl.liquidita_immediate), 'Passività correnti', fmtEur(data.ricl.passivita_correnti)],
      [
        { content: 'TOTALE IMPIEGHI', styles: { fontStyle: 'bold' } },
        { content: fmtEur(data.ricl.totale_impieghi), styles: { fontStyle: 'bold' } },
        { content: 'TOTALE FONTI', styles: { fontStyle: 'bold' } },
        { content: fmtEur(data.ricl.totale_fonti), styles: { fontStyle: 'bold' } },
      ],
      ['CCN', fmtEur(data.ricl.capitale_circolante_netto), 'Margine struttura', fmtEur(data.ricl.margine_struttura)],
    ],
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 82, 138] },
    margin: { left: 10, right: 10 },
  });

  // ─── INDICI ─────────────────────────────────────────

  doc.addPage();
  y = 20;
  addSectionTitle('PRINCIPALI INDICI DI BILANCIO');

  autoTable(doc, {
    startY: y,
    head: [['Indicatore', 'Valore', 'Categoria']],
    body: [
      ['Autonomia finanziaria', `${data.indici.solidita.autonomia_finanziaria}%`, 'Solidità'],
      ['Leverage', `${data.indici.solidita.leverage}`, 'Solidità'],
      ['Copertura immobilizzazioni', `${data.indici.solidita.copertura_immobilizzazioni}%`, 'Solidità'],
      ['Current Ratio', `${data.indici.liquidita.current_ratio}`, 'Liquidità'],
      ['Quick Ratio', `${data.indici.liquidita.quick_ratio}`, 'Liquidità'],
      ['Cash Ratio', `${data.indici.liquidita.cash_ratio}`, 'Liquidità'],
      ['ROE', `${data.indici.redditivita.roe}%`, 'Redditività'],
      ['ROI', `${data.indici.redditivita.roi}%`, 'Redditività'],
      ['ROS', `${data.indici.redditivita.ros}%`, 'Redditività'],
      ['ROA', `${data.indici.redditivita.roa}%`, 'Redditività'],
      ['Rotazione magazzino', `${data.indici.efficienza.rotazione_magazzino}x`, 'Efficienza'],
      ['DSO (giorni incasso)', `${data.indici.efficienza.dso} gg`, 'Efficienza'],
      ['DPO (giorni pagamento)', `${data.indici.efficienza.dpo} gg`, 'Efficienza'],
      ['Ciclo monetario', `${data.indici.efficienza.ciclo_monetario} gg`, 'Efficienza'],
    ],
    theme: 'striped',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 82, 138] },
    margin: { left: 10, right: 10 },
  });

  // ─── SCRITTURE DI ASSESTAMENTO ──────────────────────

  if (data.scritture.length > 0) {
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    addSectionTitle('EVIDENZA SCRITTURE DI ASSESTAMENTO');

    const contiMap = new Map(data.conti.map((c) => [c.id, c.nome]));

    autoTable(doc, {
      startY: y,
      head: [['Data', 'Tipo', 'Conto Dare', 'Conto Avere', 'Importo €', 'Descrizione']],
      body: data.scritture.map((s) => [
        new Date(s.data).toLocaleDateString('it-IT'),
        s.tipo.replace(/_/g, ' '),
        contiMap.get(s.conto_dare) || '',
        contiMap.get(s.conto_avere) || '',
        fmtEur(s.importo),
        s.descrizione,
      ]),
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: { fillColor: [41, 82, 138] },
      margin: { left: 10, right: 10 },
    });
  }

  // ─── FOOTER ─────────────────────────────────────────

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `FAC-SIMILE BILANCIO - Esercizio ${data.esercizio} - Pagina ${i}/${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
    doc.text('Documento generato da eContabilità - Piattaforma didattica', pageWidth / 2, doc.internal.pageSize.getHeight() - 4, { align: 'center' });
  }

  return doc;
}

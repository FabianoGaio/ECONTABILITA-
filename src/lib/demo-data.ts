/**
 * DATI DEMO - Funziona senza Supabase
 * Tutti i dati di esempio in memoria per modalità didattica
 */

import type { PianoConto, Operazione, ScritturaAssestamento, Budget } from '@/types';

function uuid() {
  return crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── PIANO DEI CONTI ──────────────────────────────────────

export const PIANO_CONTI: PianoConto[] = [
  // SP ATTIVO - Immobilizzazioni immateriali
  { id: uuid(), codice: '1.1.01', nome: 'Brevetti e licenze', categoria: 'attivo', sottocategoria: 'immobilizzazioni_immateriali', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'B.I.3 - Diritti di brevetto industriale', created_at: '' },
  { id: uuid(), codice: '1.1.02', nome: 'Avviamento', categoria: 'attivo', sottocategoria: 'immobilizzazioni_immateriali', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'B.I.5 - Avviamento', created_at: '' },
  { id: uuid(), codice: '1.1.03', nome: 'Costi di sviluppo', categoria: 'attivo', sottocategoria: 'immobilizzazioni_immateriali', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'B.I.2 - Costi di sviluppo', created_at: '' },
  { id: uuid(), codice: '1.1.04', nome: 'F.do amm.to immob. immateriali', categoria: 'attivo', sottocategoria: 'immobilizzazioni_immateriali', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'B.I - Fondo ammortamento', created_at: '' },
  // SP ATTIVO - Immobilizzazioni materiali
  { id: uuid(), codice: '1.2.01', nome: 'Terreni e fabbricati', categoria: 'attivo', sottocategoria: 'immobilizzazioni_materiali', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'B.II.1 - Terreni e fabbricati', created_at: '' },
  { id: uuid(), codice: '1.2.02', nome: 'Impianti e macchinari', categoria: 'attivo', sottocategoria: 'immobilizzazioni_materiali', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'B.II.2 - Impianti e macchinario', created_at: '' },
  { id: uuid(), codice: '1.2.03', nome: 'Attrezzature', categoria: 'attivo', sottocategoria: 'immobilizzazioni_materiali', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'B.II.3 - Attrezzature industriali', created_at: '' },
  { id: uuid(), codice: '1.2.04', nome: 'Automezzi', categoria: 'attivo', sottocategoria: 'immobilizzazioni_materiali', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'B.II.4 - Altri beni', created_at: '' },
  { id: uuid(), codice: '1.2.05', nome: 'F.do amm.to immob. materiali', categoria: 'attivo', sottocategoria: 'immobilizzazioni_materiali', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'B.II - Fondo ammortamento', created_at: '' },
  // SP ATTIVO - Immobilizzazioni finanziarie
  { id: uuid(), codice: '1.3.01', nome: 'Partecipazioni in controllate', categoria: 'attivo', sottocategoria: 'immobilizzazioni_finanziarie', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'B.III.1.a - Partecipazioni in imprese controllate', created_at: '' },
  { id: uuid(), codice: '1.3.02', nome: 'Crediti finanziari oltre 12 mesi', categoria: 'attivo', sottocategoria: 'immobilizzazioni_finanziarie', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'B.III.2 - Crediti', created_at: '' },
  // SP ATTIVO - Rimanenze
  { id: uuid(), codice: '2.1.01', nome: 'Materie prime', categoria: 'attivo', sottocategoria: 'rimanenze', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'C.I.1 - Materie prime', created_at: '' },
  { id: uuid(), codice: '2.1.02', nome: 'Prodotti in lavorazione', categoria: 'attivo', sottocategoria: 'rimanenze', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'C.I.2 - Prodotti in corso di lavorazione', created_at: '' },
  { id: uuid(), codice: '2.1.03', nome: 'Prodotti finiti', categoria: 'attivo', sottocategoria: 'rimanenze', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'C.I.4 - Prodotti finiti e merci', created_at: '' },
  // SP ATTIVO - Crediti
  { id: uuid(), codice: '2.2.01', nome: 'Crediti verso clienti', categoria: 'attivo', sottocategoria: 'crediti', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'C.II.1 - Crediti verso clienti', created_at: '' },
  { id: uuid(), codice: '2.2.02', nome: 'Crediti tributari', categoria: 'attivo', sottocategoria: 'crediti', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'C.II.5-bis - Crediti tributari', created_at: '' },
  { id: uuid(), codice: '2.2.03', nome: 'Crediti verso altri', categoria: 'attivo', sottocategoria: 'crediti', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'C.II.5-quater - Verso altri', created_at: '' },
  { id: uuid(), codice: '2.2.04', nome: 'F.do svalutazione crediti', categoria: 'attivo', sottocategoria: 'crediti', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'C.II - Fondo svalutazione crediti', created_at: '' },
  // SP ATTIVO - Disponibilità liquide
  { id: uuid(), codice: '2.3.01', nome: 'Cassa', categoria: 'attivo', sottocategoria: 'disponibilita_liquide', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'C.IV.3 - Danaro e valori in cassa', created_at: '' },
  { id: uuid(), codice: '2.3.02', nome: 'Banca c/c', categoria: 'attivo', sottocategoria: 'disponibilita_liquide', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'C.IV.1 - Depositi bancari e postali', created_at: '' },
  // SP ATTIVO - Ratei e risconti
  { id: uuid(), codice: '2.4.01', nome: 'Ratei attivi', categoria: 'attivo', sottocategoria: 'ratei_risconti_attivi', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'D - Ratei e risconti attivi', created_at: '' },
  { id: uuid(), codice: '2.4.02', nome: 'Risconti attivi', categoria: 'attivo', sottocategoria: 'ratei_risconti_attivi', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: 'D - Ratei e risconti attivi', created_at: '' },
  // SP PASSIVO - Patrimonio netto
  { id: uuid(), codice: '3.1.01', nome: 'Capitale sociale', categoria: 'patrimonio_netto', sottocategoria: 'patrimonio_netto', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'A.I - Capitale', created_at: '' },
  { id: uuid(), codice: '3.1.02', nome: 'Riserva legale', categoria: 'patrimonio_netto', sottocategoria: 'patrimonio_netto', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'A.IV - Riserva legale', created_at: '' },
  { id: uuid(), codice: '3.1.03', nome: 'Riserva straordinaria', categoria: 'patrimonio_netto', sottocategoria: 'patrimonio_netto', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'A.VII - Altre riserve', created_at: '' },
  { id: uuid(), codice: '3.1.04', nome: "Utile (perdita) esercizio", categoria: 'patrimonio_netto', sottocategoria: 'patrimonio_netto', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: "A.IX - Utile (perdita) dell'esercizio", created_at: '' },
  // SP PASSIVO - Fondi
  { id: uuid(), codice: '3.2.01', nome: 'Fondo rischi su garanzie', categoria: 'passivo', sottocategoria: 'fondi_rischi', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'B.1 - Fondi per trattamento di quiescenza', created_at: '' },
  { id: uuid(), codice: '3.2.02', nome: 'Fondo rischi cause legali', categoria: 'passivo', sottocategoria: 'fondi_rischi', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'B.2 - Fondo per imposte, anche differite', created_at: '' },
  { id: uuid(), codice: '3.2.03', nome: 'Altri fondi rischi', categoria: 'passivo', sottocategoria: 'fondi_rischi', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'B.3 - Altri fondi', created_at: '' },
  // SP PASSIVO - TFR
  { id: uuid(), codice: '3.3.01', nome: 'TFR', categoria: 'passivo', sottocategoria: 'tfr', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'C - Trattamento di fine rapporto', created_at: '' },
  // SP PASSIVO - Debiti finanziari
  { id: uuid(), codice: '3.4.01', nome: 'Mutui passivi', categoria: 'passivo', sottocategoria: 'debiti_finanziari', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'D.4 - Debiti verso banche', created_at: '' },
  { id: uuid(), codice: '3.4.02', nome: 'Prestiti obbligazionari', categoria: 'passivo', sottocategoria: 'debiti_finanziari', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'D.1 - Obbligazioni', created_at: '' },
  // SP PASSIVO - Debiti commerciali
  { id: uuid(), codice: '3.5.01', nome: 'Debiti verso fornitori', categoria: 'passivo', sottocategoria: 'debiti_commerciali', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'D.7 - Debiti verso fornitori', created_at: '' },
  { id: uuid(), codice: '3.5.02', nome: 'Debiti tributari', categoria: 'passivo', sottocategoria: 'debiti_commerciali', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'D.12 - Debiti tributari', created_at: '' },
  { id: uuid(), codice: '3.5.03', nome: 'Debiti verso istituti previdenziali', categoria: 'passivo', sottocategoria: 'debiti_commerciali', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'D.13 - Debiti verso istituti di previdenza', created_at: '' },
  { id: uuid(), codice: '3.5.04', nome: 'Altri debiti', categoria: 'passivo', sottocategoria: 'debiti_commerciali', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'D.14 - Altri debiti', created_at: '' },
  // SP PASSIVO - Ratei e risconti
  { id: uuid(), codice: '3.6.01', nome: 'Ratei passivi', categoria: 'passivo', sottocategoria: 'ratei_risconti_passivi', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'E - Ratei e risconti passivi', created_at: '' },
  { id: uuid(), codice: '3.6.02', nome: 'Risconti passivi', categoria: 'passivo', sottocategoria: 'ratei_risconti_passivi', sezione_bilancio: 'SP_passivo', voce_ufficiale_oic: 'E - Ratei e risconti passivi', created_at: '' },
  // CE RICAVI
  { id: uuid(), codice: '4.1.01', nome: 'Ricavi vendite prodotti', categoria: 'ricavi', sottocategoria: 'ricavi_vendite', sezione_bilancio: 'CE_ricavi', voce_ufficiale_oic: 'A.1 - Ricavi delle vendite e delle prestazioni', created_at: '' },
  { id: uuid(), codice: '4.1.02', nome: 'Ricavi prestazione servizi', categoria: 'ricavi', sottocategoria: 'ricavi_vendite', sezione_bilancio: 'CE_ricavi', voce_ufficiale_oic: 'A.1 - Ricavi delle vendite e delle prestazioni', created_at: '' },
  { id: uuid(), codice: '4.2.01', nome: 'Variazione rimanenze PF', categoria: 'ricavi', sottocategoria: 'variazione_rimanenze', sezione_bilancio: 'CE_ricavi', voce_ufficiale_oic: 'A.2 - Variazioni delle rimanenze', created_at: '' },
  { id: uuid(), codice: '4.3.01', nome: 'Incrementi immobilizzazioni', categoria: 'ricavi', sottocategoria: 'altri_ricavi', sezione_bilancio: 'CE_ricavi', voce_ufficiale_oic: 'A.4 - Incrementi di immobilizzazioni per lavori interni', created_at: '' },
  { id: uuid(), codice: '4.3.02', nome: 'Altri ricavi e proventi', categoria: 'ricavi', sottocategoria: 'altri_ricavi', sezione_bilancio: 'CE_ricavi', voce_ufficiale_oic: 'A.5 - Altri ricavi e proventi', created_at: '' },
  { id: uuid(), codice: '4.4.01', nome: 'Proventi finanziari', categoria: 'ricavi', sottocategoria: 'proventi_finanziari', sezione_bilancio: 'CE_ricavi', voce_ufficiale_oic: 'C.16 - Altri proventi finanziari', created_at: '' },
  // CE COSTI
  { id: uuid(), codice: '5.1.01', nome: 'Acquisto materie prime', categoria: 'costi', sottocategoria: 'costi_acquisti', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.6 - Per materie prime', created_at: '' },
  { id: uuid(), codice: '5.1.02', nome: 'Acquisto merci', categoria: 'costi', sottocategoria: 'costi_acquisti', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.6 - Per materie prime', created_at: '' },
  { id: uuid(), codice: '5.2.01', nome: 'Costi per servizi', categoria: 'costi', sottocategoria: 'costi_servizi', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.7 - Per servizi', created_at: '' },
  { id: uuid(), codice: '5.2.02', nome: 'Consulenze', categoria: 'costi', sottocategoria: 'costi_servizi', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.7 - Per servizi', created_at: '' },
  { id: uuid(), codice: '5.2.03', nome: 'Utenze', categoria: 'costi', sottocategoria: 'costi_servizi', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.7 - Per servizi', created_at: '' },
  { id: uuid(), codice: '5.3.01', nome: 'Canoni di leasing', categoria: 'costi', sottocategoria: 'godimento_beni_terzi', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.8 - Per godimento beni di terzi', created_at: '' },
  { id: uuid(), codice: '5.3.02', nome: 'Affitti passivi', categoria: 'costi', sottocategoria: 'godimento_beni_terzi', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.8 - Per godimento beni di terzi', created_at: '' },
  { id: uuid(), codice: '5.4.01', nome: 'Salari e stipendi', categoria: 'costi', sottocategoria: 'personale', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.9.a - Salari e stipendi', created_at: '' },
  { id: uuid(), codice: '5.4.02', nome: 'Oneri sociali', categoria: 'costi', sottocategoria: 'personale', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.9.b - Oneri sociali', created_at: '' },
  { id: uuid(), codice: '5.4.03', nome: 'Accantonamento TFR', categoria: 'costi', sottocategoria: 'personale', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.9.c - Trattamento di fine rapporto', created_at: '' },
  { id: uuid(), codice: '5.5.01', nome: 'Ammortamento immob. immateriali', categoria: 'costi', sottocategoria: 'ammortamenti', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.10.a - Ammortamento immobilizzazioni immateriali', created_at: '' },
  { id: uuid(), codice: '5.5.02', nome: 'Ammortamento immob. materiali', categoria: 'costi', sottocategoria: 'ammortamenti', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.10.b - Ammortamento immobilizzazioni materiali', created_at: '' },
  { id: uuid(), codice: '5.5.03', nome: 'Svalutazione crediti', categoria: 'costi', sottocategoria: 'ammortamenti', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.10.d - Svalutazioni dei crediti', created_at: '' },
  { id: uuid(), codice: '5.6.01', nome: 'Interessi passivi bancari', categoria: 'costi', sottocategoria: 'oneri_finanziari', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'C.17 - Interessi e altri oneri finanziari', created_at: '' },
  { id: uuid(), codice: '5.6.02', nome: 'Interessi passivi su mutui', categoria: 'costi', sottocategoria: 'oneri_finanziari', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'C.17 - Interessi e altri oneri finanziari', created_at: '' },
  { id: uuid(), codice: '5.7.01', nome: 'IRES', categoria: 'costi', sottocategoria: 'imposte', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: "20 - Imposte sul reddito dell'esercizio", created_at: '' },
  { id: uuid(), codice: '5.7.02', nome: 'IRAP', categoria: 'costi', sottocategoria: 'imposte', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: "20 - Imposte sul reddito dell'esercizio", created_at: '' },
  { id: uuid(), codice: '5.8.01', nome: 'Accantonamento fondi rischi', categoria: 'costi', sottocategoria: 'altri_costi', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.12 - Accantonamenti per rischi', created_at: '' },
  { id: uuid(), codice: '5.8.02', nome: 'Oneri diversi di gestione', categoria: 'costi', sottocategoria: 'altri_costi', sezione_bilancio: 'CE_costi', voce_ufficiale_oic: 'B.14 - Oneri diversi di gestione', created_at: '' },
];

// Helper per trovare id conto per codice
function contoId(codice: string): string {
  return PIANO_CONTI.find(c => c.codice === codice)?.id || '';
}

// ─── OPERAZIONI DI ESEMPIO (Esercizio 2025) ──────────────

export const OPERAZIONI_DEMO: Operazione[] = [
  // Conferimento capitale
  { id: uuid(), data: '2025-01-01', conto_id: contoId('2.3.02'), descrizione: 'Conferimento capitale sociale', importo: 100000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-01-01', conto_id: contoId('3.1.01'), descrizione: 'Conferimento capitale sociale', importo: 100000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Vendita merce
  { id: uuid(), data: '2025-01-15', conto_id: contoId('2.2.01'), descrizione: 'Vendita merce Ft. 001/2025', importo: 50000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-01-15', conto_id: contoId('4.1.01'), descrizione: 'Vendita merce Ft. 001/2025', importo: 50000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Acquisto materie prime
  { id: uuid(), data: '2025-01-20', conto_id: contoId('5.1.01'), descrizione: 'Acquisto materie prime Ft. A001', importo: 20000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-01-20', conto_id: contoId('3.5.01'), descrizione: 'Acquisto materie prime Ft. A001', importo: 20000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Stipendi
  { id: uuid(), data: '2025-02-01', conto_id: contoId('5.4.01'), descrizione: 'Stipendi gennaio 2025', importo: 15000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-02-01', conto_id: contoId('2.3.02'), descrizione: 'Stipendi gennaio 2025', importo: 15000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Oneri sociali
  { id: uuid(), data: '2025-02-01', conto_id: contoId('5.4.02'), descrizione: 'Oneri sociali gennaio 2025', importo: 4500, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-02-01', conto_id: contoId('3.5.03'), descrizione: 'Oneri sociali gennaio 2025', importo: 4500, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Incasso
  { id: uuid(), data: '2025-02-10', conto_id: contoId('2.3.02'), descrizione: 'Incasso Ft. 001/2025', importo: 50000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-02-10', conto_id: contoId('2.2.01'), descrizione: 'Incasso Ft. 001/2025', importo: 50000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Vendita servizi
  { id: uuid(), data: '2025-03-01', conto_id: contoId('2.2.01'), descrizione: 'Vendita servizi Ft. 002/2025', importo: 30000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-03-01', conto_id: contoId('4.1.02'), descrizione: 'Vendita servizi Ft. 002/2025', importo: 30000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Utenze
  { id: uuid(), data: '2025-03-15', conto_id: contoId('5.2.03'), descrizione: 'Utenze Q1 2025', importo: 3000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-03-15', conto_id: contoId('2.3.02'), descrizione: 'Utenze Q1 2025', importo: 3000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Affitto
  { id: uuid(), data: '2025-03-20', conto_id: contoId('5.3.02'), descrizione: 'Affitto ufficio Q1', importo: 6000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-03-20', conto_id: contoId('2.3.02'), descrizione: 'Affitto ufficio Q1', importo: 6000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Acquisto macchinario
  { id: uuid(), data: '2025-04-01', conto_id: contoId('1.2.02'), descrizione: 'Acquisto macchinario', importo: 80000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-04-01', conto_id: contoId('3.4.01'), descrizione: 'Finanziamento macchinario', importo: 80000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Vendita prodotti H1
  { id: uuid(), data: '2025-06-30', conto_id: contoId('2.2.01'), descrizione: 'Vendita prodotti Ft. 010/2025', importo: 120000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-06-30', conto_id: contoId('4.1.01'), descrizione: 'Vendita prodotti Ft. 010/2025', importo: 120000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Acquisto materie H2
  { id: uuid(), data: '2025-07-01', conto_id: contoId('5.1.01'), descrizione: 'Acquisto materie H2', importo: 45000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-07-01', conto_id: contoId('3.5.01'), descrizione: 'Acquisto materie H2', importo: 45000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
  // Rimanenze finali
  { id: uuid(), data: '2025-12-31', conto_id: contoId('2.1.03'), descrizione: 'Rimanenze finali prodotti finiti', importo: 25000, dare_avere: 'dare', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-12-31', conto_id: contoId('4.2.01'), descrizione: 'Variazione rimanenze PF', importo: 25000, dare_avere: 'avere', esercizio: 2025, created_at: '' },
];

// ─── SCRITTURE DI ASSESTAMENTO ────────────────────────────

export const SCRITTURE_DEMO: ScritturaAssestamento[] = [
  { id: uuid(), data: '2025-12-31', tipo: 'ammortamento', conto_dare: contoId('5.5.02'), conto_avere: contoId('1.2.05'), importo: 8000, descrizione: 'Ammortamento impianti e macchinari 10%', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-12-31', tipo: 'ammortamento', conto_dare: contoId('5.5.01'), conto_avere: contoId('1.1.04'), importo: 2000, descrizione: 'Ammortamento brevetti 20%', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-12-31', tipo: 'accantonamento', conto_dare: contoId('5.4.03'), conto_avere: contoId('3.3.01'), importo: 3500, descrizione: 'Accantonamento TFR esercizio 2025', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-12-31', tipo: 'accantonamento', conto_dare: contoId('5.8.01'), conto_avere: contoId('3.2.03'), importo: 2000, descrizione: 'Accantonamento fondo rischi', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-12-31', tipo: 'risconto_attivo', conto_dare: contoId('2.4.02'), conto_avere: contoId('5.3.02'), importo: 2000, descrizione: 'Risconto attivo affitto Q1 2026', esercizio: 2025, created_at: '' },
  { id: uuid(), data: '2025-12-31', tipo: 'rateo_passivo', conto_dare: contoId('5.6.01'), conto_avere: contoId('3.6.01'), importo: 1500, descrizione: 'Rateo passivo interessi su mutuo', esercizio: 2025, created_at: '' },
];

// ─── BUDGET ───────────────────────────────────────────────

export const BUDGET_DEMO: Budget[] = [
  ...[1,2,3,4,5,6,7,8,9,10,11,12].map((mese, i) => ({
    id: uuid(), esercizio: 2025, mese, voce: 'Ricavi vendite',
    importo: [15000,16000,18000,17000,19000,22000,20000,14000,21000,23000,22000,25000][i],
  })),
  ...[1,2,3,4,5,6,7,8,9,10,11,12].map((mese, i) => ({
    id: uuid(), esercizio: 2025, mese, voce: 'Costi operativi',
    importo: [10000,10500,11000,10800,11500,12000,11800,9500,12500,13000,12800,14000][i],
  })),
];

// Aggiungi i riferimenti conto alle operazioni
export function getOperazioniConConto(esercizio: number): (Operazione & { conto?: PianoConto })[] {
  return OPERAZIONI_DEMO
    .filter(o => o.esercizio === esercizio)
    .map(o => ({
      ...o,
      conto: PIANO_CONTI.find(c => c.id === o.conto_id),
    }));
}

export function getScrittureConConto(esercizio: number) {
  return SCRITTURE_DEMO
    .filter(s => s.esercizio === esercizio)
    .map(s => ({
      ...s,
      conto_dare_rel: PIANO_CONTI.find(c => c.id === s.conto_dare),
      conto_avere_rel: PIANO_CONTI.find(c => c.id === s.conto_avere),
    }));
}

export function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return !url || url.includes('your-') || url === 'https://your-project.supabase.co';
}

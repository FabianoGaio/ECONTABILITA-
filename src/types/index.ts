// ─── Tipi Database ────────────────────────────────────────

export type Categoria = 'attivo' | 'passivo' | 'patrimonio_netto' | 'ricavi' | 'costi';

export type Sottocategoria =
  | 'immobilizzazioni_immateriali'
  | 'immobilizzazioni_materiali'
  | 'immobilizzazioni_finanziarie'
  | 'rimanenze'
  | 'crediti'
  | 'disponibilita_liquide'
  | 'patrimonio_netto'
  | 'fondi_rischi'
  | 'tfr'
  | 'debiti_finanziari'
  | 'debiti_commerciali'
  | 'ratei_risconti_passivi'
  | 'ratei_risconti_attivi'
  | 'ricavi_vendite'
  | 'variazione_rimanenze'
  | 'costi_acquisti'
  | 'costi_servizi'
  | 'godimento_beni_terzi'
  | 'personale'
  | 'ammortamenti'
  | 'oneri_finanziari'
  | 'proventi_finanziari'
  | 'imposte'
  | 'altri_ricavi'
  | 'altri_costi';

export type SezioneBilancio = 'SP_attivo' | 'SP_passivo' | 'CE_ricavi' | 'CE_costi';
export type DareAvere = 'dare' | 'avere';
export type TipoAssestamento = 'ammortamento' | 'rateo_attivo' | 'rateo_passivo' | 'risconto_attivo' | 'risconto_passivo' | 'accantonamento';
export type Ruolo = 'admin' | 'studente' | 'docente';

export interface Profilo {
  id: string;
  nome: string;
  cognome: string;
  ruolo: Ruolo;
  created_at: string;
}

export interface Esercizio {
  id: string;
  user_id: string;
  anno: number;
  descrizione: string;
  created_at?: string;
}

export interface PianoConto {
  id: string;
  esercizio_id?: string;
  codice: string;
  nome: string;
  categoria: Categoria;
  sottocategoria: Sottocategoria;
  sezione_bilancio: SezioneBilancio;
  voce_ufficiale_oic: string;
  created_at: string;
}

export interface Operazione {
  id: string;
  esercizio_id?: string;
  data: string;
  conto_id: string;
  descrizione: string;
  importo: number;
  dare_avere: DareAvere;
  esercizio: number;
  created_at: string;
  conto?: PianoConto;
}

export interface ScritturaAssestamento {
  id: string;
  esercizio_id?: string;
  data: string;
  tipo: TipoAssestamento;
  conto_dare: string;
  conto_avere: string;
  importo: number;
  descrizione: string;
  esercizio: number;
  created_at: string;
  conto_dare_rel?: PianoConto;
  conto_avere_rel?: PianoConto;
}

export interface Bilancio {
  id: string;
  esercizio_id?: string;
  esercizio: number;
  totale_attivo: number;
  totale_passivo: number;
  patrimonio_netto: number;
  utile: number;
  cash_flow_operativo: number;
  created_at: string;
}

export interface Budget {
  id: string;
  esercizio_id?: string;
  esercizio: number;
  mese: number;
  voce: string;
  importo: number;
}

// ─── Tipi Calcolati ────────────────────────────────────────

export interface SaldoConto {
  conto: PianoConto;
  dare: number;
  avere: number;
  saldo: number;
}

export interface StatoPatrimoniale {
  attivo: {
    immobilizzazioni_immateriali: number;
    immobilizzazioni_materiali: number;
    immobilizzazioni_finanziarie: number;
    totale_immobilizzazioni: number;
    rimanenze: number;
    crediti: number;
    disponibilita_liquide: number;
    ratei_risconti_attivi: number;
    totale_attivo_circolante: number;
    totale_attivo: number;
  };
  passivo: {
    capitale_sociale: number;
    riserve: number;
    utile_esercizio: number;
    totale_patrimonio_netto: number;
    fondi_rischi: number;
    tfr: number;
    debiti_finanziari: number;
    debiti_commerciali: number;
    ratei_risconti_passivi: number;
    totale_debiti: number;
    totale_passivo: number;
  };
  quadratura: boolean;
}

export interface ContoEconomico {
  ricavi_vendite: number;
  variazione_rimanenze: number;
  altri_ricavi: number;
  valore_produzione: number;
  costi_acquisti: number;
  costi_servizi: number;
  godimento_beni_terzi: number;
  costi_personale: number;
  ammortamenti: number;
  altri_costi: number;
  totale_costi_operativi: number;
  ebitda: number;
  ebit: number;
  oneri_finanziari: number;
  proventi_finanziari: number;
  utile_ante_imposte: number;
  imposte: number;
  utile_netto: number;
}

export interface RendicontoFinanziario {
  utile_netto: number;
  ammortamenti: number;
  variazione_crediti: number;
  variazione_rimanenze: number;
  variazione_debiti: number;
  variazione_tfr: number;
  variazione_fondi: number;
  cash_flow_operativo: number;
  investimenti_immobilizzazioni: number;
  cash_flow_investimenti: number;
  variazione_debiti_finanziari: number;
  variazione_patrimonio: number;
  cash_flow_finanziamenti: number;
  variazione_liquidita: number;
}

export interface Riclassificazione {
  attivo_fisso: number;
  capitale_circolante_lordo: number;
  liquidita_immediate: number;
  totale_impieghi: number;
  patrimonio_netto: number;
  passivita_consolidate: number;
  passivita_correnti: number;
  totale_fonti: number;
  capitale_circolante_netto: number;
  margine_struttura: number;
}

export interface IndiciAnalisi {
  solidita: {
    autonomia_finanziaria: number;
    leverage: number;
    copertura_immobilizzazioni: number;
  };
  liquidita: {
    current_ratio: number;
    quick_ratio: number;
    cash_ratio: number;
  };
  redditivita: {
    roe: number;
    roi: number;
    ros: number;
    roa: number;
  };
  efficienza: {
    rotazione_magazzino: number;
    dso: number;
    dpo: number;
    ciclo_monetario: number;
  };
}

export interface AnalisiGestionale {
  costi_fissi: number;
  costi_variabili: number;
  ricavi_totali: number;
  margine_contribuzione: number;
  margine_contribuzione_percentuale: number;
  break_even_point: number;
  margine_sicurezza: number;
}

export interface KPI {
  label: string;
  value: number;
  format: 'currency' | 'percentage' | 'number' | 'days';
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

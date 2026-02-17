-- ═══════════════════════════════════════════════════════════
-- ECONTABILITÀ - Schema Database Supabase
-- Piattaforma Didattica di Contabilità Generale
-- ═══════════════════════════════════════════════════════════

-- Abilita UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ───────────────────────────────────────────────────────────
-- 1) PIANO DEI CONTI
-- ───────────────────────────────────────────────────────────
CREATE TABLE piano_conti (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codice VARCHAR(20) NOT NULL UNIQUE,
  nome VARCHAR(200) NOT NULL,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('attivo', 'passivo', 'patrimonio_netto', 'ricavi', 'costi')),
  sottocategoria VARCHAR(100) NOT NULL,
  sezione_bilancio VARCHAR(20) NOT NULL CHECK (sezione_bilancio IN ('SP_attivo', 'SP_passivo', 'CE_ricavi', 'CE_costi')),
  voce_ufficiale_oic VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────
-- 2) OPERAZIONI (Prima Nota)
-- ───────────────────────────────────────────────────────────
CREATE TABLE operazioni (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data DATE NOT NULL,
  conto_id UUID NOT NULL REFERENCES piano_conti(id) ON DELETE RESTRICT,
  descrizione TEXT NOT NULL,
  importo NUMERIC(15,2) NOT NULL CHECK (importo >= 0),
  dare_avere VARCHAR(5) NOT NULL CHECK (dare_avere IN ('dare', 'avere')),
  esercizio INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_operazioni_esercizio ON operazioni(esercizio);
CREATE INDEX idx_operazioni_conto ON operazioni(conto_id);
CREATE INDEX idx_operazioni_data ON operazioni(data);

-- ───────────────────────────────────────────────────────────
-- 3) SCRITTURE DI ASSESTAMENTO
-- ───────────────────────────────────────────────────────────
CREATE TABLE scritture_assestamento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data DATE NOT NULL,
  tipo VARCHAR(30) NOT NULL CHECK (tipo IN (
    'ammortamento', 'rateo_attivo', 'rateo_passivo',
    'risconto_attivo', 'risconto_passivo', 'accantonamento'
  )),
  conto_dare UUID NOT NULL REFERENCES piano_conti(id) ON DELETE RESTRICT,
  conto_avere UUID NOT NULL REFERENCES piano_conti(id) ON DELETE RESTRICT,
  importo NUMERIC(15,2) NOT NULL CHECK (importo > 0),
  descrizione TEXT NOT NULL,
  esercizio INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scritture_esercizio ON scritture_assestamento(esercizio);

-- ───────────────────────────────────────────────────────────
-- 4) BILANCI (snapshot calcolati)
-- ───────────────────────────────────────────────────────────
CREATE TABLE bilanci (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  esercizio INTEGER NOT NULL UNIQUE,
  totale_attivo NUMERIC(15,2) DEFAULT 0,
  totale_passivo NUMERIC(15,2) DEFAULT 0,
  patrimonio_netto NUMERIC(15,2) DEFAULT 0,
  utile NUMERIC(15,2) DEFAULT 0,
  cash_flow_operativo NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────
-- 5) BUDGET
-- ───────────────────────────────────────────────────────────
CREATE TABLE budget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  esercizio INTEGER NOT NULL,
  mese INTEGER NOT NULL CHECK (mese BETWEEN 1 AND 12),
  voce VARCHAR(200) NOT NULL,
  importo NUMERIC(15,2) NOT NULL DEFAULT 0,
  UNIQUE(esercizio, mese, voce)
);

-- ───────────────────────────────────────────────────────────
-- 6) PROFILI UTENTI (estende Supabase Auth)
-- ───────────────────────────────────────────────────────────
CREATE TABLE profili (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100),
  ruolo VARCHAR(20) NOT NULL DEFAULT 'contabile' CHECK (ruolo IN ('admin', 'contabile', 'manager')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────
-- RLS (Row Level Security)
-- ───────────────────────────────────────────────────────────
ALTER TABLE piano_conti ENABLE ROW LEVEL SECURITY;
ALTER TABLE operazioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE scritture_assestamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE bilanci ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE profili ENABLE ROW LEVEL SECURITY;

-- Policy permissive per ambiente didattico (tutti autenticati leggono/scrivono)
CREATE POLICY "Authenticated full access" ON piano_conti FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON operazioni FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON scritture_assestamento FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON bilanci FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON budget FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read own profile" ON profili FOR ALL USING (auth.uid() = id);

-- ═══════════════════════════════════════════════════════════
-- SEED DATA: Piano dei Conti OIC
-- ═══════════════════════════════════════════════════════════

INSERT INTO piano_conti (codice, nome, categoria, sottocategoria, sezione_bilancio, voce_ufficiale_oic) VALUES
-- STATO PATRIMONIALE ATTIVO
('1.1.01', 'Brevetti e licenze', 'attivo', 'immobilizzazioni_immateriali', 'SP_attivo', 'B.I.3 - Diritti di brevetto industriale'),
('1.1.02', 'Avviamento', 'attivo', 'immobilizzazioni_immateriali', 'SP_attivo', 'B.I.5 - Avviamento'),
('1.1.03', 'Costi di sviluppo', 'attivo', 'immobilizzazioni_immateriali', 'SP_attivo', 'B.I.2 - Costi di sviluppo'),
('1.1.04', 'F.do amm.to immob. immateriali', 'attivo', 'immobilizzazioni_immateriali', 'SP_attivo', 'B.I - Fondo ammortamento'),
('1.2.01', 'Terreni e fabbricati', 'attivo', 'immobilizzazioni_materiali', 'SP_attivo', 'B.II.1 - Terreni e fabbricati'),
('1.2.02', 'Impianti e macchinari', 'attivo', 'immobilizzazioni_materiali', 'SP_attivo', 'B.II.2 - Impianti e macchinario'),
('1.2.03', 'Attrezzature', 'attivo', 'immobilizzazioni_materiali', 'SP_attivo', 'B.II.3 - Attrezzature industriali'),
('1.2.04', 'Automezzi', 'attivo', 'immobilizzazioni_materiali', 'SP_attivo', 'B.II.4 - Altri beni'),
('1.2.05', 'F.do amm.to immob. materiali', 'attivo', 'immobilizzazioni_materiali', 'SP_attivo', 'B.II - Fondo ammortamento'),
('1.3.01', 'Partecipazioni in controllate', 'attivo', 'immobilizzazioni_finanziarie', 'SP_attivo', 'B.III.1.a - Partecipazioni in imprese controllate'),
('1.3.02', 'Crediti finanziari oltre 12 mesi', 'attivo', 'immobilizzazioni_finanziarie', 'SP_attivo', 'B.III.2 - Crediti'),
('2.1.01', 'Materie prime', 'attivo', 'rimanenze', 'SP_attivo', 'C.I.1 - Materie prime'),
('2.1.02', 'Prodotti in lavorazione', 'attivo', 'rimanenze', 'SP_attivo', 'C.I.2 - Prodotti in corso di lavorazione'),
('2.1.03', 'Prodotti finiti', 'attivo', 'rimanenze', 'SP_attivo', 'C.I.4 - Prodotti finiti e merci'),
('2.2.01', 'Crediti verso clienti', 'attivo', 'crediti', 'SP_attivo', 'C.II.1 - Crediti verso clienti'),
('2.2.02', 'Crediti tributari', 'attivo', 'crediti', 'SP_attivo', 'C.II.5-bis - Crediti tributari'),
('2.2.03', 'Crediti verso altri', 'attivo', 'crediti', 'SP_attivo', 'C.II.5-quater - Verso altri'),
('2.2.04', 'F.do svalutazione crediti', 'attivo', 'crediti', 'SP_attivo', 'C.II - Fondo svalutazione crediti'),
('2.3.01', 'Cassa', 'attivo', 'disponibilita_liquide', 'SP_attivo', 'C.IV.3 - Danaro e valori in cassa'),
('2.3.02', 'Banca c/c', 'attivo', 'disponibilita_liquide', 'SP_attivo', 'C.IV.1 - Depositi bancari e postali'),
('2.4.01', 'Ratei attivi', 'attivo', 'ratei_risconti_attivi', 'SP_attivo', 'D - Ratei e risconti attivi'),
('2.4.02', 'Risconti attivi', 'attivo', 'ratei_risconti_attivi', 'SP_attivo', 'D - Ratei e risconti attivi'),

-- STATO PATRIMONIALE PASSIVO
('3.1.01', 'Capitale sociale', 'patrimonio_netto', 'patrimonio_netto', 'SP_passivo', 'A.I - Capitale'),
('3.1.02', 'Riserva legale', 'patrimonio_netto', 'patrimonio_netto', 'SP_passivo', 'A.IV - Riserva legale'),
('3.1.03', 'Riserva straordinaria', 'patrimonio_netto', 'patrimonio_netto', 'SP_passivo', 'A.VII - Altre riserve'),
('3.1.04', 'Utile (perdita) esercizio', 'patrimonio_netto', 'patrimonio_netto', 'SP_passivo', 'A.IX - Utile (perdita) dell''esercizio'),
('3.2.01', 'Fondo rischi su garanzie', 'passivo', 'fondi_rischi', 'SP_passivo', 'B.1 - Fondi per trattamento di quiescenza'),
('3.2.02', 'Fondo rischi cause legali', 'passivo', 'fondi_rischi', 'SP_passivo', 'B.2 - Fondo per imposte, anche differite'),
('3.2.03', 'Altri fondi rischi', 'passivo', 'fondi_rischi', 'SP_passivo', 'B.3 - Altri fondi'),
('3.3.01', 'TFR', 'passivo', 'tfr', 'SP_passivo', 'C - Trattamento di fine rapporto'),
('3.4.01', 'Mutui passivi', 'passivo', 'debiti_finanziari', 'SP_passivo', 'D.4 - Debiti verso banche'),
('3.4.02', 'Prestiti obbligazionari', 'passivo', 'debiti_finanziari', 'SP_passivo', 'D.1 - Obbligazioni'),
('3.5.01', 'Debiti verso fornitori', 'passivo', 'debiti_commerciali', 'SP_passivo', 'D.7 - Debiti verso fornitori'),
('3.5.02', 'Debiti tributari', 'passivo', 'debiti_commerciali', 'SP_passivo', 'D.12 - Debiti tributari'),
('3.5.03', 'Debiti verso istituti previdenziali', 'passivo', 'debiti_commerciali', 'SP_passivo', 'D.13 - Debiti verso istituti di previdenza'),
('3.5.04', 'Altri debiti', 'passivo', 'debiti_commerciali', 'SP_passivo', 'D.14 - Altri debiti'),
('3.6.01', 'Ratei passivi', 'passivo', 'ratei_risconti_passivi', 'SP_passivo', 'E - Ratei e risconti passivi'),
('3.6.02', 'Risconti passivi', 'passivo', 'ratei_risconti_passivi', 'SP_passivo', 'E - Ratei e risconti passivi'),

-- CONTO ECONOMICO - RICAVI
('4.1.01', 'Ricavi vendite prodotti', 'ricavi', 'ricavi_vendite', 'CE_ricavi', 'A.1 - Ricavi delle vendite e delle prestazioni'),
('4.1.02', 'Ricavi prestazione servizi', 'ricavi', 'ricavi_vendite', 'CE_ricavi', 'A.1 - Ricavi delle vendite e delle prestazioni'),
('4.2.01', 'Variazione rimanenze PF', 'ricavi', 'variazione_rimanenze', 'CE_ricavi', 'A.2 - Variazioni delle rimanenze'),
('4.3.01', 'Incrementi immobilizzazioni', 'ricavi', 'altri_ricavi', 'CE_ricavi', 'A.4 - Incrementi di immobilizzazioni per lavori interni'),
('4.3.02', 'Altri ricavi e proventi', 'ricavi', 'altri_ricavi', 'CE_ricavi', 'A.5 - Altri ricavi e proventi'),
('4.4.01', 'Proventi finanziari', 'ricavi', 'proventi_finanziari', 'CE_ricavi', 'C.16 - Altri proventi finanziari'),

-- CONTO ECONOMICO - COSTI
('5.1.01', 'Acquisto materie prime', 'costi', 'costi_acquisti', 'CE_costi', 'B.6 - Per materie prime'),
('5.1.02', 'Acquisto merci', 'costi', 'costi_acquisti', 'CE_costi', 'B.6 - Per materie prime'),
('5.2.01', 'Costi per servizi', 'costi', 'costi_servizi', 'CE_costi', 'B.7 - Per servizi'),
('5.2.02', 'Consulenze', 'costi', 'costi_servizi', 'CE_costi', 'B.7 - Per servizi'),
('5.2.03', 'Utenze', 'costi', 'costi_servizi', 'CE_costi', 'B.7 - Per servizi'),
('5.3.01', 'Canoni di leasing', 'costi', 'godimento_beni_terzi', 'CE_costi', 'B.8 - Per godimento beni di terzi'),
('5.3.02', 'Affitti passivi', 'costi', 'godimento_beni_terzi', 'CE_costi', 'B.8 - Per godimento beni di terzi'),
('5.4.01', 'Salari e stipendi', 'costi', 'personale', 'CE_costi', 'B.9.a - Salari e stipendi'),
('5.4.02', 'Oneri sociali', 'costi', 'personale', 'CE_costi', 'B.9.b - Oneri sociali'),
('5.4.03', 'Accantonamento TFR', 'costi', 'personale', 'CE_costi', 'B.9.c - Trattamento di fine rapporto'),
('5.5.01', 'Ammortamento immob. immateriali', 'costi', 'ammortamenti', 'CE_costi', 'B.10.a - Ammortamento immobilizzazioni immateriali'),
('5.5.02', 'Ammortamento immob. materiali', 'costi', 'ammortamenti', 'CE_costi', 'B.10.b - Ammortamento immobilizzazioni materiali'),
('5.5.03', 'Svalutazione crediti', 'costi', 'ammortamenti', 'CE_costi', 'B.10.d - Svalutazioni dei crediti'),
('5.6.01', 'Interessi passivi bancari', 'costi', 'oneri_finanziari', 'CE_costi', 'C.17 - Interessi e altri oneri finanziari'),
('5.6.02', 'Interessi passivi su mutui', 'costi', 'oneri_finanziari', 'CE_costi', 'C.17 - Interessi e altri oneri finanziari'),
('5.7.01', 'IRES', 'costi', 'imposte', 'CE_costi', '20 - Imposte sul reddito dell''esercizio'),
('5.7.02', 'IRAP', 'costi', 'imposte', 'CE_costi', '20 - Imposte sul reddito dell''esercizio'),
('5.8.01', 'Accantonamento fondi rischi', 'costi', 'altri_costi', 'CE_costi', 'B.12 - Accantonamenti per rischi'),
('5.8.02', 'Oneri diversi di gestione', 'costi', 'altri_costi', 'CE_costi', 'B.14 - Oneri diversi di gestione');

-- ═══════════════════════════════════════════════════════════
-- SEED DATA: Dati di esempio per esercizio 2025
-- ═══════════════════════════════════════════════════════════

-- Operazioni esempio (partita doppia)
-- Vendita merce: Crediti vs clienti DARE / Ricavi vendite AVERE
INSERT INTO operazioni (data, conto_id, descrizione, importo, dare_avere, esercizio) VALUES
('2025-01-15', (SELECT id FROM piano_conti WHERE codice='2.2.01'), 'Vendita merce Ft. 001/2025', 50000.00, 'dare', 2025),
('2025-01-15', (SELECT id FROM piano_conti WHERE codice='4.1.01'), 'Vendita merce Ft. 001/2025', 50000.00, 'avere', 2025),
('2025-01-20', (SELECT id FROM piano_conti WHERE codice='5.1.01'), 'Acquisto materie prime Ft. A001', 20000.00, 'dare', 2025),
('2025-01-20', (SELECT id FROM piano_conti WHERE codice='3.5.01'), 'Acquisto materie prime Ft. A001', 20000.00, 'avere', 2025),
('2025-02-01', (SELECT id FROM piano_conti WHERE codice='5.4.01'), 'Stipendi gennaio 2025', 15000.00, 'dare', 2025),
('2025-02-01', (SELECT id FROM piano_conti WHERE codice='2.3.02'), 'Stipendi gennaio 2025', 15000.00, 'avere', 2025),
('2025-02-01', (SELECT id FROM piano_conti WHERE codice='5.4.02'), 'Oneri sociali gennaio 2025', 4500.00, 'dare', 2025),
('2025-02-01', (SELECT id FROM piano_conti WHERE codice='3.5.03'), 'Oneri sociali gennaio 2025', 4500.00, 'avere', 2025),
('2025-02-10', (SELECT id FROM piano_conti WHERE codice='2.3.02'), 'Incasso Ft. 001/2025', 50000.00, 'dare', 2025),
('2025-02-10', (SELECT id FROM piano_conti WHERE codice='2.2.01'), 'Incasso Ft. 001/2025', 50000.00, 'avere', 2025),
('2025-03-01', (SELECT id FROM piano_conti WHERE codice='2.2.01'), 'Vendita servizi Ft. 002/2025', 30000.00, 'dare', 2025),
('2025-03-01', (SELECT id FROM piano_conti WHERE codice='4.1.02'), 'Vendita servizi Ft. 002/2025', 30000.00, 'avere', 2025),
('2025-03-15', (SELECT id FROM piano_conti WHERE codice='5.2.03'), 'Utenze Q1 2025', 3000.00, 'dare', 2025),
('2025-03-15', (SELECT id FROM piano_conti WHERE codice='2.3.02'), 'Utenze Q1 2025', 3000.00, 'avere', 2025),
('2025-03-20', (SELECT id FROM piano_conti WHERE codice='5.3.02'), 'Affitto ufficio Q1', 6000.00, 'dare', 2025),
('2025-03-20', (SELECT id FROM piano_conti WHERE codice='2.3.02'), 'Affitto ufficio Q1', 6000.00, 'avere', 2025),
('2025-04-01', (SELECT id FROM piano_conti WHERE codice='1.2.02'), 'Acquisto macchinario', 80000.00, 'dare', 2025),
('2025-04-01', (SELECT id FROM piano_conti WHERE codice='3.4.01'), 'Finanziamento macchinario', 80000.00, 'avere', 2025),
('2025-06-30', (SELECT id FROM piano_conti WHERE codice='2.2.01'), 'Vendita prodotti Ft. 010/2025', 120000.00, 'dare', 2025),
('2025-06-30', (SELECT id FROM piano_conti WHERE codice='4.1.01'), 'Vendita prodotti Ft. 010/2025', 120000.00, 'avere', 2025),
('2025-07-01', (SELECT id FROM piano_conti WHERE codice='5.1.01'), 'Acquisto materie H2', 45000.00, 'dare', 2025),
('2025-07-01', (SELECT id FROM piano_conti WHERE codice='3.5.01'), 'Acquisto materie H2', 45000.00, 'avere', 2025),
-- Conferimento capitale iniziale
('2025-01-01', (SELECT id FROM piano_conti WHERE codice='2.3.02'), 'Conferimento capitale sociale', 100000.00, 'dare', 2025),
('2025-01-01', (SELECT id FROM piano_conti WHERE codice='3.1.01'), 'Conferimento capitale sociale', 100000.00, 'avere', 2025),
-- Rimanenze finali
('2025-12-31', (SELECT id FROM piano_conti WHERE codice='2.1.03'), 'Rimanenze finali prodotti finiti', 25000.00, 'dare', 2025),
('2025-12-31', (SELECT id FROM piano_conti WHERE codice='4.2.01'), 'Variazione rimanenze PF', 25000.00, 'avere', 2025);

-- Scritture di assestamento esempio
INSERT INTO scritture_assestamento (data, tipo, conto_dare, conto_avere, importo, descrizione, esercizio) VALUES
('2025-12-31', 'ammortamento',
  (SELECT id FROM piano_conti WHERE codice='5.5.02'),
  (SELECT id FROM piano_conti WHERE codice='1.2.05'),
  8000.00, 'Ammortamento impianti e macchinari 10%', 2025),
('2025-12-31', 'ammortamento',
  (SELECT id FROM piano_conti WHERE codice='5.5.01'),
  (SELECT id FROM piano_conti WHERE codice='1.1.04'),
  2000.00, 'Ammortamento brevetti 20%', 2025),
('2025-12-31', 'accantonamento',
  (SELECT id FROM piano_conti WHERE codice='5.4.03'),
  (SELECT id FROM piano_conti WHERE codice='3.3.01'),
  3500.00, 'Accantonamento TFR esercizio 2025', 2025),
('2025-12-31', 'accantonamento',
  (SELECT id FROM piano_conti WHERE codice='5.8.01'),
  (SELECT id FROM piano_conti WHERE codice='3.2.03'),
  2000.00, 'Accantonamento fondo rischi', 2025),
('2025-12-31', 'risconto_attivo',
  (SELECT id FROM piano_conti WHERE codice='2.4.02'),
  (SELECT id FROM piano_conti WHERE codice='5.3.02'),
  2000.00, 'Risconto attivo affitto Q1 2026', 2025),
('2025-12-31', 'rateo_passivo',
  (SELECT id FROM piano_conti WHERE codice='5.6.01'),
  (SELECT id FROM piano_conti WHERE codice='3.6.01'),
  1500.00, 'Rateo passivo interessi su mutuo', 2025);

-- Budget esempio
INSERT INTO budget (esercizio, mese, voce, importo) VALUES
(2025, 1, 'Ricavi vendite', 15000), (2025, 2, 'Ricavi vendite', 16000),
(2025, 3, 'Ricavi vendite', 18000), (2025, 4, 'Ricavi vendite', 17000),
(2025, 5, 'Ricavi vendite', 19000), (2025, 6, 'Ricavi vendite', 22000),
(2025, 7, 'Ricavi vendite', 20000), (2025, 8, 'Ricavi vendite', 14000),
(2025, 9, 'Ricavi vendite', 21000), (2025, 10, 'Ricavi vendite', 23000),
(2025, 11, 'Ricavi vendite', 22000), (2025, 12, 'Ricavi vendite', 25000),
(2025, 1, 'Costi operativi', 10000), (2025, 2, 'Costi operativi', 10500),
(2025, 3, 'Costi operativi', 11000), (2025, 4, 'Costi operativi', 10800),
(2025, 5, 'Costi operativi', 11500), (2025, 6, 'Costi operativi', 12000),
(2025, 7, 'Costi operativi', 11800), (2025, 8, 'Costi operativi', 9500),
(2025, 9, 'Costi operativi', 12500), (2025, 10, 'Costi operativi', 13000),
(2025, 11, 'Costi operativi', 12800), (2025, 12, 'Costi operativi', 14000);

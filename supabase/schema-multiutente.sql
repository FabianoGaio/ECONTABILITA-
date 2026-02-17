-- ═══════════════════════════════════════════════════════════
-- ECONTABILITÀ - Schema Multi-Utente Supabase
-- Ogni utente ha i propri esercizi isolati con RLS
-- ═══════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ───────────────────────────────────────────────────────────
-- 1) DROP delle vecchie tabelle (se upgrade da schema precedente)
-- ───────────────────────────────────────────────────────────
DROP TABLE IF EXISTS budget CASCADE;
DROP TABLE IF EXISTS bilanci CASCADE;
DROP TABLE IF EXISTS scritture_assestamento CASCADE;
DROP TABLE IF EXISTS operazioni CASCADE;
DROP TABLE IF EXISTS piano_conti CASCADE;
DROP TABLE IF EXISTS esercizi CASCADE;
DROP TABLE IF EXISTS profili CASCADE;

-- Anche le tabelle template
DROP TABLE IF EXISTS template_budget CASCADE;
DROP TABLE IF EXISTS template_scritture_assestamento CASCADE;
DROP TABLE IF EXISTS template_operazioni CASCADE;
DROP TABLE IF EXISTS template_piano_conti CASCADE;

-- ───────────────────────────────────────────────────────────
-- 2) PROFILI UTENTI
-- ───────────────────────────────────────────────────────────
CREATE TABLE profili (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100),
  cognome VARCHAR(100),
  ruolo VARCHAR(20) NOT NULL DEFAULT 'studente' CHECK (ruolo IN ('admin', 'studente', 'docente')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger per creare profilo automaticamente alla registrazione
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profili (id, nome, cognome)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'cognome', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ───────────────────────────────────────────────────────────
-- 3) ESERCIZI (ogni utente ha i propri)
-- ───────────────────────────────────────────────────────────
CREATE TABLE esercizi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anno INTEGER NOT NULL,
  descrizione VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, anno)
);

CREATE INDEX idx_esercizi_user ON esercizi(user_id);

-- ───────────────────────────────────────────────────────────
-- 4) PIANO DEI CONTI (per esercizio)
-- ───────────────────────────────────────────────────────────
CREATE TABLE piano_conti (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  esercizio_id UUID NOT NULL REFERENCES esercizi(id) ON DELETE CASCADE,
  codice VARCHAR(20) NOT NULL,
  nome VARCHAR(200) NOT NULL,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('attivo', 'passivo', 'patrimonio_netto', 'ricavi', 'costi')),
  sottocategoria VARCHAR(100) NOT NULL,
  sezione_bilancio VARCHAR(20) NOT NULL CHECK (sezione_bilancio IN ('SP_attivo', 'SP_passivo', 'CE_ricavi', 'CE_costi')),
  voce_ufficiale_oic VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(esercizio_id, codice)
);

CREATE INDEX idx_piano_conti_esercizio ON piano_conti(esercizio_id);

-- ───────────────────────────────────────────────────────────
-- 5) OPERAZIONI (Prima Nota) per esercizio
-- ───────────────────────────────────────────────────────────
CREATE TABLE operazioni (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  esercizio_id UUID NOT NULL REFERENCES esercizi(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  conto_id UUID NOT NULL REFERENCES piano_conti(id) ON DELETE RESTRICT,
  descrizione TEXT NOT NULL,
  importo NUMERIC(15,2) NOT NULL CHECK (importo >= 0),
  dare_avere VARCHAR(5) NOT NULL CHECK (dare_avere IN ('dare', 'avere')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_operazioni_esercizio ON operazioni(esercizio_id);
CREATE INDEX idx_operazioni_conto ON operazioni(conto_id);
CREATE INDEX idx_operazioni_data ON operazioni(data);

-- ───────────────────────────────────────────────────────────
-- 6) SCRITTURE DI ASSESTAMENTO per esercizio
-- ───────────────────────────────────────────────────────────
CREATE TABLE scritture_assestamento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  esercizio_id UUID NOT NULL REFERENCES esercizi(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  tipo VARCHAR(30) NOT NULL CHECK (tipo IN (
    'ammortamento', 'rateo_attivo', 'rateo_passivo',
    'risconto_attivo', 'risconto_passivo', 'accantonamento'
  )),
  conto_dare UUID NOT NULL REFERENCES piano_conti(id) ON DELETE RESTRICT,
  conto_avere UUID NOT NULL REFERENCES piano_conti(id) ON DELETE RESTRICT,
  importo NUMERIC(15,2) NOT NULL CHECK (importo > 0),
  descrizione TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scritture_esercizio ON scritture_assestamento(esercizio_id);

-- ───────────────────────────────────────────────────────────
-- 7) BILANCI (snapshot calcolati) per esercizio
-- ───────────────────────────────────────────────────────────
CREATE TABLE bilanci (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  esercizio_id UUID NOT NULL UNIQUE REFERENCES esercizi(id) ON DELETE CASCADE,
  totale_attivo NUMERIC(15,2) DEFAULT 0,
  totale_passivo NUMERIC(15,2) DEFAULT 0,
  patrimonio_netto NUMERIC(15,2) DEFAULT 0,
  utile NUMERIC(15,2) DEFAULT 0,
  cash_flow_operativo NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────
-- 8) BUDGET per esercizio
-- ───────────────────────────────────────────────────────────
CREATE TABLE budget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  esercizio_id UUID NOT NULL REFERENCES esercizi(id) ON DELETE CASCADE,
  mese INTEGER NOT NULL CHECK (mese BETWEEN 1 AND 12),
  voce VARCHAR(200) NOT NULL,
  importo NUMERIC(15,2) NOT NULL DEFAULT 0,
  UNIQUE(esercizio_id, mese, voce)
);

CREATE INDEX idx_budget_esercizio ON budget(esercizio_id);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Ogni utente vede solo i dati dei propri esercizi
-- ═══════════════════════════════════════════════════════════

ALTER TABLE profili ENABLE ROW LEVEL SECURITY;
ALTER TABLE esercizi ENABLE ROW LEVEL SECURITY;
ALTER TABLE piano_conti ENABLE ROW LEVEL SECURITY;
ALTER TABLE operazioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE scritture_assestamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE bilanci ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget ENABLE ROW LEVEL SECURITY;

-- Profili: ognuno vede solo il proprio
CREATE POLICY "Users read own profile" ON profili
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profili
  FOR UPDATE USING (auth.uid() = id);

-- Esercizi: ognuno vede solo i propri
CREATE POLICY "Users manage own esercizi" ON esercizi
  FOR ALL USING (auth.uid() = user_id);

-- Piano conti: via esercizi.user_id
CREATE POLICY "Users manage own piano_conti" ON piano_conti
  FOR ALL USING (
    EXISTS (SELECT 1 FROM esercizi WHERE esercizi.id = piano_conti.esercizio_id AND esercizi.user_id = auth.uid())
  );

-- Operazioni: via esercizi.user_id
CREATE POLICY "Users manage own operazioni" ON operazioni
  FOR ALL USING (
    EXISTS (SELECT 1 FROM esercizi WHERE esercizi.id = operazioni.esercizio_id AND esercizi.user_id = auth.uid())
  );

-- Scritture: via esercizi.user_id
CREATE POLICY "Users manage own scritture" ON scritture_assestamento
  FOR ALL USING (
    EXISTS (SELECT 1 FROM esercizi WHERE esercizi.id = scritture_assestamento.esercizio_id AND esercizi.user_id = auth.uid())
  );

-- Bilanci: via esercizi.user_id
CREATE POLICY "Users manage own bilanci" ON bilanci
  FOR ALL USING (
    EXISTS (SELECT 1 FROM esercizi WHERE esercizi.id = bilanci.esercizio_id AND esercizi.user_id = auth.uid())
  );

-- Budget: via esercizi.user_id
CREATE POLICY "Users manage own budget" ON budget
  FOR ALL USING (
    EXISTS (SELECT 1 FROM esercizi WHERE esercizi.id = budget.esercizio_id AND esercizi.user_id = auth.uid())
  );

-- ═══════════════════════════════════════════════════════════
-- TABELLE TEMPLATE (dati modello da clonare per ogni nuovo esercizio)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE template_piano_conti (
  id SERIAL PRIMARY KEY,
  codice VARCHAR(20) NOT NULL,
  nome VARCHAR(200) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  sottocategoria VARCHAR(100) NOT NULL,
  sezione_bilancio VARCHAR(20) NOT NULL,
  voce_ufficiale_oic VARCHAR(200)
);

CREATE TABLE template_operazioni (
  id SERIAL PRIMARY KEY,
  livello VARCHAR(20) NOT NULL DEFAULT 'base',  -- base, intermedio, avanzato
  data_offset_giorni INTEGER NOT NULL DEFAULT 0,  -- offset dal 01/01 dell'anno
  conto_codice VARCHAR(20) NOT NULL,
  descrizione TEXT NOT NULL,
  importo NUMERIC(15,2) NOT NULL,
  dare_avere VARCHAR(5) NOT NULL
);

CREATE TABLE template_scritture_assestamento (
  id SERIAL PRIMARY KEY,
  livello VARCHAR(20) NOT NULL DEFAULT 'base',
  tipo VARCHAR(30) NOT NULL,
  conto_dare_codice VARCHAR(20) NOT NULL,
  conto_avere_codice VARCHAR(20) NOT NULL,
  importo NUMERIC(15,2) NOT NULL,
  descrizione TEXT NOT NULL
);

CREATE TABLE template_budget (
  id SERIAL PRIMARY KEY,
  livello VARCHAR(20) NOT NULL DEFAULT 'base',
  mese INTEGER NOT NULL,
  voce VARCHAR(200) NOT NULL,
  importo NUMERIC(15,2) NOT NULL
);

-- ═══════════════════════════════════════════════════════════
-- SEED TEMPLATE: Piano dei Conti OIC
-- ═══════════════════════════════════════════════════════════

INSERT INTO template_piano_conti (codice, nome, categoria, sottocategoria, sezione_bilancio, voce_ufficiale_oic) VALUES
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
-- SEED TEMPLATE: Operazioni per livello
-- ═══════════════════════════════════════════════════════════

-- LIVELLO BASE (2023) - operazioni semplici
INSERT INTO template_operazioni (livello, data_offset_giorni, conto_codice, descrizione, importo, dare_avere) VALUES
-- Conferimento capitale
('base', 0, '2.3.02', 'Conferimento capitale sociale', 50000, 'dare'),
('base', 0, '3.1.01', 'Conferimento capitale sociale', 50000, 'avere'),
-- Vendita semplice
('base', 30, '2.2.01', 'Vendita merce Ft. 001', 25000, 'dare'),
('base', 30, '4.1.01', 'Vendita merce Ft. 001', 25000, 'avere'),
-- Acquisto
('base', 45, '5.1.01', 'Acquisto materie prime Ft. A001', 10000, 'dare'),
('base', 45, '3.5.01', 'Acquisto materie prime Ft. A001', 10000, 'avere'),
-- Stipendi
('base', 60, '5.4.01', 'Stipendi bimestre', 8000, 'dare'),
('base', 60, '2.3.02', 'Stipendi bimestre', 8000, 'avere'),
('base', 60, '5.4.02', 'Oneri sociali bimestre', 2400, 'dare'),
('base', 60, '3.5.03', 'Oneri sociali bimestre', 2400, 'avere'),
-- Incasso
('base', 75, '2.3.02', 'Incasso Ft. 001', 25000, 'dare'),
('base', 75, '2.2.01', 'Incasso Ft. 001', 25000, 'avere'),
-- Seconda vendita
('base', 120, '2.2.01', 'Vendita merce Ft. 002', 18000, 'dare'),
('base', 120, '4.1.01', 'Vendita merce Ft. 002', 18000, 'avere'),
-- Utenze
('base', 90, '5.2.03', 'Utenze Q1', 1500, 'dare'),
('base', 90, '2.3.02', 'Utenze Q1', 1500, 'avere'),
-- Rimanenze finali
('base', 364, '2.1.03', 'Rimanenze finali prodotti finiti', 8000, 'dare'),
('base', 364, '4.2.01', 'Variazione rimanenze PF', 8000, 'avere');

-- LIVELLO INTERMEDIO (2024)
INSERT INTO template_operazioni (livello, data_offset_giorni, conto_codice, descrizione, importo, dare_avere) VALUES
('intermedio', 0, '2.3.02', 'Conferimento capitale sociale', 80000, 'dare'),
('intermedio', 0, '3.1.01', 'Conferimento capitale sociale', 80000, 'avere'),
('intermedio', 14, '2.2.01', 'Vendita merce Ft. 001', 40000, 'dare'),
('intermedio', 14, '4.1.01', 'Vendita merce Ft. 001', 40000, 'avere'),
('intermedio', 20, '5.1.01', 'Acquisto materie prime Ft. A001', 18000, 'dare'),
('intermedio', 20, '3.5.01', 'Acquisto materie prime Ft. A001', 18000, 'avere'),
('intermedio', 30, '5.4.01', 'Stipendi gennaio', 12000, 'dare'),
('intermedio', 30, '2.3.02', 'Stipendi gennaio', 12000, 'avere'),
('intermedio', 30, '5.4.02', 'Oneri sociali gennaio', 3600, 'dare'),
('intermedio', 30, '3.5.03', 'Oneri sociali gennaio', 3600, 'avere'),
('intermedio', 40, '2.3.02', 'Incasso Ft. 001', 40000, 'dare'),
('intermedio', 40, '2.2.01', 'Incasso Ft. 001', 40000, 'avere'),
('intermedio', 60, '2.2.01', 'Vendita servizi Ft. 002', 22000, 'dare'),
('intermedio', 60, '4.1.02', 'Vendita servizi Ft. 002', 22000, 'avere'),
('intermedio', 75, '5.2.03', 'Utenze Q1', 2500, 'dare'),
('intermedio', 75, '2.3.02', 'Utenze Q1', 2500, 'avere'),
('intermedio', 80, '5.3.02', 'Affitto ufficio Q1', 4500, 'dare'),
('intermedio', 80, '2.3.02', 'Affitto ufficio Q1', 4500, 'avere'),
('intermedio', 90, '1.2.02', 'Acquisto macchinario', 60000, 'dare'),
('intermedio', 90, '3.4.01', 'Finanziamento macchinario', 60000, 'avere'),
('intermedio', 150, '2.2.01', 'Vendita prodotti Ft. 005', 75000, 'dare'),
('intermedio', 150, '4.1.01', 'Vendita prodotti Ft. 005', 75000, 'avere'),
('intermedio', 180, '5.1.01', 'Acquisto materie H2', 30000, 'dare'),
('intermedio', 180, '3.5.01', 'Acquisto materie H2', 30000, 'avere'),
('intermedio', 364, '2.1.03', 'Rimanenze finali prodotti finiti', 15000, 'dare'),
('intermedio', 364, '4.2.01', 'Variazione rimanenze PF', 15000, 'avere');

-- LIVELLO AVANZATO (2025) - identico ai demo data originali
INSERT INTO template_operazioni (livello, data_offset_giorni, conto_codice, descrizione, importo, dare_avere) VALUES
('avanzato', 0, '2.3.02', 'Conferimento capitale sociale', 100000, 'dare'),
('avanzato', 0, '3.1.01', 'Conferimento capitale sociale', 100000, 'avere'),
('avanzato', 14, '2.2.01', 'Vendita merce Ft. 001', 50000, 'dare'),
('avanzato', 14, '4.1.01', 'Vendita merce Ft. 001', 50000, 'avere'),
('avanzato', 19, '5.1.01', 'Acquisto materie prime Ft. A001', 20000, 'dare'),
('avanzato', 19, '3.5.01', 'Acquisto materie prime Ft. A001', 20000, 'avere'),
('avanzato', 31, '5.4.01', 'Stipendi gennaio', 15000, 'dare'),
('avanzato', 31, '2.3.02', 'Stipendi gennaio', 15000, 'avere'),
('avanzato', 31, '5.4.02', 'Oneri sociali gennaio', 4500, 'dare'),
('avanzato', 31, '3.5.03', 'Oneri sociali gennaio', 4500, 'avere'),
('avanzato', 40, '2.3.02', 'Incasso Ft. 001', 50000, 'dare'),
('avanzato', 40, '2.2.01', 'Incasso Ft. 001', 50000, 'avere'),
('avanzato', 59, '2.2.01', 'Vendita servizi Ft. 002', 30000, 'dare'),
('avanzato', 59, '4.1.02', 'Vendita servizi Ft. 002', 30000, 'avere'),
('avanzato', 73, '5.2.03', 'Utenze Q1', 3000, 'dare'),
('avanzato', 73, '2.3.02', 'Utenze Q1', 3000, 'avere'),
('avanzato', 78, '5.3.02', 'Affitto ufficio Q1', 6000, 'dare'),
('avanzato', 78, '2.3.02', 'Affitto ufficio Q1', 6000, 'avere'),
('avanzato', 90, '1.2.02', 'Acquisto macchinario', 80000, 'dare'),
('avanzato', 90, '3.4.01', 'Finanziamento macchinario', 80000, 'avere'),
('avanzato', 180, '2.2.01', 'Vendita prodotti Ft. 010', 120000, 'dare'),
('avanzato', 180, '4.1.01', 'Vendita prodotti Ft. 010', 120000, 'avere'),
('avanzato', 181, '5.1.01', 'Acquisto materie H2', 45000, 'dare'),
('avanzato', 181, '3.5.01', 'Acquisto materie H2', 45000, 'avere'),
('avanzato', 270, '2.2.01', 'Vendita prodotti Q4 Ft. 020', 65000, 'dare'),
('avanzato', 270, '4.1.01', 'Vendita prodotti Q4 Ft. 020', 65000, 'avere'),
('avanzato', 300, '5.2.02', 'Consulenza fiscale', 8000, 'dare'),
('avanzato', 300, '3.5.01', 'Consulenza fiscale', 8000, 'avere'),
('avanzato', 330, '4.4.01', 'Interessi attivi su deposito', 1200, 'avere'),
('avanzato', 330, '2.3.02', 'Interessi attivi su deposito', 1200, 'dare'),
('avanzato', 364, '2.1.03', 'Rimanenze finali prodotti finiti', 25000, 'dare'),
('avanzato', 364, '4.2.01', 'Variazione rimanenze PF', 25000, 'avere');

-- ═══════════════════════════════════════════════════════════
-- SEED TEMPLATE: Scritture di assestamento per livello
-- ═══════════════════════════════════════════════════════════

INSERT INTO template_scritture_assestamento (livello, tipo, conto_dare_codice, conto_avere_codice, importo, descrizione) VALUES
-- BASE
('base', 'ammortamento', '5.5.02', '1.2.05', 3000, 'Ammortamento impianti e macchinari'),
('base', 'accantonamento', '5.4.03', '3.3.01', 2000, 'Accantonamento TFR'),
-- INTERMEDIO
('intermedio', 'ammortamento', '5.5.02', '1.2.05', 6000, 'Ammortamento impianti e macchinari 10%'),
('intermedio', 'ammortamento', '5.5.01', '1.1.04', 1500, 'Ammortamento brevetti 20%'),
('intermedio', 'accantonamento', '5.4.03', '3.3.01', 3000, 'Accantonamento TFR'),
('intermedio', 'risconto_attivo', '2.4.02', '5.3.02', 1500, 'Risconto attivo affitto'),
-- AVANZATO
('avanzato', 'ammortamento', '5.5.02', '1.2.05', 8000, 'Ammortamento impianti e macchinari 10%'),
('avanzato', 'ammortamento', '5.5.01', '1.1.04', 2000, 'Ammortamento brevetti 20%'),
('avanzato', 'accantonamento', '5.4.03', '3.3.01', 3500, 'Accantonamento TFR esercizio'),
('avanzato', 'accantonamento', '5.8.01', '3.2.03', 2000, 'Accantonamento fondo rischi'),
('avanzato', 'risconto_attivo', '2.4.02', '5.3.02', 2000, 'Risconto attivo affitto Q1 successivo'),
('avanzato', 'rateo_passivo', '5.6.01', '3.6.01', 1500, 'Rateo passivo interessi su mutuo');

-- ═══════════════════════════════════════════════════════════
-- SEED TEMPLATE: Budget per livello
-- ═══════════════════════════════════════════════════════════

INSERT INTO template_budget (livello, mese, voce, importo) VALUES
-- BASE
('base', 1, 'Ricavi vendite', 8000), ('base', 2, 'Ricavi vendite', 8500),
('base', 3, 'Ricavi vendite', 9000), ('base', 4, 'Ricavi vendite', 8800),
('base', 5, 'Ricavi vendite', 9500), ('base', 6, 'Ricavi vendite', 10000),
('base', 7, 'Ricavi vendite', 9800), ('base', 8, 'Ricavi vendite', 7000),
('base', 9, 'Ricavi vendite', 10500), ('base', 10, 'Ricavi vendite', 11000),
('base', 11, 'Ricavi vendite', 10800), ('base', 12, 'Ricavi vendite', 12000),
('base', 1, 'Costi operativi', 5000), ('base', 2, 'Costi operativi', 5200),
('base', 3, 'Costi operativi', 5500), ('base', 4, 'Costi operativi', 5400),
('base', 5, 'Costi operativi', 5800), ('base', 6, 'Costi operativi', 6000),
('base', 7, 'Costi operativi', 5900), ('base', 8, 'Costi operativi', 4500),
('base', 9, 'Costi operativi', 6200), ('base', 10, 'Costi operativi', 6500),
('base', 11, 'Costi operativi', 6400), ('base', 12, 'Costi operativi', 7000),
-- INTERMEDIO
('intermedio', 1, 'Ricavi vendite', 12000), ('intermedio', 2, 'Ricavi vendite', 12500),
('intermedio', 3, 'Ricavi vendite', 14000), ('intermedio', 4, 'Ricavi vendite', 13500),
('intermedio', 5, 'Ricavi vendite', 15000), ('intermedio', 6, 'Ricavi vendite', 17000),
('intermedio', 7, 'Ricavi vendite', 16000), ('intermedio', 8, 'Ricavi vendite', 11000),
('intermedio', 9, 'Ricavi vendite', 17000), ('intermedio', 10, 'Ricavi vendite', 18000),
('intermedio', 11, 'Ricavi vendite', 17500), ('intermedio', 12, 'Ricavi vendite', 20000),
('intermedio', 1, 'Costi operativi', 8000), ('intermedio', 2, 'Costi operativi', 8300),
('intermedio', 3, 'Costi operativi', 8800), ('intermedio', 4, 'Costi operativi', 8600),
('intermedio', 5, 'Costi operativi', 9200), ('intermedio', 6, 'Costi operativi', 9500),
('intermedio', 7, 'Costi operativi', 9300), ('intermedio', 8, 'Costi operativi', 7500),
('intermedio', 9, 'Costi operativi', 10000), ('intermedio', 10, 'Costi operativi', 10500),
('intermedio', 11, 'Costi operativi', 10200), ('intermedio', 12, 'Costi operativi', 11500),
-- AVANZATO
('avanzato', 1, 'Ricavi vendite', 15000), ('avanzato', 2, 'Ricavi vendite', 16000),
('avanzato', 3, 'Ricavi vendite', 18000), ('avanzato', 4, 'Ricavi vendite', 17000),
('avanzato', 5, 'Ricavi vendite', 19000), ('avanzato', 6, 'Ricavi vendite', 22000),
('avanzato', 7, 'Ricavi vendite', 20000), ('avanzato', 8, 'Ricavi vendite', 14000),
('avanzato', 9, 'Ricavi vendite', 21000), ('avanzato', 10, 'Ricavi vendite', 23000),
('avanzato', 11, 'Ricavi vendite', 22000), ('avanzato', 12, 'Ricavi vendite', 25000),
('avanzato', 1, 'Costi operativi', 10000), ('avanzato', 2, 'Costi operativi', 10500),
('avanzato', 3, 'Costi operativi', 11000), ('avanzato', 4, 'Costi operativi', 10800),
('avanzato', 5, 'Costi operativi', 11500), ('avanzato', 6, 'Costi operativi', 12000),
('avanzato', 7, 'Costi operativi', 11800), ('avanzato', 8, 'Costi operativi', 9500),
('avanzato', 9, 'Costi operativi', 12500), ('avanzato', 10, 'Costi operativi', 13000),
('avanzato', 11, 'Costi operativi', 12800), ('avanzato', 12, 'Costi operativi', 14000);

-- ═══════════════════════════════════════════════════════════
-- FUNZIONE: Clona template per un nuovo esercizio
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION clone_template_per_esercizio(
  p_esercizio_id UUID,
  p_anno INTEGER,
  p_livello VARCHAR DEFAULT 'avanzato'
)
RETURNS VOID AS $$
DECLARE
  v_tmpl RECORD;
  v_conto_dare UUID;
  v_conto_avere UUID;
BEGIN
  -- 1) Clona piano dei conti dal template
  INSERT INTO piano_conti (esercizio_id, codice, nome, categoria, sottocategoria, sezione_bilancio, voce_ufficiale_oic)
  SELECT p_esercizio_id, codice, nome, categoria, sottocategoria, sezione_bilancio, voce_ufficiale_oic
  FROM template_piano_conti;

  -- 2) Clona operazioni dal template per il livello
  FOR v_tmpl IN
    SELECT * FROM template_operazioni WHERE livello = p_livello
  LOOP
    INSERT INTO operazioni (esercizio_id, data, conto_id, descrizione, importo, dare_avere)
    VALUES (
      p_esercizio_id,
      (p_anno || '-01-01')::DATE + v_tmpl.data_offset_giorni,
      (SELECT id FROM piano_conti WHERE esercizio_id = p_esercizio_id AND codice = v_tmpl.conto_codice),
      v_tmpl.descrizione,
      v_tmpl.importo,
      v_tmpl.dare_avere
    );
  END LOOP;

  -- 3) Clona scritture di assestamento
  FOR v_tmpl IN
    SELECT * FROM template_scritture_assestamento WHERE livello = p_livello
  LOOP
    SELECT id INTO v_conto_dare FROM piano_conti WHERE esercizio_id = p_esercizio_id AND codice = v_tmpl.conto_dare_codice;
    SELECT id INTO v_conto_avere FROM piano_conti WHERE esercizio_id = p_esercizio_id AND codice = v_tmpl.conto_avere_codice;
    
    INSERT INTO scritture_assestamento (esercizio_id, data, tipo, conto_dare, conto_avere, importo, descrizione)
    VALUES (
      p_esercizio_id,
      (p_anno || '-12-31')::DATE,
      v_tmpl.tipo,
      v_conto_dare,
      v_conto_avere,
      v_tmpl.importo,
      v_tmpl.descrizione
    );
  END LOOP;

  -- 4) Clona budget
  INSERT INTO budget (esercizio_id, mese, voce, importo)
  SELECT p_esercizio_id, mese, voce, importo
  FROM template_budget
  WHERE livello = p_livello;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════════
-- FUNZIONE: Setup completo per un nuovo utente
-- Crea 3 esercizi (2023 base, 2024 intermedio, 2025 avanzato)
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION setup_nuovo_utente(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_esercizio_id UUID;
  v_count INTEGER;
BEGIN
  -- Verifica se l'utente ha già esercizi
  SELECT COUNT(*) INTO v_count FROM esercizi WHERE user_id = p_user_id;
  IF v_count > 0 THEN
    RETURN;
  END IF;

  -- Esercizio 2023 - Base
  INSERT INTO esercizi (user_id, anno, descrizione) VALUES (p_user_id, 2023, 'Base')
  RETURNING id INTO v_esercizio_id;
  PERFORM clone_template_per_esercizio(v_esercizio_id, 2023, 'base');

  -- Esercizio 2024 - Intermedio
  INSERT INTO esercizi (user_id, anno, descrizione) VALUES (p_user_id, 2024, 'Intermedio')
  RETURNING id INTO v_esercizio_id;
  PERFORM clone_template_per_esercizio(v_esercizio_id, 2024, 'intermedio');

  -- Esercizio 2025 - Avanzato
  INSERT INTO esercizi (user_id, anno, descrizione) VALUES (p_user_id, 2025, 'Avanzato')
  RETURNING id INTO v_esercizio_id;
  PERFORM clone_template_per_esercizio(v_esercizio_id, 2025, 'avanzato');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

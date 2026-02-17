-- ═══════════════════════════════════════════════════════════
-- SCHEMA DIDATTICO - Tabella info_contabili
-- ═══════════════════════════════════════════════════════════
-- Estende il database Supabase con contenuti didattici
-- universitari per ogni conto, voce di bilancio e indice.
-- ═══════════════════════════════════════════════════════════

-- Tabella principale contenuti didattici
CREATE TABLE IF NOT EXISTS info_contabili (
  id            TEXT PRIMARY KEY,
  codice_conto  TEXT,
  titolo        TEXT NOT NULL,
  categoria     TEXT NOT NULL CHECK (
    categoria IN ('conto_attivo','conto_passivo','conto_pn','conto_ricavo','conto_costo',
                  'voce_bilancio','indice','assestamento','finanziario','gestionale')
  ),
  definizione       TEXT NOT NULL,
  spiegazione       TEXT NOT NULL,
  collocazione_bilancio TEXT NOT NULL,
  scrittura_tipica  TEXT NOT NULL,
  esempio_pratico   TEXT NOT NULL,
  effetto_bilancio  TEXT NOT NULL,
  effetto_utile     TEXT NOT NULL,
  effetto_cassa     TEXT NOT NULL,
  effetto_indici    TEXT NOT NULL,
  formula           TEXT,
  normativa         TEXT,
  collegamenti      TEXT[] DEFAULT '{}',
  tooltip           TEXT NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- Indice per ricerca per codice conto
CREATE INDEX IF NOT EXISTS idx_info_codice ON info_contabili(codice_conto);
CREATE INDEX IF NOT EXISTS idx_info_categoria ON info_contabili(categoria);

-- ═══════════════════════════════════════════════════════════
-- SEED CONTENUTI DIDATTICI
-- ═══════════════════════════════════════════════════════════

INSERT INTO info_contabili (id, codice_conto, titolo, categoria, definizione, spiegazione, collocazione_bilancio, scrittura_tipica, esempio_pratico, effetto_bilancio, effetto_utile, effetto_cassa, effetto_indici, formula, normativa, collegamenti, tooltip)
VALUES

-- BREVETTI
('brevetti', '1.1.01', 'Brevetti e Licenze', 'conto_attivo',
 'Diritti di utilizzazione industriale acquisiti a titolo oneroso: brevetti, licenze software, diritti d''autore.',
 'Quando un''azienda acquista un brevetto o una licenza software, non lo registra come costo immediato ma come investimento pluriennale.',
 'Stato Patrimoniale ATTIVO, voce B.I.3 "Diritti di brevetto industriale"',
 E'Acquisto brevetto:\n  DARE: Brevetti e licenze     €50.000\n  AVERE: Debiti vs fornitori   €50.000',
 'La Alfa S.r.l. acquista un brevetto per €50.000 con vita utile 5 anni. Ammortamento: €10.000/anno.',
 'Aumenta l''attivo immobilizzato (B.I). Il fondo ammortamento riduce il valore netto.',
 'L''acquisto NON impatta il CE. L''ammortamento genera un costo che riduce EBIT e utile.',
 'L''acquisto genera uscita di cassa. L''ammortamento è un costo figurativo NON cash.',
 'Aumenta il denominatore del ROI. L''ammortamento riduce ROS e ROI.',
 NULL,
 'Art. 2424 c.c., voce B.I.3; OIC 24.',
 ARRAY['ammortamento_immateriali','ebit','cash_flow_investimenti'],
 'Beni immateriali a utilità pluriennale: brevetti, licenze, diritti'),

-- CREDITI VS CLIENTI
('crediti_clienti', '2.2.01', 'Crediti verso Clienti', 'conto_attivo',
 'Diritti dell''impresa verso i clienti per beni venduti o servizi prestati non ancora incassati.',
 'In Italia la vendita si registra alla fatturazione (competenza), non all''incasso. Se fatturi €100.000 e incassi €70.000, hai €30.000 di crediti.',
 'Stato Patrimoniale ATTIVO, voce C.II.1 "Crediti verso clienti"',
 E'Vendita:\n  DARE: Crediti vs clienti     €50.000\n  AVERE: Ricavi vendite        €50.000\n\nIncasso:\n  DARE: Banca c/c              €50.000\n  AVERE: Crediti vs clienti    €50.000',
 'Vendita di €50.000 con pagamento a 60 giorni. Al bilancio il cliente non ha ancora pagato.',
 'Aumenta l''attivo circolante. Crediti elevati rispetto ai ricavi indicano tempi di incasso lunghi.',
 'La vendita genera ricavo al momento della fattura, NON dell''incasso.',
 'I crediti NON sono cassa! Una vendita fatturata ma non incassata NON genera cash flow.',
 'Aumenta current ratio. DSO elevato allunga il ciclo monetario.',
 'DSO = (Crediti vs clienti / Ricavi) x 365',
 'Art. 2424 c.c., C.II.1; OIC 15.',
 ARRAY['fondo_svalutazione_crediti','dso','current_ratio','cash_flow_operativo'],
 'Importi dovuti dai clienti per vendite non ancora incassate'),

-- RIMANENZE MP
('rimanenze_mp', '2.1.01', 'Materie Prime', 'conto_attivo',
 'Scorte di materie prime non ancora utilizzate nel processo produttivo.',
 'Le rimanenze di materie prime rappresentano un "magazzino di input". La variazione impatta il CE.',
 'Stato Patrimoniale ATTIVO, voce C.I.1 "Materie prime, sussidiarie e di consumo"',
 E'Rilevazione rimanenze finali:\n  DARE: Materie prime (SP)     €15.000\n  AVERE: Variaz. rim. MP (CE)  €15.000',
 'Al 31/12 inventario di €15.000, anno precedente €12.000. Variazione +€3.000 riduce i costi nel CE.',
 'Aumenta l''attivo circolante. Rimanenze elevate possono indicare sovrastoccaggio.',
 'Aumento rimanenze RIDUCE i costi. Diminuzione li AUMENTA.',
 'Rimanenze = denaro "bloccato" in magazzino. Meno liquidità disponibile.',
 'Aumenta current ratio. Peggiorano rotazione magazzino e ciclo monetario.',
 'Costo del venduto = Rim. iniziali + Acquisti - Rim. finali',
 'Art. 2426 n.9-10 c.c.; OIC 13.',
 ARRAY['rimanenze_pf','rotazione_magazzino','current_ratio','quick_ratio'],
 'Scorte di materie prime in magazzino'),

-- DEBITI VS FORNITORI
('debiti_fornitori', '3.5.01', 'Debiti verso Fornitori', 'conto_passivo',
 'Importi dovuti ai fornitori per beni/servizi acquistati e non ancora pagati.',
 'La dilazione di pagamento ai fornitori è una forma di finanziamento a costo zero del capitale circolante.',
 'Stato Patrimoniale PASSIVO, voce D.7 "Debiti verso fornitori"',
 E'Acquisto a credito:\n  DARE: Acquisti materie prime  €20.000\n  AVERE: Debiti vs fornitori   €20.000',
 'Acquisti annui €400.000, DPO 60 gg. Debiti medi = €400.000 x 60/365 = €65.753.',
 'Aumenta il passivo corrente. È una delle voci più rilevanti.',
 'L''acquisto crea un costo nel CE; il debito è solo la modalità di pagamento.',
 'Il debito RITARDA l''uscita di cassa. DPO alto migliora il CF operativo.',
 'Aumenta passività correnti → peggiora current ratio. Migliora ciclo monetario.',
 'DPO = (Debiti vs fornitori / Acquisti) x 365',
 'Art. 2424 c.c., D.7; OIC 19.',
 ARRAY['dpo','current_ratio','ciclo_monetario','cash_flow_operativo'],
 'Debiti commerciali: fonte di finanziamento spontanea e gratuita'),

-- MUTUI PASSIVI
('mutui_passivi', '3.4.01', 'Mutui Passivi', 'conto_passivo',
 'Finanziamenti bancari a medio-lungo termine garantiti da ipoteca o fideiussione.',
 'Il mutuo è la forma di finanziamento più comune per investimenti. La rata include quota capitale e interessi.',
 'Stato Patrimoniale PASSIVO, voce D.4 "Debiti verso banche"',
 E'Erogazione:\n  DARE: Banca c/c              €200.000\n  AVERE: Mutui passivi         €200.000\n\nRata:\n  DARE: Mutui passivi          €1.500\n  DARE: Interessi passivi      €500\n  AVERE: Banca c/c             €2.000',
 'Mutuo €200.000 a 10 anni, 3%. Rata mensile circa €1.931.',
 'All''erogazione: +attivo e +passivo. Ogni rata: -passivo e -attivo.',
 'Solo gli interessi impattano il CE (C.17). La quota capitale NON è un costo.',
 'L''erogazione è un''entrata. Le rate sono uscite.',
 'Aumenta leverage. Se ROI > tasso del mutuo → leva positiva.',
 NULL,
 'Art. 2424 c.c., D.4; OIC 19.',
 ARRAY['interessi_passivi','leverage','roi','cash_flow_finanziamenti'],
 'Finanziamenti bancari a medio-lungo termine per investimenti'),

-- FONDI RISCHI
('fondi_rischi', '3.2.03', 'Fondi per Rischi e Oneri', 'conto_passivo',
 'Accantonamenti per coprire perdite o debiti futuri probabili ma incerti nell''ammontare.',
 'Il principio di prudenza impone di anticipare i costi probabili. Si accantona solo se rischio >50%.',
 'Stato Patrimoniale PASSIVO, voce B "Fondi per rischi e oneri"',
 E'Accantonamento:\n  DARE: Accantonamento fondi rischi  €30.000\n  AVERE: Fondo rischi cause legali   €30.000',
 'Causa legale: perdita stimata €30.000. Accantonamento ora, pagamento quando si concretizza.',
 'Aumenta il passivo. L''accantonamento è un costo nel CE (B.12/B.13).',
 'L''accantonamento riduce l''utile. Se la perdita è minore, l''eccedenza migliora utili futuri.',
 'L''accantonamento NON genera uscita di cassa. L''esborso avviene dopo.',
 'Riduce utile → peggiora ROE. I fondi aumentano le passività consolidate.',
 NULL,
 'Art. 2424 c.c., B; OIC 31.',
 ARRAY['utile_netto','cash_flow_operativo'],
 'Accantonamenti per perdite o debiti futuri probabili'),

-- RATEI ATTIVI
('ratei_attivi', '2.4.01', 'Ratei Attivi', 'conto_attivo',
 'Quote di ricavi maturati nell''esercizio la cui manifestazione finanziaria avverrà nell''esercizio successivo.',
 'Il rateo attivo anticipa un ricavo non ancora incassato né fatturato, rispettando la competenza.',
 'Stato Patrimoniale ATTIVO, voce D "Ratei e risconti attivi"',
 E'Interessi attivi maturati:\n  DARE: Ratei attivi           €3.000\n  AVERE: Proventi finanziari   €3.000',
 'Cedola semestrale €6.000 (01/07-30/06). Al 31/12 maturati 6 mesi: rateo €3.000.',
 'Aumenta l''attivo (voce D).',
 'Aumenta i ricavi del CE, quindi aumenta l''utile.',
 'NON genera cassa. L''incasso sarà nell''anno successivo.',
 'Effetto marginale su current ratio.',
 NULL,
 'Art. 2424-bis c.c.; OIC 18.',
 ARRAY['ratei_passivi','risconti_attivi'],
 'Ricavi maturati ma non ancora incassati'),

-- RISCONTI ATTIVI
('risconti_attivi', '2.4.02', 'Risconti Attivi', 'conto_attivo',
 'Quote di costi già pagati ma di competenza economica dell''esercizio successivo.',
 'Il risconto attivo toglie un costo dall''anno corrente e lo rinvia al prossimo.',
 'Stato Patrimoniale ATTIVO, voce D "Ratei e risconti attivi"',
 E'Risconto su affitto:\n  DARE: Risconti attivi        €6.000\n  AVERE: Affitti passivi       €6.000',
 'Affitto annuo €12.000 pagato il 01/07. Al 31/12: 6 mesi futuri. Risconto = €6.000.',
 'Aumenta l''attivo. Riduce i costi nel CE dell''anno corrente.',
 'AUMENTA l''utile riducendo i costi dell''esercizio.',
 'Nessun effetto sulla cassa: il pagamento è già avvenuto.',
 'Lieve aumento current ratio. Migliora ROS/ROI.',
 'Risconto = Importo pagato x (giorni futuri / giorni totali)',
 'Art. 2424-bis c.c.; OIC 18.',
 ARRAY['ratei_attivi','risconti_passivi','ratei_passivi'],
 'Costi già pagati ma di competenza futura'),

-- EBITDA
('ebitda_voce', NULL, 'EBITDA - Margine Operativo Lordo', 'voce_bilancio',
 'Earnings Before Interest, Taxes, Depreciation and Amortization.',
 'L''EBITDA è il proxy migliore del cash flow operativo. Elimina effetti contabili e struttura finanziaria.',
 'NON ha voce autonoma nel bilancio civilistico. Si calcola: Valore produzione - Costi + Ammortamenti.',
 'Non ha scrittura propria. EBITDA = A) - B) + Ammortamenti',
 'Ricavi €1M, costi operativi €700K, ammortamenti €50K → EBITDA = €350K (margin 35%).',
 'Non è una voce di bilancio ma il margine intermedio più importante.',
 'EBITDA >= EBIT sempre. La differenza sono gli ammortamenti.',
 'Proxy del CF operativo. Per passare a CF: +/- variazioni circolante.',
 'EBITDA margin usato per comparare aziende. EV/EBITDA per le valutazioni.',
 'EBITDA = Ricavi - Costi operativi (excl. ammortamenti)\nEBITDA margin = EBITDA / Ricavi x 100',
 'Non codificato. Standard de facto nell''analisi finanziaria.',
 ARRAY['ebit_voce','ammortamento_materiali','cash_flow_operativo','ros'],
 'Margine operativo lordo: redditivita del core business'),

-- ROE
('indice_roe', NULL, 'ROE - Return on Equity', 'indice',
 'Rendimento del capitale proprio. Quanto utile genera ogni euro dei soci.',
 'Il ROE è L''INDICE per i soci. Si scompone con DuPont: ROE = ROS x Rotazione x Leverage.',
 'Si calcola da CE (utile netto) e SP (patrimonio netto)',
 'ROE = Utile Netto / Patrimonio Netto x 100',
 'Utile €50K, PN €400K → ROE = 12,5%. Se BTP rende 4%, premio rischio = 8,5%.',
 'Non è voce di bilancio ma indicatore sintetico della performance.',
 'ROE dipende dall''utile (numeratore). Ogni miglioramento dell''utile migliora ROE.',
 'ROE usa utile contabile, non cash flow. ROE alto con CF negativo = "ROE di carta".',
 'La leva finanziaria amplifica il ROE: più debito → più ROE se ROI > costo debito.',
 'ROE = Utile Netto / PN x 100\nDuPont: ROE = ROS x (Ricavi/Attivo) x (Attivo/PN)',
 'Standard universale dell''analisi fondamentale.',
 ARRAY['indice_roi','ros','leverage','utile_netto','capitale_sociale'],
 'Rendimento per i soci: quanto utile genera ogni euro di capitale proprio'),

-- ROI
('indice_roi', NULL, 'ROI - Return on Investment', 'indice',
 'Rendimento del capitale investito totale. Efficienza operativa indipendente dalla struttura finanziaria.',
 'ROI risponde: le risorse investite generano reddito sufficiente? Se ROI > costo debito, conviene la leva.',
 'Si calcola da CE (EBIT) e SP (totale attivo)',
 'ROI = EBIT / Totale Attivo x 100',
 'EBIT €80K, Attivo €800K → ROI = 10%. Tasso debito 4% → spread +6% → leva positiva.',
 'Collega CE (EBIT) e SP (Attivo). Ponte tra redditivita e struttura.',
 'ROI dipende da EBIT. Migliorare = aumentare EBIT o ridurre attivo.',
 'Il ROI usa EBIT, non cash flow.',
 'Se ROI > costo debito → ROE > ROI (leva positiva). Se ROI < costo debito → pericolo.',
 'ROI = EBIT / Totale Attivo x 100\nSpread = ROI - Tasso medio debito',
 'Standard universale dell''analisi di bilancio.',
 ARRAY['indice_roe','ros','leverage','ebit_voce'],
 'Redditivita del capitale investito: il business funziona?'),

-- CICLO MONETARIO
('indice_ciclo_monetario', NULL, 'Ciclo Monetario (Cash Conversion Cycle)', 'indice',
 'Giorni tra pagamento fornitori e incasso clienti. Misura il fabbisogno finanziario del circolante.',
 'Ciclo = DSO + Gg Magazzino - DPO. Positivo = azienda finanzia il gap. Negativo = incassa prima di pagare.',
 'Si calcola da SP (crediti, rimanenze, debiti) e CE (ricavi, acquisti)',
 'DSO + Gg Magazzino - DPO',
 'DSO 55 + Gg Mag 40 - DPO 60 = 35 gg. Con fatturato €1M: fabbisogno = €95.890.',
 'Collega dinamicamente circolante SP con CE.',
 'Impatto indiretto: ciclo lungo → più debito → più interessi → meno utile.',
 'Impatto DIRETTO: ciclo lungo = cassa bloccata. Ciclo corto = liquidita liberata.',
 'Termometro dell''efficienza del capitale circolante.',
 'Ciclo Monetario = DSO + Giorni Magazzino - DPO',
 'Non codificato. Strumento universale dell''analisi finanziaria.',
 ARRAY['crediti_clienti','debiti_fornitori','rimanenze_mp','ccn_voce','cash_flow_operativo'],
 'Giorni di finanziamento del circolante')

ON CONFLICT (id) DO NOTHING;

-- RLS: info_contabili è leggibile da tutti gli utenti autenticati
ALTER TABLE info_contabili ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Info contabili readable by all" ON info_contabili
  FOR SELECT USING (true);

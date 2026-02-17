-- ═══════════════════════════════════════════════════════════════════════
-- SEED DATI AZIENDALI - "Tecnomeccanica Rossi S.r.l."
-- Azienda manifatturiera italiana - Dati completi e realistici
-- ═══════════════════════════════════════════════════════════════════════
--
-- ISTRUZIONI:
--   1) Esegui PRIMA schema-multiutente.sql (crea tabelle e struttura)
--   2) Esegui QUESTO file (popola i template con dati ricchi)
--   3) Esegui schema-didattica.sql (aggiunge tabella info_contabili)
--
--   Quando un nuovo utente si registra, i template vengono clonati
--   automaticamente nei suoi 3 esercizi (2023, 2024, 2025).
--
-- PROFILO AZIENDA:
--   Tecnomeccanica Rossi S.r.l. - Produzione componenti meccanici
--   Sede: Brescia
--
--   2023 (BASE):       6 dip. | Fatturato ~318k | Utile ~16k (5%)  | Startup
--   2024 (INTERMEDIO): 8 dip. | Fatturato ~463k | Utile ~21k (5%)  | Sviluppo
--   2025 (AVANZATO):  10 dip. | Fatturato ~686k | Utile ~53k (8%)  | Consolidamento
-- ═══════════════════════════════════════════════════════════════════════

-- Pulisci template esistenti
DELETE FROM template_budget;
DELETE FROM template_scritture_assestamento;
DELETE FROM template_operazioni;
DELETE FROM template_piano_conti;

-- ═══════════════════════════════════════════════════════════════════════
-- PIANO DEI CONTI (completo OIC, uguale per tutti i livelli)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO template_piano_conti (codice, nome, categoria, sottocategoria, sezione_bilancio, voce_ufficiale_oic) VALUES
-- ATTIVO - Immobilizzazioni immateriali
('1.1.01', 'Brevetti e licenze',                'attivo', 'immobilizzazioni_immateriali', 'SP_attivo', 'B.I.3 - Diritti di brevetto industriale'),
('1.1.02', 'Avviamento',                        'attivo', 'immobilizzazioni_immateriali', 'SP_attivo', 'B.I.5 - Avviamento'),
('1.1.03', 'Costi di sviluppo',                 'attivo', 'immobilizzazioni_immateriali', 'SP_attivo', 'B.I.2 - Costi di sviluppo'),
('1.1.04', 'F.do amm.to immob. immateriali',    'attivo', 'immobilizzazioni_immateriali', 'SP_attivo', 'B.I - Fondo ammortamento'),
-- ATTIVO - Immobilizzazioni materiali
('1.2.01', 'Terreni e fabbricati',              'attivo', 'immobilizzazioni_materiali', 'SP_attivo', 'B.II.1 - Terreni e fabbricati'),
('1.2.02', 'Impianti e macchinari',             'attivo', 'immobilizzazioni_materiali', 'SP_attivo', 'B.II.2 - Impianti e macchinario'),
('1.2.03', 'Attrezzature',                      'attivo', 'immobilizzazioni_materiali', 'SP_attivo', 'B.II.3 - Attrezzature industriali'),
('1.2.04', 'Automezzi',                         'attivo', 'immobilizzazioni_materiali', 'SP_attivo', 'B.II.4 - Altri beni'),
('1.2.05', 'F.do amm.to immob. materiali',      'attivo', 'immobilizzazioni_materiali', 'SP_attivo', 'B.II - Fondo ammortamento'),
-- ATTIVO - Immobilizzazioni finanziarie
('1.3.01', 'Partecipazioni in controllate',      'attivo', 'immobilizzazioni_finanziarie', 'SP_attivo', 'B.III.1.a - Partecipazioni'),
('1.3.02', 'Crediti finanziari oltre 12 mesi',   'attivo', 'immobilizzazioni_finanziarie', 'SP_attivo', 'B.III.2 - Crediti'),
-- ATTIVO - Rimanenze
('2.1.01', 'Materie prime',                      'attivo', 'rimanenze', 'SP_attivo', 'C.I.1 - Materie prime'),
('2.1.02', 'Prodotti in lavorazione',            'attivo', 'rimanenze', 'SP_attivo', 'C.I.2 - Prodotti in corso di lavorazione'),
('2.1.03', 'Prodotti finiti',                    'attivo', 'rimanenze', 'SP_attivo', 'C.I.4 - Prodotti finiti e merci'),
-- ATTIVO - Crediti
('2.2.01', 'Crediti verso clienti',              'attivo', 'crediti', 'SP_attivo', 'C.II.1 - Crediti verso clienti'),
('2.2.02', 'Crediti tributari',                  'attivo', 'crediti', 'SP_attivo', 'C.II.5-bis - Crediti tributari'),
('2.2.03', 'Crediti verso altri',                'attivo', 'crediti', 'SP_attivo', 'C.II.5-quater - Verso altri'),
('2.2.04', 'F.do svalutazione crediti',          'attivo', 'crediti', 'SP_attivo', 'C.II - Fondo svalutazione crediti'),
-- ATTIVO - Liquidita
('2.3.01', 'Cassa',                              'attivo', 'disponibilita_liquide', 'SP_attivo', 'C.IV.3 - Danaro e valori in cassa'),
('2.3.02', 'Banca c/c',                          'attivo', 'disponibilita_liquide', 'SP_attivo', 'C.IV.1 - Depositi bancari e postali'),
-- ATTIVO - Ratei e risconti
('2.4.01', 'Ratei attivi',                       'attivo', 'ratei_risconti_attivi', 'SP_attivo', 'D - Ratei e risconti attivi'),
('2.4.02', 'Risconti attivi',                    'attivo', 'ratei_risconti_attivi', 'SP_attivo', 'D - Ratei e risconti attivi'),
-- PASSIVO - Patrimonio netto
('3.1.01', 'Capitale sociale',                   'patrimonio_netto', 'patrimonio_netto', 'SP_passivo', 'A.I - Capitale'),
('3.1.02', 'Riserva legale',                     'patrimonio_netto', 'patrimonio_netto', 'SP_passivo', 'A.IV - Riserva legale'),
('3.1.03', 'Riserva straordinaria',              'patrimonio_netto', 'patrimonio_netto', 'SP_passivo', 'A.VII - Altre riserve'),
('3.1.04', 'Utile (perdita) esercizio',          'patrimonio_netto', 'patrimonio_netto', 'SP_passivo', 'A.IX - Utile (perdita)'),
-- PASSIVO - Fondi
('3.2.01', 'Fondo rischi su garanzie',           'passivo', 'fondi_rischi', 'SP_passivo', 'B.1 - Fondi per quiescenza'),
('3.2.02', 'Fondo rischi cause legali',          'passivo', 'fondi_rischi', 'SP_passivo', 'B.2 - Fondo imposte differite'),
('3.2.03', 'Altri fondi rischi',                 'passivo', 'fondi_rischi', 'SP_passivo', 'B.3 - Altri fondi'),
-- PASSIVO - TFR
('3.3.01', 'TFR',                                'passivo', 'tfr', 'SP_passivo', 'C - Trattamento fine rapporto'),
-- PASSIVO - Debiti finanziari
('3.4.01', 'Mutui passivi',                      'passivo', 'debiti_finanziari', 'SP_passivo', 'D.4 - Debiti verso banche'),
('3.4.02', 'Prestiti obbligazionari',            'passivo', 'debiti_finanziari', 'SP_passivo', 'D.1 - Obbligazioni'),
-- PASSIVO - Debiti commerciali
('3.5.01', 'Debiti verso fornitori',             'passivo', 'debiti_commerciali', 'SP_passivo', 'D.7 - Debiti verso fornitori'),
('3.5.02', 'Debiti tributari',                   'passivo', 'debiti_commerciali', 'SP_passivo', 'D.12 - Debiti tributari'),
('3.5.03', 'Debiti verso istituti previdenziali','passivo', 'debiti_commerciali', 'SP_passivo', 'D.13 - Debiti verso INPS/INAIL'),
('3.5.04', 'Altri debiti',                       'passivo', 'debiti_commerciali', 'SP_passivo', 'D.14 - Altri debiti'),
-- PASSIVO - Ratei e risconti
('3.6.01', 'Ratei passivi',                      'passivo', 'ratei_risconti_passivi', 'SP_passivo', 'E - Ratei e risconti passivi'),
('3.6.02', 'Risconti passivi',                   'passivo', 'ratei_risconti_passivi', 'SP_passivo', 'E - Ratei e risconti passivi'),
-- CE - Ricavi
('4.1.01', 'Ricavi vendite prodotti',            'ricavi', 'ricavi_vendite', 'CE_ricavi', 'A.1 - Ricavi vendite e prestazioni'),
('4.1.02', 'Ricavi prestazione servizi',         'ricavi', 'ricavi_vendite', 'CE_ricavi', 'A.1 - Ricavi vendite e prestazioni'),
('4.2.01', 'Variazione rimanenze PF',            'ricavi', 'variazione_rimanenze', 'CE_ricavi', 'A.2 - Variazioni delle rimanenze'),
('4.3.01', 'Incrementi immobilizzazioni',        'ricavi', 'altri_ricavi', 'CE_ricavi', 'A.4 - Incrementi per lavori interni'),
('4.3.02', 'Altri ricavi e proventi',            'ricavi', 'altri_ricavi', 'CE_ricavi', 'A.5 - Altri ricavi e proventi'),
('4.4.01', 'Proventi finanziari',                'ricavi', 'proventi_finanziari', 'CE_ricavi', 'C.16 - Altri proventi finanziari'),
-- CE - Costi
('5.1.01', 'Acquisto materie prime',             'costi', 'costi_acquisti', 'CE_costi', 'B.6 - Per materie prime'),
('5.1.02', 'Acquisto merci',                     'costi', 'costi_acquisti', 'CE_costi', 'B.6 - Per materie prime'),
('5.2.01', 'Costi per servizi',                  'costi', 'costi_servizi', 'CE_costi', 'B.7 - Per servizi'),
('5.2.02', 'Consulenze',                         'costi', 'costi_servizi', 'CE_costi', 'B.7 - Per servizi'),
('5.2.03', 'Utenze',                             'costi', 'costi_servizi', 'CE_costi', 'B.7 - Per servizi'),
('5.3.01', 'Canoni di leasing',                  'costi', 'godimento_beni_terzi', 'CE_costi', 'B.8 - Godimento beni di terzi'),
('5.3.02', 'Affitti passivi',                    'costi', 'godimento_beni_terzi', 'CE_costi', 'B.8 - Godimento beni di terzi'),
('5.4.01', 'Salari e stipendi',                  'costi', 'personale', 'CE_costi', 'B.9.a - Salari e stipendi'),
('5.4.02', 'Oneri sociali',                      'costi', 'personale', 'CE_costi', 'B.9.b - Oneri sociali'),
('5.4.03', 'Accantonamento TFR',                 'costi', 'personale', 'CE_costi', 'B.9.c - Trattamento fine rapporto'),
('5.5.01', 'Ammortamento immob. immateriali',    'costi', 'ammortamenti', 'CE_costi', 'B.10.a - Amm.to immob. immateriali'),
('5.5.02', 'Ammortamento immob. materiali',      'costi', 'ammortamenti', 'CE_costi', 'B.10.b - Amm.to immob. materiali'),
('5.5.03', 'Svalutazione crediti',               'costi', 'ammortamenti', 'CE_costi', 'B.10.d - Svalutazioni crediti'),
('5.6.01', 'Interessi passivi bancari',          'costi', 'oneri_finanziari', 'CE_costi', 'C.17 - Interessi e altri oneri fin.'),
('5.6.02', 'Interessi passivi su mutui',         'costi', 'oneri_finanziari', 'CE_costi', 'C.17 - Interessi e altri oneri fin.'),
('5.7.01', 'IRES',                               'costi', 'imposte', 'CE_costi', '20 - Imposte sul reddito'),
('5.7.02', 'IRAP',                               'costi', 'imposte', 'CE_costi', '20 - Imposte sul reddito'),
('5.8.01', 'Accantonamento fondi rischi',        'costi', 'altri_costi', 'CE_costi', 'B.12 - Accantonamenti per rischi'),
('5.8.02', 'Oneri diversi di gestione',          'costi', 'altri_costi', 'CE_costi', 'B.14 - Oneri diversi di gestione');


-- ═══════════════════════════════════════════════════════════════════════
-- OPERAZIONI 2023 - LIVELLO BASE
-- Anno di avvio: Tecnomeccanica Rossi nasce, primi clienti
-- Fatturato: ~318.000 | 6 dipendenti | Capannone in affitto
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO template_operazioni (livello, data_offset_giorni, conto_codice, descrizione, importo, dare_avere) VALUES
-- GENNAIO: Costituzione e avvio
('base', 0,   '2.3.02', 'Conferimento capitale sociale (3 soci x €20.000)',  60000, 'dare'),
('base', 0,   '3.1.01', 'Conferimento capitale sociale',                     60000, 'avere'),
('base', 5,   '1.2.03', 'Acquisto attrezzature officina',                    15000, 'dare'),
('base', 5,   '2.3.02', 'Pagamento attrezzature officina',                   15000, 'avere'),
('base', 10,  '5.3.02', 'Affitto capannone gennaio',                         2500, 'dare'),
('base', 10,  '2.3.02', 'Pagamento affitto gennaio',                         2500, 'avere'),

-- FEBBRAIO: Prime vendite
('base', 35,  '2.2.01', 'Vendita componenti Ft.001 - Meccanica Bianchi',    18000, 'dare'),
('base', 35,  '4.1.01', 'Vendita componenti Ft.001',                        18000, 'avere'),
('base', 38,  '5.1.01', 'Acquisto acciaio inox Ft.A001 - Siderurgica SpA',  8000, 'dare'),
('base', 38,  '3.5.01', 'Acquisto acciaio inox Ft.A001',                     8000, 'avere'),
('base', 40,  '5.3.02', 'Affitto capannone febbraio',                        2500, 'dare'),
('base', 40,  '2.3.02', 'Pagamento affitto febbraio',                        2500, 'avere'),
('base', 45,  '5.4.01', 'Stipendi gennaio (6 operai)',                       12000, 'dare'),
('base', 45,  '2.3.02', 'Pagamento stipendi gennaio',                       12000, 'avere'),
('base', 45,  '5.4.02', 'Oneri sociali e contrib. gennaio',                  3600, 'dare'),
('base', 45,  '3.5.03', 'Debito INPS/INAIL gennaio',                         3600, 'avere'),

-- MARZO: Incassi e nuove vendite
('base', 65,  '2.3.02', 'Incasso Ft.001 Meccanica Bianchi',                 18000, 'dare'),
('base', 65,  '2.2.01', 'Incasso Ft.001',                                   18000, 'avere'),
('base', 70,  '2.2.01', 'Vendita lavorazioni Ft.002 - AutoParts Srl',       22000, 'dare'),
('base', 70,  '4.1.01', 'Vendita lavorazioni Ft.002',                       22000, 'avere'),
('base', 72,  '5.3.02', 'Affitto capannone marzo',                           2500, 'dare'),
('base', 72,  '2.3.02', 'Pagamento affitto marzo',                           2500, 'avere'),
('base', 75,  '5.4.01', 'Stipendi febbraio',                                12000, 'dare'),
('base', 75,  '2.3.02', 'Pagamento stipendi febbraio',                      12000, 'avere'),
('base', 75,  '5.4.02', 'Oneri sociali febbraio',                            3600, 'dare'),
('base', 75,  '3.5.03', 'Debito INPS febbraio',                              3600, 'avere'),
('base', 80,  '5.2.03', 'Utenze elettriche Q1 (forza motrice)',              2200, 'dare'),
('base', 80,  '2.3.02', 'Pagamento utenze Q1',                               2200, 'avere'),

-- Affitto Q2-Q4
('base', 101, '5.3.02', 'Affitto capannone aprile',                          2500, 'dare'),
('base', 101, '2.3.02', 'Pagamento affitto aprile',                          2500, 'avere'),
('base', 131, '5.3.02', 'Affitto capannone maggio',                          2500, 'dare'),
('base', 131, '2.3.02', 'Pagamento affitto maggio',                          2500, 'avere'),
('base', 162, '5.3.02', 'Affitto capannone giugno',                          2500, 'dare'),
('base', 162, '2.3.02', 'Pagamento affitto giugno',                          2500, 'avere'),
('base', 192, '5.3.02', 'Affitto capannone luglio',                          2500, 'dare'),
('base', 192, '2.3.02', 'Pagamento affitto luglio',                          2500, 'avere'),
('base', 223, '5.3.02', 'Affitto capannone agosto',                          2500, 'dare'),
('base', 223, '2.3.02', 'Pagamento affitto agosto',                          2500, 'avere'),
('base', 253, '5.3.02', 'Affitto capannone settembre',                       2500, 'dare'),
('base', 253, '2.3.02', 'Pagamento affitto settembre',                       2500, 'avere'),
('base', 283, '5.3.02', 'Affitto capannone ottobre',                         2500, 'dare'),
('base', 283, '2.3.02', 'Pagamento affitto ottobre',                         2500, 'avere'),
('base', 314, '5.3.02', 'Affitto capannone novembre',                        2500, 'dare'),
('base', 314, '2.3.02', 'Pagamento affitto novembre',                        2500, 'avere'),
('base', 344, '5.3.02', 'Affitto capannone dicembre',                        2500, 'dare'),
('base', 344, '2.3.02', 'Pagamento affitto dicembre',                        2500, 'avere'),

-- Q2: Crescita graduale
('base', 95,  '2.2.01', 'Vendita componenti Ft.003 - Idraulica Verdi',      35000, 'dare'),
('base', 95,  '4.1.01', 'Vendita componenti Ft.003',                        35000, 'avere'),
('base', 100, '5.1.01', 'Acquisto alluminio Ft.A002 - MetalliSud',          12000, 'dare'),
('base', 100, '3.5.01', 'Debito MetalliSud Ft.A002',                        12000, 'avere'),
('base', 105, '5.4.01', 'Stipendi marzo',                                   12000, 'dare'),
('base', 105, '2.3.02', 'Pagamento stipendi marzo',                         12000, 'avere'),
('base', 105, '5.4.02', 'Oneri sociali marzo',                               3600, 'dare'),
('base', 105, '3.5.03', 'Debito INPS marzo',                                 3600, 'avere'),
('base', 110, '3.5.01', 'Pagamento Ft.A001 Siderurgica',                     8000, 'dare'),
('base', 110, '2.3.02', 'Pagamento Ft.A001',                                 8000, 'avere'),
('base', 120, '2.2.01', 'Vendita Ft.004 - Meccanica Bianchi',               28000, 'dare'),
('base', 120, '4.1.01', 'Vendita Ft.004',                                   28000, 'avere'),
('base', 130, '2.3.02', 'Incasso Ft.002 AutoParts',                         22000, 'dare'),
('base', 130, '2.2.01', 'Incasso Ft.002',                                   22000, 'avere'),
('base', 135, '5.4.01', 'Stipendi aprile',                                  12000, 'dare'),
('base', 135, '2.3.02', 'Pagamento stipendi aprile',                        12000, 'avere'),
('base', 135, '5.4.02', 'Oneri sociali aprile',                              3600, 'dare'),
('base', 135, '3.5.03', 'Debito INPS aprile',                                3600, 'avere'),
('base', 150, '5.2.01', 'Manutenzione macchinari Q2',                        3500, 'dare'),
('base', 150, '2.3.02', 'Pagamento manutenzione',                            3500, 'avere'),
('base', 160, '5.4.01', 'Stipendi maggio',                                  12000, 'dare'),
('base', 160, '2.3.02', 'Pagamento stipendi maggio',                        12000, 'avere'),
('base', 170, '5.2.03', 'Utenze Q2',                                         2800, 'dare'),
('base', 170, '2.3.02', 'Pagamento utenze Q2',                               2800, 'avere'),

-- Q3: Periodo estivo + forniture importanti
('base', 185, '2.2.01', 'Vendita Ft.005 - Tecnoval Spa',                    55000, 'dare'),
('base', 185, '4.1.01', 'Vendita Ft.005 ordine grande',                     55000, 'avere'),
('base', 190, '5.1.01', 'Acquisto materie Ft.A003 (ordine grosso)',          18000, 'dare'),
('base', 190, '3.5.01', 'Debito fornitore Ft.A003',                         18000, 'avere'),
('base', 195, '5.4.01', 'Stipendi giugno',                                  12000, 'dare'),
('base', 195, '2.3.02', 'Pagamento stipendi giugno',                        12000, 'avere'),
('base', 195, '5.4.02', 'Oneri sociali maggio-giugno',                       7200, 'dare'),
('base', 195, '3.5.03', 'Debito INPS mag-giu',                               7200, 'avere'),
('base', 200, '2.3.02', 'Incasso Ft.003 Idraulica Verdi',                   22000, 'dare'),
('base', 200, '2.2.01', 'Incasso Ft.003',                                   22000, 'avere'),
('base', 215, '2.3.02', 'Incasso Ft.004 Meccanica Bianchi',                 28000, 'dare'),
('base', 215, '2.2.01', 'Incasso Ft.004',                                   28000, 'avere'),
('base', 225, '5.4.01', 'Stipendi luglio',                                  12000, 'dare'),
('base', 225, '2.3.02', 'Pagamento stipendi luglio',                        12000, 'avere'),
('base', 240, '2.2.01', 'Vendita Ft.006 - vari clienti',                    35000, 'dare'),
('base', 240, '4.1.01', 'Vendita Ft.006',                                   35000, 'avere'),
('base', 255, '5.4.01', 'Stipendi agosto (ferie)',                           12000, 'dare'),
('base', 255, '2.3.02', 'Pagamento stipendi agosto',                        12000, 'avere'),
('base', 260, '5.2.03', 'Utenze Q3',                                         2500, 'dare'),
('base', 260, '2.3.02', 'Pagamento utenze Q3',                               2500, 'avere'),

-- Q4: Chiusura anno, ultimi ordini
('base', 275, '2.2.01', 'Vendita Ft.007 - Tecnoval Spa (riordino)',         48000, 'dare'),
('base', 275, '4.1.01', 'Vendita Ft.007',                                   48000, 'avere'),
('base', 280, '2.3.02', 'Incasso Ft.005 Tecnoval',                          55000, 'dare'),
('base', 280, '2.2.01', 'Incasso Ft.005',                                   55000, 'avere'),
('base', 285, '5.4.01', 'Stipendi settembre',                               12000, 'dare'),
('base', 285, '2.3.02', 'Pagamento stipendi settembre',                     12000, 'avere'),
('base', 285, '5.4.02', 'Oneri sociali Q3',                                 10800, 'dare'),
('base', 285, '3.5.03', 'Debito INPS Q3',                                   10800, 'avere'),
('base', 290, '5.1.01', 'Acquisto materie Ft.A004 - ultimo Q4',              9000, 'dare'),
('base', 290, '3.5.01', 'Debito fornitore Ft.A004',                          9000, 'avere'),
('base', 300, '2.2.01', 'Vendita Ft.008 - AutoParts riordino',              32000, 'dare'),
('base', 300, '4.1.01', 'Vendita Ft.008',                                   32000, 'avere'),
('base', 310, '5.4.01', 'Stipendi ottobre',                                 12000, 'dare'),
('base', 310, '2.3.02', 'Pagamento stipendi ottobre',                       12000, 'avere'),
('base', 315, '3.5.01', 'Pagamento Ft.A002 MetalliSud',                     12000, 'dare'),
('base', 315, '2.3.02', 'Pagamento Ft.A002',                                12000, 'avere'),
('base', 325, '2.2.01', 'Vendita Ft.009 - chiusura anno',                   28000, 'dare'),
('base', 325, '4.1.01', 'Vendita Ft.009',                                   28000, 'avere'),
('base', 335, '2.3.02', 'Incasso Ft.006',                                   35000, 'dare'),
('base', 335, '2.2.01', 'Incasso Ft.006',                                   35000, 'avere'),
('base', 340, '5.4.01', 'Stipendi novembre',                                12000, 'dare'),
('base', 340, '2.3.02', 'Pagamento stipendi novembre',                      12000, 'avere'),
('base', 345, '5.2.03', 'Utenze Q4',                                         3000, 'dare'),
('base', 345, '2.3.02', 'Pagamento utenze Q4',                               3000, 'avere'),
('base', 350, '5.8.02', 'Oneri diversi (assicurazione, bolli)',              1800, 'dare'),
('base', 350, '2.3.02', 'Pagamento oneri diversi',                           1800, 'avere'),
('base', 355, '5.4.01', 'Stipendi dicembre + tredicesima',                   24000, 'dare'),
('base', 355, '2.3.02', 'Pagamento stipendi dicembre + 13esima',            24000, 'avere'),
('base', 355, '5.4.02', 'Oneri sociali Q4 + tredicesima',                   14400, 'dare'),
('base', 355, '3.5.03', 'Debito INPS Q4',                                   14400, 'avere'),
-- Rimanenze finali
('base', 364, '2.1.01', 'Inventario materie prime al 31/12',                 5000, 'dare'),
('base', 364, '4.2.01', 'Variazione rimanenze MP',                           5000, 'avere'),
('base', 364, '2.1.03', 'Inventario prodotti finiti al 31/12',              12000, 'dare'),
('base', 364, '4.2.01', 'Variazione rimanenze PF',                          12000, 'avere');


-- ═══════════════════════════════════════════════════════════════════════
-- OPERAZIONI 2024 - LIVELLO INTERMEDIO
-- Secondo anno: investimento in macchinario, piu clienti, mutuo
-- Fatturato: ~463.000 | 8 dipendenti | Investimento CNC
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO template_operazioni (livello, data_offset_giorni, conto_codice, descrizione, importo, dare_avere) VALUES
-- GENNAIO: Aumento capitale e investimento
('intermedio', 0,   '2.3.02', 'Conferimento capitale (aumento da soci)',     80000, 'dare'),
('intermedio', 0,   '3.1.01', 'Aumento capitale sociale',                   80000, 'avere'),
('intermedio', 5,   '3.1.04', 'Destinazione utile 2023 a riserva legale',    2500, 'dare'),
('intermedio', 5,   '3.1.02', 'Riporto utile 2023 a riserva legale',         2500, 'avere'),
('intermedio', 10,  '1.2.02', 'Acquisto centro lavoro CNC',                  85000, 'dare'),
('intermedio', 10,  '3.4.01', 'Mutuo bancario macchinario CNC',             85000, 'avere'),
('intermedio', 12,  '1.1.01', 'Licenza software CAD/CAM',                     8000, 'dare'),
('intermedio', 12,  '2.3.02', 'Pagamento licenza CAD/CAM',                    8000, 'avere'),
('intermedio', 15,  '5.3.02', 'Affitto capannone gennaio',                    2800, 'dare'),
('intermedio', 15,  '2.3.02', 'Pagamento affitto gennaio',                    2800, 'avere'),

-- FEBBRAIO: Vendite in crescita
('intermedio', 32,  '2.2.01', 'Vendita Ft.001 - Meccanica Bianchi',         35000, 'dare'),
('intermedio', 32,  '4.1.01', 'Vendita Ft.001',                             35000, 'avere'),
('intermedio', 35,  '2.2.01', 'Vendita Ft.002 - Tecnoval Spa',              42000, 'dare'),
('intermedio', 35,  '4.1.01', 'Vendita Ft.002',                             42000, 'avere'),
('intermedio', 38,  '5.1.01', 'Acquisto acciaio Ft.A001',                   15000, 'dare'),
('intermedio', 38,  '3.5.01', 'Debito Siderurgica Ft.A001',                 15000, 'avere'),
('intermedio', 40,  '5.4.01', 'Stipendi gennaio (8 dipendenti)',             16000, 'dare'),
('intermedio', 40,  '2.3.02', 'Pagamento stipendi gennaio',                 16000, 'avere'),
('intermedio', 40,  '5.4.02', 'Oneri sociali gennaio',                       4800, 'dare'),
('intermedio', 40,  '3.5.03', 'Debito INPS gennaio',                         4800, 'avere'),
('intermedio', 45,  '5.3.02', 'Affitto capannone febbraio',                   2800, 'dare'),
('intermedio', 45,  '2.3.02', 'Pagamento affitto febbraio',                   2800, 'avere'),

-- MARZO-APRILE: Consolidamento
('intermedio', 60,  '2.3.02', 'Incasso Ft.001 Meccanica Bianchi',           35000, 'dare'),
('intermedio', 60,  '2.2.01', 'Incasso Ft.001',                             35000, 'avere'),
('intermedio', 65,  '2.2.01', 'Vendita Ft.003 - Idraulica Verdi',           18000, 'dare'),
('intermedio', 65,  '4.1.02', 'Vendita servizi lavorazione Ft.003',         18000, 'avere'),
('intermedio', 70,  '5.4.01', 'Stipendi febbraio',                          16000, 'dare'),
('intermedio', 70,  '2.3.02', 'Pagamento stipendi febbraio',                16000, 'avere'),
('intermedio', 70,  '5.4.02', 'Oneri sociali febbraio',                      4800, 'dare'),
('intermedio', 70,  '3.5.03', 'Debito INPS febbraio',                        4800, 'avere'),
('intermedio', 75,  '5.2.03', 'Utenze Q1 (elettricita + gas)',               4200, 'dare'),
('intermedio', 75,  '2.3.02', 'Pagamento utenze Q1',                         4200, 'avere'),
('intermedio', 80,  '5.3.02', 'Affitto capannone marzo',                     2800, 'dare'),
('intermedio', 80,  '2.3.02', 'Pagamento affitto marzo',                     2800, 'avere'),
('intermedio', 90,  '5.1.01', 'Acquisto alluminio Ft.A002',                  20000, 'dare'),
('intermedio', 90,  '3.5.01', 'Debito MetalliSud Ft.A002',                  20000, 'avere'),
('intermedio', 95,  '2.2.01', 'Vendita Ft.004 - nuovo cliente IndustriaX',  40000, 'dare'),
('intermedio', 95,  '4.1.01', 'Vendita Ft.004',                             40000, 'avere'),
('intermedio', 100, '5.4.01', 'Stipendi marzo',                             16000, 'dare'),
('intermedio', 100, '2.3.02', 'Pagamento stipendi marzo',                   16000, 'avere'),
('intermedio', 100, '5.4.02', 'Oneri sociali marzo',                         4800, 'dare'),
('intermedio', 100, '3.5.03', 'Debito INPS marzo',                           4800, 'avere'),
('intermedio', 105, '3.5.01', 'Pagamento Ft.A001 Siderurgica',              15000, 'dare'),
('intermedio', 105, '2.3.02', 'Pagamento Ft.A001',                          15000, 'avere'),
('intermedio', 110, '5.6.02', 'Rata mutuo CNC - Q1 (interessi)',             1200, 'dare'),
('intermedio', 110, '3.4.01', 'Rata mutuo CNC - Q1 (capitale)',              4000, 'dare'),
('intermedio', 110, '2.3.02', 'Pagamento rata mutuo Q1',                     5200, 'avere'),

-- Affitto Q2-Q4
('intermedio', 101, '5.3.02', 'Affitto capannone aprile',                    2800, 'dare'),
('intermedio', 101, '2.3.02', 'Pagamento affitto aprile',                    2800, 'avere'),
('intermedio', 131, '5.3.02', 'Affitto capannone maggio',                    2800, 'dare'),
('intermedio', 131, '2.3.02', 'Pagamento affitto maggio',                    2800, 'avere'),
('intermedio', 162, '5.3.02', 'Affitto capannone giugno',                    2800, 'dare'),
('intermedio', 162, '2.3.02', 'Pagamento affitto giugno',                    2800, 'avere'),
('intermedio', 192, '5.3.02', 'Affitto capannone luglio',                    2800, 'dare'),
('intermedio', 192, '2.3.02', 'Pagamento affitto luglio',                    2800, 'avere'),
('intermedio', 223, '5.3.02', 'Affitto capannone agosto',                    2800, 'dare'),
('intermedio', 223, '2.3.02', 'Pagamento affitto agosto',                    2800, 'avere'),
('intermedio', 253, '5.3.02', 'Affitto capannone settembre',                 2800, 'dare'),
('intermedio', 253, '2.3.02', 'Pagamento affitto settembre',                 2800, 'avere'),
('intermedio', 283, '5.3.02', 'Affitto capannone ottobre',                   2800, 'dare'),
('intermedio', 283, '2.3.02', 'Pagamento affitto ottobre',                   2800, 'avere'),
('intermedio', 314, '5.3.02', 'Affitto capannone novembre',                  2800, 'dare'),
('intermedio', 314, '2.3.02', 'Pagamento affitto novembre',                  2800, 'avere'),
('intermedio', 344, '5.3.02', 'Affitto capannone dicembre',                  2800, 'dare'),
('intermedio', 344, '2.3.02', 'Pagamento affitto dicembre',                  2800, 'avere'),

-- Q2: Buon semestre
('intermedio', 125, '2.3.02', 'Incasso Ft.002 Tecnoval',                    42000, 'dare'),
('intermedio', 125, '2.2.01', 'Incasso Ft.002',                             42000, 'avere'),
('intermedio', 130, '5.4.01', 'Stipendi aprile',                            16000, 'dare'),
('intermedio', 130, '2.3.02', 'Pagamento stipendi aprile',                  16000, 'avere'),
('intermedio', 135, '2.2.01', 'Vendita Ft.005 - Meccanica Bianchi',         45000, 'dare'),
('intermedio', 135, '4.1.01', 'Vendita Ft.005',                             45000, 'avere'),
('intermedio', 140, '5.2.02', 'Consulenza tecnica esterna',                   5000, 'dare'),
('intermedio', 140, '3.5.01', 'Debito consulente',                           5000, 'avere'),
('intermedio', 155, '5.1.01', 'Acquisto materie Q2',                         22000, 'dare'),
('intermedio', 155, '3.5.01', 'Debiti fornitori Q2',                         22000, 'avere'),
('intermedio', 160, '5.4.01', 'Stipendi maggio',                            16000, 'dare'),
('intermedio', 160, '2.3.02', 'Pagamento stipendi maggio',                  16000, 'avere'),
('intermedio', 160, '5.4.02', 'Oneri sociali aprile-maggio',                  9600, 'dare'),
('intermedio', 160, '3.5.03', 'Debito INPS apr-mag',                          9600, 'avere'),
('intermedio', 170, '5.2.03', 'Utenze Q2',                                    4500, 'dare'),
('intermedio', 170, '2.3.02', 'Pagamento utenze Q2',                          4500, 'avere'),
('intermedio', 175, '2.2.01', 'Vendita Ft.006 - Tecnoval ordine grosso',    65000, 'dare'),
('intermedio', 175, '4.1.01', 'Vendita Ft.006',                             65000, 'avere'),
('intermedio', 180, '5.6.02', 'Rata mutuo CNC - Q2 (interessi)',             1100, 'dare'),
('intermedio', 180, '3.4.01', 'Rata mutuo CNC - Q2 (capitale)',              4000, 'dare'),
('intermedio', 180, '2.3.02', 'Pagamento rata mutuo Q2',                     5100, 'avere'),

-- Q3: Crescita continua
('intermedio', 195, '5.4.01', 'Stipendi giugno',                            16000, 'dare'),
('intermedio', 195, '2.3.02', 'Pagamento stipendi giugno',                  16000, 'avere'),
('intermedio', 200, '2.3.02', 'Incasso Ft.003 Idraulica Verdi',             18000, 'dare'),
('intermedio', 200, '2.2.01', 'Incasso Ft.003',                             18000, 'avere'),
('intermedio', 200, '2.3.02', 'Incasso Ft.004 IndustriaX',                  40000, 'dare'),
('intermedio', 200, '2.2.01', 'Incasso Ft.004',                             40000, 'avere'),
('intermedio', 210, '2.2.01', 'Vendita Ft.007 - AutoParts lotto estivo',    38000, 'dare'),
('intermedio', 210, '4.1.01', 'Vendita Ft.007',                             38000, 'avere'),
('intermedio', 220, '5.1.01', 'Acquisto materie Ft.A005 (stock estivo)',     16000, 'dare'),
('intermedio', 220, '3.5.01', 'Debito fornitore Ft.A005',                   16000, 'avere'),
('intermedio', 225, '5.4.01', 'Stipendi luglio',                            16000, 'dare'),
('intermedio', 225, '2.3.02', 'Pagamento stipendi luglio',                  16000, 'avere'),
('intermedio', 225, '5.4.02', 'Oneri sociali giu-lug',                       9600, 'dare'),
('intermedio', 225, '3.5.03', 'Debito INPS giu-lug',                         9600, 'avere'),
('intermedio', 240, '3.5.01', 'Pagamento Ft.A002 MetalliSud',               20000, 'dare'),
('intermedio', 240, '2.3.02', 'Pagamento Ft.A002',                          20000, 'avere'),
('intermedio', 250, '5.4.01', 'Stipendi agosto (ferie)',                    16000, 'dare'),
('intermedio', 250, '2.3.02', 'Pagamento stipendi agosto',                  16000, 'avere'),
('intermedio', 258, '5.2.03', 'Utenze Q3',                                    3800, 'dare'),
('intermedio', 258, '2.3.02', 'Pagamento utenze Q3',                          3800, 'avere'),
('intermedio', 260, '5.6.02', 'Rata mutuo CNC - Q3 (interessi)',             1000, 'dare'),
('intermedio', 260, '3.4.01', 'Rata mutuo CNC - Q3 (capitale)',              4000, 'dare'),
('intermedio', 260, '2.3.02', 'Pagamento rata mutuo Q3',                     5000, 'avere'),

-- Q4: Chiusura forte
('intermedio', 270, '2.3.02', 'Incasso Ft.005 Meccanica Bianchi',           45000, 'dare'),
('intermedio', 270, '2.2.01', 'Incasso Ft.005',                             45000, 'avere'),
('intermedio', 275, '2.2.01', 'Vendita Ft.008 - IndustriaX riordino',       55000, 'dare'),
('intermedio', 275, '4.1.01', 'Vendita Ft.008',                             55000, 'avere'),
('intermedio', 280, '5.4.01', 'Stipendi settembre',                         16000, 'dare'),
('intermedio', 280, '2.3.02', 'Pagamento stipendi settembre',               16000, 'avere'),
('intermedio', 280, '5.4.02', 'Oneri sociali ago-set',                        9600, 'dare'),
('intermedio', 280, '3.5.03', 'Debito INPS ago-set',                          9600, 'avere'),
('intermedio', 290, '5.1.01', 'Acquisto materie Q4',                         14000, 'dare'),
('intermedio', 290, '3.5.01', 'Debiti fornitori Q4',                         14000, 'avere'),
('intermedio', 300, '2.2.01', 'Vendita Ft.009 - Tecnoval',                  55000, 'dare'),
('intermedio', 300, '4.1.01', 'Vendita Ft.009',                             55000, 'avere'),
('intermedio', 305, '2.2.01', 'Vendita Ft.010 - clienti minori',            35000, 'dare'),
('intermedio', 305, '4.1.01', 'Vendita Ft.010',                             35000, 'avere'),
('intermedio', 310, '5.4.01', 'Stipendi ottobre',                           16000, 'dare'),
('intermedio', 310, '2.3.02', 'Pagamento stipendi ottobre',                 16000, 'avere'),
('intermedio', 320, '2.3.02', 'Incasso Ft.006 Tecnoval',                    65000, 'dare'),
('intermedio', 320, '2.2.01', 'Incasso Ft.006',                             65000, 'avere'),
('intermedio', 330, '5.8.02', 'Oneri diversi (assicurazione, contributi)',    3200, 'dare'),
('intermedio', 330, '2.3.02', 'Pagamento oneri diversi',                      3200, 'avere'),
('intermedio', 340, '5.4.01', 'Stipendi novembre',                          16000, 'dare'),
('intermedio', 340, '2.3.02', 'Pagamento stipendi novembre',                16000, 'avere'),
('intermedio', 345, '5.2.03', 'Utenze Q4',                                    4800, 'dare'),
('intermedio', 345, '2.3.02', 'Pagamento utenze Q4',                          4800, 'avere'),
('intermedio', 350, '5.6.02', 'Rata mutuo CNC - Q4 (interessi)',              900, 'dare'),
('intermedio', 350, '3.4.01', 'Rata mutuo CNC - Q4 (capitale)',              4000, 'dare'),
('intermedio', 350, '2.3.02', 'Pagamento rata mutuo Q4',                     4900, 'avere'),
('intermedio', 355, '5.4.01', 'Stipendi dicembre + tredicesima',            32000, 'dare'),
('intermedio', 355, '2.3.02', 'Pagamento stipendi dic + 13esima',           32000, 'avere'),
('intermedio', 355, '5.4.02', 'Oneri sociali Q4 + tredicesima',             19200, 'dare'),
('intermedio', 355, '3.5.03', 'Debito INPS Q4',                             19200, 'avere'),
('intermedio', 360, '4.3.02', 'Contributo regionale per innovazione',        5000, 'avere'),
('intermedio', 360, '2.2.02', 'Credito contributo regionale',                5000, 'dare'),
-- Rimanenze finali
('intermedio', 364, '2.1.01', 'Inventario materie prime al 31/12',          10000, 'dare'),
('intermedio', 364, '4.2.01', 'Variazione rimanenze MP',                    10000, 'avere'),
('intermedio', 364, '2.1.03', 'Inventario prodotti finiti al 31/12',        20000, 'dare'),
('intermedio', 364, '4.2.01', 'Variazione rimanenze PF',                    20000, 'avere');


-- ═══════════════════════════════════════════════════════════════════════
-- OPERAZIONI 2025 - LIVELLO AVANZATO
-- Terzo anno: consolidamento, struttura completa, crescita forte
-- Fatturato: ~686.000 | 10 dipendenti | Secondo macchinario
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO template_operazioni (livello, data_offset_giorni, conto_codice, descrizione, importo, dare_avere) VALUES
-- GENNAIO: Anno forte dall'inizio
('avanzato', 0,   '2.3.02', 'Conferimento aumento capitale (nuovo socio)',  100000, 'dare'),
('avanzato', 0,   '3.1.01', 'Aumento capitale sociale',                    100000, 'avere'),
('avanzato', 3,   '3.1.04', 'Destinazione utile 2024 a riserva legale',      3000, 'dare'),
('avanzato', 3,   '3.1.02', 'Riserva legale (5% utile 2024)',                3000, 'avere'),
('avanzato', 3,   '3.1.04', 'Destinazione utile 2024 a riserva straord.',    8000, 'dare'),
('avanzato', 3,   '3.1.03', 'Riserva straordinaria',                         8000, 'avere'),
('avanzato', 8,   '1.2.02', 'Acquisto secondo centro CNC',                  95000, 'dare'),
('avanzato', 8,   '3.4.01', 'Mutuo bancario secondo CNC',                   65000, 'avere'),
('avanzato', 8,   '2.3.02', 'Anticipo secondo CNC',                         30000, 'avere'),
('avanzato', 10,  '5.3.02', 'Affitto capannone gennaio',                     3200, 'dare'),
('avanzato', 10,  '2.3.02', 'Pagamento affitto gennaio',                     3200, 'avere'),

-- FEBBRAIO: Ordini importanti
('avanzato', 32,  '2.2.01', 'Vendita Ft.001 - Tecnoval contratto annuale',  55000, 'dare'),
('avanzato', 32,  '4.1.01', 'Vendita Ft.001',                               55000, 'avere'),
('avanzato', 35,  '2.2.01', 'Vendita Ft.002 - Meccanica Bianchi',           30000, 'dare'),
('avanzato', 35,  '4.1.01', 'Vendita Ft.002',                               30000, 'avere'),
('avanzato', 38,  '5.1.01', 'Acquisto acciaio lotto grande Ft.A001',        28000, 'dare'),
('avanzato', 38,  '3.5.01', 'Debito Siderurgica SpA Ft.A001',              28000, 'avere'),
('avanzato', 40,  '5.4.01', 'Stipendi gennaio (10 dipendenti)',             22000, 'dare'),
('avanzato', 40,  '2.3.02', 'Pagamento stipendi gennaio',                   22000, 'avere'),
('avanzato', 40,  '5.4.02', 'Oneri sociali gennaio',                         6600, 'dare'),
('avanzato', 40,  '3.5.03', 'Debito INPS gennaio',                           6600, 'avere'),
('avanzato', 45,  '5.3.02', 'Affitto capannone febbraio',                    3200, 'dare'),
('avanzato', 45,  '2.3.02', 'Pagamento affitto febbraio',                    3200, 'avere'),

-- MARZO-APRILE
('avanzato', 60,  '2.3.02', 'Incasso Ft.001 Tecnoval',                      55000, 'dare'),
('avanzato', 60,  '2.2.01', 'Incasso Ft.001',                               55000, 'avere'),
('avanzato', 62,  '2.2.01', 'Vendita Ft.003 - IndustriaX ordine grande',    42000, 'dare'),
('avanzato', 62,  '4.1.01', 'Vendita Ft.003',                               42000, 'avere'),
('avanzato', 65,  '2.2.01', 'Vendita servizi Ft.004 - assistenza tecnica',  15000, 'dare'),
('avanzato', 65,  '4.1.02', 'Vendita servizi Ft.004',                       15000, 'avere'),
('avanzato', 70,  '5.4.01', 'Stipendi febbraio',                            22000, 'dare'),
('avanzato', 70,  '2.3.02', 'Pagamento stipendi febbraio',                  22000, 'avere'),
('avanzato', 70,  '5.4.02', 'Oneri sociali febbraio',                        6600, 'dare'),
('avanzato', 70,  '3.5.03', 'Debito INPS febbraio',                          6600, 'avere'),
('avanzato', 75,  '5.2.03', 'Utenze Q1 (forza motrice + gas)',               5500, 'dare'),
('avanzato', 75,  '2.3.02', 'Pagamento utenze Q1',                           5500, 'avere'),
('avanzato', 80,  '5.3.02', 'Affitto capannone marzo',                       3200, 'dare'),
('avanzato', 80,  '2.3.02', 'Pagamento affitto marzo',                       3200, 'avere'),
('avanzato', 85,  '5.1.01', 'Acquisto alluminio Ft.A002',                   22000, 'dare'),
('avanzato', 85,  '3.5.01', 'Debito MetalliSud Ft.A002',                    22000, 'avere'),
('avanzato', 90,  '5.2.02', 'Consulenza fiscale e bilancio 2024',           6000, 'dare'),
('avanzato', 90,  '3.5.01', 'Debito commercialista',                        6000, 'avere'),
('avanzato', 95,  '5.6.02', 'Rata mutui Q1 (interessi)',                     2200, 'dare'),
('avanzato', 95,  '3.4.01', 'Rata mutui Q1 (capitale)',                      6000, 'dare'),
('avanzato', 95,  '2.3.02', 'Pagamento rate mutui Q1',                       8200, 'avere'),
('avanzato', 100, '5.4.01', 'Stipendi marzo',                               22000, 'dare'),
('avanzato', 100, '2.3.02', 'Pagamento stipendi marzo',                     22000, 'avere'),
('avanzato', 100, '5.4.02', 'Oneri sociali marzo',                           6600, 'dare'),
('avanzato', 100, '3.5.03', 'Debito INPS marzo',                             6600, 'avere'),
('avanzato', 105, '3.5.01', 'Pagamento Ft.A001 Siderurgica',                28000, 'dare'),
('avanzato', 105, '2.3.02', 'Pagamento Ft.A001',                            28000, 'avere'),

-- Affitto Q2-Q4
('avanzato', 101, '5.3.02', 'Affitto capannone aprile',                      3200, 'dare'),
('avanzato', 101, '2.3.02', 'Pagamento affitto aprile',                      3200, 'avere'),
('avanzato', 131, '5.3.02', 'Affitto capannone maggio',                      3200, 'dare'),
('avanzato', 131, '2.3.02', 'Pagamento affitto maggio',                      3200, 'avere'),
('avanzato', 162, '5.3.02', 'Affitto capannone giugno',                      3200, 'dare'),
('avanzato', 162, '2.3.02', 'Pagamento affitto giugno',                      3200, 'avere'),
('avanzato', 192, '5.3.02', 'Affitto capannone luglio',                      3200, 'dare'),
('avanzato', 192, '2.3.02', 'Pagamento affitto luglio',                      3200, 'avere'),
('avanzato', 222, '5.3.02', 'Affitto capannone agosto',                      3200, 'dare'),
('avanzato', 222, '2.3.02', 'Pagamento affitto agosto',                      3200, 'avere'),
('avanzato', 253, '5.3.02', 'Affitto capannone settembre',                   3200, 'dare'),
('avanzato', 253, '2.3.02', 'Pagamento affitto settembre',                   3200, 'avere'),
('avanzato', 283, '5.3.02', 'Affitto capannone ottobre',                     3200, 'dare'),
('avanzato', 283, '2.3.02', 'Pagamento affitto ottobre',                     3200, 'avere'),
('avanzato', 314, '5.3.02', 'Affitto capannone novembre',                    3200, 'dare'),
('avanzato', 314, '2.3.02', 'Pagamento affitto novembre',                    3200, 'avere'),
('avanzato', 344, '5.3.02', 'Affitto capannone dicembre',                    3200, 'dare'),
('avanzato', 344, '2.3.02', 'Pagamento affitto dicembre',                    3200, 'avere'),

-- Q2: Fatturato alto
('avanzato', 120, '2.2.01', 'Vendita Ft.005 - Tecnoval secondo ordine',     62000, 'dare'),
('avanzato', 120, '4.1.01', 'Vendita Ft.005',                               62000, 'avere'),
('avanzato', 125, '2.3.02', 'Incasso Ft.002 Meccanica Bianchi',             30000, 'dare'),
('avanzato', 125, '2.2.01', 'Incasso Ft.002',                               30000, 'avere'),
('avanzato', 130, '5.4.01', 'Stipendi aprile',                              22000, 'dare'),
('avanzato', 130, '2.3.02', 'Pagamento stipendi aprile',                    22000, 'avere'),
('avanzato', 140, '5.1.01', 'Acquisto materie Q2 - lotto grande',           35000, 'dare'),
('avanzato', 140, '3.5.01', 'Debiti fornitori Q2',                          35000, 'avere'),
('avanzato', 145, '2.2.01', 'Vendita Ft.006 - AutoParts Srl',              38000, 'dare'),
('avanzato', 145, '4.1.01', 'Vendita Ft.006',                               38000, 'avere'),
('avanzato', 150, '2.2.01', 'Vendita Ft.007 - nuovo cliente EuroMec',       55000, 'dare'),
('avanzato', 150, '4.1.01', 'Vendita Ft.007',                               55000, 'avere'),
('avanzato', 155, '5.2.01', 'Manutenzione programmata impianti',             4500, 'dare'),
('avanzato', 155, '2.3.02', 'Pagamento manutenzione',                        4500, 'avere'),
('avanzato', 160, '5.4.01', 'Stipendi maggio',                              22000, 'dare'),
('avanzato', 160, '2.3.02', 'Pagamento stipendi maggio',                    22000, 'avere'),
('avanzato', 160, '5.4.02', 'Oneri sociali apr-mag',                        13200, 'dare'),
('avanzato', 160, '3.5.03', 'Debito INPS apr-mag',                          13200, 'avere'),
('avanzato', 165, '5.2.03', 'Utenze Q2',                                     6000, 'dare'),
('avanzato', 165, '2.3.02', 'Pagamento utenze Q2',                           6000, 'avere'),
('avanzato', 170, '5.3.01', 'Canone leasing furgone Q1-Q2',                  3600, 'dare'),
('avanzato', 170, '2.3.02', 'Pagamento leasing furgone',                     3600, 'avere'),
('avanzato', 175, '2.3.02', 'Incasso Ft.003 IndustriaX',                    42000, 'dare'),
('avanzato', 175, '2.2.01', 'Incasso Ft.003',                               42000, 'avere'),
('avanzato', 180, '5.6.02', 'Rata mutui Q2 (interessi)',                      2000, 'dare'),
('avanzato', 180, '3.4.01', 'Rata mutui Q2 (capitale)',                       6000, 'dare'),
('avanzato', 180, '2.3.02', 'Pagamento rate mutui Q2',                        8000, 'avere'),

-- Q3: Estate produttiva
('avanzato', 190, '5.4.01', 'Stipendi giugno',                              22000, 'dare'),
('avanzato', 190, '2.3.02', 'Pagamento stipendi giugno',                    22000, 'avere'),
('avanzato', 195, '2.2.01', 'Vendita Ft.008 - Tecnoval Q3',                 68000, 'dare'),
('avanzato', 195, '4.1.01', 'Vendita Ft.008',                               68000, 'avere'),
('avanzato', 200, '3.5.01', 'Pagamento fornitori Q2',                       35000, 'dare'),
('avanzato', 200, '2.3.02', 'Pagamento fornitori Q2',                       35000, 'avere'),
('avanzato', 210, '5.1.01', 'Acquisto materie speciali Q3',                  25000, 'dare'),
('avanzato', 210, '3.5.01', 'Debiti fornitori Q3',                          25000, 'avere'),
('avanzato', 215, '2.2.01', 'Vendita Ft.009 - EuroMec riordino',            48000, 'dare'),
('avanzato', 215, '4.1.01', 'Vendita Ft.009',                               48000, 'avere'),
('avanzato', 220, '5.4.01', 'Stipendi luglio',                              22000, 'dare'),
('avanzato', 220, '2.3.02', 'Pagamento stipendi luglio',                    22000, 'avere'),
('avanzato', 220, '5.4.02', 'Oneri sociali giu-lug',                        13200, 'dare'),
('avanzato', 220, '3.5.03', 'Debito INPS giu-lug',                          13200, 'avere'),
('avanzato', 230, '2.3.02', 'Incasso Ft.004 assistenza tecnica',            15000, 'dare'),
('avanzato', 230, '2.2.01', 'Incasso Ft.004',                               15000, 'avere'),
('avanzato', 235, '2.3.02', 'Incasso Ft.005 Tecnoval',                      48000, 'dare'),
('avanzato', 235, '2.2.01', 'Incasso Ft.005',                               48000, 'avere'),
('avanzato', 245, '5.4.01', 'Stipendi agosto (ferie)',                       22000, 'dare'),
('avanzato', 245, '2.3.02', 'Pagamento stipendi agosto',                    22000, 'avere'),
('avanzato', 255, '5.2.03', 'Utenze Q3',                                      5200, 'dare'),
('avanzato', 255, '2.3.02', 'Pagamento utenze Q3',                            5200, 'avere'),
('avanzato', 260, '4.4.01', 'Interessi attivi su deposito bancario',          1800, 'avere'),
('avanzato', 260, '2.3.02', 'Accredito interessi attivi',                     1800, 'dare'),
('avanzato', 265, '5.6.02', 'Rata mutui Q3 (interessi)',                      1800, 'dare'),
('avanzato', 265, '3.4.01', 'Rata mutui Q3 (capitale)',                       6000, 'dare'),
('avanzato', 265, '2.3.02', 'Pagamento rate mutui Q3',                        7800, 'avere'),

-- Q4: Chiusura anno forte
('avanzato', 275, '2.2.01', 'Vendita Ft.010 - Tecnoval ultimo Q4',          75000, 'dare'),
('avanzato', 275, '4.1.01', 'Vendita Ft.010',                               75000, 'avere'),
('avanzato', 278, '2.2.01', 'Vendita Ft.011 - IndustriaX Q4',              50000, 'dare'),
('avanzato', 278, '4.1.01', 'Vendita Ft.011',                               50000, 'avere'),
('avanzato', 280, '5.4.01', 'Stipendi settembre',                           22000, 'dare'),
('avanzato', 280, '2.3.02', 'Pagamento stipendi settembre',                 22000, 'avere'),
('avanzato', 280, '5.4.02', 'Oneri sociali ago-set',                        13200, 'dare'),
('avanzato', 280, '3.5.03', 'Debito INPS ago-set',                          13200, 'avere'),
('avanzato', 285, '5.1.01', 'Acquisto materie Q4',                          20000, 'dare'),
('avanzato', 285, '3.5.01', 'Debiti fornitori Q4',                          20000, 'avere'),
('avanzato', 290, '2.3.02', 'Incasso Ft.006 AutoParts',                     38000, 'dare'),
('avanzato', 290, '2.2.01', 'Incasso Ft.006',                               38000, 'avere'),
('avanzato', 295, '2.3.02', 'Incasso Ft.007 EuroMec',                       55000, 'dare'),
('avanzato', 295, '2.2.01', 'Incasso Ft.007',                               55000, 'avere'),
('avanzato', 300, '2.2.01', 'Vendita Ft.012 - clienti minori vari',         40000, 'dare'),
('avanzato', 300, '4.1.01', 'Vendita Ft.012',                               40000, 'avere'),
('avanzato', 305, '5.2.02', 'Consulenza fiscale Q4',                         4000, 'dare'),
('avanzato', 305, '3.5.01', 'Debito consulente Q4',                          4000, 'avere'),
('avanzato', 310, '5.4.01', 'Stipendi ottobre',                             22000, 'dare'),
('avanzato', 310, '2.3.02', 'Pagamento stipendi ottobre',                   22000, 'avere'),
('avanzato', 315, '3.5.01', 'Pagamento fornitori Q3',                       25000, 'dare'),
('avanzato', 315, '2.3.02', 'Pagamento fornitori Q3',                       25000, 'avere'),
('avanzato', 320, '2.2.01', 'Vendita Ft.013 - Meccanica Bianchi Q4',        45000, 'dare'),
('avanzato', 320, '4.1.01', 'Vendita Ft.013',                               45000, 'avere'),
('avanzato', 325, '2.3.02', 'Incasso Ft.008 Tecnoval',                      68000, 'dare'),
('avanzato', 325, '2.2.01', 'Incasso Ft.008',                               68000, 'avere'),
('avanzato', 330, '5.3.01', 'Canone leasing furgone Q3-Q4',                  3600, 'dare'),
('avanzato', 330, '2.3.02', 'Pagamento leasing Q3-Q4',                       3600, 'avere'),
('avanzato', 335, '5.8.02', 'Oneri diversi (assicurazioni, bolli, CCIAA)',   4500, 'dare'),
('avanzato', 335, '2.3.02', 'Pagamento oneri diversi',                       4500, 'avere'),
('avanzato', 340, '5.4.01', 'Stipendi novembre',                            22000, 'dare'),
('avanzato', 340, '2.3.02', 'Pagamento stipendi novembre',                  22000, 'avere'),
('avanzato', 345, '5.2.03', 'Utenze Q4',                                      6500, 'dare'),
('avanzato', 345, '2.3.02', 'Pagamento utenze Q4',                            6500, 'avere'),
('avanzato', 348, '5.6.02', 'Rata mutui Q4 (interessi)',                      1600, 'dare'),
('avanzato', 348, '3.4.01', 'Rata mutui Q4 (capitale)',                       6000, 'dare'),
('avanzato', 348, '2.3.02', 'Pagamento rate mutui Q4',                        7600, 'avere'),
('avanzato', 350, '4.3.02', 'Contributo Industria 4.0 su CNC',               8500, 'avere'),
('avanzato', 350, '2.2.02', 'Credito tributario Industria 4.0',               8500, 'dare'),
('avanzato', 355, '5.4.01', 'Stipendi dicembre + tredicesima',              44000, 'dare'),
('avanzato', 355, '2.3.02', 'Pagamento stipendi dic + 13esima',             44000, 'avere'),
('avanzato', 355, '5.4.02', 'Oneri sociali Q4 + tredicesima',               26400, 'dare'),
('avanzato', 355, '3.5.03', 'Debito INPS Q4',                               26400, 'avere'),
-- Rimanenze finali
('avanzato', 364, '2.1.01', 'Inventario materie prime al 31/12',            15000, 'dare'),
('avanzato', 364, '4.2.01', 'Variazione rimanenze MP',                      15000, 'avere'),
('avanzato', 364, '2.1.03', 'Inventario prodotti finiti al 31/12',          30000, 'dare'),
('avanzato', 364, '4.2.01', 'Variazione rimanenze PF',                      30000, 'avere'),
('avanzato', 364, '2.1.02', 'Prodotti in lavorazione al 31/12',              8000, 'dare'),
('avanzato', 364, '4.2.01', 'Variazione WIP',                                8000, 'avere');


-- ═══════════════════════════════════════════════════════════════════════
-- SCRITTURE DI ASSESTAMENTO
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO template_scritture_assestamento (livello, tipo, conto_dare_codice, conto_avere_codice, importo, descrizione) VALUES
-- 2023 BASE
('base', 'ammortamento',     '5.5.02', '1.2.05', 1500,  'Ammortamento attrezzature 10%'),
('base', 'accantonamento',   '5.4.03', '3.3.01', 4000,  'Accantonamento TFR esercizio 2023'),
('base', 'rateo_passivo',    '5.6.01', '3.6.01', 800,   'Rateo passivo interessi c/c bancario'),

-- 2024 INTERMEDIO
('intermedio', 'ammortamento',     '5.5.02', '1.2.05', 10000, 'Ammortamento impianti CNC 10% + attrezzature'),
('intermedio', 'ammortamento',     '5.5.01', '1.1.04', 1600,  'Ammortamento licenza CAD/CAM 20%'),
('intermedio', 'accantonamento',   '5.4.03', '3.3.01', 5500,  'Accantonamento TFR 2024 (8 dip.)'),
('intermedio', 'risconto_attivo',  '2.4.02', '5.3.02', 1400,  'Risconto attivo affitto gennaio 2025'),
('intermedio', 'rateo_passivo',    '5.6.02', '3.6.01', 900,   'Rateo passivo interessi mutuo CNC Q1 2025'),
('intermedio', 'accantonamento',   '5.8.01', '3.2.03', 3000,  'Fondo rischi garanzie prodotti'),

-- 2025 AVANZATO
('avanzato', 'ammortamento',     '5.5.02', '1.2.05', 19000, 'Ammortamento impianti (2 CNC + attrezz.)'),
('avanzato', 'ammortamento',     '5.5.01', '1.1.04', 1600,  'Ammortamento licenza CAD/CAM 20%'),
('avanzato', 'accantonamento',   '5.4.03', '3.3.01', 7500,  'Accantonamento TFR 2025 (10 dip.)'),
('avanzato', 'risconto_attivo',  '2.4.02', '5.3.02', 1600,  'Risconto attivo affitto gen 2026'),
('avanzato', 'rateo_passivo',    '5.6.02', '3.6.01', 1500,  'Rateo passivo interessi mutui Q1 2026'),
('avanzato', 'accantonamento',   '5.8.01', '3.2.03', 4000,  'Fondo rischi garanzie prodotti'),
('avanzato', 'rateo_attivo',     '2.4.01', '4.4.01', 600,   'Rateo attivo interessi deposito bancario'),
('avanzato', 'accantonamento',   '5.5.03', '2.2.04', 2500,  'Svalutazione crediti (stima 0.5% fatturato)');


-- ═══════════════════════════════════════════════════════════════════════
-- BUDGET PREVISIONALE (mensile, per livello)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO template_budget (livello, mese, voce, importo) VALUES
-- 2023 BASE - Fatturato ~250k
('base', 1,  'Ricavi vendite', 12000), ('base', 2,  'Ricavi vendite', 15000),
('base', 3,  'Ricavi vendite', 18000), ('base', 4,  'Ricavi vendite', 20000),
('base', 5,  'Ricavi vendite', 22000), ('base', 6,  'Ricavi vendite', 24000),
('base', 7,  'Ricavi vendite', 22000), ('base', 8,  'Ricavi vendite', 15000),
('base', 9,  'Ricavi vendite', 23000), ('base', 10, 'Ricavi vendite', 25000),
('base', 11, 'Ricavi vendite', 24000), ('base', 12, 'Ricavi vendite', 28000),
('base', 1,  'Costi operativi', 10000), ('base', 2,  'Costi operativi', 11000),
('base', 3,  'Costi operativi', 12500), ('base', 4,  'Costi operativi', 13000),
('base', 5,  'Costi operativi', 14000), ('base', 6,  'Costi operativi', 14500),
('base', 7,  'Costi operativi', 14000), ('base', 8,  'Costi operativi', 10000),
('base', 9,  'Costi operativi', 14500), ('base', 10, 'Costi operativi', 15000),
('base', 11, 'Costi operativi', 15000), ('base', 12, 'Costi operativi', 18000),

-- 2024 INTERMEDIO - Fatturato ~420k
('intermedio', 1,  'Ricavi vendite', 25000), ('intermedio', 2,  'Ricavi vendite', 28000),
('intermedio', 3,  'Ricavi vendite', 32000), ('intermedio', 4,  'Ricavi vendite', 35000),
('intermedio', 5,  'Ricavi vendite', 38000), ('intermedio', 6,  'Ricavi vendite', 42000),
('intermedio', 7,  'Ricavi vendite', 35000), ('intermedio', 8,  'Ricavi vendite', 22000),
('intermedio', 9,  'Ricavi vendite', 40000), ('intermedio', 10, 'Ricavi vendite', 42000),
('intermedio', 11, 'Ricavi vendite', 40000), ('intermedio', 12, 'Ricavi vendite', 45000),
('intermedio', 1,  'Costi operativi', 18000), ('intermedio', 2,  'Costi operativi', 19000),
('intermedio', 3,  'Costi operativi', 21000), ('intermedio', 4,  'Costi operativi', 22000),
('intermedio', 5,  'Costi operativi', 24000), ('intermedio', 6,  'Costi operativi', 26000),
('intermedio', 7,  'Costi operativi', 23000), ('intermedio', 8,  'Costi operativi', 16000),
('intermedio', 9,  'Costi operativi', 25000), ('intermedio', 10, 'Costi operativi', 26000),
('intermedio', 11, 'Costi operativi', 25500), ('intermedio', 12, 'Costi operativi', 30000),

-- 2025 AVANZATO - Fatturato ~600k
('avanzato', 1,  'Ricavi vendite', 40000), ('avanzato', 2,  'Ricavi vendite', 45000),
('avanzato', 3,  'Ricavi vendite', 50000), ('avanzato', 4,  'Ricavi vendite', 52000),
('avanzato', 5,  'Ricavi vendite', 55000), ('avanzato', 6,  'Ricavi vendite', 58000),
('avanzato', 7,  'Ricavi vendite', 50000), ('avanzato', 8,  'Ricavi vendite', 35000),
('avanzato', 9,  'Ricavi vendite', 55000), ('avanzato', 10, 'Ricavi vendite', 58000),
('avanzato', 11, 'Ricavi vendite', 55000), ('avanzato', 12, 'Ricavi vendite', 62000),
('avanzato', 1,  'Costi operativi', 28000), ('avanzato', 2,  'Costi operativi', 30000),
('avanzato', 3,  'Costi operativi', 33000), ('avanzato', 4,  'Costi operativi', 34000),
('avanzato', 5,  'Costi operativi', 36000), ('avanzato', 6,  'Costi operativi', 38000),
('avanzato', 7,  'Costi operativi', 34000), ('avanzato', 8,  'Costi operativi', 25000),
('avanzato', 9,  'Costi operativi', 36000), ('avanzato', 10, 'Costi operativi', 38000),
('avanzato', 11, 'Costi operativi', 37000), ('avanzato', 12, 'Costi operativi', 44000);


-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICA DATI
-- ═══════════════════════════════════════════════════════════════════════

-- Conteggio template
DO $$
DECLARE
  v_conti INTEGER;
  v_op_base INTEGER;
  v_op_inter INTEGER;
  v_op_avanz INTEGER;
  v_scr INTEGER;
  v_bud INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_conti FROM template_piano_conti;
  SELECT COUNT(*) INTO v_op_base FROM template_operazioni WHERE livello = 'base';
  SELECT COUNT(*) INTO v_op_inter FROM template_operazioni WHERE livello = 'intermedio';
  SELECT COUNT(*) INTO v_op_avanz FROM template_operazioni WHERE livello = 'avanzato';
  SELECT COUNT(*) INTO v_scr FROM template_scritture_assestamento;
  SELECT COUNT(*) INTO v_bud FROM template_budget;

  RAISE NOTICE '';
  RAISE NOTICE '══════════════════════════════════════════';
  RAISE NOTICE '  SEED COMPLETATO - Tecnomeccanica Rossi';
  RAISE NOTICE '══════════════════════════════════════════';
  RAISE NOTICE '  Piano conti:          % voci', v_conti;
  RAISE NOTICE '  Operazioni BASE:      % righe', v_op_base;
  RAISE NOTICE '  Operazioni INTERMEDIO: % righe', v_op_inter;
  RAISE NOTICE '  Operazioni AVANZATO:  % righe', v_op_avanz;
  RAISE NOTICE '  Scritture assest.:    % righe', v_scr;
  RAISE NOTICE '  Budget:               % righe', v_bud;
  RAISE NOTICE '══════════════════════════════════════════';
  RAISE NOTICE '';
END $$;

/**
 * DIZIONARIO COMPLETO DEFINIZIONI CONTABILI
 * Ogni voce include: definizione, formula, normativa, interpretazione, esempio
 */

export interface Definizione {
  chiave: string;
  titolo: string;
  definizione: string;
  formula?: string;
  normativa?: string;
  interpretazione?: string;
  esempio?: string;
  categoria: 'bilancio' | 'indice' | 'conto' | 'assestamento' | 'gestionale' | 'finanziario';
}

export const DEFINIZIONI: Record<string, Definizione> = {

  // ═══════════════════════════════════════════════════════
  // STATO PATRIMONIALE
  // ═══════════════════════════════════════════════════════

  immobilizzazioni_immateriali: {
    chiave: 'immobilizzazioni_immateriali',
    titolo: 'Immobilizzazioni Immateriali',
    definizione: 'Beni privi di consistenza fisica destinati a essere utilizzati durevolmente nell\'impresa: brevetti, licenze, marchi, avviamento, costi di sviluppo.',
    normativa: 'Art. 2424 c.c., voce B.I; OIC 24 - Immobilizzazioni immateriali. L\'avviamento può essere iscritto solo se acquisito a titolo oneroso (art. 2426 c.c.).',
    interpretazione: 'Un peso elevato delle immobilizzazioni immateriali può indicare investimenti in innovazione ma anche rischio di svalutazione. L\'avviamento va ammortizzato in max 10 anni.',
    esempio: 'Brevetto acquistato per €50.000, ammortizzato in 5 anni → €10.000/anno di ammortamento.',
    categoria: 'bilancio',
  },

  immobilizzazioni_materiali: {
    chiave: 'immobilizzazioni_materiali',
    titolo: 'Immobilizzazioni Materiali',
    definizione: 'Beni tangibili di uso durevole: terreni, fabbricati, impianti, macchinari, attrezzature, automezzi. Iscritti al costo storico al netto dei fondi di ammortamento.',
    normativa: 'Art. 2424 c.c., voce B.II; OIC 16 - Immobilizzazioni materiali. Criterio di valutazione: costo di acquisto o produzione (art. 2426 c.c.).',
    interpretazione: 'Rappresentano la capacità produttiva dell\'azienda. Il rapporto immobilizzazioni/attivo indica l\'intensità di capitale. Settori industriali hanno valori più alti.',
    esempio: 'Macchinario acquistato a €100.000, vita utile 10 anni, fondo ammortamento €30.000 → valore netto contabile €70.000.',
    categoria: 'bilancio',
  },

  immobilizzazioni_finanziarie: {
    chiave: 'immobilizzazioni_finanziarie',
    titolo: 'Immobilizzazioni Finanziarie',
    definizione: 'Partecipazioni in altre società, crediti finanziari a medio-lungo termine, titoli destinati a permanere durevolmente nel patrimonio aziendale.',
    normativa: 'Art. 2424 c.c., voce B.III; OIC 21 - Partecipazioni. Le partecipazioni in controllate possono essere valutate al costo o con il metodo del patrimonio netto.',
    interpretazione: 'Indicano la strategia di diversificazione o integrazione del gruppo. Partecipazioni rilevanti richiedono il bilancio consolidato.',
    categoria: 'bilancio',
  },

  rimanenze: {
    chiave: 'rimanenze',
    titolo: 'Rimanenze',
    definizione: 'Scorte di magazzino: materie prime, semilavorati, prodotti in corso di lavorazione, prodotti finiti e merci. Valutate al minore tra costo e valore di realizzo.',
    formula: 'Rimanenze finali = Rimanenze iniziali + Acquisti - Costo del venduto',
    normativa: 'Art. 2424 c.c., voce C.I; OIC 13 - Rimanenze. Metodi di valutazione ammessi: FIFO, costo medio ponderato, LIFO (art. 2426 n. 10 c.c.).',
    interpretazione: 'Rimanenze elevate possono indicare inefficienza o rischio di obsolescenza. La rotazione del magazzino misura l\'efficienza della gestione.',
    esempio: 'Materie prime €15.000 + Prodotti finiti €25.000 = Rimanenze totali €40.000.',
    categoria: 'bilancio',
  },

  crediti: {
    chiave: 'crediti',
    titolo: 'Crediti',
    definizione: 'Diritti dell\'impresa a ricevere somme di denaro: crediti verso clienti (commerciali), crediti tributari, crediti verso altri. Esposti al netto del fondo svalutazione crediti.',
    normativa: 'Art. 2424 c.c., voce C.II; OIC 15 - Crediti. Devono essere valutati al valore presumibile di realizzo (art. 2426 n. 8 c.c.).',
    interpretazione: 'Crediti elevati rispetto ai ricavi indicano tempi di incasso lunghi (DSO alto). Il fondo svalutazione copre il rischio di insolvenza.',
    esempio: 'Crediti vs clienti €120.000, fondo svalutazione €5.000 → Crediti netti €115.000.',
    categoria: 'bilancio',
  },

  disponibilita_liquide: {
    chiave: 'disponibilita_liquide',
    titolo: 'Disponibilità Liquide',
    definizione: 'Denaro immediatamente disponibile: depositi bancari e postali, assegni, denaro e valori in cassa.',
    normativa: 'Art. 2424 c.c., voce C.IV; OIC 14 - Disponibilità liquide.',
    interpretazione: 'Misurano la capacità di far fronte a pagamenti immediati. Troppa liquidità può indicare inefficienza nell\'impiego del capitale; troppo poca indica rischio di liquidità.',
    categoria: 'bilancio',
  },

  patrimonio_netto: {
    chiave: 'patrimonio_netto',
    titolo: 'Patrimonio Netto',
    definizione: 'Differenza tra attività e passività. Comprende: capitale sociale, riserve (legale, straordinaria, da sovrapprezzo), utili/perdite portati a nuovo, utile/perdita d\'esercizio.',
    formula: 'PN = Totale Attivo - Totale Debiti',
    normativa: 'Art. 2424 c.c., voce A; OIC 28 - Patrimonio netto. Il capitale minimo per S.r.l. è €1 (art. 2463 c.c.), per S.p.A. €50.000 (art. 2327 c.c.).',
    interpretazione: 'Rappresenta la "ricchezza propria" dell\'azienda. Se il PN scende sotto il capitale sociale, si attivano gli obblighi di ricapitalizzazione (artt. 2446-2447 c.c.).',
    esempio: 'Capitale €100.000 + Riserve €20.000 + Utile €15.000 = PN €135.000.',
    categoria: 'bilancio',
  },

  fondi_rischi: {
    chiave: 'fondi_rischi',
    titolo: 'Fondi per Rischi e Oneri',
    definizione: 'Accantonamenti destinati a coprire perdite o debiti di natura determinata, di esistenza certa o probabile, il cui ammontare o data di sopravvenienza è indeterminato.',
    normativa: 'Art. 2424 c.c., voce B; OIC 31 - Fondi per rischi e oneri. Si accantona quando il rischio è probabile e l\'importo stimabile ragionevolmente.',
    interpretazione: 'Fondi elevati possono indicare gestione prudente o esposizione a rischi significativi (cause legali, garanzie, bonifica ambientale).',
    esempio: 'Causa legale in corso, rischio probabile stimato €50.000 → Accantonamento al fondo rischi cause legali.',
    categoria: 'bilancio',
  },

  tfr: {
    chiave: 'tfr',
    titolo: 'TFR - Trattamento di Fine Rapporto',
    definizione: 'Debito maturato verso i dipendenti, pari alla retribuzione annua divisa per 13,5, rivalutata annualmente. Si eroga alla cessazione del rapporto di lavoro.',
    formula: 'TFR annuo = Retribuzione annua / 13,5 (al netto del contributo INPS 0,50%)',
    normativa: 'Art. 2120 c.c.; OIC 31; Art. 2424 c.c., voce C. Dal 2007 il TFR maturando può essere destinato a fondi pensione o al Fondo Tesoreria INPS.',
    interpretazione: 'È un debito certo nell\'importo e nella scadenza (uscita del dipendente). Rappresenta una forma di autofinanziamento.',
    categoria: 'bilancio',
  },

  debiti_finanziari: {
    chiave: 'debiti_finanziari',
    titolo: 'Debiti Finanziari',
    definizione: 'Debiti contratti per operazioni di finanziamento: mutui bancari, prestiti obbligazionari, finanziamenti soci. Distinti tra breve termine (< 12 mesi) e medio-lungo.',
    normativa: 'Art. 2424 c.c., voci D.1 (obbligazioni) e D.4 (debiti verso banche); OIC 19 - Debiti.',
    interpretazione: 'Un alto indebitamento finanziario aumenta il leverage e il rischio. Il costo del debito deve essere inferiore al ROI per creare valore (leva finanziaria positiva).',
    esempio: 'Mutuo bancario €200.000 a 10 anni, tasso 3% → Rata annua circa €23.500.',
    categoria: 'bilancio',
  },

  debiti_commerciali: {
    chiave: 'debiti_commerciali',
    titolo: 'Debiti Commerciali',
    definizione: 'Debiti verso fornitori per acquisti di beni e servizi, debiti tributari (IVA, IRES, IRAP), debiti verso istituti previdenziali (INPS, INAIL), altri debiti operativi.',
    normativa: 'Art. 2424 c.c., voci D.7 (fornitori), D.12 (tributari), D.13 (previdenziali); OIC 19.',
    interpretazione: 'Rappresentano una fonte di finanziamento spontanea a costo zero (dilazione fornitori). Il DPO misura i giorni medi di pagamento.',
    categoria: 'bilancio',
  },

  ratei_risconti: {
    chiave: 'ratei_risconti',
    titolo: 'Ratei e Risconti',
    definizione: 'Voci di rettifica per il principio di competenza economica. I ratei sono quote di ricavi/costi di competenza non ancora rilevati; i risconti sono quote già rilevate ma di competenza futura.',
    normativa: 'Art. 2424 c.c., voci D (attivi) e E (passivi); OIC 18 - Ratei e risconti. Art. 2424-bis c.c.: misurano proventi/oneri comuni a due o più esercizi.',
    interpretazione: 'Servono a rispettare il principio di competenza economica (art. 2423-bis c.c.): i ricavi e i costi devono essere attribuiti all\'esercizio in cui maturano, indipendentemente dalla manifestazione finanziaria.',
    esempio: 'Affitto annuo €12.000 pagato il 01/07: al 31/12 → Risconto attivo €6.000 (quota gen-giu anno successivo).',
    categoria: 'bilancio',
  },

  totale_attivo: {
    chiave: 'totale_attivo',
    titolo: 'Totale Attivo',
    definizione: 'Somma di tutte le attività patrimoniali dell\'impresa: immobilizzazioni + attivo circolante + ratei e risconti attivi. Rappresenta il totale degli impieghi.',
    formula: 'Totale Attivo = Immobilizzazioni (B) + Attivo Circolante (C) + Ratei e Risconti (D)',
    normativa: 'Art. 2424 c.c. Il totale attivo deve essere uguale al totale passivo (principio della partita doppia).',
    interpretazione: 'La dimensione dell\'attivo indica la scala dell\'impresa. La sua composizione (fisso vs circolante) rivela il modello di business.',
    categoria: 'bilancio',
  },

  totale_passivo: {
    chiave: 'totale_passivo',
    titolo: 'Totale Passivo',
    definizione: 'Somma di patrimonio netto e debiti. Rappresenta il totale delle fonti di finanziamento. Deve essere uguale al totale attivo.',
    formula: 'Totale Passivo = PN (A) + Fondi (B) + TFR (C) + Debiti (D) + Ratei e Risconti (E)',
    normativa: 'Art. 2424 c.c. La quadratura Attivo = Passivo è un principio fondamentale della contabilità.',
    categoria: 'bilancio',
  },

  // ═══════════════════════════════════════════════════════
  // CONTO ECONOMICO
  // ═══════════════════════════════════════════════════════

  valore_produzione: {
    chiave: 'valore_produzione',
    titolo: 'Valore della Produzione',
    definizione: 'Totale dei ricavi caratteristici: ricavi di vendita, variazioni delle rimanenze di prodotti, incrementi per lavori interni, altri ricavi e proventi.',
    formula: 'A) = A.1 Ricavi vendite + A.2 Variazione rimanenze + A.4 Incrementi + A.5 Altri ricavi',
    normativa: 'Art. 2425 c.c., sezione A; OIC 12 - Composizione e schemi del bilancio.',
    interpretazione: 'Misura il volume d\'affari complessivo. Include anche la produzione non venduta (variazione rimanenze) e quella interna.',
    categoria: 'bilancio',
  },

  ricavi_vendite: {
    chiave: 'ricavi_vendite',
    titolo: 'Ricavi delle Vendite e delle Prestazioni',
    definizione: 'Corrispettivi delle cessioni di beni e prestazioni di servizi che costituiscono l\'attività caratteristica dell\'impresa, al netto di resi, sconti e abbuoni.',
    normativa: 'Art. 2425 c.c., voce A.1; OIC 12. I ricavi si rilevano quando il processo produttivo è completato e lo scambio è avvenuto.',
    interpretazione: 'È la voce più importante del CE. La sua crescita anno su anno indica l\'andamento del business. Il confronto con il budget rileva eventuali scostamenti.',
    categoria: 'bilancio',
  },

  ebitda: {
    chiave: 'ebitda',
    titolo: 'EBITDA - Margine Operativo Lordo',
    definizione: 'Earnings Before Interest, Taxes, Depreciation and Amortization. Misura la redditività operativa al lordo di ammortamenti, oneri finanziari e imposte.',
    formula: 'EBITDA = Valore Produzione - Costi operativi (esclusi ammortamenti)',
    normativa: 'Non previsto dal codice civile come voce autonoma. È un indicatore gestionale ampiamente usato nella prassi e nell\'analisi finanziaria (EV/EBITDA per le valutazioni).',
    interpretazione: 'Elimina gli effetti delle politiche di ammortamento e della struttura finanziaria, permettendo confronti più omogenei. Un EBITDA margin > 15% è generalmente positivo.',
    esempio: 'Ricavi €1.000.000 - Costi operativi (no ammortamenti) €750.000 = EBITDA €250.000 (margin 25%).',
    categoria: 'bilancio',
  },

  ebit: {
    chiave: 'ebit',
    titolo: 'EBIT - Risultato Operativo',
    definizione: 'Earnings Before Interest and Taxes. Differenza tra valore della produzione e costi della produzione. Misura la redditività della gestione caratteristica.',
    formula: 'EBIT = A) Valore Produzione - B) Costi Produzione = EBITDA - Ammortamenti',
    normativa: 'Art. 2425 c.c.: corrisponde alla "Differenza tra valore e costi della produzione (A-B)". Principio di riferimento: OIC 12.',
    interpretazione: 'È il risultato "core" dell\'azienda, prima della gestione finanziaria e fiscale. È la base per il calcolo del ROI. Un EBIT negativo indica che il business non è sostenibile operativamente.',
    esempio: 'EBITDA €250.000 - Ammortamenti €50.000 = EBIT €200.000.',
    categoria: 'bilancio',
  },

  utile_netto: {
    chiave: 'utile_netto',
    titolo: 'Utile (Perdita) dell\'Esercizio',
    definizione: 'Risultato finale del conto economico dopo tutte le gestioni: operativa, finanziaria, straordinaria e fiscale. Se negativo si parla di perdita d\'esercizio.',
    formula: 'Utile = EBIT ± Gestione finanziaria - Imposte',
    normativa: 'Art. 2425 c.c., voce 21; OIC 12. L\'utile confluisce nel patrimonio netto (voce A.IX). La distribuzione è disciplinata dagli artt. 2430-2433 c.c.',
    interpretazione: 'L\'utile remunera i soci. Prima della distribuzione, almeno il 5% deve andare a riserva legale fino al raggiungimento di 1/5 del capitale sociale (art. 2430 c.c.).',
    esempio: 'EBIT €200.000 - Interessi €15.000 - Imposte €55.000 = Utile netto €130.000.',
    categoria: 'bilancio',
  },

  imposte: {
    chiave: 'imposte',
    titolo: 'Imposte sul Reddito',
    definizione: 'IRES (Imposta sul Reddito delle Società, 24%) e IRAP (Imposta Regionale sulle Attività Produttive, circa 3,9%). Calcolate sul reddito imponibile fiscale.',
    formula: 'IRES = Reddito imponibile × 24%; IRAP = Valore della produzione netta × 3,9%',
    normativa: 'Art. 2425 c.c., voce 20; OIC 25 - Imposte sul reddito. D.P.R. 917/1986 (TUIR) per IRES; D.Lgs. 446/1997 per IRAP.',
    interpretazione: 'L\'aliquota effettiva (tax rate) può differire da quella nominale per deduzioni, crediti d\'imposta, differenze temporanee.',
    categoria: 'bilancio',
  },

  // ═══════════════════════════════════════════════════════
  // INDICI DI BILANCIO
  // ═══════════════════════════════════════════════════════

  roe: {
    chiave: 'roe',
    titolo: 'ROE - Return on Equity',
    definizione: 'Indice di redditività del capitale proprio. Misura il rendimento per i soci: quanto utile genera ogni euro investito dai proprietari.',
    formula: 'ROE = (Utile Netto / Patrimonio Netto) × 100',
    normativa: 'Non codificato per legge, ma richiesto da OIC 30 per i bilanci intermedi e universalmente usato nell\'analisi fondamentale.',
    interpretazione: 'ROE > 8-10% è generalmente buono. Deve essere confrontato con il costo del capitale proprio e il rendimento di investimenti alternativi. Si scompone con la formula DuPont: ROE = ROS × Rotazione × Leverage.',
    esempio: 'Utile €50.000 / PN €400.000 = ROE 12,5%. Ogni €100 di capitale proprio genera €12,50 di utile.',
    categoria: 'indice',
  },

  roi: {
    chiave: 'roi',
    titolo: 'ROI - Return on Investment',
    definizione: 'Indice di redditività del capitale investito. Misura l\'efficienza con cui l\'azienda utilizza tutte le risorse, indipendentemente da come sono finanziate.',
    formula: 'ROI = (EBIT / Totale Attivo) × 100',
    normativa: 'Indicatore gestionale. Confrontare con il costo medio del debito: se ROI > tasso debito → leva finanziaria positiva.',
    interpretazione: 'ROI > 5% è generalmente accettabile. Un ROI superiore al costo del debito significa che indebitarsi crea valore. La scomposizione è: ROI = ROS × Rotazione del capitale.',
    esempio: 'EBIT €80.000 / Attivo €800.000 = ROI 10%. Ogni €100 investito genera €10 di reddito operativo.',
    categoria: 'indice',
  },

  ros: {
    chiave: 'ros',
    titolo: 'ROS - Return on Sales',
    definizione: 'Indice di redditività delle vendite. Misura la percentuale di ricavi che si trasforma in reddito operativo dopo aver coperto tutti i costi operativi.',
    formula: 'ROS = (EBIT / Ricavi Vendite) × 100',
    normativa: 'Indicatore gestionale. Varia significativamente tra settori: retail 2-5%, industria 8-15%, software 20-40%.',
    interpretazione: 'Un ROS alto indica buon potere di prezzo o buona efficienza operativa. Un calo del ROS nel tempo segnala erosione dei margini.',
    esempio: 'EBIT €80.000 / Ricavi €500.000 = ROS 16%. Su ogni €100 di vendite, €16 sono reddito operativo.',
    categoria: 'indice',
  },

  roa: {
    chiave: 'roa',
    titolo: 'ROA - Return on Assets',
    definizione: 'Rendimento delle attività totali. Simile al ROI ma usa l\'utile netto anziché l\'EBIT, includendo l\'effetto della gestione finanziaria e fiscale.',
    formula: 'ROA = (Utile Netto / Totale Attivo) × 100',
    interpretazione: 'Misura la redditività complessiva di tutte le risorse. ROA > 3% è generalmente positivo. La differenza ROI-ROA rivela l\'impatto di finanza e fisco.',
    categoria: 'indice',
  },

  autonomia_finanziaria: {
    chiave: 'autonomia_finanziaria',
    titolo: 'Autonomia Finanziaria',
    definizione: 'Rapporto tra patrimonio netto e totale attivo. Misura la percentuale delle attività finanziata con mezzi propri (non a debito).',
    formula: 'Autonomia = (PN / Totale Attivo) × 100',
    normativa: 'L\'art. 2446 c.c. prevede obblighi quando il PN scende sotto i 2/3 del capitale. Basilea III impone requisiti patrimoniali per le banche.',
    interpretazione: '> 33% indica buona capitalizzazione. < 20% segnala forte dipendenza dal debito. Settori capital-intensive tollerano valori più bassi.',
    esempio: 'PN €300.000 / Attivo €900.000 = 33,3%. Un terzo delle attività è finanziato dai soci.',
    categoria: 'indice',
  },

  leverage: {
    chiave: 'leverage',
    titolo: 'Leverage (Leva Finanziaria)',
    definizione: 'Rapporto tra totale attivo e patrimonio netto. Misura quante volte il capitale proprio è "moltiplicato" dal debito.',
    formula: 'Leverage = Totale Attivo / PN',
    normativa: 'Concetto centrale della teoria finanziaria (Modigliani-Miller). La leva amplifica sia i rendimenti che le perdite.',
    interpretazione: 'Leverage < 2 = conservativo; 2-3 = equilibrato; > 3 = aggressivo. Se ROI > costo debito → indebitarsi conviene. Se ROI < costo debito → la leva distrugge valore.',
    esempio: 'Attivo €900.000 / PN €300.000 = Leverage 3x. Per ogni €1 di capitale proprio, l\'azienda gestisce €3 di risorse.',
    categoria: 'indice',
  },

  current_ratio: {
    chiave: 'current_ratio',
    titolo: 'Current Ratio (Indice di Liquidità Corrente)',
    definizione: 'Rapporto tra attivo corrente e passivo corrente. Misura la capacità dell\'azienda di far fronte ai debiti a breve termine con le attività a breve.',
    formula: 'Current Ratio = Attivo Corrente / Passivo Corrente',
    normativa: 'Non codificato, ma l\'art. 2423-bis c.c. impone la valutazione della continuità aziendale, di cui la liquidità è indicatore chiave.',
    interpretazione: '> 1.5 = buono; 1.0-1.5 = accettabile; < 1.0 = tensione finanziaria (le passività a breve superano le attività a breve). Settore retail tollera valori più bassi.',
    esempio: 'Attivo corrente €450.000 / Passivo corrente €300.000 = Current ratio 1,5x.',
    categoria: 'indice',
  },

  quick_ratio: {
    chiave: 'quick_ratio',
    titolo: 'Quick Ratio (Acid Test)',
    definizione: 'Come il Current Ratio ma esclude le rimanenze, considerate meno liquide. Misura la liquidità "immediata" senza dover vendere il magazzino.',
    formula: 'Quick Ratio = (Attivo Corrente - Rimanenze) / Passivo Corrente',
    interpretazione: '> 1.0 = buono (l\'azienda copre i debiti a breve senza toccare il magazzino); < 0.8 = rischio; < 0.5 = critico.',
    esempio: '(Att. corrente €450.000 - Rimanenze €100.000) / Pass. corrente €300.000 = Quick ratio 1,17x.',
    categoria: 'indice',
  },

  cash_ratio: {
    chiave: 'cash_ratio',
    titolo: 'Cash Ratio',
    definizione: 'Rapporto tra liquidità immediate (cassa e banca) e passività correnti. L\'indicatore di liquidità più severo.',
    formula: 'Cash Ratio = Disponibilità Liquide / Passivo Corrente',
    interpretazione: '> 0.2 = adeguato. Valori molto alti (> 0.5) possono indicare eccesso di liquidità non investita.',
    categoria: 'indice',
  },

  rotazione_magazzino: {
    chiave: 'rotazione_magazzino',
    titolo: 'Rotazione del Magazzino',
    definizione: 'Numero di volte in cui il magazzino si rinnova completamente nell\'anno. Misura l\'efficienza nella gestione delle scorte.',
    formula: 'Rotazione = Costo del Venduto / Rimanenze Medie',
    interpretazione: '> 6x = molto efficiente; 4-6x = buono; < 3x = scorte elevate o lenta movimentazione. Varia per settore (alimentare > 20x, lusso < 2x).',
    esempio: 'Costo del venduto €500.000 / Rimanenze medie €100.000 = 5 volte/anno. Il magazzino si rinnova ogni ~73 giorni.',
    categoria: 'indice',
  },

  dso: {
    chiave: 'dso',
    titolo: 'DSO - Days Sales Outstanding',
    definizione: 'Giorni medi di incasso dei crediti commerciali. Misura quanto tempo impiegano i clienti a pagare.',
    formula: 'DSO = (Crediti verso Clienti / Ricavi Vendite) × 365',
    interpretazione: '< 30 gg = ottimo; 30-60 gg = buono; 60-90 gg = nella media; > 90 gg = critico. In Italia la media è circa 60-80 giorni.',
    esempio: 'Crediti €150.000 / Ricavi €1.000.000 × 365 = DSO 55 giorni.',
    categoria: 'indice',
  },

  dpo: {
    chiave: 'dpo',
    titolo: 'DPO - Days Payable Outstanding',
    definizione: 'Giorni medi di pagamento ai fornitori. Misura quanto tempo l\'azienda impiega a pagare i propri debiti commerciali.',
    formula: 'DPO = (Debiti verso Fornitori / Acquisti) × 365',
    interpretazione: 'DPO alto = l\'azienda sfrutta la dilazione dei fornitori (fonte di finanziamento gratuita). Tuttavia, DPO troppo alto può deteriorare i rapporti commerciali.',
    esempio: 'Debiti fornitori €80.000 / Acquisti €400.000 × 365 = DPO 73 giorni.',
    categoria: 'indice',
  },

  ciclo_monetario: {
    chiave: 'ciclo_monetario',
    titolo: 'Ciclo Monetario (Cash Conversion Cycle)',
    definizione: 'Tempo medio che intercorre tra il pagamento ai fornitori e l\'incasso dai clienti. Misura per quanti giorni l\'azienda deve finanziare il capitale circolante.',
    formula: 'Ciclo Monetario = DSO + Giorni Magazzino - DPO',
    interpretazione: 'Più è breve, meglio è. Un ciclo negativo (raro) significa che l\'azienda incassa prima di pagare. Amazon ha ciclo monetario negativo (-30 giorni circa).',
    esempio: 'DSO 55 gg + Gg magazzino 73 gg - DPO 73 gg = Ciclo monetario 55 giorni.',
    categoria: 'indice',
  },

  copertura_immobilizzazioni: {
    chiave: 'copertura_immobilizzazioni',
    titolo: 'Copertura delle Immobilizzazioni',
    definizione: 'Rapporto tra fonti durevoli (PN + passività a M/L termine) e attivo immobilizzato. Verifica se le immobilizzazioni sono finanziate con fonti a lungo termine.',
    formula: 'Copertura = (PN + Passività Consolidate) / Immobilizzazioni × 100',
    normativa: 'Principio finanziario fondamentale: le attività a lungo termine devono essere finanziate con fonti a lungo termine (regola aurea della finanza).',
    interpretazione: '> 100% = le immobilizzazioni sono interamente coperte da fonti durevoli (situazione corretta). < 100% = parte dell\'attivo fisso è finanziata a breve (squilibrio finanziario).',
    categoria: 'indice',
  },

  // ═══════════════════════════════════════════════════════
  // SCRITTURE DI ASSESTAMENTO
  // ═══════════════════════════════════════════════════════

  ammortamento: {
    chiave: 'ammortamento',
    titolo: 'Ammortamento',
    definizione: 'Processo contabile di ripartizione del costo di un\'immobilizzazione lungo la sua vita utile stimata. Rappresenta la quota annua di deperimento economico del bene.',
    formula: 'Quota ammortamento = Costo storico / Vita utile (metodo a quote costanti)',
    normativa: 'Art. 2426 n. 2 c.c.; OIC 16 (materiali) e OIC 24 (immateriali). L\'ammortamento deve essere sistematico. Il piano di ammortamento può essere modificato solo in casi eccezionali.',
    interpretazione: 'Non rappresenta un\'uscita di cassa ma un costo figurativo. Per questo EBITDA (ante ammortamenti) è spesso preferito per l\'analisi dei flussi di cassa.',
    esempio: 'Macchinario €100.000, vita utile 10 anni → Ammortamento annuo €10.000. Scrittura: Dare "Ammortamento immob. mat." / Avere "Fondo amm.to immob. mat."',
    categoria: 'assestamento',
  },

  rateo_attivo: {
    chiave: 'rateo_attivo',
    titolo: 'Rateo Attivo',
    definizione: 'Quota di ricavo di competenza dell\'esercizio in chiusura, la cui manifestazione finanziaria (incasso) avverrà nell\'esercizio successivo.',
    formula: 'Rateo Attivo = Importo totale × (giorni di competenza / giorni totali)',
    normativa: 'Art. 2424-bis c.c.; OIC 18. Il rateo attivo esprime un credito per una prestazione già resa ma non ancora fatturata/incassata.',
    interpretazione: 'Tipico degli interessi attivi maturati su depositi/titoli. Al 31/12 si rileva la quota maturata anche se l\'incasso avverrà dopo.',
    esempio: 'Titolo con cedola semestrale di €6.000 (01/07-30/06). Al 31/12 → Rateo attivo €3.000 (6 mesi su 12).',
    categoria: 'assestamento',
  },

  rateo_passivo: {
    chiave: 'rateo_passivo',
    titolo: 'Rateo Passivo',
    definizione: 'Quota di costo di competenza dell\'esercizio in chiusura, la cui manifestazione finanziaria (pagamento) avverrà nell\'esercizio successivo.',
    formula: 'Rateo Passivo = Importo totale × (giorni di competenza / giorni totali)',
    normativa: 'Art. 2424-bis c.c.; OIC 18. Il rateo passivo esprime un debito per una prestazione già ricevuta ma non ancora fatturata/pagata.',
    interpretazione: 'Tipico degli interessi passivi su mutui con scadenza successiva alla chiusura dell\'esercizio.',
    esempio: 'Mutuo con rata semestrale di interessi €3.000 (01/10-31/03). Al 31/12 → Rateo passivo €1.500 (3 mesi su 6).',
    categoria: 'assestamento',
  },

  risconto_attivo: {
    chiave: 'risconto_attivo',
    titolo: 'Risconto Attivo',
    definizione: 'Quota di costo già sostenuto (pagato) nell\'esercizio in chiusura, ma di competenza dell\'esercizio successivo. È uno storno di costo.',
    formula: 'Risconto Attivo = Importo pagato × (giorni di competenza futura / giorni totali)',
    normativa: 'Art. 2424-bis c.c.; OIC 18. Il risconto attivo riduce il costo dell\'esercizio corrente, rinviandone una parte al futuro.',
    interpretazione: 'Tipico di affitti, assicurazioni, canoni pagati anticipatamente. Entro 12 mesi va in attivo circolante; oltre 12 mesi in immobilizzazioni.',
    esempio: 'Affitto annuo €12.000 pagato il 01/10. Al 31/12 → Risconto attivo €9.000 (9 mesi gen-set anno successivo). Scrittura: Dare "Risconti attivi" / Avere "Affitti passivi".',
    categoria: 'assestamento',
  },

  risconto_passivo: {
    chiave: 'risconto_passivo',
    titolo: 'Risconto Passivo',
    definizione: 'Quota di ricavo già conseguito (incassato) nell\'esercizio in chiusura, ma di competenza dell\'esercizio successivo. È uno storno di ricavo.',
    formula: 'Risconto Passivo = Importo incassato × (giorni di competenza futura / giorni totali)',
    normativa: 'Art. 2424-bis c.c.; OIC 18. Il risconto passivo riduce il ricavo dell\'esercizio corrente, rinviandone una parte al futuro.',
    esempio: 'Canone annuo di €24.000 incassato il 01/07. Al 31/12 → Risconto passivo €12.000 (6 mesi gen-giu successivo).',
    categoria: 'assestamento',
  },

  accantonamento: {
    chiave: 'accantonamento',
    titolo: 'Accantonamento a Fondi Rischi e Oneri',
    definizione: 'Iscrizione in conto economico di un costo stimato per perdite o debiti futuri di natura determinata, la cui esistenza è certa o probabile ma l\'ammontare è indeterminato.',
    normativa: 'Art. 2424 c.c., voce B; OIC 31 - Fondi per rischi e oneri. L\'accantonamento è obbligatorio quando il rischio è probabile (> 50%) e l\'importo stimabile.',
    interpretazione: 'Rispetta il principio di prudenza (art. 2423-bis c.c.). Non accantona se il rischio è solo possibile (< 50%): in tal caso si indica nei conti d\'ordine o nella nota integrativa.',
    esempio: 'Causa legale con rischio probabile di perdita stimata €30.000 → Dare "Accantonamento fondi rischi" / Avere "Fondo rischi cause legali".',
    categoria: 'assestamento',
  },

  // ═══════════════════════════════════════════════════════
  // ANALISI GESTIONALE
  // ═══════════════════════════════════════════════════════

  break_even_point: {
    chiave: 'break_even_point',
    titolo: 'Break-Even Point (Punto di Pareggio)',
    definizione: 'Volume di fatturato al quale i ricavi totali eguagliano i costi totali (fissi + variabili). Al di sotto di questo punto l\'azienda è in perdita, al di sopra genera utile.',
    formula: 'BEP = Costi Fissi / Margine di Contribuzione %',
    interpretazione: 'Più è basso il BEP rispetto ai ricavi effettivi, maggiore è il margine di sicurezza. Un BEP alto indica struttura di costi rigida (alti costi fissi).',
    esempio: 'Costi fissi €200.000, MdC% 40% → BEP = €200.000 / 0,40 = €500.000. Serve fatturare almeno €500.000 per pareggiare.',
    categoria: 'gestionale',
  },

  margine_contribuzione: {
    chiave: 'margine_contribuzione',
    titolo: 'Margine di Contribuzione',
    definizione: 'Differenza tra ricavi e costi variabili. Rappresenta quanto ogni euro di vendita "contribuisce" alla copertura dei costi fissi e alla generazione di utile.',
    formula: 'MdC = Ricavi - Costi Variabili; MdC% = MdC / Ricavi × 100',
    interpretazione: 'MdC% alto → i costi fissi pesano di più ma una volta superato il BEP i margini crescono rapidamente. MdC% basso → minor leva operativa.',
    esempio: 'Ricavi €800.000 - Costi variabili €480.000 = MdC €320.000 (MdC% = 40%).',
    categoria: 'gestionale',
  },

  margine_sicurezza: {
    chiave: 'margine_sicurezza',
    titolo: 'Margine di Sicurezza',
    definizione: 'Misura percentuale di quanto i ricavi attuali superano il break-even point. Indica quanto possono calare le vendite prima di andare in perdita.',
    formula: 'MdS = (Ricavi Attuali - BEP) / Ricavi Attuali × 100',
    interpretazione: '> 30% = comfort elevato; 10-30% = adeguato; < 10% = situazione fragile, un piccolo calo delle vendite porta in perdita.',
    esempio: 'Ricavi €800.000, BEP €500.000 → MdS = (800-500)/800 = 37,5%. Le vendite possono calare del 37,5% prima di andare in perdita.',
    categoria: 'gestionale',
  },

  // ═══════════════════════════════════════════════════════
  // RENDICONTO FINANZIARIO
  // ═══════════════════════════════════════════════════════

  cash_flow_operativo: {
    chiave: 'cash_flow_operativo',
    titolo: 'Cash Flow Operativo',
    definizione: 'Flusso di cassa generato (o assorbito) dalla gestione corrente dell\'impresa. Si calcola con metodo indiretto partendo dall\'utile netto.',
    formula: 'CF Operativo = Utile + Ammortamenti ± Variazione Crediti ± Variazione Rimanenze ± Variazione Debiti ± Variazione TFR/Fondi',
    normativa: 'OIC 10 - Rendiconto finanziario. Obbligatorio per le società che redigono il bilancio in forma ordinaria (art. 2425-ter c.c., introdotto dal D.Lgs. 139/2015).',
    interpretazione: 'È l\'indicatore più importante della salute finanziaria. Un\'azienda profittevole può fallire se il CF operativo è negativo (crisi di liquidità). Deve essere positivo e crescente.',
    esempio: 'Utile €100.000 + Ammortamenti €30.000 - Aumento crediti €20.000 + Aumento debiti forn. €10.000 = CF operativo €120.000.',
    categoria: 'finanziario',
  },

  cash_flow_investimenti: {
    chiave: 'cash_flow_investimenti',
    titolo: 'Cash Flow da Investimenti',
    definizione: 'Flusso di cassa relativo ad acquisti/vendite di immobilizzazioni (materiali, immateriali, finanziarie).',
    normativa: 'OIC 10. Include investimenti CAPEX (capital expenditure) e disinvestimenti.',
    interpretazione: 'Tipicamente negativo (l\'azienda investe). Un valore molto negativo indica forte espansione. Se positivo, l\'azienda sta dismettendo attività (attenzione).',
    categoria: 'finanziario',
  },

  cash_flow_finanziamenti: {
    chiave: 'cash_flow_finanziamenti',
    titolo: 'Cash Flow da Finanziamenti',
    definizione: 'Flusso di cassa relativo a variazioni del debito finanziario e del patrimonio netto (nuovi prestiti, rimborsi, aumenti di capitale, distribuzione dividendi).',
    normativa: 'OIC 10. Include tutte le operazioni con i finanziatori (banche e soci).',
    interpretazione: 'Positivo se l\'azienda raccoglie nuovi finanziamenti; negativo se rimborsa debiti o distribuisce dividendi.',
    categoria: 'finanziario',
  },

  // ═══════════════════════════════════════════════════════
  // RICLASSIFICAZIONE
  // ═══════════════════════════════════════════════════════

  capitale_circolante_netto: {
    chiave: 'capitale_circolante_netto',
    titolo: 'CCN - Capitale Circolante Netto',
    definizione: 'Differenza tra attivo corrente (rimanenze + crediti + liquidità + ratei/risconti attivi) e passività correnti (debiti commerciali + ratei/risconti passivi).',
    formula: 'CCN = Attivo Corrente - Passività Correnti',
    interpretazione: 'CCN > 0 → l\'azienda ha risorse sufficienti per coprire i debiti a breve. CCN < 0 → tensione finanziaria, parte dell\'attivo fisso è finanziata a breve.',
    esempio: 'Attivo corrente €450.000 - Passivo corrente €300.000 = CCN €150.000.',
    categoria: 'bilancio',
  },

  margine_struttura: {
    chiave: 'margine_struttura',
    titolo: 'Margine di Struttura',
    definizione: 'Differenza tra fonti durevoli (PN + passività consolidate) e attivo fisso (immobilizzazioni nette). Verifica il rispetto della "regola aurea" della finanza.',
    formula: 'Margine = (PN + Passività Consolidate) - Attivo Fisso',
    interpretazione: '> 0 → le immobilizzazioni sono coperte da fonti a lungo termine (equilibrio). < 0 → squilibrio finanziario: parte dell\'attivo fisso è finanziata con debiti a breve.',
    categoria: 'bilancio',
  },
};

export function getDefinizione(chiave: string): Definizione | undefined {
  return DEFINIZIONI[chiave];
}

export function getDefinizioniPerCategoria(cat: Definizione['categoria']): Definizione[] {
  return Object.values(DEFINIZIONI).filter(d => d.categoria === cat);
}

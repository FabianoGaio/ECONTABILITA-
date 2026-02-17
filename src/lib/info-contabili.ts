/**
 * DATABASE DIDATTICO COMPLETO - Info Contabili
 * Contenuti universitari per ogni conto, voce di bilancio, indice e scrittura.
 * Ogni voce contiene: definizione, spiegazione, collocazione, scrittura tipica,
 * esempio reale, effetti su utile/cassa/indici, e collegamenti dinamici.
 */

export interface InfoContabile {
  id: string;
  codice_conto?: string;
  titolo: string;
  categoria: 'conto_attivo' | 'conto_passivo' | 'conto_pn' | 'conto_ricavo' | 'conto_costo' | 'voce_bilancio' | 'indice' | 'assestamento' | 'finanziario' | 'gestionale';
  definizione: string;
  spiegazione: string;
  collocazione_bilancio: string;
  scrittura_tipica: string;
  esempio_pratico: string;
  effetto_bilancio: string;
  effetto_utile: string;
  effetto_cassa: string;
  effetto_indici: string;
  formula?: string;
  normativa?: string;
  collegamenti: string[];
  tooltip: string;
}

export const INFO_CONTABILI: InfoContabile[] = [

  // ═══════════════════════════════════════════════════════════
  // CONTI ATTIVO - IMMOBILIZZAZIONI
  // ═══════════════════════════════════════════════════════════

  {
    id: 'brevetti',
    codice_conto: '1.1.01',
    titolo: 'Brevetti e Licenze',
    categoria: 'conto_attivo',
    definizione: 'Diritti di utilizzazione industriale acquisiti a titolo oneroso: brevetti, licenze software, diritti d\'autore. Sono beni immateriali a utilita\' pluriennale.',
    spiegazione: 'Quando un\'azienda acquista un brevetto o una licenza software, non lo registra come costo immediato ma come investimento. Il costo viene poi ripartito negli anni di vita utile tramite ammortamento.',
    collocazione_bilancio: 'Stato Patrimoniale ATTIVO, voce B.I.3 "Diritti di brevetto industriale e diritti di utilizzazione delle opere dell\'ingegno"',
    scrittura_tipica: 'Acquisto brevetto:\n  DARE: Brevetti e licenze     €50.000\n  AVERE: Debiti vs fornitori   €50.000\n\nAmmortamento annuo (vita utile 5 anni):\n  DARE: Amm.to immob. immat.   €10.000\n  AVERE: F.do amm.to immat.    €10.000',
    esempio_pratico: 'La Alfa S.r.l. acquista un brevetto industriale per €50.000 con vita utile stimata di 5 anni. Ogni anno ammortizza €10.000. Dopo 3 anni il valore netto contabile sara\' €20.000 (50.000 - 30.000 di fondo).',
    effetto_bilancio: 'Aumenta l\'attivo immobilizzato (B.I). Il fondo ammortamento riduce progressivamente il valore netto. A fine vita utile il valore residuo e\' zero.',
    effetto_utile: 'L\'acquisto NON impatta il conto economico. L\'ammortamento annuo genera un costo (B.10.a) che riduce EBITDA, EBIT e utile netto.',
    effetto_cassa: 'L\'acquisto genera un\'uscita di cassa immediata. L\'ammortamento e\' un costo figurativo che NON genera uscite di cassa (ecco perche\' nel rendiconto finanziario si somma all\'utile).',
    effetto_indici: 'Aumenta il denominatore del ROI (attivo totale). L\'ammortamento riduce ROS e ROI tramite riduzione dell\'EBIT. Riduce il current ratio se pagato per cassa.',
    normativa: 'Art. 2424 c.c., voce B.I.3; OIC 24 - Immobilizzazioni immateriali. Art. 2426 n.2 c.c.: ammortamento sistematico.',
    collegamenti: ['ammortamento_immateriali', 'fondo_ammortamento_immateriali', 'ebit', 'cash_flow_investimenti'],
    tooltip: 'Beni immateriali a utilita\' pluriennale: brevetti, licenze, diritti',
  },

  {
    id: 'avviamento',
    codice_conto: '1.1.02',
    titolo: 'Avviamento',
    categoria: 'conto_attivo',
    definizione: 'Differenza positiva tra il prezzo pagato per l\'acquisizione di un\'azienda e il fair value delle sue attivita\' nette. Rappresenta il "valore intangibile" dell\'impresa.',
    spiegazione: 'L\'avviamento si iscrive SOLO se acquisito a titolo oneroso (comprato), mai se generato internamente. Rappresenta la capacita\' dell\'azienda di generare redditi superiori alla norma (clientela, know-how, reputazione).',
    collocazione_bilancio: 'Stato Patrimoniale ATTIVO, voce B.I.5 "Avviamento". Va ammortizzato in max 10 anni (OIC) o sottoposto a impairment test (IFRS).',
    scrittura_tipica: 'Acquisto azienda con avviamento:\n  DARE: Attivita\' acquisite     €300.000\n  DARE: Avviamento             €100.000\n  AVERE: Debiti acquisiti      €150.000\n  AVERE: Banca c/c             €250.000',
    esempio_pratico: 'La Beta S.p.A. acquista la Gamma S.r.l. per €400.000. Le attivita\' nette della Gamma valgono €300.000. La differenza di €100.000 e\' avviamento, ammortizzato in 10 anni (€10.000/anno).',
    effetto_bilancio: 'Aumenta significativamente l\'attivo. Un avviamento elevato rispetto al totale attivo puo\' indicare rischio di svalutazione futura.',
    effetto_utile: 'L\'ammortamento dell\'avviamento riduce l\'utile. In caso di perdita durevole di valore, la svalutazione puo\' essere molto rilevante.',
    effetto_cassa: 'L\'acquisto genera uscita di cassa. L\'ammortamento no (costo figurativo).',
    effetto_indici: 'Aumenta attivo totale e quindi riduce ROI e ROA. Il leverage aumenta se l\'acquisto e\' finanziato a debito.',
    normativa: 'Art. 2426 n.6 c.c.; OIC 24. L\'avviamento generato internamente NON puo\' essere iscritto (art. 2426 n.6). Max ammortamento: 10 anni.',
    collegamenti: ['ammortamento_immateriali', 'leverage', 'roi'],
    tooltip: 'Differenza tra prezzo d\'acquisto di un\'azienda e il valore delle sue attivita\' nette',
  },

  {
    id: 'terreni_fabbricati',
    codice_conto: '1.2.01',
    titolo: 'Terreni e Fabbricati',
    categoria: 'conto_attivo',
    definizione: 'Beni immobili di proprieta\': terreni, fabbricati industriali, uffici, capannoni. I terreni non si ammortizzano; i fabbricati si\' (vita utile 25-33 anni).',
    spiegazione: 'Nella contabilita\' italiana il terreno va scorporato dal fabbricato perche\' non si ammortizza (non si deperisce). L\'OIC 16 prevede lo scorporo in base al valore di mercato o, in mancanza, il 20-30% del costo totale.',
    collocazione_bilancio: 'Stato Patrimoniale ATTIVO, voce B.II.1 "Terreni e fabbricati"',
    scrittura_tipica: 'Acquisto immobile €500.000 (terreno 20%, fabbricato 80%):\n  DARE: Terreni                €100.000\n  DARE: Fabbricati             €400.000\n  AVERE: Mutuo passivo         €350.000\n  AVERE: Banca c/c             €150.000',
    esempio_pratico: 'Capannone industriale acquistato a €500.000, scorporo terreno 20% = €100.000. Il fabbricato (€400.000) si ammortizza in 33 anni: quota annua €12.121. Il terreno resta a €100.000.',
    effetto_bilancio: 'Aumenta fortemente l\'attivo fisso. L\'immobile e\' tipicamente l\'investimento piu\' rilevante di una PMI.',
    effetto_utile: 'L\'ammortamento del fabbricato genera un costo annuo. Il terreno no. Costo medio: 3-4% del valore del fabbricato/anno.',
    effetto_cassa: 'Forte uscita di cassa all\'acquisto (o rate di mutuo nel tempo). L\'ammortamento non genera uscita.',
    effetto_indici: 'Aumenta il denominatore del ROI. Aumenta le immobilizzazioni → copertura immobilizzazioni deve restare >100%. Se finanziato con mutuo: leverage aumenta.',
    normativa: 'Art. 2424 c.c., B.II.1; OIC 16 - Immobilizzazioni materiali. Scorporo terreno obbligatorio.',
    collegamenti: ['ammortamento_materiali', 'mutui_passivi', 'copertura_immobilizzazioni', 'cash_flow_investimenti'],
    tooltip: 'Immobili di proprieta\': terreni (non ammortizzabili) e fabbricati',
  },

  {
    id: 'impianti_macchinari',
    codice_conto: '1.2.02',
    titolo: 'Impianti e Macchinari',
    categoria: 'conto_attivo',
    definizione: 'Beni strumentali utilizzati nel processo produttivo: impianti di produzione, macchinari, linee di assemblaggio. Iscritti al costo e ammortizzati sulla vita utile.',
    spiegazione: 'Rappresentano la "potenza produttiva" dell\'azienda. La scelta del piano di ammortamento (lineare, accelerato, per unita\' prodotte) influenza i risultati del conto economico. Le manutenzioni ordinarie sono costi; quelle straordinarie sono capitalizzabili.',
    collocazione_bilancio: 'Stato Patrimoniale ATTIVO, voce B.II.2 "Impianti e macchinario"',
    scrittura_tipica: 'Acquisto macchinario:\n  DARE: Impianti e macchinari  €80.000\n  AVERE: Debiti vs fornitori   €80.000\n\nAmmortamento 10% lineare:\n  DARE: Amm.to immob. mat.     €8.000\n  AVERE: F.do amm.to mat.      €8.000',
    esempio_pratico: 'Macchinario CNC acquistato a €80.000, vita utile 10 anni. Ammortamento lineare: €8.000/anno. Dopo 5 anni: valore lordo €80.000, fondo €40.000, valore netto €40.000.',
    effetto_bilancio: 'Aumenta l\'attivo fisso. Il valore netto contabile diminuisce ogni anno per l\'ammortamento. Alla fine della vita utile l\'asset ha valore contabile zero.',
    effetto_utile: 'L\'ammortamento (B.10.b) riduce EBIT e utile. E\' il costo "figurativo" dell\'usura del bene. L\'EBITDA ne e\' esente.',
    effetto_cassa: 'Uscita all\'acquisto; l\'ammortamento NON genera uscita. Per questo CF operativo = Utile + Ammortamenti.',
    effetto_indici: 'Aumenta attivo totale (riduce ROI/ROA). L\'ammortamento riduce ROS. La differenza EBITDA-EBIT rivela l\'intensita\' di capitale.',
    normativa: 'Art. 2424 c.c., B.II.2; OIC 16. Coefficienti fiscali: D.M. 31/12/1988.',
    collegamenti: ['ammortamento_materiali', 'fondo_ammortamento_materiali', 'ebitda', 'ebit', 'cash_flow_investimenti'],
    tooltip: 'Beni strumentali per la produzione: impianti, macchinari, linee produttive',
  },

  // ═══════════════════════════════════════════════════════════
  // CONTI ATTIVO - CIRCOLANTE
  // ═══════════════════════════════════════════════════════════

  {
    id: 'rimanenze_mp',
    codice_conto: '2.1.01',
    titolo: 'Materie Prime',
    categoria: 'conto_attivo',
    definizione: 'Scorte di materie prime non ancora utilizzate nel processo produttivo. Valutate al minore tra costo d\'acquisto e valore di realizzo desumibile dal mercato.',
    spiegazione: 'Le rimanenze di materie prime rappresentano un "magazzino di input". Il loro valore a fine anno si determina con l\'inventario fisico. La variazione tra rimanenze iniziali e finali impatta il conto economico.',
    collocazione_bilancio: 'Stato Patrimoniale ATTIVO, voce C.I.1 "Materie prime, sussidiarie e di consumo"',
    scrittura_tipica: 'Rilevazione rimanenze finali:\n  DARE: Materie prime (SP)     €15.000\n  AVERE: Variazione rim. MP (CE) €15.000\n\nRimanenze iniziali (anno successivo):\n  DARE: Variazione rim. MP (CE) €15.000\n  AVERE: Materie prime (SP)     €15.000',
    esempio_pratico: 'Al 31/12 l\'inventario rileva €15.000 di materie prime in magazzino. L\'anno precedente erano €12.000. La variazione positiva di €3.000 riduce i costi nel CE (meno materie consumate).',
    effetto_bilancio: 'Aumenta l\'attivo circolante (C.I). Rimanenze elevate possono indicare scorte obsolete o sovrastoccaggio.',
    effetto_utile: 'L\'aumento delle rimanenze RIDUCE i costi dell\'esercizio (meno consumato). La diminuzione li AUMENTA. Effetto diretto sull\'utile.',
    effetto_cassa: 'Le rimanenze rappresentano denaro "bloccato" in magazzino. Rimanenze alte → capitale circolante assorbito → meno liquidita\'.',
    effetto_indici: 'Aumenta current ratio. Rimanenze alte peggiorano rotazione magazzino. Allungano il ciclo monetario. Il quick ratio le esclude apposta.',
    normativa: 'Art. 2426 n.9-10 c.c.; OIC 13 - Rimanenze. Metodi ammessi: FIFO, costo medio ponderato, LIFO.',
    formula: 'Costo del venduto = Rim. iniziali + Acquisti - Rim. finali',
    collegamenti: ['rimanenze_pf', 'rotazione_magazzino', 'current_ratio', 'quick_ratio', 'ciclo_monetario'],
    tooltip: 'Scorte di materie prime in magazzino, valutate al minore tra costo e mercato',
  },

  {
    id: 'rimanenze_pf',
    codice_conto: '2.1.03',
    titolo: 'Prodotti Finiti',
    categoria: 'conto_attivo',
    definizione: 'Merci e prodotti finiti pronti per la vendita ma non ancora venduti. Valutati al costo di produzione (materie + lavoro + quote ammortamento) o al valore di realizzo se inferiore.',
    spiegazione: 'Rappresentano l\'output del processo produttivo non ancora venduto. La variazione delle rimanenze di prodotti finiti compare nel valore della produzione (A.2 del CE) e serve a "rettificare" i ricavi.',
    collocazione_bilancio: 'Stato Patrimoniale ATTIVO, voce C.I.4 "Prodotti finiti e merci"',
    scrittura_tipica: 'Rilevazione rimanenze finali PF:\n  DARE: Prodotti finiti (SP)    €25.000\n  AVERE: Variazione rim. PF (CE) €25.000',
    esempio_pratico: 'La societa\' ha prodotto merce per €250.000 e ne ha venduta per €225.000. I €25.000 rimanenti sono in magazzino come prodotti finiti. La variazione positiva aumenta il valore della produzione.',
    effetto_bilancio: 'Aumenta l\'attivo circolante. Un magazzino prodotti finiti troppo pieno puo\' indicare difficolta\' di vendita.',
    effetto_utile: 'L\'aumento di PF incrementa il valore della produzione (A.2), aumentando EBITDA/EBIT/utile. Attenzione: NON significa vendita reale!',
    effetto_cassa: 'Le rimanenze PF NON generano cassa. Sono "utili potenziali non realizzati". La cassa arriva solo con la vendita.',
    effetto_indici: 'Migliora current ratio. Peggiora rotazione magazzino. Un ROE alto con rimanenze in crescita e\' un segnale di allarme.',
    normativa: 'Art. 2426 n.9-10 c.c.; OIC 13. Il costo di produzione include costi diretti + quota ragionevole di costi indiretti.',
    collegamenti: ['rimanenze_mp', 'valore_produzione', 'rotazione_magazzino'],
    tooltip: 'Prodotti finiti in magazzino, pronti per la vendita',
  },

  {
    id: 'crediti_clienti',
    codice_conto: '2.2.01',
    titolo: 'Crediti verso Clienti',
    categoria: 'conto_attivo',
    definizione: 'Diritti dell\'impresa verso i clienti per beni venduti o servizi prestati non ancora incassati. Iscritti al valore nominale meno il fondo svalutazione crediti.',
    spiegazione: 'In Italia la vendita si registra alla fatturazione (principio di competenza), non all\'incasso. Quindi se fatturi €100.000 e incassi €70.000, hai €30.000 di crediti. I crediti inesigibili si coprono con il fondo svalutazione.',
    collocazione_bilancio: 'Stato Patrimoniale ATTIVO, voce C.II.1 "Crediti verso clienti", distinguendo entro/oltre 12 mesi',
    scrittura_tipica: 'Vendita con pagamento differito:\n  DARE: Crediti vs clienti     €50.000\n  AVERE: Ricavi vendite        €50.000\n\nIncasso:\n  DARE: Banca c/c              €50.000\n  AVERE: Crediti vs clienti    €50.000\n\nSvalutazione per rischio insolvenza:\n  DARE: Svalutazione crediti   €2.000\n  AVERE: F.do sval. crediti    €2.000',
    esempio_pratico: 'Vendita di €50.000 con pagamento a 60 giorni. Alla data di bilancio il cliente non ha ancora pagato: i €50.000 restano nei crediti. Se il cliente e\' in difficolta\', si accantona al fondo svalutazione.',
    effetto_bilancio: 'Aumenta l\'attivo circolante. Crediti elevati rispetto ai ricavi indicano tempi di incasso lunghi.',
    effetto_utile: 'La vendita genera ricavo nel CE (impatta utile) al momento della fattura, NON dell\'incasso. La svalutazione crediti riduce l\'utile.',
    effetto_cassa: 'I crediti NON sono cassa! Una vendita fatturata ma non incassata migliora il CE ma NON la cassa. E\' la differenza fondamentale tra utile e cash flow.',
    effetto_indici: 'Aumenta current ratio. Il DSO (giorni di incasso) misura quanto "pesano" i crediti. Un DSO alto allunga il ciclo monetario e riduce la liquidita\' reale.',
    normativa: 'Art. 2424 c.c., C.II.1; OIC 15 - Crediti. Art. 2426 n.8: valutazione al presumibile valore di realizzo.',
    formula: 'DSO = (Crediti vs clienti / Ricavi vendite) x 365',
    collegamenti: ['fondo_svalutazione_crediti', 'dso', 'current_ratio', 'cash_flow_operativo', 'ciclo_monetario'],
    tooltip: 'Importi dovuti dai clienti per vendite non ancora incassate',
  },

  {
    id: 'banca_cc',
    codice_conto: '2.3.02',
    titolo: 'Banca c/c',
    categoria: 'conto_attivo',
    definizione: 'Depositi bancari dell\'impresa immediatamente disponibili. Rappresenta la "cassa digitale" dell\'azienda.',
    spiegazione: 'E\' il conto piu\' movimentato della contabilita\': ogni incasso e ogni pagamento lo attraversa. Un saldo positivo indica liquidita\' disponibile; un saldo negativo (scoperto) indica fabbisogno di finanziamento.',
    collocazione_bilancio: 'Stato Patrimoniale ATTIVO, voce C.IV.1 "Depositi bancari e postali"',
    scrittura_tipica: 'Incasso da cliente:\n  DARE: Banca c/c              €30.000\n  AVERE: Crediti vs clienti    €30.000\n\nPagamento a fornitore:\n  DARE: Debiti vs fornitori    €20.000\n  AVERE: Banca c/c             €20.000',
    esempio_pratico: 'Saldo Banca c/c al 01/01: €50.000. Incassi dell\'anno: €500.000. Pagamenti: €480.000. Saldo al 31/12: €70.000. La variazione di +€20.000 e\' la "variazione netta di liquidita\'" del rendiconto finanziario.',
    effetto_bilancio: 'Fa parte delle disponibilita\' liquide (C.IV). E\' l\'indicatore piu\' immediato della salute finanziaria a brevissimo termine.',
    effetto_utile: 'Il saldo banca NON impatta direttamente il CE. L\'utile si forma per competenza, la banca per cassa. Aziende profittevoli possono avere banca in rosso!',
    effetto_cassa: 'E\' LA cassa per definizione. Tutti i flussi finanziari (operativi, investimenti, finanziamenti) si riflettono qui.',
    effetto_indici: 'Aumenta current ratio, quick ratio e cash ratio. Troppa liquidita\' puo\' indicare capitale non investito (costo-opportunita\').',
    normativa: 'Art. 2424 c.c., C.IV.1; OIC 14 - Disponibilita\' liquide.',
    collegamenti: ['cash_flow_operativo', 'cash_ratio', 'current_ratio'],
    tooltip: 'Depositi bancari disponibili: la liquidita\' immediata dell\'azienda',
  },

  {
    id: 'ratei_attivi',
    codice_conto: '2.4.01',
    titolo: 'Ratei Attivi',
    categoria: 'conto_attivo',
    definizione: 'Quote di ricavi di competenza dell\'esercizio in chiusura la cui manifestazione finanziaria (incasso) avverra\' nell\'esercizio successivo.',
    spiegazione: 'Il rateo attivo "anticipa" nel bilancio un ricavo non ancora incassato ne\' fatturato. Serve per rispettare il principio di competenza: se il ricavo e\' maturato economicamente, deve essere contabilizzato anche se l\'incasso e\' futuro.',
    collocazione_bilancio: 'Stato Patrimoniale ATTIVO, voce D "Ratei e risconti attivi"',
    scrittura_tipica: 'Interessi attivi maturati ma non incassati:\n  DARE: Ratei attivi           €3.000\n  AVERE: Proventi finanziari   €3.000',
    esempio_pratico: 'Titolo obbligazionario con cedola semestrale di €6.000 (01/07-30/06). Al 31/12 sono maturati 6 mesi di interessi: rateo attivo €3.000. L\'incasso avverra\' il 30/06 successivo.',
    effetto_bilancio: 'Aumenta l\'attivo (voce D). Importo tipicamente contenuto.',
    effetto_utile: 'Aumenta i ricavi del CE (proventi finanziari o altri ricavi), quindi aumenta l\'utile.',
    effetto_cassa: 'NON genera cassa nell\'esercizio. L\'incasso avverra\' nell\'anno successivo. E\' la differenza tipica utile vs cassa.',
    effetto_indici: 'Effetto marginale su current ratio (numeratore leggermente piu\' alto).',
    normativa: 'Art. 2424-bis c.c.; OIC 18 - Ratei e risconti.',
    collegamenti: ['ratei_passivi', 'risconti_attivi', 'competenza_economica'],
    tooltip: 'Ricavi maturati nell\'esercizio ma non ancora incassati',
  },

  {
    id: 'risconti_attivi',
    codice_conto: '2.4.02',
    titolo: 'Risconti Attivi',
    categoria: 'conto_attivo',
    definizione: 'Quote di costi gia\' sostenuti (pagati) nell\'esercizio in chiusura ma di competenza economica dell\'esercizio successivo. Rappresentano uno "storno" di costo.',
    spiegazione: 'Se pago un affitto annuo a luglio, al 31/12 meta\' dell\'affitto e\' di competenza del prossimo anno. Il risconto attivo "toglie" quella meta\' dai costi dell\'anno corrente e la rinvia al prossimo.',
    collocazione_bilancio: 'Stato Patrimoniale ATTIVO, voce D "Ratei e risconti attivi"',
    scrittura_tipica: 'Risconto su affitto pagato anticipatamente:\n  DARE: Risconti attivi        €6.000\n  AVERE: Affitti passivi       €6.000\n\n(Storna il costo di competenza futura)',
    esempio_pratico: 'Affitto annuo di €12.000 pagato il 01/07. Al 31/12: 6 mesi sono di competenza (lug-dic), 6 mesi sono futuri (gen-giu). Risconto attivo = €6.000. I costi dell\'anno scendono da €12.000 a €6.000.',
    effetto_bilancio: 'Aumenta l\'attivo. Riduce i costi nel CE dell\'anno corrente.',
    effetto_utile: 'AUMENTA l\'utile perche\' riduce i costi dell\'esercizio. Il costo "riscontato" gravera\' sull\'anno successivo.',
    effetto_cassa: 'Nessun effetto sulla cassa: il pagamento e\' gia\' avvenuto. Il risconto e\' solo una rettifica contabile.',
    effetto_indici: 'Lieve aumento del current ratio. Migliora ROS e ROI dell\'anno corrente (meno costi).',
    normativa: 'Art. 2424-bis c.c.; OIC 18. Formula: Importo x (giorni competenza futura / giorni totali).',
    formula: 'Risconto = Importo pagato x (giorni futuri / giorni totali del contratto)',
    collegamenti: ['ratei_attivi', 'risconti_passivi', 'ratei_passivi', 'affitti_passivi'],
    tooltip: 'Costi gia\' pagati ma di competenza dell\'esercizio successivo',
  },

  // ═══════════════════════════════════════════════════════════
  // CONTI PASSIVO - PATRIMONIO NETTO
  // ═══════════════════════════════════════════════════════════

  {
    id: 'capitale_sociale',
    codice_conto: '3.1.01',
    titolo: 'Capitale Sociale',
    categoria: 'conto_pn',
    definizione: 'Importo complessivo dei conferimenti dei soci al momento della costituzione e degli eventuali aumenti successivi. E\' il "fondamento" patrimoniale dell\'impresa.',
    spiegazione: 'Il capitale sociale e\' il primo "mattone" dell\'impresa. Per le S.r.l. il minimo e\' €1 (semplificata) o €10.000; per le S.p.A. €50.000. Rappresenta la garanzia minima per i creditori.',
    collocazione_bilancio: 'Stato Patrimoniale PASSIVO, voce A.I "Capitale"',
    scrittura_tipica: 'Conferimento capitale in denaro:\n  DARE: Banca c/c              €100.000\n  AVERE: Capitale sociale      €100.000',
    esempio_pratico: 'Tre soci costituiscono una S.r.l. con €100.000 di capitale (€33.333 ciascuno). L\'importo e\' versato su c/c bancario.',
    effetto_bilancio: 'Aumenta il PN (fonte durevole). Bilancia con un aumento dell\'attivo (banca o altri conferimenti).',
    effetto_utile: 'NON impatta il CE. Il conferimento non e\' un ricavo.',
    effetto_cassa: 'Genera un\'entrata di cassa (il versamento dei soci).',
    effetto_indici: 'Migliora autonomia finanziaria (PN/Attivo). Riduce leverage. Aumenta la copertura delle immobilizzazioni.',
    normativa: 'Artt. 2327, 2463 c.c.; OIC 28 - Patrimonio netto. Capitale minimo S.p.A.: €50.000.',
    collegamenti: ['patrimonio_netto', 'autonomia_finanziaria', 'leverage', 'roe'],
    tooltip: 'Importo conferito dai soci: il fondamento patrimoniale dell\'impresa',
  },

  // ═══════════════════════════════════════════════════════════
  // CONTI PASSIVO - DEBITI E FONDI
  // ═══════════════════════════════════════════════════════════

  {
    id: 'tfr_conto',
    codice_conto: '3.3.01',
    titolo: 'TFR - Trattamento Fine Rapporto',
    categoria: 'conto_passivo',
    definizione: 'Debito dell\'impresa verso i dipendenti, pari alla retribuzione annua divisa per 13,5, rivalutato annualmente. Si eroga alla cessazione del rapporto.',
    spiegazione: 'Il TFR e\' un debito "certo" (si paghera\' quando il dipendente lascia l\'azienda) ma a scadenza incerta. Per l\'azienda e\' una fonte di finanziamento gratuita fino all\'erogazione. Dal 2007 il TFR maturando puo\' andare a fondi pensione.',
    collocazione_bilancio: 'Stato Patrimoniale PASSIVO, voce C "Trattamento di fine rapporto di lavoro subordinato"',
    scrittura_tipica: 'Accantonamento TFR annuo:\n  DARE: Accantonamento TFR     €15.000\n  AVERE: Fondo TFR             €15.000\n\nErogazione alla cessazione:\n  DARE: Fondo TFR              €45.000\n  AVERE: Banca c/c             €45.000',
    esempio_pratico: 'Dipendente con RAL €35.000. TFR annuo = €35.000 / 13,5 = €2.593. Dopo 10 anni di servizio (con rivalutazioni): fondo TFR circa €28.000.',
    effetto_bilancio: 'Aumenta il passivo (voce C). Il fondo cresce ogni anno con l\'accantonamento e le rivalutazioni.',
    effetto_utile: 'L\'accantonamento TFR e\' un costo del personale (B.9.c) che riduce l\'utile.',
    effetto_cassa: 'L\'accantonamento NON genera uscita di cassa (e\' un debito futuro). L\'erogazione SI\'. Per questo il TFR e\' una forma di autofinanziamento.',
    effetto_indici: 'Aumenta le passivita\' consolidate (M/L termine). Migliora la copertura delle immobilizzazioni. Peggiora leggermente il leverage.',
    normativa: 'Art. 2120 c.c.; OIC 31. Formula: RAL/13,5 - contributo INPS 0,50%. Rivalutazione: 1,5% + 75% dell\'inflazione.',
    formula: 'TFR annuo = RAL / 13,5 - 0,50% contributo INPS',
    collegamenti: ['costi_personale', 'cash_flow_operativo', 'passivita_consolidate'],
    tooltip: 'Debito verso dipendenti maturato annualmente, fonte di autofinanziamento',
  },

  {
    id: 'mutui_passivi',
    codice_conto: '3.4.01',
    titolo: 'Mutui Passivi',
    categoria: 'conto_passivo',
    definizione: 'Finanziamenti bancari a medio-lungo termine (tipicamente 5-20 anni) garantiti da ipoteca o fideiussione. Comprendono una quota capitale e una quota interessi.',
    spiegazione: 'Il mutuo e\' la forma di finanziamento piu\' comune per investimenti in immobilizzazioni. La rata include: quota capitale (che riduce il debito) e quota interessi (che e\' un costo). In bilancio si distingue la parte entro 12 mesi da quella oltre.',
    collocazione_bilancio: 'Stato Patrimoniale PASSIVO, voce D.4 "Debiti verso banche". Distinguere quota entro/oltre 12 mesi.',
    scrittura_tipica: 'Erogazione mutuo:\n  DARE: Banca c/c              €200.000\n  AVERE: Mutui passivi         €200.000\n\nPagamento rata (capitale €1.500 + interessi €500):\n  DARE: Mutui passivi          €1.500\n  DARE: Interessi passivi      €500\n  AVERE: Banca c/c             €2.000',
    esempio_pratico: 'Mutuo di €200.000 a 10 anni, tasso 3%. Rata mensile circa €1.931. Il primo anno: interessi ~€5.800, capitale ~€17.400. Il debito residuo a fine anno: €182.600.',
    effetto_bilancio: 'All\'erogazione: +attivo (banca) e +passivo (mutuo). Ad ogni rata: -passivo (quota capitale) e -attivo (banca).',
    effetto_utile: 'Solo gli interessi impattano il CE (oneri finanziari, C.17). La quota capitale NON e\' un costo.',
    effetto_cassa: 'L\'erogazione e\' un\'entrata. Le rate sono uscite. Nel rendiconto: la quota capitale va nei flussi da finanziamento, gli interessi nell\'operativo.',
    effetto_indici: 'Aumenta il leverage. Se ROI > tasso del mutuo → la leva finanziaria e\' positiva (crea valore). Se ROI < tasso → distrugge valore.',
    normativa: 'Art. 2424 c.c., D.4; OIC 19 - Debiti. Obbligo di indicare le scadenze in Nota Integrativa.',
    collegamenti: ['interessi_passivi', 'leverage', 'roi', 'cash_flow_finanziamenti', 'copertura_immobilizzazioni'],
    tooltip: 'Finanziamenti bancari a medio-lungo termine per investimenti',
  },

  {
    id: 'debiti_fornitori',
    codice_conto: '3.5.01',
    titolo: 'Debiti verso Fornitori',
    categoria: 'conto_passivo',
    definizione: 'Importi dovuti ai fornitori per beni/servizi acquistati e non ancora pagati. Rappresentano una fonte di finanziamento "spontanea" e tipicamente gratuita.',
    spiegazione: 'La dilazione di pagamento ai fornitori (30-60-90 giorni) e\' una forma di finanziamento del capitale circolante a costo zero. Gestire bene il DPO (giorni medi di pagamento) e\' cruciale per la liquidita\'.',
    collocazione_bilancio: 'Stato Patrimoniale PASSIVO, voce D.7 "Debiti verso fornitori"',
    scrittura_tipica: 'Acquisto a credito:\n  DARE: Acquisto materie prime €20.000\n  AVERE: Debiti vs fornitori   €20.000\n\nPagamento:\n  DARE: Debiti vs fornitori    €20.000\n  AVERE: Banca c/c             €20.000',
    esempio_pratico: 'Acquisti annui €400.000, DPO medio 60 giorni. Debiti medi = €400.000 x 60/365 = €65.753. Questi €65.753 "finanziano" gratuitamente il capitale circolante.',
    effetto_bilancio: 'Aumenta il passivo corrente. E\' una delle voci piu\' rilevanti tra le passivita\' a breve.',
    effetto_utile: 'L\'acquisto crea un costo nel CE; il debito e\' solo la "modalita\' di pagamento". NON impatta l\'utile di per se\'.',
    effetto_cassa: 'Il debito vs fornitore RITARDA l\'uscita di cassa. Un DPO alto migliora il cash flow operativo perche\' si paga piu\' tardi.',
    effetto_indici: 'Aumenta passivita\' correnti → peggiora current ratio. Migliora pero\' il ciclo monetario (DPO alto = meno giorni da finanziare).',
    normativa: 'Art. 2424 c.c., D.7; OIC 19.',
    formula: 'DPO = (Debiti vs fornitori / Acquisti) x 365',
    collegamenti: ['dpo', 'current_ratio', 'ciclo_monetario', 'cash_flow_operativo'],
    tooltip: 'Debiti commerciali: fonte di finanziamento spontanea e gratuita',
  },

  {
    id: 'fondi_rischi',
    codice_conto: '3.2.03',
    titolo: 'Fondi per Rischi e Oneri',
    categoria: 'conto_passivo',
    definizione: 'Accantonamenti per coprire perdite o debiti futuri la cui esistenza e\' certa o probabile, ma il cui ammontare o scadenza e\' indeterminato al momento.',
    spiegazione: 'Il principio di prudenza impone di "anticipare" i costi probabili. Se una causa legale rischia di costare €50.000, l\'azienda accantona oggi anche se il pagamento sara\' futuro. Si accantona SOLO se il rischio e\' probabile (>50%).',
    collocazione_bilancio: 'Stato Patrimoniale PASSIVO, voce B "Fondi per rischi e oneri": B.1 quiescenza, B.2 imposte, B.3 altri',
    scrittura_tipica: 'Accantonamento fondo rischi:\n  DARE: Accantonamento fondi rischi (CE)  €30.000\n  AVERE: Fondo rischi cause legali (SP)   €30.000\n\nUtilizzo fondo (perdita effettiva):\n  DARE: Fondo rischi cause legali        €30.000\n  AVERE: Banca c/c                       €30.000',
    esempio_pratico: 'Causa legale in corso: il legale stima una perdita probabile di €30.000. Si accantona. Se la causa si chiude a €25.000, i €5.000 in eccesso si rilasciano a proventi.',
    effetto_bilancio: 'Aumenta il passivo. L\'accantonamento e\' un costo nel CE (B.12 o B.13). L\'utilizzo riduce il fondo e la cassa.',
    effetto_utile: 'L\'accantonamento riduce l\'utile dell\'esercizio. Se la perdita effettiva e\' minore dell\'accantonamento, l\'eccedenza migliora l\'utile futuro.',
    effetto_cassa: 'L\'accantonamento NON genera uscita di cassa (e\' un debito stimato). L\'esborso effettivo avverra\' quando la perdita si concretizza.',
    effetto_indici: 'Riduce utile → peggiora ROE. I fondi aumentano le passivita\' consolidate → effetto su leverage e copertura immobilizzazioni.',
    normativa: 'Art. 2424 c.c., B; OIC 31. Si accantona se: rischio probabile, importo stimabile ragionevolmente.',
    collegamenti: ['accantonamento', 'utile_netto', 'cash_flow_operativo'],
    tooltip: 'Accantonamenti per perdite o debiti futuri probabili ma incerti nell\'ammontare',
  },

  {
    id: 'ratei_passivi',
    codice_conto: '3.6.01',
    titolo: 'Ratei Passivi',
    categoria: 'conto_passivo',
    definizione: 'Quote di costi di competenza dell\'esercizio in chiusura la cui manifestazione finanziaria (pagamento) avverra\' nell\'esercizio successivo.',
    spiegazione: 'Il rateo passivo "anticipa" un costo non ancora pagato. E\' lo specchio del rateo attivo: se per l\'azienda che riceve il pagamento e\' un rateo attivo, per l\'azienda che deve pagare e\' un rateo passivo.',
    collocazione_bilancio: 'Stato Patrimoniale PASSIVO, voce E "Ratei e risconti passivi"',
    scrittura_tipica: 'Interessi su mutuo maturati ma non ancora pagati:\n  DARE: Interessi passivi bancari  €1.500\n  AVERE: Ratei passivi             €1.500',
    esempio_pratico: 'Mutuo con rata semestrale di interessi il 31/03. Al 31/12 sono maturati 9 mesi di interessi (apr-dic). Se gli interessi semestrali sono €3.000, il rateo passivo al 31/12 e\' €4.500 (9/12 dell\'anno).',
    effetto_bilancio: 'Aumenta il passivo (voce E). Corrispondentemente aumenta un costo nel CE.',
    effetto_utile: 'RIDUCE l\'utile perche\' aggiunge un costo di competenza non ancora pagato.',
    effetto_cassa: 'NON genera uscita di cassa nell\'esercizio. Il pagamento avverra\' nell\'anno successivo.',
    effetto_indici: 'Lieve peggioramento current ratio (passivo corrente piu\' alto).',
    normativa: 'Art. 2424-bis c.c.; OIC 18.',
    collegamenti: ['ratei_attivi', 'risconti_passivi', 'interessi_passivi'],
    tooltip: 'Costi maturati nell\'esercizio ma non ancora pagati',
  },

  // ═══════════════════════════════════════════════════════════
  // CONTI CONTO ECONOMICO
  // ═══════════════════════════════════════════════════════════

  {
    id: 'ricavi_vendite',
    codice_conto: '4.1.01',
    titolo: 'Ricavi delle Vendite',
    categoria: 'conto_ricavo',
    definizione: 'Corrispettivi delle cessioni di beni e prestazioni di servizi caratteristici dell\'impresa, al netto di resi, sconti e abbuoni.',
    spiegazione: 'I ricavi sono la "linea della vita" dell\'azienda. Si rilevano per competenza (alla fatturazione), non per cassa (all\'incasso). Un\'azienda puo\' avere ricavi in crescita e cassa in diminuzione se i clienti pagano in ritardo.',
    collocazione_bilancio: 'Conto Economico, voce A.1 "Ricavi delle vendite e delle prestazioni"',
    scrittura_tipica: 'Vendita merce:\n  DARE: Crediti vs clienti     €50.000\n  AVERE: Ricavi vendite        €50.000',
    esempio_pratico: 'Azienda con ricavi annui di €1.000.000. Se il 70% e\' incassato entro l\'anno e il 30% e\' ancora nei crediti, la cassa ha ricevuto solo €700.000.',
    effetto_bilancio: 'Aumenta il CE alla voce A.1. Se non incassati, si riflettono nei crediti dell\'attivo.',
    effetto_utile: 'E\' il driver principale dell\'utile. Ricavi - Costi = Utile. Ogni euro di ricavo aggiuntivo migliora potenzialmente l\'utile.',
    effetto_cassa: 'Solo se incassati. I ricavi fatturati ma non incassati non generano cassa.',
    effetto_indici: 'Denominatore del ROS. Numeratore implicito del ROI. La crescita dei ricavi e\' il segnale principale di sviluppo.',
    normativa: 'Art. 2425 c.c., A.1; OIC 12. Riconoscimento: processo produttivo completato e scambio avvenuto.',
    collegamenti: ['crediti_clienti', 'ros', 'dso', 'valore_produzione', 'ebitda'],
    tooltip: 'Fatturato caratteristico: vendite di beni e prestazioni di servizi',
  },

  {
    id: 'ammortamento_materiali',
    codice_conto: '5.5.02',
    titolo: 'Ammortamento Immobilizzazioni Materiali',
    categoria: 'conto_costo',
    definizione: 'Quota annua di deperimento economico dei beni materiali a utilita\' pluriennale (impianti, macchinari, attrezzature, automezzi).',
    spiegazione: 'L\'ammortamento "spalma" il costo di un investimento lungo la sua vita utile. NON e\' un\'uscita di cassa ma un costo figurativo. Per questo l\'EBITDA (che lo esclude) e\' spesso preferito al\'EBIT per misurare la redditivita\' operativa.',
    collocazione_bilancio: 'Conto Economico, voce B.10.b "Ammortamento delle immobilizzazioni materiali"',
    scrittura_tipica: 'Ammortamento annuo macchinario:\n  DARE: Amm.to immob. materiali  €8.000\n  AVERE: F.do amm.to materiali   €8.000\n\n(Il fondo e\' in AVERE perche\' rettifica l\'attivo)',
    esempio_pratico: 'Macchinario da €80.000, vita utile 10 anni, aliquota 10%. Quota annua: €8.000. Impatto: riduce EBIT di €8.000 ma NON la cassa. CF operativo = Utile + €8.000.',
    effetto_bilancio: 'Crea un costo nel CE (B.10.b) e un fondo nello SP (rettifica dell\'attivo). Il valore netto dell\'immobilizzazione diminuisce.',
    effetto_utile: 'RIDUCE EBIT e utile netto. E\' la differenza tra EBITDA ed EBIT. Settori capital-intensive hanno ammortamenti elevati.',
    effetto_cassa: 'NON genera uscita di cassa! Ecco perche\' nel CF operativo si somma all\'utile. E\' il "costo fantasma" della contabilita\'.',
    effetto_indici: 'Riduce ROS e ROI (via EBIT). NON impatta EBITDA margin. Differenza EBITDA-EBIT = intensita\' di capitale.',
    normativa: 'Art. 2426 n.2 c.c.; OIC 16. Piano sistematico. Coefficienti fiscali: D.M. 31/12/1988.',
    formula: 'Quota ammortamento = Costo storico / Vita utile (metodo lineare)',
    collegamenti: ['impianti_macchinari', 'fondo_ammortamento_materiali', 'ebitda', 'ebit', 'cash_flow_operativo'],
    tooltip: 'Costo figurativo annuo dell\'usura dei beni strumentali - NON genera uscita di cassa',
  },

  {
    id: 'interessi_passivi',
    codice_conto: '5.6.01',
    titolo: 'Interessi Passivi',
    categoria: 'conto_costo',
    definizione: 'Oneri finanziari sostenuti per l\'utilizzo di capitali di terzi: interessi su mutui, su scoperti di c/c, su finanziamenti.',
    spiegazione: 'Gli interessi sono il "prezzo" del debito. Rappresentano il costo della leva finanziaria. Se il ROI dell\'azienda e\' superiore al tasso di interesse, indebitarsi crea valore (leva positiva). Se inferiore, distrugge valore.',
    collocazione_bilancio: 'Conto Economico, voce C.17 "Interessi e altri oneri finanziari"',
    scrittura_tipica: 'Interessi su mutuo:\n  DARE: Interessi passivi su mutui  €5.000\n  AVERE: Banca c/c                  €5.000',
    esempio_pratico: 'Mutuo di €200.000 al 3%: interessi annui circa €6.000 il primo anno (decrescenti). Su scoperto bancario: tasso 7-10%, costo piu\' elevato.',
    effetto_bilancio: 'Costo nella gestione finanziaria (C.17). Riduce il risultato da utile ante imposte a utile netto.',
    effetto_utile: 'Riduce l\'utile ante imposte e l\'utile netto. NON impatta EBITDA ne\' EBIT (sono "sopra la linea").',
    effetto_cassa: 'Generano un\'uscita di cassa diretta (pagamento alla banca).',
    effetto_indici: 'La differenza EBIT - utile ante imposte rivela il peso della gestione finanziaria. Se ROI > tasso debito → leva positiva → ROE > ROI.',
    normativa: 'Art. 2425 c.c., C.17; OIC 12.',
    formula: 'Costo del debito = Interessi passivi / Debiti finanziari medi x 100',
    collegamenti: ['mutui_passivi', 'leverage', 'roi', 'roe', 'ebit', 'utile_netto'],
    tooltip: 'Il prezzo del debito: oneri finanziari per l\'uso di capitali di terzi',
  },

  // ═══════════════════════════════════════════════════════════
  // VOCI DI BILANCIO AGGREGATE
  // ═══════════════════════════════════════════════════════════

  {
    id: 'ebitda_voce',
    titolo: 'EBITDA - Margine Operativo Lordo',
    categoria: 'voce_bilancio',
    definizione: 'Earnings Before Interest, Taxes, Depreciation and Amortization. Misura la redditivita\' operativa "pura", escludendo ammortamenti, gestione finanziaria e imposte.',
    spiegazione: 'L\'EBITDA e\' l\'indicatore piu\' usato nella prassi aziendale perche\' elimina gli effetti delle scelte contabili (piani di ammortamento diversi) e della struttura finanziaria (debito vs equity). E\' anche un proxy del cash flow operativo.',
    collocazione_bilancio: 'NON ha una voce autonoma nel bilancio civilistico. Si calcola: Valore produzione - Costi operativi + Ammortamenti.',
    scrittura_tipica: 'Non ha una scrittura propria. E\' un aggregato calcolato:\n  EBITDA = A) Valore produzione - B) Costi produzione + Ammortamenti\n  Oppure: EBIT + Ammortamenti',
    esempio_pratico: 'Ricavi €1.000.000, costi operativi €700.000, ammortamenti €50.000.\nEBITDA = 1.000.000 - 700.000 + 50.000 = €350.000 (EBITDA margin: 35%)\nEBIT = 350.000 - 50.000 = €300.000',
    effetto_bilancio: 'Non e\' una voce di bilancio ma un margine intermedio. E\' il ponte tra ricavi e risultato operativo.',
    effetto_utile: 'L\'EBITDA e\' SEMPRE >= EBIT. La differenza sono gli ammortamenti. Un EBITDA positivo con EBIT negativo indica che gli ammortamenti "mangiano" tutto il margine.',
    effetto_cassa: 'L\'EBITDA e\' il migliore proxy del cash flow operativo. Per passare da EBITDA a CF operativo: +/- variazioni capitale circolante.',
    effetto_indici: 'EBITDA margin = EBITDA/Ricavi. Usato per comparare aziende (EV/EBITDA). Settore industriale: 15-20%; software: 30-40%; retail: 5-10%.',
    formula: 'EBITDA = Ricavi - Costi operativi (esclusi ammortamenti)\nEBITDA margin = EBITDA / Ricavi x 100',
    normativa: 'Non codificato civilisticamente. Standard de facto nell\'analisi finanziaria e nelle valutazioni (EV/EBITDA).',
    collegamenti: ['ebit_voce', 'valore_produzione', 'ammortamento_materiali', 'cash_flow_operativo', 'ros'],
    tooltip: 'Margine operativo lordo: redditivita\' del core business prima di ammortamenti e finanza',
  },

  {
    id: 'ebit_voce',
    titolo: 'EBIT - Risultato Operativo',
    categoria: 'voce_bilancio',
    definizione: 'Differenza tra valore e costi della produzione. E\' il risultato della gestione "caratteristica", prima della gestione finanziaria e fiscale.',
    spiegazione: 'L\'EBIT risponde alla domanda: "il business in se\' genera reddito?". Esclude la struttura finanziaria (interessi) e la politica fiscale. Un EBIT negativo = il modello di business non funziona.',
    collocazione_bilancio: 'Conto Economico: corrisponde a "Differenza tra valore e costi della produzione (A-B)"',
    scrittura_tipica: 'Non ha scrittura propria. E\' un margine calcolato:\n  EBIT = A) Valore produzione - B) Costi produzione\n  Oppure: EBITDA - Ammortamenti',
    esempio_pratico: 'EBITDA €350.000 - Ammortamenti €50.000 = EBIT €300.000.\nQuesto significa che il core business genera €300.000 di reddito, prima di pagare gli interessi al banche e le tasse allo Stato.',
    effetto_bilancio: 'Margine intermedio nel CE. E\' la base per il calcolo del ROI.',
    effetto_utile: 'L\'EBIT e\' il "gradino" sopra l\'utile ante imposte. Da EBIT si sottragono interessi e si aggiungono proventi finanziari.',
    effetto_cassa: 'EBIT ≠ cassa perche\' include ammortamenti (non-cash) e variazioni di circolante.',
    effetto_indici: 'ROI = EBIT / Attivo totale. ROS = EBIT / Ricavi. E\' il numeratore di due indici fondamentali.',
    formula: 'EBIT = Valore Produzione - Costi Produzione\nROI = EBIT / Totale Attivo x 100',
    collegamenti: ['ebitda_voce', 'roi', 'ros', 'utile_netto_voce', 'ammortamento_materiali'],
    tooltip: 'Risultato operativo: il core business genera valore?',
  },

  {
    id: 'ccn_voce',
    titolo: 'Capitale Circolante Netto (CCN)',
    categoria: 'voce_bilancio',
    definizione: 'Differenza tra attivita\' correnti (rimanenze + crediti + liquidita\') e passivita\' correnti (debiti commerciali + ratei/risconti passivi). Misura l\'equilibrio finanziario a breve.',
    spiegazione: 'Il CCN e\' il "cuscinetto" di sicurezza finanziaria. Se positivo, l\'azienda ha risorse sufficienti per coprire i debiti a breve. Se negativo, indica tensione di liquidita\': parte dell\'attivo fisso e\' finanziata con debiti a breve (squilibrio).',
    collocazione_bilancio: 'Non e\' una voce autonoma ma un aggregato: Attivo Circolante (C) + Ratei/Risconti attivi (D) - Debiti entro 12 mesi (D) - Ratei/Risconti passivi (E)',
    scrittura_tipica: 'Non ha scrittura propria. La sua variazione nel tempo e\' fondamentale:\n  CCN in aumento → assorbe liquidita\' (attenzione al cash flow)\n  CCN in diminuzione → libera liquidita\'',
    esempio_pratico: 'Attivo corrente €450.000 (crediti €200.000, rimanenze €150.000, liquidita\' €100.000) - Passivo corrente €300.000 (debiti fornitori €250.000, altri €50.000) = CCN €150.000.',
    effetto_bilancio: 'E\' un aggregato riclassificato. Non esiste nel bilancio civilistico ma e\' fondamentale per l\'analisi.',
    effetto_utile: 'Il CCN non impatta direttamente l\'utile. Pero\' un CCN in forte crescita (es. crediti che crescono piu\' dei debiti) segnala possibili problemi di incasso.',
    effetto_cassa: 'La VARIAZIONE del CCN e\' cruciale: aumento CCN = assorbimento di cassa (piu\' crediti, piu\' rimanenze). Diminuzione CCN = liberazione di cassa.',
    effetto_indici: 'Current ratio = Att. corrente / Pass. corrente. Se CCN > 0 → current ratio > 1. Il ciclo monetario misura la "velocita\'" del CCN.',
    formula: 'CCN = Attivo Corrente - Passivita\' Correnti\nVariazione CCN impatta cash flow operativo',
    normativa: 'Non codificato. Strumento universale dell\'analisi finanziaria.',
    collegamenti: ['current_ratio', 'quick_ratio', 'ciclo_monetario', 'cash_flow_operativo', 'crediti_clienti', 'debiti_fornitori'],
    tooltip: 'Equilibrio finanziario a breve: attivita\' correnti meno passivita\' correnti',
  },

  {
    id: 'rendiconto_voce',
    titolo: 'Rendiconto Finanziario',
    categoria: 'finanziario',
    definizione: 'Prospetto che spiega come e\' variata la liquidita\' dell\'azienda nell\'esercizio, distinguendo tre aree: operativa, investimenti, finanziamenti.',
    spiegazione: 'Il rendiconto finanziario risponde alla domanda: "dove sono finiti i soldi?". Un\'azienda puo\' essere profittevole ma avere cassa negativa (e fallire). Il RF spiega questa differenza tra utile e cassa.',
    collocazione_bilancio: 'Prospetto autonomo del bilancio (obbligatorio in forma ordinaria dal D.Lgs. 139/2015, art. 2425-ter c.c.)',
    scrittura_tipica: 'Non ha scritture proprie. Si costruisce dal CE e dalla variazione delle voci di SP:\n  Metodo indiretto:\n  Utile + Ammortamenti +/- Var. crediti +/- Var. rimanenze +/- Var. debiti = CF Operativo',
    esempio_pratico: 'Utile €100.000 + Ammortamenti €30.000 - Aumento crediti €20.000 - Aumento rimanenze €10.000 + Aumento debiti forn. €15.000 = CF Operativo €115.000.\nLa differenza tra utile (€100.000) e CF operativo (€115.000) e\' spiegata dalla variazione del circolante.',
    effetto_bilancio: 'Spiega la variazione della voce C.IV (disponibilita\' liquide) dello SP tra inizio e fine anno.',
    effetto_utile: 'Il RF non impatta l\'utile; lo SPIEGA in termini di cassa. Un utile alto con CF operativo negativo e\' un allarme rosso.',
    effetto_cassa: 'E\' IL prospetto della cassa per definizione. CF Operativo + CF Investimenti + CF Finanziamenti = Variazione liquidita\'.',
    effetto_indici: 'Il rapporto CF operativo / Utile misura la "qualita\'" dell\'utile. Un rapporto > 1 indica utili "veri" (convertiti in cassa).',
    normativa: 'Art. 2425-ter c.c.; OIC 10. Obbligatorio per bilanci in forma ordinaria.',
    collegamenti: ['cash_flow_operativo', 'cash_flow_investimenti', 'cash_flow_finanziamenti', 'ebitda_voce', 'ccn_voce'],
    tooltip: 'Dove sono finiti i soldi? Il ponte tra utile contabile e variazione di cassa',
  },

  // ═══════════════════════════════════════════════════════════
  // INDICI
  // ═══════════════════════════════════════════════════════════

  {
    id: 'indice_roe',
    titolo: 'ROE - Return on Equity',
    categoria: 'indice',
    definizione: 'Rendimento del capitale proprio. Misura quanto utile genera ogni euro investito dai soci.',
    spiegazione: 'Il ROE e\' L\'INDICE per i soci. Se il ROE e\' 12%, significa che €100 investiti generano €12 di utile. Va confrontato con il rendimento di investimenti alternativi (es. BTP). Si scompone con la formula DuPont: ROE = ROS x Rotazione x Leverage.',
    collocazione_bilancio: 'Si calcola da CE (utile netto) e SP (patrimonio netto)',
    scrittura_tipica: 'Non ha scrittura. E\' un rapporto:\n  ROE = Utile Netto / Patrimonio Netto x 100\n  \n  Scomposizione DuPont:\n  ROE = (Utile/Ricavi) x (Ricavi/Attivo) x (Attivo/PN)\n      = ROS x Rotazione x Leverage',
    esempio_pratico: 'Utile €50.000, PN €400.000 → ROE = 12,5%. Se il BTP rende il 4%, il premio per il rischio aziendale e\' 8,5%. Decisamente attraente per l\'investitore.',
    effetto_bilancio: 'Non e\' una voce di bilancio ma un indicatore sintetico della performance complessiva.',
    effetto_utile: 'Il ROE DIPENDE dall\'utile (numeratore). Ogni miglioramento dell\'utile migliora il ROE.',
    effetto_cassa: 'Il ROE usa l\'utile contabile, non il cash flow. Un ROE alto con CF operativo negativo e\' un "ROE di carta".',
    effetto_indici: 'Il ROE e\' influenzato dalla leva finanziaria. Piu\' debito → piu\' leverage → piu\' ROE (se ROI > costo debito). Ma anche piu\' rischio!',
    formula: 'ROE = Utile Netto / PN x 100\nDuPont: ROE = ROS x (Ricavi/Attivo) x (Attivo/PN)',
    normativa: 'Standard universale dell\'analisi fondamentale. Non codificato per legge.',
    collegamenti: ['roi', 'ros', 'leverage', 'utile_netto_voce', 'capitale_sociale'],
    tooltip: 'Rendimento per i soci: quanto utile genera ogni euro di capitale proprio',
  },

  {
    id: 'indice_roi',
    titolo: 'ROI - Return on Investment',
    categoria: 'indice',
    definizione: 'Rendimento del capitale investito totale. Misura l\'efficienza operativa indipendentemente da come e\' finanziata l\'azienda.',
    spiegazione: 'Il ROI risponde alla domanda: "le risorse investite generano reddito sufficiente?". E\' l\'indice chiave per decidere se indebitarsi: se ROI > costo del debito, conviene usare la leva finanziaria.',
    collocazione_bilancio: 'Si calcola da CE (EBIT) e SP (totale attivo)',
    scrittura_tipica: 'Non ha scrittura. E\' un rapporto:\n  ROI = EBIT / Totale Attivo x 100\n  \n  Scomposizione:\n  ROI = ROS x Rotazione del capitale investito\n      = (EBIT/Ricavi) x (Ricavi/Attivo)',
    esempio_pratico: 'EBIT €80.000, Attivo €800.000 → ROI = 10%. Se il tasso medio del debito e\' 4%, lo spread e\' +6% → la leva finanziaria crea valore → conviene indebitarsi.',
    effetto_bilancio: 'Collega CE (EBIT) e SP (Attivo). E\' il ponte tra redditivita\' e struttura patrimoniale.',
    effetto_utile: 'ROI dipende dall\'EBIT. Migliorare il ROI = aumentare EBIT (efficienza operativa) o ridurre attivo (efficienza patrimoniale).',
    effetto_cassa: 'Il ROI usa l\'EBIT, non il cash flow. Per la "redditivita\' di cassa" si usa ROIC o CF/Attivo.',
    effetto_indici: 'Se ROI > costo debito → ROE > ROI (leva positiva). Se ROI < costo debito → ROE < ROI (leva negativa, pericolo!).',
    formula: 'ROI = EBIT / Totale Attivo x 100\nSpread finanziario = ROI - Tasso medio debito',
    collegamenti: ['indice_roe', 'ros', 'leverage', 'ebit_voce', 'mutui_passivi'],
    tooltip: 'Redditivita\' del capitale investito: il business funziona?',
  },

  {
    id: 'indice_ciclo_monetario',
    titolo: 'Ciclo Monetario (Cash Conversion Cycle)',
    categoria: 'indice',
    definizione: 'Giorni che intercorrono tra il pagamento ai fornitori e l\'incasso dai clienti. Misura per quanti giorni l\'azienda deve finanziare il capitale circolante.',
    spiegazione: 'Il ciclo monetario = DSO + Giorni Magazzino - DPO. Se positivo, l\'azienda paga prima di incassare e deve finanziare la differenza. Se negativo (raro ma possibile: es. Amazon), l\'azienda incassa prima di pagare!',
    collocazione_bilancio: 'Si calcola da voci di SP (crediti, rimanenze, debiti) e CE (ricavi, acquisti)',
    scrittura_tipica: 'Non ha scrittura. E\' un indicatore:\n  DSO = (Crediti/Ricavi) x 365\n  Giorni Magazzino = (Rimanenze/Costo venduto) x 365\n  DPO = (Debiti fornitori/Acquisti) x 365\n  Ciclo = DSO + Gg Magazzino - DPO',
    esempio_pratico: 'DSO 55 gg + Gg Magazzino 40 gg - DPO 60 gg = Ciclo 35 gg. L\'azienda deve finanziare 35 giorni di circolante. Con fatturato €1.000.000: fabbisogno = €1.000.000 x 35/365 = €95.890.',
    effetto_bilancio: 'Collega dinamicamente le voci di circolante dello SP con quelle del CE.',
    effetto_utile: 'Impatto indiretto: un ciclo lungo richiede piu\' capitale → piu\' debito → piu\' interessi → meno utile.',
    effetto_cassa: 'Impatto DIRETTO e fondamentale. Ciclo lungo = la cassa e\' "bloccata" nel circolante. Ciclo corto = liquidita\' liberata.',
    effetto_indici: 'Il ciclo monetario e\' il "termometro" dell\'efficienza del capitale circolante. Connette DSO, rotazione magazzino e DPO.',
    formula: 'Ciclo Monetario = DSO + Giorni Magazzino - DPO',
    collegamenti: ['dso', 'dpo', 'rotazione_magazzino', 'ccn_voce', 'cash_flow_operativo', 'crediti_clienti', 'debiti_fornitori'],
    tooltip: 'Giorni di finanziamento del circolante: dal pagamento fornitori all\'incasso clienti',
  },

];

// ── FUNZIONI DI ACCESSO ─────────────────────────────────────

export function getInfoByCodice(codice: string): InfoContabile | undefined {
  return INFO_CONTABILI.find(i => i.codice_conto === codice);
}

export function getInfoById(id: string): InfoContabile | undefined {
  return INFO_CONTABILI.find(i => i.id === id);
}

export function getInfoByCategoria(cat: InfoContabile['categoria']): InfoContabile[] {
  return INFO_CONTABILI.filter(i => i.categoria === cat);
}

export function getCollegamenti(id: string): InfoContabile[] {
  const info = getInfoById(id);
  if (!info) return [];
  return info.collegamenti
    .map(colId => INFO_CONTABILI.find(i => i.id === colId))
    .filter((i): i is InfoContabile => !!i);
}

export function searchInfo(query: string): InfoContabile[] {
  const q = query.toLowerCase();
  return INFO_CONTABILI.filter(i =>
    i.titolo.toLowerCase().includes(q) ||
    i.definizione.toLowerCase().includes(q) ||
    i.tooltip.toLowerCase().includes(q) ||
    (i.codice_conto && i.codice_conto.includes(q))
  );
}

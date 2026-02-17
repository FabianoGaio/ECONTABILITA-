'use client';

import { useState } from 'react';

const sezioni = [
  {
    id: 'intro',
    titolo: "Cos'è eContabilità",
    contenuto: [
      "eContabilità è una piattaforma web didattica per lo studio della contabilità generale e del bilancio aziendale.",
      "Permette di consultare un piano dei conti conforme ai principi OIC, registrare operazioni in partita doppia, gestire scritture di assestamento, visualizzare il bilancio completo (SP, CE, CF), analizzare il bilancio tramite riclassificazione e indici, simulare scenari gestionali e generare un fac-simile PDF del bilancio ufficiale.",
      "Il progetto funziona in due modalità: DEMO (dati precaricati, pronto all'uso) e LIVE (collegato a Supabase con database reale).",
    ],
  },
  {
    id: 'installazione',
    titolo: 'Installazione e Avvio',
    contenuto: [
      "Prerequisiti: Node.js 18+ e un browser moderno.",
    ],
    codice: "# 1. Installa le dipendenze\nnpm install\n\n# 2. Avvia il server\nnpm run dev\n\n# 3. Apri il browser su\nhttp://localhost:3000",
    nota: "Il progetto parte in modalità demo con dati di esempio per l'esercizio 2025. Non serve configurare nulla.",
  },
  {
    id: 'navigazione',
    titolo: 'Navigazione',
    contenuto: [
      "La barra laterale sinistra contiene tutte le sezioni del progetto, organizzate in 6 gruppi. È collassabile cliccando la freccia in alto.",
      "Il selettore \"Esercizio\" in alto a destra di ogni pagina permette di cambiare l'anno di riferimento. In modalità demo, i dati sono disponibili solo per il 2025.",
    ],
    tabella: [
      ['Sezione', 'Pagine', 'Descrizione'],
      ['Generale', 'Dashboard, Piano dei Conti', 'Panoramica KPI e elenco conti OIC'],
      ['Contabilità', 'Prima Nota, Scritture Assestamento', 'Registrazione operazioni e rettifiche'],
      ['Bilancio', 'SP, CE, Rendiconto Finanziario', 'Prospetti civilistici art. 2424/2425 c.c.'],
      ['Analisi', 'Riclassificazione, Indici, Gestionale, Budget', 'Strumenti di analisi finanziaria'],
      ['Documenti', 'Genera Bilancio PDF', 'Fac-simile bilancio ufficiale'],
      ['Supporto', 'Guida Utente', 'Questa pagina'],
    ],
  },
  {
    id: 'dashboard',
    titolo: 'Dashboard Direzionale',
    contenuto: [
      "La pagina iniziale mostra a colpo d'occhio: 6 KPI principali (Ricavi, EBITDA, Utile Netto, Cash Flow, ROE, Current Ratio), un alert di quadratura del bilancio, e diversi grafici interattivi.",
      "I grafici includono: margini del CE a barre, flussi di cassa, composizione attivo e passivo a torta, indici di redditività, e un riepilogo tabellare di SP e CE.",
    ],
  },
  {
    id: 'piano-conti',
    titolo: 'Piano dei Conti',
    contenuto: [
      "Elenco completo dei 60 conti contabili conformi agli standard OIC. Ogni conto ha: codice, nome, categoria, sottocategoria, sezione bilancio e riferimento alla voce ufficiale OIC.",
      "Usa la barra di ricerca per trovare un conto per nome o codice. Filtra per categoria (Attivo, Passivo, PN, Ricavi, Costi) o per sezione bilancio.",
    ],
    tabella: [
      ['Codice', 'Contenuto'],
      ['1.x.xx', 'Immobilizzazioni (attivo fisso)'],
      ['2.x.xx', 'Attivo circolante (rimanenze, crediti, liquidità)'],
      ['3.x.xx', 'Passivo e patrimonio netto'],
      ['4.x.xx', 'Ricavi'],
      ['5.x.xx', 'Costi'],
    ],
  },
  {
    id: 'prima-nota',
    titolo: 'Prima Nota',
    contenuto: [
      "Permette di registrare operazioni contabili in partita doppia. Ogni scrittura deve QUADRARE: il totale dare deve essere uguale al totale avere.",
      "Per registrare una scrittura: clicca \"+ Nuova Scrittura\", inserisci data e descrizione, per ogni riga seleziona il conto, dare/avere e importo. L'indicatore di quadratura mostra in tempo reale se la scrittura è bilanciata.",
    ],
    esempio: {
      titolo: 'Esempio: Vendita merce a credito per €10.000',
      righe: [
        'Riga 1: Crediti vs clienti → DARE → €10.000',
        'Riga 2: Ricavi vendite → AVERE → €10.000',
      ],
    },
  },
  {
    id: 'scritture',
    titolo: 'Scritture di Assestamento',
    contenuto: [
      "Rettifiche di fine esercizio per rispettare il principio di competenza economica. Si registrano tipicamente al 31/12.",
    ],
    definizioni: [
      { termine: 'Ammortamento', descrizione: 'Ripartizione del costo di un\'immobilizzazione sulla vita utile. Es: Macchinario €80.000, vita 10 anni → €8.000/anno.' },
      { termine: 'Rateo Attivo', descrizione: 'Ricavo di competenza dell\'esercizio non ancora rilevato. Es: Interessi attivi maturati ma non incassati.' },
      { termine: 'Rateo Passivo', descrizione: 'Costo di competenza dell\'esercizio non ancora rilevato. Es: Interessi su mutuo maturati ma non pagati.' },
      { termine: 'Risconto Attivo', descrizione: 'Costo già rilevato ma di competenza futura. Es: Affitto pagato in anticipo per il trimestre successivo.' },
      { termine: 'Risconto Passivo', descrizione: 'Ricavo già rilevato ma di competenza futura. Es: Canone incassato in anticipo.' },
      { termine: 'Accantonamento', descrizione: 'Fondo per rischi e oneri futuri probabili. Es: Causa legale in corso, rischio probabile.' },
    ],
  },
  {
    id: 'bilancio',
    titolo: 'Bilancio (SP, CE, CF)',
    contenuto: [
      "Stato Patrimoniale: schema civilistico art. 2424 c.c. Diviso in Attivo (immobilizzazioni, circolante, ratei/risconti) e Passivo (patrimonio netto, fondi, TFR, debiti, ratei/risconti). In alto un indicatore di quadratura.",
      "Conto Economico: schema civilistico art. 2425 c.c. Mostra il valore della produzione, i costi, e i margini intermedi: EBITDA, EBIT, utile ante imposte e utile netto. Sulla destra un grafico e le incidenze percentuali.",
      "Rendiconto Finanziario: metodo indiretto OIC 10. Tre sezioni: flussi operativi (utile + ammortamenti ± variazioni CCN), flussi da investimenti e flussi da finanziamenti. La somma dà la variazione netta della liquidità.",
    ],
  },
  {
    id: 'riclassificazione',
    titolo: 'Riclassificazione',
    contenuto: [
      "Bilancio riclassificato con criterio finanziario: Impieghi (attivo fisso, circolante lordo, liquidità) vs Fonti (patrimonio netto, passività consolidate, passività correnti).",
      "Indicatori chiave: CCN (Capitale Circolante Netto) = Attivo corrente − Passività correnti. Margine di Struttura = (PN + Pass. consolidate) − Attivo fisso.",
      "Include anche il Conto Economico riclassificato a valore aggiunto: dalla produzione al valore aggiunto, all'EBITDA, EBIT e utile netto.",
    ],
  },
  {
    id: 'indici',
    titolo: 'Analisi per Indici',
    contenuto: [
      "16 indici di bilancio divisi in 4 categorie con benchmark di riferimento e formule.",
    ],
    tabella: [
      ['Categoria', 'Indice', 'Formula', 'Benchmark'],
      ['Solidità', 'Autonomia finanziaria', 'PN / Attivo × 100', '> 33%'],
      ['Solidità', 'Leverage', 'Attivo / PN', '< 3x'],
      ['Liquidità', 'Current Ratio', 'Att. corrente / Pass. correnti', '> 1.5x'],
      ['Liquidità', 'Quick Ratio', '(Att. corr. − Rimanenze) / Pass. corr.', '> 1.0x'],
      ['Redditività', 'ROE', 'Utile netto / PN × 100', '> 8%'],
      ['Redditività', 'ROI', 'EBIT / Totale attivo × 100', '> 5%'],
      ['Redditività', 'ROS', 'EBIT / Ricavi × 100', '> 5%'],
      ['Efficienza', 'DSO', '(Crediti / Ricavi) × 365', '< 60 gg'],
      ['Efficienza', 'DPO', '(Debiti forn. / Acquisti) × 365', '60-90 gg'],
    ],
  },
  {
    id: 'gestionale',
    titolo: 'Analisi Gestionale',
    contenuto: [
      "Analisi costi-volumi-profitti con break-even point. Lo slider \"Incidenza Costi Fissi\" (20%-90%) permette di simulare diverse strutture di costo.",
      "Break-Even Point = Costi Fissi / Margine di Contribuzione %. È il fatturato minimo per non avere perdite.",
      "Margine di Contribuzione = Ricavi − Costi Variabili. Margine di Sicurezza = (Ricavi − BEP) / Ricavi × 100: quanto puoi perdere in fatturato prima di andare in perdita.",
    ],
  },
  {
    id: 'budget',
    titolo: 'Budget e Controllo',
    contenuto: [
      "Budget mensile di ricavi e costi con andamento cumulato. Permette di inserire voci budget per mese e confrontare con i dati a consuntivo.",
      "Include: grafico barre ricavi vs costi mensili, grafico linee andamento cumulato, e tabella dettaglio con totali.",
    ],
  },
  {
    id: 'pdf',
    titolo: 'Generazione PDF Bilancio',
    contenuto: [
      "Genera un documento PDF fac-simile del bilancio ufficiale con layout stile CCIAA.",
      "Passi: vai su \"Genera Bilancio PDF\", inserisci la ragione sociale, seleziona l'esercizio, verifica l'anteprima e clicca \"Genera e Scarica PDF\".",
      "Il PDF contiene: Stato Patrimoniale, Conto Economico, Rendiconto Finanziario, Prospetto Riclassificato, Indici e Scritture di Assestamento.",
      "NOTA: Il documento è un fac-simile a scopo didattico e non ha validità legale.",
    ],
  },
  {
    id: 'percorso',
    titolo: 'Percorso di Studio Consigliato',
    contenuto: [
      "Per trarre il massimo beneficio didattico, si consiglia di seguire questo percorso:",
    ],
    lista: [
      '1. Piano dei Conti → studia la struttura OIC e le voci',
      '2. Prima Nota → registra operazioni e comprendi la partita doppia',
      '3. Scritture di Assestamento → capire ratei, risconti, ammortamenti',
      '4. Stato Patrimoniale → vedere l\'effetto delle operazioni sul SP',
      '5. Conto Economico → capire la formazione del reddito',
      '6. Rendiconto Finanziario → distinguere reddito da liquidità',
      '7. Riclassificazione → leggere il bilancio in ottica finanziaria',
      '8. Indici → valutare la salute dell\'azienda',
      '9. Analisi Gestionale → simulare scenari costi/ricavi',
      '10. PDF → produrre il documento finale di bilancio',
    ],
  },
  {
    id: 'esercizi',
    titolo: 'Esercizi Proposti',
    contenuto: [],
    lista: [
      'Registra un intero ciclo acquisti-produzione-vendita in partita doppia',
      'Confronta EBITDA e cash flow operativo: perché differiscono?',
      'Modifica lo slider costi fissi nell\'analisi gestionale e osserva come cambia il BEP',
      'Prova a costruire un bilancio con utile negativo e analizza gli effetti sugli indici',
      'Analizza come un aumento di debito finanziario cambia il leverage e il ROE',
      'Registra ammortamenti con diverse aliquote e osserva l\'effetto su EBITDA vs EBIT',
      'Crea ratei e risconti e verifica la corretta competenza economica nel CE',
    ],
  },
];

export default function GuidaPage() {
  const [activeSection, setActiveSection] = useState('intro');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Guida Utente</h1>
        <p className="page-subtitle">Come funziona e come utilizzare eContabilità</p>
      </div>

      <div className="flex gap-6">
        {/* Indice laterale */}
        <nav className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-8 space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2 px-2">Indice</p>
            {sezioni.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActiveSection(s.id)}
                className={`block px-2 py-1.5 text-xs rounded transition-colors ${
                  activeSection === s.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {s.titolo}
              </a>
            ))}
          </div>
        </nav>

        {/* Contenuto */}
        <div className="flex-1 space-y-8 min-w-0">
          {sezioni.map((s) => (
            <section key={s.id} id={s.id} className="card scroll-mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                {s.titolo}
              </h2>

              {s.contenuto.map((p, i) => (
                <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3">{p}</p>
              ))}

              {s.codice && (
                <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-4 mb-3 overflow-x-auto font-mono">
                  {s.codice}
                </pre>
              )}

              {s.nota && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800 mb-3">
                  {s.nota}
                </div>
              )}

              {s.tabella && (
                <div className="table-container mb-3">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {s.tabella[0].map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.tabella.slice(1).map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className={j === 0 ? 'font-medium' : ''}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {s.esempio && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                  <p className="text-sm font-semibold text-green-800 mb-2">{s.esempio.titolo}</p>
                  {s.esempio.righe.map((r, i) => (
                    <p key={i} className="text-sm text-green-700 font-mono">{r}</p>
                  ))}
                </div>
              )}

              {s.definizioni && (
                <div className="space-y-3 mb-3">
                  {s.definizioni.map((d, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">{d.termine}</p>
                      <p className="text-xs text-gray-600 mt-1">{d.descrizione}</p>
                    </div>
                  ))}
                </div>
              )}

              {s.lista && (
                <ul className="space-y-2 mb-3">
                  {s.lista.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Footer */}
          <div className="card bg-gray-50 border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              eContabilità — Piattaforma didattica per lo studio della contabilità generale e del bilancio aziendale.
              <br />
              Progetto a scopo esclusivamente didattico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

# eContabilità - Piattaforma Didattica di Contabilità Generale

Applicazione web full-stack per lo studio, la simulazione e la comprensione della contabilità generale e del bilancio aziendale.

## Stack Tecnologico

- **Frontend**: Next.js 14 (App Router) + React 18 + Tailwind CSS
- **Backend**: Next.js API Routes + Supabase
- **Database**: Supabase PostgreSQL
- **Grafici**: Recharts
- **PDF**: jsPDF + jspdf-autotable
- **Auth**: Supabase Auth (ruoli: admin, contabile, manager)

## Funzionalità

### Contabilità
- **Piano dei Conti** conforme ai principi OIC
- **Prima Nota** con partita doppia e controllo quadratura
- **Scritture di Assestamento** (ammortamenti, ratei, risconti, accantonamenti)

### Bilancio
- **Stato Patrimoniale** (schema civilistico art. 2424 c.c.)
- **Conto Economico** (schema civilistico art. 2425 c.c.)
- **Rendiconto Finanziario** (metodo indiretto, OIC 10)

### Analisi
- **Riclassificazione** (criterio finanziario impieghi/fonti)
- **Analisi per Indici** (solidità, liquidità, redditività, efficienza)
- **Analisi Gestionale** (break-even, margine di contribuzione)
- **Budget** e controllo scostamenti

### Dashboard
- KPI principali con grafici interattivi
- Composizione attivo/passivo
- Andamento margini e flussi di cassa

### Documenti
- **Generazione PDF** fac-simile bilancio ufficiale stile CCIAA

## Setup

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura Supabase

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Copia `.env.local.example` in `.env.local`
3. Inserisci URL e anon key del tuo progetto Supabase:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### 3. Crea il database

Esegui lo script SQL nel SQL Editor di Supabase:

```bash
# Copia il contenuto di supabase/schema.sql nel SQL Editor
```

Questo creerà:
- Tutte le tabelle (piano_conti, operazioni, scritture_assestamento, bilanci, budget, profili)
- Il piano dei conti OIC completo
- Dati di esempio per l'esercizio 2025
- Policy RLS

### 4. Avvia il server di sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## Struttura Progetto

```
src/
├── app/
│   ├── api/
│   │   ├── bilancio/route.ts       # Calcolo completo bilancio
│   │   ├── budget/route.ts         # CRUD budget
│   │   ├── conti/route.ts          # CRUD piano dei conti
│   │   ├── operazioni/route.ts     # CRUD prima nota
│   │   └── scritture/route.ts      # CRUD scritture assestamento
│   ├── analisi/
│   │   ├── budget/page.tsx
│   │   ├── gestionale/page.tsx
│   │   ├── indici/page.tsx
│   │   └── riclassificazione/page.tsx
│   ├── bilancio/
│   │   ├── conto-economico/page.tsx
│   │   ├── pdf/page.tsx
│   │   ├── rendiconto-finanziario/page.tsx
│   │   └── stato-patrimoniale/page.tsx
│   ├── piano-conti/page.tsx
│   ├── prima-nota/page.tsx
│   ├── scritture-assestamento/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # Dashboard
├── components/
│   ├── layout/Sidebar.tsx
│   └── ui/
│       ├── EsercizioSelector.tsx
│       ├── KPICard.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── calcoli.ts                   # Motore calcolo contabile
│   ├── hooks.ts                     # React hooks
│   ├── pdf-bilancio.ts              # Generazione PDF
│   ├── supabase.ts                  # Client Supabase
│   └── utils.ts                     # Utilità
├── types/
│   └── index.ts                     # Definizioni TypeScript
supabase/
└── schema.sql                       # Schema DB + seed data
```

## Note

Questo progetto è a **scopo esclusivamente didattico**. Il bilancio generato è un fac-simile e non ha validità legale.
# ECONTABILITA-

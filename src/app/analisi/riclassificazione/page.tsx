'use client';

import { useBilancio, useEsercizio } from '@/lib/hooks';
import EsercizioSelector from '@/components/ui/EsercizioSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InfoButton from '@/components/ui/InfoButton';
import { formatCurrency } from '@/lib/utils';
import type { Riclassificazione, ContoEconomico } from '@/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS_IMPIEGHI = ['#3b82f6', '#10b981', '#06b6d4'];
const COLORS_FONTI = ['#8b5cf6', '#f59e0b', '#ef4444'];

export default function RiclassificazionePage() {
  const { esercizio, setEsercizio } = useEsercizio();
  const { data, loading, error } = useBilancio(esercizio);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;
  if (!data) return <div className="text-gray-500 p-8">Nessun dato</div>;

  const ricl = data.riclassificazione as Riclassificazione;
  const ce = data.conto_economico as ContoEconomico;

  const impieghiData = [
    { name: 'Attivo Fisso', value: ricl.attivo_fisso },
    { name: 'Capitale Circolante', value: ricl.capitale_circolante_lordo },
    { name: 'Liquidità Immediate', value: ricl.liquidita_immediate },
  ].filter((d) => d.value > 0);

  const fontiData = [
    { name: 'Patrimonio Netto', value: ricl.patrimonio_netto },
    { name: 'Passività Consolidate', value: ricl.passivita_consolidate },
    { name: 'Passività Correnti', value: ricl.passivita_correnti },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Riclassificazione di Bilancio</h1>
          <p className="page-subtitle">Criterio finanziario - Prospetto impieghi/fonti</p>
        </div>
        <EsercizioSelector value={esercizio} onChange={setEsercizio} />
      </div>

      {/* Impieghi / Fonti side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IMPIEGHI */}
        <div className="card">
          <h3 className="card-header text-blue-800">IMPIEGHI (Attivo)</h3>
          <div className="space-y-2 mb-4">
            <div className="bilancio-row">
              <span className="text-gray-600">Attivo fisso (immobilizzazioni nette)</span>
              <span className="font-mono">{formatCurrency(ricl.attivo_fisso)}</span>
            </div>
            <div className="bilancio-row">
              <span className="text-gray-600">Capitale circolante lordo</span>
              <span className="font-mono">{formatCurrency(ricl.capitale_circolante_lordo)}</span>
            </div>
            <div className="bilancio-row">
              <span className="text-gray-600">Liquidità immediate</span>
              <span className="font-mono">{formatCurrency(ricl.liquidita_immediate)}</span>
            </div>
            <div className="bilancio-total">
              <span>TOTALE IMPIEGHI</span>
              <span className="font-mono">{formatCurrency(ricl.totale_impieghi)}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={impieghiData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {impieghiData.map((_, i) => <Cell key={i} fill={COLORS_IMPIEGHI[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* FONTI */}
        <div className="card">
          <h3 className="card-header text-purple-800">FONTI (Passivo)</h3>
          <div className="space-y-2 mb-4">
            <div className="bilancio-row">
              <span className="text-gray-600">Patrimonio netto</span>
              <span className="font-mono">{formatCurrency(ricl.patrimonio_netto)}</span>
            </div>
            <div className="bilancio-row">
              <span className="text-gray-600">Passività consolidate (M/L termine)</span>
              <span className="font-mono">{formatCurrency(ricl.passivita_consolidate)}</span>
            </div>
            <div className="bilancio-row">
              <span className="text-gray-600">Passività correnti (breve termine)</span>
              <span className="font-mono">{formatCurrency(ricl.passivita_correnti)}</span>
            </div>
            <div className="bilancio-total">
              <span>TOTALE FONTI</span>
              <span className="font-mono">{formatCurrency(ricl.totale_fonti)}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={fontiData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {fontiData.map((_, i) => <Cell key={i} fill={COLORS_FONTI[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Margini */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-1"><p className="text-xs font-medium text-gray-500 uppercase">CCN</p><InfoButton chiave="capitale_circolante_netto" infoId="ccn_voce" /></div>
          <p className={`text-xl sm:text-3xl font-bold ${ricl.capitale_circolante_netto >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatCurrency(ricl.capitale_circolante_netto)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Attivo corrente - Passivita correnti</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-1"><p className="text-xs font-medium text-gray-500 uppercase">Margine di Struttura</p><InfoButton chiave="margine_struttura" /></div>
          <p className={`text-xl sm:text-3xl font-bold ${ricl.margine_struttura >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatCurrency(ricl.margine_struttura)}
          </p>
          <p className="text-xs text-gray-500 mt-1">(PN + Pass. consolidate) - Attivo fisso</p>
        </div>
      </div>

      {/* CE Riclassificato */}
      <div className="card">
        <h3 className="card-header">Conto Economico Riclassificato a Valore Aggiunto</h3>
        <div className="space-y-1">
          <div className="bilancio-row"><span>Valore della produzione</span><span className="font-mono">{formatCurrency(ce.valore_produzione)}</span></div>
          <div className="bilancio-row"><span className="pl-4 text-gray-600">- Costi materie e servizi</span><span className="font-mono text-red-600">{formatCurrency(ce.costi_acquisti + ce.costi_servizi + ce.godimento_beni_terzi)}</span></div>
          <div className="bilancio-row-bold"><span>= Valore aggiunto</span><span className="font-mono">{formatCurrency(ce.valore_produzione - ce.costi_acquisti - ce.costi_servizi - ce.godimento_beni_terzi)}</span></div>
          <div className="bilancio-row"><span className="pl-4 text-gray-600">- Costo del personale</span><span className="font-mono text-red-600">{formatCurrency(ce.costi_personale)}</span></div>
          <div className="bilancio-row-bold"><span>= EBITDA</span><span className="font-mono text-blue-700">{formatCurrency(ce.ebitda)}</span></div>
          <div className="bilancio-row"><span className="pl-4 text-gray-600">- Ammortamenti</span><span className="font-mono text-red-600">{formatCurrency(ce.ammortamenti)}</span></div>
          <div className="bilancio-row-bold"><span>= EBIT</span><span className="font-mono text-blue-700">{formatCurrency(ce.ebit)}</span></div>
          <div className="bilancio-row"><span className="pl-4 text-gray-600">+/- Gestione finanziaria</span><span className="font-mono">{formatCurrency(ce.proventi_finanziari - ce.oneri_finanziari)}</span></div>
          <div className="bilancio-row-bold"><span>= Utile ante imposte</span><span className="font-mono">{formatCurrency(ce.utile_ante_imposte)}</span></div>
          <div className="bilancio-row"><span className="pl-4 text-gray-600">- Imposte</span><span className="font-mono text-red-600">{formatCurrency(ce.imposte)}</span></div>
          <div className="bilancio-total"><span>UTILE NETTO</span><span className={`font-mono ${ce.utile_netto >= 0 ? '' : 'text-red-700'}`}>{formatCurrency(ce.utile_netto)}</span></div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useBilancio, useEsercizio } from '@/lib/hooks';
import EsercizioSelector from '@/components/ui/EsercizioSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InfoButton from '@/components/ui/InfoButton';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { formatCurrency } from '@/lib/utils';
import type { RendicontoFinanziario } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function Row({ label, value, indent = false }: { label: string; value: number; indent?: boolean }) {
  return (
    <div className="bilancio-row">
      <span className={indent ? 'pl-4 text-gray-600 text-sm' : 'text-sm'}>{label}</span>
      <span className={`font-mono text-sm ${value >= 0 ? 'text-green-700' : 'text-red-700'}`}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function SubTotal({ label, value }: { label: string; value: number }) {
  return (
    <div className="bilancio-row-bold">
      <span>{label}</span>
      <span className={`font-mono ${value >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatCurrency(value)}</span>
    </div>
  );
}

export default function RendicontoFinanziarioPage() {
  const { esercizio, setEsercizio } = useEsercizio();
  const { data, loading, error } = useBilancio(esercizio);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;
  if (!data) return <div className="text-gray-500 p-8">Nessun dato</div>;

  const rf = data.rendiconto_finanziario as RendicontoFinanziario;

  const chartData = [
    { name: 'CF Operativo', valore: rf.cash_flow_operativo },
    { name: 'CF Investimenti', valore: rf.cash_flow_investimenti },
    { name: 'CF Finanziamenti', valore: rf.cash_flow_finanziamenti },
    { name: 'Var. Liquidità', valore: rf.variazione_liquidita },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Rendiconto Finanziario</h1>
          <p className="page-subtitle">Metodo indiretto - OIC 10</p>
        </div>
        <EsercizioSelector value={esercizio} onChange={setEsercizio} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="card-header">Rendiconto Finanziario {esercizio}</h3>

          <div className="space-y-1 mb-6">
            <h4 className="section-title text-sm text-blue-700">A) Flussi finanziari da attivita operativa <InfoButton chiave="cash_flow_operativo" infoId="rendiconto_voce" /></h4>
            <Row label="Utile dell'esercizio" value={rf.utile_netto} indent />
            <Row label="(+) Ammortamenti" value={rf.ammortamenti} indent />
            <Row label="Variazione crediti commerciali" value={-rf.variazione_crediti} indent />
            <Row label="Variazione rimanenze" value={-rf.variazione_rimanenze} indent />
            <Row label="Variazione debiti commerciali" value={rf.variazione_debiti} indent />
            <Row label="Variazione TFR" value={rf.variazione_tfr} indent />
            <Row label="Variazione fondi rischi" value={rf.variazione_fondi} indent />
            <SubTotal label="Cash flow operativo (A)" value={rf.cash_flow_operativo} />
          </div>

          <div className="space-y-1 mb-6">
            <h4 className="section-title text-sm text-purple-700">B) Flussi da attivita di investimento <InfoButton chiave="cash_flow_investimenti" /></h4>
            <Row label="Investimenti in immobilizzazioni" value={-rf.investimenti_immobilizzazioni} indent />
            <SubTotal label="Cash flow investimenti (B)" value={rf.cash_flow_investimenti} />
          </div>

          <div className="space-y-1 mb-6">
            <h4 className="section-title text-sm text-amber-700">C) Flussi da attivita di finanziamento <InfoButton chiave="cash_flow_finanziamenti" /></h4>
            <Row label="Variazione debiti finanziari" value={rf.variazione_debiti_finanziari} indent />
            <Row label="Variazione patrimonio netto" value={rf.variazione_patrimonio} indent />
            <SubTotal label="Cash flow finanziamenti (C)" value={rf.cash_flow_finanziamenti} />
          </div>

          <div className="bilancio-total">
            <span>VARIAZIONE NETTA LIQUIDITÀ (A+B+C)</span>
            <span className={`font-mono ${rf.variazione_liquidita >= 0 ? '' : 'text-red-700'}`}>
              {formatCurrency(rf.variazione_liquidita)}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="card">
          <h3 className="card-header">Flussi di Cassa</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="valore" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.valore >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-xs font-semibold text-blue-800 mb-2">Legenda didattica</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li><strong>CF Operativo:</strong> generato dalla gestione corrente</li>
              <li><strong>CF Investimenti:</strong> impiegato in immobilizzazioni</li>
              <li><strong>CF Finanziamenti:</strong> da/verso finanziatori</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

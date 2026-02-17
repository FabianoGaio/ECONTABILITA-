'use client';

import { useBilancio, useEsercizio } from '@/lib/hooks';
import EsercizioSelector from '@/components/ui/EsercizioSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InfoButton from '@/components/ui/InfoButton';
import InfoTooltip from '@/components/ui/InfoTooltip';
import type { IndiciAnalisi } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

function IndiceCard({ label, value, unit, description, benchmark, color, infoKey, infoId }: {
  label: string; value: number; unit: string; description: string; benchmark?: string; color: string; infoKey?: string; infoId?: string;
}) {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {infoId ? <InfoTooltip infoId={infoId}>{label}</InfoTooltip> : label}
        </p>
        {(infoKey || infoId) && <InfoButton chiave={infoKey} infoId={infoId} />}
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}{unit}</p>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
      {benchmark && <p className="text-xs text-blue-600 mt-1 font-medium">Benchmark: {benchmark}</p>}
    </div>
  );
}

export default function IndiciPage() {
  const { esercizio, setEsercizio } = useEsercizio();
  const { data, loading, error } = useBilancio(esercizio);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;
  if (!data) return <div className="text-gray-500 p-8">Nessun dato</div>;

  const idx = data.indici as IndiciAnalisi;

  const radarData = [
    { subject: 'ROE', A: Math.min(Math.max(idx.redditivita.roe, 0), 50) },
    { subject: 'ROI', A: Math.min(Math.max(idx.redditivita.roi, 0), 50) },
    { subject: 'Current', A: Math.min(idx.liquidita.current_ratio * 20, 50) },
    { subject: 'Quick', A: Math.min(idx.liquidita.quick_ratio * 20, 50) },
    { subject: 'Autonomia', A: Math.min(idx.solidita.autonomia_finanziaria, 50) },
  ];

  const redditData = [
    { name: 'ROE', valore: idx.redditivita.roe },
    { name: 'ROI', valore: idx.redditivita.roi },
    { name: 'ROS', valore: idx.redditivita.ros },
    { name: 'ROA', valore: idx.redditivita.roa },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Analisi per Indici</h1>
          <p className="page-subtitle">Solidità, liquidità, redditività, efficienza</p>
        </div>
        <EsercizioSelector value={esercizio} onChange={setEsercizio} />
      </div>

      {/* Radar Overview */}
      <div className="card">
        <h3 className="card-header">Profilo Aziendale Sintetico</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fontSize: 10 }} />
              <Radar name="Indici" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SOLIDITÀ */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
          Indici di Solidità
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <IndiceCard
            label="Autonomia Finanziaria"
            value={idx.solidita.autonomia_finanziaria}
            unit="%"
            description="PN / Totale Attivo × 100"
            benchmark="> 33%"
            color="#3b82f6"
            infoKey="autonomia_finanziaria"
          />
          <IndiceCard
            label="Leverage"
            value={idx.solidita.leverage}
            unit="x"
            description="Totale Attivo / PN"
            benchmark="< 3x"
            color="#3b82f6"
            infoKey="leverage"
          />
          <IndiceCard
            label="Copertura Immobilizzazioni"
            value={idx.solidita.copertura_immobilizzazioni}
            unit="%"
            description="(PN + Pass. consolidate) / Immobilizzazioni × 100"
            benchmark="> 100%"
            color="#3b82f6"
            infoKey="copertura_immobilizzazioni"
          />
        </div>
      </div>

      {/* LIQUIDITÀ */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-600 rounded-full"></span>
          Indici di Liquidità
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <IndiceCard
            label="Current Ratio"
            value={idx.liquidita.current_ratio}
            unit="x"
            description="Attivo corrente / Passivo corrente"
            benchmark="> 1.5x"
            color="#10b981"
            infoKey="current_ratio"
          />
          <IndiceCard
            label="Quick Ratio (Acid Test)"
            value={idx.liquidita.quick_ratio}
            unit="x"
            description="(Attivo corrente - Rimanenze) / Passivo corrente"
            benchmark="> 1.0x"
            color="#10b981"
            infoKey="quick_ratio"
          />
          <IndiceCard
            label="Cash Ratio"
            value={idx.liquidita.cash_ratio}
            unit="x"
            description="Liquidita immediate / Passivo corrente"
            benchmark="> 0.2x"
            color="#10b981"
            infoKey="cash_ratio"
          />
        </div>
      </div>

      {/* REDDITIVITÀ */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
          Indici di Redditività
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <IndiceCard label="ROE" value={idx.redditivita.roe} unit="%" description="Utile netto / PN × 100" benchmark="> 8%" color="#8b5cf6" infoKey="roe" infoId="indice_roe" />
            <IndiceCard label="ROI" value={idx.redditivita.roi} unit="%" description="EBIT / Totale attivo × 100" benchmark="> 5%" color="#8b5cf6" infoKey="roi" infoId="indice_roi" />
            <IndiceCard label="ROS" value={idx.redditivita.ros} unit="%" description="EBIT / Ricavi vendite × 100" benchmark="> 5%" color="#8b5cf6" infoKey="ros" />
            <IndiceCard label="ROA" value={idx.redditivita.roa} unit="%" description="Utile netto / Totale attivo × 100" benchmark="> 3%" color="#8b5cf6" infoKey="roa" />
          </div>
          <div className="card">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Confronto Indici Redditività (%)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={redditData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Bar dataKey="valore" radius={[4, 4, 0, 0]}>
                  {redditData.map((entry, i) => (
                    <Cell key={i} fill={entry.valore >= 0 ? '#8b5cf6' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* EFFICIENZA */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
          Indici di Efficienza
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <IndiceCard
            label="Rotazione Magazzino"
            value={idx.efficienza.rotazione_magazzino}
            unit="x"
            description="Costo venduto / Rimanenze medie"
            benchmark="> 4x"
            color="#f59e0b"
            infoKey="rotazione_magazzino"
          />
          <IndiceCard
            label="DSO (Days Sales Outstanding)"
            value={idx.efficienza.dso}
            unit=" gg"
            description="(Crediti / Ricavi) × 365"
            benchmark="< 60 gg"
            color="#f59e0b"
            infoKey="dso"
          />
          <IndiceCard
            label="DPO (Days Payable Outstanding)"
            value={idx.efficienza.dpo}
            unit=" gg"
            description="(Debiti fornitori / Acquisti) × 365"
            benchmark="60-90 gg"
            color="#f59e0b"
            infoKey="dpo"
          />
          <IndiceCard
            label="Ciclo Monetario"
            value={idx.efficienza.ciclo_monetario}
            unit=" gg"
            description="DSO + Giorni magazzino - DPO"
            benchmark="< 60 gg"
            color="#f59e0b"
            infoKey="ciclo_monetario"
            infoId="indice_ciclo_monetario"
          />
        </div>
      </div>

      {/* Legenda didattica */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="card-header text-blue-900">Legenda Didattica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p><strong>Scomposizione ROE (DuPont):</strong></p>
            <p className="mt-1">ROE = ROS × Rotazione capitale × Leverage</p>
            <p className="text-xs text-blue-600 mt-1">
              = (Utile/Ricavi) × (Ricavi/Attivo) × (Attivo/PN)
            </p>
          </div>
          <div>
            <p><strong>Leva finanziaria:</strong></p>
            <p className="mt-1">Se ROI {">"} costo del debito → l&apos;indebitamento crea valore</p>
            <p className="text-xs text-blue-600 mt-1">
              Spread = ROI - tasso medio di indebitamento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

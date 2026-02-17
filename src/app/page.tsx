'use client';

import { useState } from 'react';
import { useBilancio, useEsercizio } from '@/lib/hooks';
import EsercizioSelector from '@/components/ui/EsercizioSelector';
import KPICard from '@/components/ui/KPICard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InfoButton from '@/components/ui/InfoButton';
import { formatCurrency } from '@/lib/utils';
import type { ContoEconomico, StatoPatrimoniale, IndiciAnalisi, RendicontoFinanziario, KPI } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const { esercizio, setEsercizio } = useEsercizio();
  const { data, loading, error } = useBilancio(esercizio);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;
  if (!data) return <div className="text-gray-500 p-8">Nessun dato disponibile. Configura Supabase e carica i dati.</div>;

  const ce = data.conto_economico as ContoEconomico;
  const sp = data.stato_patrimoniale as StatoPatrimoniale;
  const indici = data.indici as IndiciAnalisi;
  const rf = data.rendiconto_finanziario as RendicontoFinanziario;

  const kpis: KPI[] = [
    { label: 'Ricavi', value: ce.ricavi_vendite, format: 'currency', color: '#10b981', trend: 'up' },
    { label: 'EBITDA', value: ce.ebitda, format: 'currency', color: '#3b82f6', trend: 'up' },
    { label: 'Utile Netto', value: ce.utile_netto, format: 'currency', color: '#8b5cf6', trend: ce.utile_netto > 0 ? 'up' : 'down' },
    { label: 'Cash Flow Operativo', value: rf.cash_flow_operativo, format: 'currency', color: '#06b6d4' },
    { label: 'ROE', value: indici.redditivita.roe, format: 'percentage', color: '#f59e0b' },
    { label: 'Current Ratio', value: indici.liquidita.current_ratio, format: 'number', color: '#ef4444' },
  ];

  const ceBarData = [
    { name: 'Ricavi', valore: ce.ricavi_vendite },
    { name: 'Costi Op.', valore: ce.totale_costi_operativi },
    { name: 'EBITDA', valore: ce.ebitda },
    { name: 'EBIT', valore: ce.ebit },
    { name: 'Utile', valore: ce.utile_netto },
  ];

  const spPieAttivo = [
    { name: 'Immobilizzazioni', value: sp.attivo.totale_immobilizzazioni },
    { name: 'Rimanenze', value: sp.attivo.rimanenze },
    { name: 'Crediti', value: sp.attivo.crediti },
    { name: 'Liquidità', value: sp.attivo.disponibilita_liquide },
  ].filter(d => d.value > 0);

  const spPiePassivo = [
    { name: 'Patrimonio Netto', value: sp.passivo.totale_patrimonio_netto },
    { name: 'Fondi/TFR', value: sp.passivo.fondi_rischi + sp.passivo.tfr },
    { name: 'Debiti Fin.', value: sp.passivo.debiti_finanziari },
    { name: 'Debiti Comm.', value: sp.passivo.debiti_commerciali },
  ].filter(d => d.value > 0);

  const indiciData = [
    { name: 'ROE', valore: indici.redditivita.roe },
    { name: 'ROI', valore: indici.redditivita.roi },
    { name: 'ROS', valore: indici.redditivita.ros },
    { name: 'ROA', valore: indici.redditivita.roa },
  ];

  const cfData = [
    { name: 'Operativo', valore: rf.cash_flow_operativo },
    { name: 'Investimenti', valore: rf.cash_flow_investimenti },
    { name: 'Finanziamenti', valore: rf.cash_flow_finanziamenti },
    { name: 'Var. Liquidità', valore: rf.variazione_liquidita },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard Direzionale</h1>
          <p className="page-subtitle">Panoramica KPI e indicatori di bilancio</p>
        </div>
        <EsercizioSelector value={esercizio} onChange={setEsercizio} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* Quadratura Alert */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
        sp.quadratura ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
      }`}>
        <span className="text-lg">{sp.quadratura ? '✓' : '✗'}</span>
        {sp.quadratura
          ? `Bilancio quadrato: Attivo ${formatCurrency(sp.attivo.totale_attivo)} = Passivo ${formatCurrency(sp.passivo.totale_passivo)}`
          : `ATTENZIONE: Bilancio non quadra! Attivo ${formatCurrency(sp.attivo.totale_attivo)} ≠ Passivo ${formatCurrency(sp.passivo.totale_passivo)}`
        }
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CE Bar Chart */}
        <div className="card">
          <h3 className="card-header">Conto Economico - Margini</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ceBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="valore" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {ceBarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cash Flow */}
        <div className="card">
          <h3 className="card-header">Flussi di Cassa</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="valore" radius={[4, 4, 0, 0]}>
                {cfData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.valore >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SP Attivo Pie */}
        <div className="card">
          <h3 className="card-header">Composizione Attivo</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={spPieAttivo} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {spPieAttivo.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* SP Passivo Pie */}
        <div className="card">
          <h3 className="card-header">Composizione Passivo</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={spPiePassivo} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {spPiePassivo.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Indici Redditività */}
        <div className="card">
          <h3 className="card-header">Indici di Redditività (%)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={indiciData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={40} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="valore" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                {indiciData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.valore >= 0 ? '#8b5cf6' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="card-header">Riepilogo Stato Patrimoniale</h3>
          <div className="space-y-1">
            <div className="bilancio-row"><span className="text-gray-600">Totale Immobilizzazioni</span><span className="font-medium">{formatCurrency(sp.attivo.totale_immobilizzazioni)}</span></div>
            <div className="bilancio-row"><span className="text-gray-600">Attivo Circolante</span><span className="font-medium">{formatCurrency(sp.attivo.totale_attivo_circolante)}</span></div>
            <div className="bilancio-total"><span>Totale Attivo</span><span>{formatCurrency(sp.attivo.totale_attivo)}</span></div>
            <div className="mt-3" />
            <div className="bilancio-row"><span className="text-gray-600">Patrimonio Netto</span><span className="font-medium">{formatCurrency(sp.passivo.totale_patrimonio_netto)}</span></div>
            <div className="bilancio-row"><span className="text-gray-600">Totale Debiti</span><span className="font-medium">{formatCurrency(sp.passivo.totale_debiti)}</span></div>
            <div className="bilancio-total"><span>Totale Passivo</span><span>{formatCurrency(sp.passivo.totale_passivo)}</span></div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-header">Riepilogo Conto Economico</h3>
          <div className="space-y-1">
            <div className="bilancio-row"><span className="text-gray-600">Valore Produzione</span><span className="font-medium">{formatCurrency(ce.valore_produzione)}</span></div>
            <div className="bilancio-row"><span className="text-gray-600">Costi Operativi</span><span className="font-medium text-red-600">{formatCurrency(ce.totale_costi_operativi)}</span></div>
            <div className="bilancio-row-bold"><span className="flex items-center gap-1">EBITDA <InfoButton infoId="ebitda_voce" chiave="ebitda" /></span><span className="text-blue-700">{formatCurrency(ce.ebitda)}</span></div>
            <div className="bilancio-row-bold"><span className="flex items-center gap-1">EBIT <InfoButton infoId="ebit_voce" chiave="ebit" /></span><span className="text-blue-700">{formatCurrency(ce.ebit)}</span></div>
            <div className="bilancio-row"><span className="text-gray-600">Gestione finanziaria</span><span className="font-medium">{formatCurrency(ce.proventi_finanziari - ce.oneri_finanziari)}</span></div>
            <div className="bilancio-row"><span className="text-gray-600">Imposte</span><span className="font-medium text-red-600">{formatCurrency(ce.imposte)}</span></div>
            <div className="bilancio-total"><span>Utile Netto</span><span className={ce.utile_netto >= 0 ? 'text-green-700' : 'text-red-700'}>{formatCurrency(ce.utile_netto)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

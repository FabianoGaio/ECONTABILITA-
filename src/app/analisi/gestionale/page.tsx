'use client';

import { useState } from 'react';
import { useBilancio, useEsercizio } from '@/lib/hooks';
import EsercizioSelector from '@/components/ui/EsercizioSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InfoButton from '@/components/ui/InfoButton';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import type { AnalisiGestionale, ContoEconomico } from '@/types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  ReferenceLine,
} from 'recharts';

export default function GestionalePage() {
  const { esercizio, setEsercizio } = useEsercizio();
  const { data, loading, error } = useBilancio(esercizio);
  const [percCF, setPercCF] = useState(60);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;
  if (!data) return <div className="text-gray-500 p-8">Nessun dato</div>;

  const ce = data.conto_economico as ContoEconomico;

  const costiTotali = ce.totale_costi_operativi;
  const costiFissi = (costiTotali * percCF) / 100;
  const costiVariabili = costiTotali - costiFissi;
  const ricaviTotali = ce.valore_produzione;
  const margineContribuzione = ricaviTotali - costiVariabili;
  const margineContribPerc = ricaviTotali !== 0 ? (margineContribuzione / ricaviTotali) * 100 : 0;
  const bep = margineContribPerc !== 0 ? (costiFissi / margineContribPerc) * 100 : 0;
  const margineSicurezza = ricaviTotali !== 0 ? ((ricaviTotali - bep) / ricaviTotali) * 100 : 0;

  const bepChartData = Array.from({ length: 11 }, (_, i) => {
    const ricavo = (ricaviTotali * i) / 10;
    const cv = (costiVariabili / ricaviTotali) * ricavo;
    const ctot = costiFissi + cv;
    return {
      ricavi: Math.round(ricavo),
      totale_costi: Math.round(ctot),
      costi_fissi: Math.round(costiFissi),
      ricavi_line: Math.round(ricavo),
    };
  });

  const costiPieData = [
    { name: 'Costi Fissi', value: costiFissi },
    { name: 'Costi Variabili', value: costiVariabili },
  ];

  const costiDettaglio = [
    { name: 'Materie prime', value: ce.costi_acquisti, tipo: 'variabile' },
    { name: 'Servizi', value: ce.costi_servizi, tipo: 'variabile' },
    { name: 'Godimento beni', value: ce.godimento_beni_terzi, tipo: 'fisso' },
    { name: 'Personale', value: ce.costi_personale, tipo: 'fisso' },
    { name: 'Ammortamenti', value: ce.ammortamenti, tipo: 'fisso' },
    { name: 'Altri costi', value: ce.altri_costi, tipo: 'variabile' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Analisi Gestionale</h1>
          <p className="page-subtitle">Break-even, margini di contribuzione, analisi costi</p>
        </div>
        <EsercizioSelector value={esercizio} onChange={setEsercizio} />
      </div>

      {/* Parametro costi fissi */}
      <div className="card">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Incidenza Costi Fissi su totale costi: <strong>{percCF}%</strong>
          </label>
          <input
            type="range"
            min="20"
            max="90"
            value={percCF}
            onChange={(e) => setPercCF(parseInt(e.target.value))}
            className="flex-1 accent-blue-600"
          />
          <span className="text-xs text-gray-400">
            CF: {formatCurrency(costiFissi)} | CV: {formatCurrency(costiVariabili)}
          </span>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="flex items-center justify-between"><p className="text-xs font-medium text-gray-500 uppercase">Break-Even Point</p><InfoButton chiave="break_even_point" /></div>
          <p className="text-2xl font-bold text-blue-700">{formatCurrency(bep)}</p>
          <p className="text-xs text-gray-400">Fatturato di pareggio</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center justify-between"><p className="text-xs font-medium text-gray-500 uppercase">Margine Contribuzione</p><InfoButton chiave="margine_contribuzione" /></div>
          <p className="text-2xl font-bold text-green-700">{formatCurrency(margineContribuzione)}</p>
          <p className="text-xs text-gray-400">{margineContribPerc.toFixed(1)}% dei ricavi</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center justify-between"><p className="text-xs font-medium text-gray-500 uppercase">Margine di Sicurezza</p><InfoButton chiave="margine_sicurezza" /></div>
          <p className={`text-2xl font-bold ${margineSicurezza >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {margineSicurezza.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400">Distanza dal BEP</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center justify-between"><p className="text-xs font-medium text-gray-500 uppercase">Risultato Operativo</p><InfoButton chiave="ebit" infoId="ebit_voce" /></div>
          <p className={`text-2xl font-bold ${ce.ebit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatCurrency(ce.ebit)}
          </p>
          <p className="text-xs text-gray-400">EBIT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEP Chart */}
        <div className="card">
          <h3 className="card-header">Grafico Break-Even</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={bepChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="ricavi" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="costi_fissi" stackId="1" stroke="#f59e0b" fill="#fef3c7" name="Costi Fissi" />
              <Area type="monotone" dataKey="totale_costi" stroke="#ef4444" fill="#fee2e2" name="Costi Totali" fillOpacity={0.3} />
              <Area type="monotone" dataKey="ricavi_line" stroke="#10b981" fill="#d1fae5" name="Ricavi" fillOpacity={0.3} />
              <ReferenceLine x={Math.round(bep)} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'BEP', fill: '#3b82f6', fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Costi Pie */}
        <div className="card">
          <h3 className="card-header">Struttura dei Costi</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={costiPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                <Cell fill="#f59e0b" />
                <Cell fill="#8b5cf6" />
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Dettaglio costi per natura</h4>
            <div className="space-y-1">
              {costiDettaglio.map((c) => (
                <div key={c.name} className="flex justify-between items-center text-sm py-1">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${c.tipo === 'fisso' ? 'bg-amber-500' : 'bg-purple-500'}`} />
                    {c.name}
                  </span>
                  <span className="font-mono text-gray-700">{formatCurrency(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Didattica */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="card-header text-blue-900">Approfondimento Didattico</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p><strong>Break-Even Point:</strong></p>
            <p className="mt-1">BEP = Costi Fissi / Margine di Contribuzione %</p>
            <p className="text-xs text-blue-600 mt-1">
              = {formatCurrency(costiFissi)} / {margineContribPerc.toFixed(1)}% = {formatCurrency(bep)}
            </p>
          </div>
          <div>
            <p><strong>Margine di Contribuzione:</strong></p>
            <p className="mt-1">MdC = Ricavi - Costi Variabili</p>
            <p className="text-xs text-blue-600 mt-1">
              = {formatCurrency(ricaviTotali)} - {formatCurrency(costiVariabili)} = {formatCurrency(margineContribuzione)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

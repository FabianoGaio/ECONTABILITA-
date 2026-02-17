'use client';

import { useState } from 'react';
import { useBudget, useEsercizio } from '@/lib/hooks';
import EsercizioSelector from '@/components/ui/EsercizioSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';
import type { Budget } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from 'recharts';

const MESI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

export default function BudgetPage() {
  const { esercizio, esercizioId, setEsercizio } = useEsercizio();
  const { data: budget, loading, error, refetch } = useBudget(esercizio);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ mese: 1, voce: 'Ricavi vendite', importo: 0 });

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;

  const budgetData = budget || [];

  const ricaviBudget = budgetData.filter((b) => b.voce === 'Ricavi vendite');
  const costiBudget = budgetData.filter((b) => b.voce === 'Costi operativi');

  const chartData = MESI.map((mese, i) => {
    const ricavo = ricaviBudget.find((b) => b.mese === i + 1)?.importo || 0;
    const costo = costiBudget.find((b) => b.mese === i + 1)?.importo || 0;
    return {
      mese,
      ricavi: ricavo,
      costi: costo,
      margine: ricavo - costo,
    };
  });

  const totRicavi = ricaviBudget.reduce((s, b) => s + b.importo, 0);
  const totCosti = costiBudget.reduce((s, b) => s + b.importo, 0);

  const cumulativeData = MESI.map((mese, i) => {
    const ricCum = ricaviBudget.filter((b) => b.mese <= i + 1).reduce((s, b) => s + b.importo, 0);
    const cosCum = costiBudget.filter((b) => b.mese <= i + 1).reduce((s, b) => s + b.importo, 0);
    return { mese, ricavi_cum: ricCum, costi_cum: cosCum, margine_cum: ricCum - cosCum };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ esercizio_id: esercizioId, ...form }),
      });
      if (res.ok) {
        refetch();
        setShowForm(false);
      }
    } catch {
      alert('Errore');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Budget e Controllo</h1>
          <p className="page-subtitle">Pianificazione e scostamenti budget vs consuntivo</p>
        </div>
        <div className="flex gap-3">
          <EsercizioSelector value={esercizio} onChange={setEsercizio} />
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Chiudi' : '+ Voce Budget'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h3 className="card-header">Inserisci Voce Budget</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mese</label>
              <select className="select-field" value={form.mese} onChange={(e) => setForm({ ...form, mese: parseInt(e.target.value) })}>
                {MESI.map((m, i) => (<option key={i} value={i + 1}>{m}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Voce</label>
              <select className="select-field" value={form.voce} onChange={(e) => setForm({ ...form, voce: e.target.value })}>
                <option>Ricavi vendite</option>
                <option>Costi operativi</option>
                <option>Costi personale</option>
                <option>Ammortamenti</option>
                <option>Oneri finanziari</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Importo</label>
              <input type="number" step="0.01" className="input-field" value={form.importo || ''} onChange={(e) => setForm({ ...form, importo: parseFloat(e.target.value) || 0 })} required />
            </div>
          </div>
          <button type="submit" className="btn-primary">Salva</button>
        </form>
      )}

      {/* KPI Budget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="kpi-card">
          <p className="text-xs font-medium text-gray-500 uppercase">Budget Ricavi Annuale</p>
          <p className="text-2xl font-bold text-green-700">{formatCurrency(totRicavi)}</p>
        </div>
        <div className="kpi-card">
          <p className="text-xs font-medium text-gray-500 uppercase">Budget Costi Annuale</p>
          <p className="text-2xl font-bold text-red-700">{formatCurrency(totCosti)}</p>
        </div>
        <div className="kpi-card">
          <p className="text-xs font-medium text-gray-500 uppercase">Margine Budget</p>
          <p className={`text-2xl font-bold ${totRicavi - totCosti >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            {formatCurrency(totRicavi - totCosti)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Chart */}
        <div className="card">
          <h3 className="card-header">Budget Mensile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mese" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="ricavi" name="Ricavi" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="costi" name="Costi" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cumulative Chart */}
        <div className="card">
          <h3 className="card-header">Andamento Cumulato</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mese" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="ricavi_cum" name="Ricavi cumulati" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="costi_cum" name="Costi cumulati" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="margine_cum" name="Margine cumulato" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Table */}
      <div className="card">
        <h3 className="card-header">Dettaglio Budget Mensile</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mese</th>
                <th className="text-right">Ricavi Budget</th>
                <th className="text-right">Costi Budget</th>
                <th className="text-right">Margine</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, i) => (
                <tr key={i}>
                  <td className="font-medium">{row.mese}</td>
                  <td className="text-right font-mono text-green-700">{formatCurrency(row.ricavi)}</td>
                  <td className="text-right font-mono text-red-700">{formatCurrency(row.costi)}</td>
                  <td className={`text-right font-mono font-medium ${row.margine >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                    {formatCurrency(row.margine)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td>TOTALE</td>
                <td className="text-right font-mono text-green-700">{formatCurrency(totRicavi)}</td>
                <td className="text-right font-mono text-red-700">{formatCurrency(totCosti)}</td>
                <td className={`text-right font-mono ${totRicavi - totCosti >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                  {formatCurrency(totRicavi - totCosti)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

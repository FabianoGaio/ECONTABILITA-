'use client';

import { useState } from 'react';
import { useScritture, useConti, useEsercizio } from '@/lib/hooks';
import EsercizioSelector from '@/components/ui/EsercizioSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InfoButton from '@/components/ui/InfoButton';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { TipoAssestamento } from '@/types';

const TIPI_ASSESTAMENTO: { value: TipoAssestamento; label: string; description: string; infoKey?: string; infoId?: string }[] = [
  { value: 'ammortamento', label: 'Ammortamento', description: 'Ripartizione costo immobilizzazioni sulla vita utile', infoKey: 'ammortamento', infoId: 'ammortamento_materiali' },
  { value: 'rateo_attivo', label: 'Rateo Attivo', description: 'Ricavo di competenza non ancora rilevato', infoKey: 'rateo_attivo', infoId: 'ratei_attivi' },
  { value: 'rateo_passivo', label: 'Rateo Passivo', description: 'Costo di competenza non ancora rilevato', infoKey: 'rateo_passivo', infoId: 'ratei_passivi' },
  { value: 'risconto_attivo', label: 'Risconto Attivo', description: 'Costo rilevato ma di competenza futura', infoKey: 'risconto_attivo', infoId: 'risconti_attivi' },
  { value: 'risconto_passivo', label: 'Risconto Passivo', description: 'Ricavo rilevato ma di competenza futura', infoKey: 'risconto_passivo' },
  { value: 'accantonamento', label: 'Accantonamento', description: 'Fondi rischi e oneri futuri probabili', infoKey: 'accantonamento', infoId: 'fondi_rischi' },
];

export default function ScrittureAssestamentoPage() {
  const { esercizio, esercizioId, setEsercizio } = useEsercizio();
  const { data: scritture, loading, error, refetch } = useScritture(esercizio);
  const { data: conti } = useConti();
  const [showForm, setShowForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const [form, setForm] = useState({
    data: `${esercizio}-12-31`,
    tipo: 'ammortamento' as TipoAssestamento,
    conto_dare: '',
    conto_avere: '',
    importo: 0,
    descrizione: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/scritture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, esercizio_id: esercizioId }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ data: `${esercizio}-12-31`, tipo: 'ammortamento', conto_dare: '', conto_avere: '', importo: 0, descrizione: '' });
        refetch();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch {
      alert('Errore nel salvataggio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa scrittura?')) return;
    await fetch(`/api/scritture?id=${id}`, { method: 'DELETE' });
    refetch();
  };

  const suggestConti = (tipo: TipoAssestamento) => {
    if (!conti) return;
    switch (tipo) {
      case 'ammortamento': {
        const dare = conti.find((c) => c.sottocategoria === 'ammortamenti');
        const avere = conti.find((c) => c.codice === '1.2.05' || c.codice === '1.1.04');
        if (dare) setForm((f) => ({ ...f, conto_dare: dare.id }));
        if (avere) setForm((f) => ({ ...f, conto_avere: avere.id }));
        break;
      }
      case 'accantonamento': {
        const dare = conti.find((c) => c.codice === '5.8.01' || c.codice === '5.4.03');
        const avere = conti.find((c) => c.sottocategoria === 'fondi_rischi' || c.sottocategoria === 'tfr');
        if (dare) setForm((f) => ({ ...f, conto_dare: dare.id }));
        if (avere) setForm((f) => ({ ...f, conto_avere: avere.id }));
        break;
      }
      case 'risconto_attivo': {
        const dare = conti.find((c) => c.codice === '2.4.02');
        if (dare) setForm((f) => ({ ...f, conto_dare: dare.id }));
        break;
      }
      case 'rateo_passivo': {
        const avere = conti.find((c) => c.codice === '3.6.01');
        if (avere) setForm((f) => ({ ...f, conto_avere: avere.id }));
        break;
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Scritture di Assestamento</h1>
          <p className="page-subtitle">Ammortamenti, ratei, risconti e accantonamenti</p>
        </div>
        <div className="flex gap-3">
          <EsercizioSelector value={esercizio} onChange={setEsercizio} />
          <button onClick={() => setShowGuide(!showGuide)} className="btn-secondary">
            {showGuide ? 'Chiudi Guida' : '? Guida'}
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Chiudi' : '+ Nuova Scrittura'}
          </button>
        </div>
      </div>

      {/* Guida didattica */}
      {showGuide && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="card-header text-blue-900">Guida Scritture di Assestamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIPI_ASSESTAMENTO.map((t) => (
              <div key={t.value} className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-blue-800">{t.label}</h4>
                  <InfoButton chiave={t.infoKey} infoId={t.infoId} />
                </div>
                <p className="text-xs text-gray-600 mt-1">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h3 className="card-header">Nuova Scrittura di Assestamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
              <select
                className="select-field"
                value={form.tipo}
                onChange={(e) => {
                  const tipo = e.target.value as TipoAssestamento;
                  setForm({ ...form, tipo });
                  suggestConti(tipo);
                }}
              >
                {TIPI_ASSESTAMENTO.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Data</label>
              <input type="date" className="input-field" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Importo</label>
              <input type="number" step="0.01" min="0" className="input-field" value={form.importo || ''} onChange={(e) => setForm({ ...form, importo: parseFloat(e.target.value) || 0 })} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Conto DARE</label>
              <select className="select-field" value={form.conto_dare} onChange={(e) => setForm({ ...form, conto_dare: e.target.value })} required>
                <option value="">Seleziona...</option>
                {(conti || []).map((c) => (
                  <option key={c.id} value={c.id}>{c.codice} - {c.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Conto AVERE</label>
              <select className="select-field" value={form.conto_avere} onChange={(e) => setForm({ ...form, conto_avere: e.target.value })} required>
                <option value="">Seleziona...</option>
                {(conti || []).map((c) => (
                  <option key={c.id} value={c.id}>{c.codice} - {c.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Descrizione</label>
              <input className="input-field" value={form.descrizione} onChange={(e) => setForm({ ...form, descrizione: e.target.value })} placeholder="Descrizione" required />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary">Registra</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annulla</button>
          </div>
        </form>
      )}

      {/* Riepilogo per tipo */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {TIPI_ASSESTAMENTO.map((t) => {
          const tot = (scritture || []).filter((s) => s.tipo === t.value).reduce((sum, s) => sum + s.importo, 0);
          const count = (scritture || []).filter((s) => s.tipo === t.value).length;
          return (
            <div key={t.value} className="kpi-card text-center">
              <p className="text-[10px] uppercase text-gray-500">{t.label}</p>
              <p className="text-lg font-bold text-blue-700">{formatCurrency(tot)}</p>
              <p className="text-[10px] text-gray-400">{count} scritture</p>
            </div>
          );
        })}
      </div>

      {/* Tabella */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Conto Dare</th>
              <th>Conto Avere</th>
              <th className="text-right">Importo</th>
              <th>Descrizione</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(scritture || []).map((s) => (
              <tr key={s.id}>
                <td className="font-mono text-xs">{formatDate(s.data)}</td>
                <td>
                  <span className="badge bg-indigo-100 text-indigo-800">{s.tipo.replace(/_/g, ' ')}</span>
                </td>
                <td className="text-sm">{s.conto_dare_rel?.nome || s.conto_dare}</td>
                <td className="text-sm">{s.conto_avere_rel?.nome || s.conto_avere}</td>
                <td className="text-right font-mono font-medium">{formatCurrency(s.importo)}</td>
                <td className="text-gray-600 text-sm">{s.descrizione}</td>
                <td>
                  <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600 text-xs">Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(scritture || []).length === 0 && (
        <div className="text-center py-8 text-gray-400">Nessuna scrittura di assestamento</div>
      )}
    </div>
  );
}

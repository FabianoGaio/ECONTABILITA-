'use client';

import { useState } from 'react';
import { useOperazioni, useConti, useEsercizio } from '@/lib/hooks';
import EsercizioSelector from '@/components/ui/EsercizioSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { DareAvere, PianoConto } from '@/types';

interface RigaScrittura {
  conto_id: string;
  dare_avere: DareAvere;
  importo: number;
}

export default function PrimaNotaPage() {
  const { esercizio, esercizioId, setEsercizio } = useEsercizio();
  const { data: operazioni, loading, error, refetch } = useOperazioni(esercizio);
  const { data: conti } = useConti();
  const [showForm, setShowForm] = useState(false);
  const [descrizione, setDescrizione] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [righe, setRighe] = useState<RigaScrittura[]>([
    { conto_id: '', dare_avere: 'dare', importo: 0 },
    { conto_id: '', dare_avere: 'avere', importo: 0 },
  ]);
  const [filtro, setFiltro] = useState('');

  const totaleDare = righe.filter((r) => r.dare_avere === 'dare').reduce((s, r) => s + r.importo, 0);
  const totaleAvere = righe.filter((r) => r.dare_avere === 'avere').reduce((s, r) => s + r.importo, 0);
  const quadra = Math.abs(totaleDare - totaleAvere) < 0.01 && totaleDare > 0;

  const addRiga = () => setRighe([...righe, { conto_id: '', dare_avere: 'dare', importo: 0 }]);
  const removeRiga = (i: number) => righe.length > 2 && setRighe(righe.filter((_, idx) => idx !== i));

  const updateRiga = (i: number, field: keyof RigaScrittura, value: string | number) => {
    const newRighe = [...righe];
    (newRighe[i] as unknown as Record<string, unknown>)[field] = value;
    setRighe(newRighe);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quadra) {
      alert('La scrittura non quadra! Dare e Avere devono essere uguali.');
      return;
    }

    const payload = righe
      .filter((r) => r.conto_id && r.importo > 0)
      .map((r) => ({
        data,
        conto_id: r.conto_id,
        descrizione,
        importo: r.importo,
        dare_avere: r.dare_avere,
        esercizio_id: esercizioId,
      }));

    try {
      const res = await fetch('/api/operazioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        setDescrizione('');
        setRighe([
          { conto_id: '', dare_avere: 'dare', importo: 0 },
          { conto_id: '', dare_avere: 'avere', importo: 0 },
        ]);
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
    if (!confirm('Eliminare questa operazione?')) return;
    await fetch(`/api/operazioni?id=${id}`, { method: 'DELETE' });
    refetch();
  };

  // Raggruppa per descrizione e data per mostrare le scritture
  const opFiltered = (operazioni || []).filter((op) => {
    if (!filtro) return true;
    const s = filtro.toLowerCase();
    return op.descrizione.toLowerCase().includes(s) || op.conto?.nome.toLowerCase().includes(s);
  });

  // Calcola totali generali
  const totGeneraleDare = opFiltered.filter((o) => o.dare_avere === 'dare').reduce((s, o) => s + o.importo, 0);
  const totGeneraleAvere = opFiltered.filter((o) => o.dare_avere === 'avere').reduce((s, o) => s + o.importo, 0);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Prima Nota</h1>
          <p className="page-subtitle">Registrazione movimenti in partita doppia</p>
        </div>
        <div className="flex gap-3">
          <EsercizioSelector value={esercizio} onChange={setEsercizio} />
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Chiudi' : '+ Nuova Scrittura'}
          </button>
        </div>
      </div>

      {/* Form inserimento partita doppia */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h3 className="card-header">Nuova Scrittura Contabile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Data</label>
              <input type="date" className="input-field" value={data} onChange={(e) => setData(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Descrizione</label>
              <input className="input-field" value={descrizione} onChange={(e) => setDescrizione(e.target.value)} placeholder="Descrizione operazione" required />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Righe contabili</label>
              <button type="button" onClick={addRiga} className="btn-secondary text-xs">+ Aggiungi riga</button>
            </div>
            {righe.map((riga, i) => (
              <div key={i} className="flex gap-3 items-center">
                <select
                  className="select-field flex-1"
                  value={riga.conto_id}
                  onChange={(e) => updateRiga(i, 'conto_id', e.target.value)}
                  required
                >
                  <option value="">Seleziona conto...</option>
                  {(conti || []).map((c) => (
                    <option key={c.id} value={c.id}>{c.codice} - {c.nome}</option>
                  ))}
                </select>
                <select
                  className="select-field w-24"
                  value={riga.dare_avere}
                  onChange={(e) => updateRiga(i, 'dare_avere', e.target.value)}
                >
                  <option value="dare">Dare</option>
                  <option value="avere">Avere</option>
                </select>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-field w-36"
                  value={riga.importo || ''}
                  onChange={(e) => updateRiga(i, 'importo', parseFloat(e.target.value) || 0)}
                  placeholder="Importo"
                  required
                />
                <button type="button" onClick={() => removeRiga(i)} className="text-red-400 hover:text-red-600 text-lg px-2" title="Rimuovi">
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Quadratura */}
          <div className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm ${
            quadra ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex gap-6">
              <span>Dare: <strong className="text-blue-700">{formatCurrency(totaleDare)}</strong></span>
              <span>Avere: <strong className="text-green-700">{formatCurrency(totaleAvere)}</strong></span>
            </div>
            <span className={quadra ? 'text-green-700 font-medium' : 'text-amber-700 font-medium'}>
              {quadra ? '✓ Scrittura quadrata' : '✗ Scrittura non quadra'}
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={!quadra} className="btn-primary">Registra Scrittura</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annulla</button>
          </div>
        </form>
      )}

      {/* Filtro */}
      <input
        className="input-field w-64"
        placeholder="Filtra per descrizione o conto..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {/* Totali generali */}
      <div className="flex gap-6 text-sm">
        <span>Totale Dare: <strong className="text-blue-700">{formatCurrency(totGeneraleDare)}</strong></span>
        <span>Totale Avere: <strong className="text-green-700">{formatCurrency(totGeneraleAvere)}</strong></span>
        <span className={Math.abs(totGeneraleDare - totGeneraleAvere) < 0.01 ? 'text-green-600' : 'text-red-600'}>
          {Math.abs(totGeneraleDare - totGeneraleAvere) < 0.01 ? '✓ Quadratura OK' : '✗ NON QUADRA'}
        </span>
      </div>

      {/* Tabella operazioni */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Conto</th>
              <th>Descrizione</th>
              <th className="text-right">Dare</th>
              <th className="text-right">Avere</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {opFiltered.map((op) => (
              <tr key={op.id}>
                <td className="font-mono text-xs">{formatDate(op.data)}</td>
                <td>
                  <span className="font-mono text-xs text-gray-400">{op.conto?.codice}</span>{' '}
                  <span className="font-medium">{op.conto?.nome}</span>
                </td>
                <td className="text-gray-600">{op.descrizione}</td>
                <td className="text-right font-mono">
                  {op.dare_avere === 'dare' ? (
                    <span className="text-blue-700 font-medium">{formatCurrency(op.importo)}</span>
                  ) : ''}
                </td>
                <td className="text-right font-mono">
                  {op.dare_avere === 'avere' ? (
                    <span className="text-green-700 font-medium">{formatCurrency(op.importo)}</span>
                  ) : ''}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(op.id)}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {opFiltered.length === 0 && (
        <div className="text-center py-8 text-gray-400">Nessuna operazione registrata</div>
      )}
    </div>
  );
}

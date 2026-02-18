'use client';

import { useState } from 'react';
import { useConti, useEsercizio } from '@/lib/hooks';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InfoButton from '@/components/ui/InfoButton';
import { getInfoByCodice } from '@/lib/info-contabili';
import type { PianoConto, Categoria, SezioneBilancio } from '@/types';

const CATEGORIE: { value: Categoria; label: string }[] = [
  { value: 'attivo', label: 'Attivo' },
  { value: 'passivo', label: 'Passivo' },
  { value: 'patrimonio_netto', label: 'Patrimonio Netto' },
  { value: 'ricavi', label: 'Ricavi' },
  { value: 'costi', label: 'Costi' },
];

export default function PianoContiPage() {
  const { esercizioId } = useEsercizio();
  const { data: conti, loading, error, refetch } = useConti();
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [filtroSezione, setFiltroSezione] = useState<string>('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    codice: '',
    nome: '',
    categoria: 'attivo' as Categoria,
    sottocategoria: '',
    sezione_bilancio: 'SP_attivo' as SezioneBilancio,
    voce_ufficiale_oic: '',
  });

  const filtered = (conti || []).filter((c) => {
    if (filtroCategoria && c.categoria !== filtroCategoria) return false;
    if (filtroSezione && c.sezione_bilancio !== filtroSezione) return false;
    if (search) {
      const s = search.toLowerCase();
      return c.codice.toLowerCase().includes(s) || c.nome.toLowerCase().includes(s) || c.voce_ufficiale_oic?.toLowerCase().includes(s);
    }
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/conti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, esercizio_id: esercizioId }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ codice: '', nome: '', categoria: 'attivo', sottocategoria: '', sezione_bilancio: 'SP_attivo', voce_ufficiale_oic: '' });
        refetch();
      }
    } catch {
      alert('Errore nel salvataggio');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Piano dei Conti</h1>
          <p className="page-subtitle">Voci contabili conformi ai principi OIC - {conti?.length || 0} conti</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Chiudi' : '+ Nuovo Conto'}
        </button>
      </div>

      {/* Form inserimento */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h3 className="card-header">Nuovo Conto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Codice</label>
              <input className="input-field" value={form.codice} onChange={(e) => setForm({ ...form, codice: e.target.value })} placeholder="es. 1.1.01" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nome</label>
              <input className="input-field" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome del conto" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Categoria</label>
              <select className="select-field" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}>
                {CATEGORIE.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sottocategoria</label>
              <input className="input-field" value={form.sottocategoria} onChange={(e) => setForm({ ...form, sottocategoria: e.target.value })} placeholder="es. immobilizzazioni_materiali" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sezione Bilancio</label>
              <select className="select-field" value={form.sezione_bilancio} onChange={(e) => setForm({ ...form, sezione_bilancio: e.target.value as SezioneBilancio })}>
                <option value="SP_attivo">SP Attivo</option>
                <option value="SP_passivo">SP Passivo</option>
                <option value="CE_ricavi">CE Ricavi</option>
                <option value="CE_costi">CE Costi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Voce OIC</label>
              <input className="input-field" value={form.voce_ufficiale_oic} onChange={(e) => setForm({ ...form, voce_ufficiale_oic: e.target.value })} placeholder="es. B.II.1 - Terreni" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary">Salva</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annulla</button>
          </div>
        </form>
      )}

      {/* Filtri */}
      <div className="flex flex-wrap gap-3">
        <input
          className="input-field w-full sm:w-64"
          placeholder="Cerca per codice, nome o voce OIC..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select-field w-auto" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="">Tutte le categorie</option>
          {CATEGORIE.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
        </select>
        <select className="select-field w-auto" value={filtroSezione} onChange={(e) => setFiltroSezione(e.target.value)}>
          <option value="">Tutte le sezioni</option>
          <option value="SP_attivo">SP Attivo</option>
          <option value="SP_passivo">SP Passivo</option>
          <option value="CE_ricavi">CE Ricavi</option>
          <option value="CE_costi">CE Costi</option>
        </select>
      </div>

      {/* Tabella */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Codice</th>
              <th>Nome Conto</th>
              <th>Categoria</th>
              <th>Sottocategoria</th>
              <th>Sezione</th>
              <th>Voce OIC</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((conto) => {
              const info = getInfoByCodice(conto.codice);
              return (
              <tr key={conto.id}>
                <td className="font-mono font-medium">{conto.codice}</td>
                <td className="font-medium">
                  <span className="flex items-center gap-1">
                    {conto.nome}
                    {info && <InfoButton codice={conto.codice} />}
                  </span>
                </td>
                <td><span className={`badge badge-${conto.categoria}`}>{conto.categoria.replace('_', ' ')}</span></td>
                <td className="text-xs text-gray-500">{conto.sottocategoria.replace(/_/g, ' ')}</td>
                <td><span className="text-xs font-mono">{conto.sezione_bilancio}</span></td>
                <td className="text-xs text-gray-500 max-w-[200px] truncate">{conto.voce_ufficiale_oic}</td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-400">Nessun conto trovato</div>
      )}
    </div>
  );
}

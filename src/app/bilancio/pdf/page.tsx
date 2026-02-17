'use client';

import { useState } from 'react';
import { useBilancio, useEsercizio } from '@/lib/hooks';
import EsercizioSelector from '@/components/ui/EsercizioSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';
import { generaBilancioPDF } from '@/lib/pdf-bilancio';
import type { StatoPatrimoniale, ContoEconomico, RendicontoFinanziario, Riclassificazione, IndiciAnalisi, ScritturaAssestamento, PianoConto } from '@/types';

export default function BilancioPDFPage() {
  const { esercizio, setEsercizio } = useEsercizio();
  const { data, loading, error } = useBilancio(esercizio);
  const [ragioneSociale, setRagioneSociale] = useState('Società Didattica S.r.l.');
  const [generating, setGenerating] = useState(false);

  const handleGenera = async () => {
    if (!data) return;
    setGenerating(true);
    try {
      const doc = generaBilancioPDF({
        esercizio,
        ragioneSociale,
        sp: data.stato_patrimoniale as StatoPatrimoniale,
        ce: data.conto_economico as ContoEconomico,
        rf: data.rendiconto_finanziario as RendicontoFinanziario,
        ricl: data.riclassificazione as Riclassificazione,
        indici: data.indici as IndiciAnalisi,
        scritture: data.scritture as ScritturaAssestamento[],
        conti: data.conti as PianoConto[],
      });
      doc.save(`Bilancio_${esercizio}_${ragioneSociale.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      alert('Errore nella generazione del PDF');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;
  if (!data) return <div className="text-gray-500 p-8">Nessun dato disponibile</div>;

  const sp = data.stato_patrimoniale as StatoPatrimoniale;
  const ce = data.conto_economico as ContoEconomico;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Genera Bilancio PDF</h1>
          <p className="page-subtitle">Fac-simile bilancio ufficiale stile CCIAA</p>
        </div>
        <EsercizioSelector value={esercizio} onChange={setEsercizio} />
      </div>

      {/* Configurazione */}
      <div className="card">
        <h3 className="card-header">Configurazione Documento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ragione Sociale</label>
            <input
              className="input-field"
              value={ragioneSociale}
              onChange={(e) => setRagioneSociale(e.target.value)}
              placeholder="Nome società"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Esercizio</label>
            <p className="text-lg font-bold text-gray-800 py-2">
              01/01/{esercizio} - 31/12/{esercizio}
            </p>
          </div>
        </div>
      </div>

      {/* Anteprima */}
      <div className="card">
        <h3 className="card-header">Anteprima Contenuto PDF</h3>
        <p className="text-sm text-gray-500 mb-4">Il documento conterrà le seguenti sezioni:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800">1. Stato Patrimoniale</h4>
            <p className="text-xs text-blue-600 mt-1">Schema civilistico art. 2424 c.c.</p>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Totale Attivo</span>
                <span className="font-mono">{formatCurrency(sp.attivo.totale_attivo)}</span>
              </div>
              <div className="flex justify-between">
                <span>Totale Passivo</span>
                <span className="font-mono">{formatCurrency(sp.passivo.totale_passivo)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Quadratura</span>
                <span className={sp.quadratura ? 'text-green-700' : 'text-red-700'}>
                  {sp.quadratura ? 'OK' : 'NON QUADRA'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-800">2. Conto Economico</h4>
            <p className="text-xs text-green-600 mt-1">Schema civilistico art. 2425 c.c.</p>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Valore Produzione</span>
                <span className="font-mono">{formatCurrency(ce.valore_produzione)}</span>
              </div>
              <div className="flex justify-between">
                <span>EBITDA</span>
                <span className="font-mono">{formatCurrency(ce.ebitda)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Utile Netto</span>
                <span className={`font-mono ${ce.utile_netto >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {formatCurrency(ce.utile_netto)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-800">3. Rendiconto Finanziario</h4>
            <p className="text-xs text-purple-600 mt-1">Metodo indiretto OIC 10</p>
            <div className="mt-2 text-xs text-purple-700">
              Cash flow operativo, investimenti, finanziamenti
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800">4. Prospetto Riclassificato</h4>
            <p className="text-xs text-amber-600 mt-1">Impieghi e Fonti</p>
            <div className="mt-2 text-xs text-amber-700">
              Criterio finanziario, CCN, margine di struttura
            </div>
          </div>

          <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
            <h4 className="text-sm font-semibold text-sky-800">5. Indici Principali</h4>
            <p className="text-xs text-sky-600 mt-1">Solidità, liquidità, redditività, efficienza</p>
            <div className="mt-2 text-xs text-sky-700">
              ROE, ROI, ROS, Current Ratio, Quick Ratio, DSO, DPO
            </div>
          </div>

          <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
            <h4 className="text-sm font-semibold text-rose-800">6. Scritture di Assestamento</h4>
            <p className="text-xs text-rose-600 mt-1">Evidenza rettifiche di fine esercizio</p>
            <div className="mt-2 text-xs text-rose-700">
              {data.scritture?.length || 0} scritture registrate
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenera}
          disabled={generating}
          className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generazione in corso...
            </span>
          ) : (
            'Genera e Scarica PDF Bilancio'
          )}
        </button>
      </div>

      {/* Note */}
      <div className="card bg-gray-50 border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Il documento generato è un <strong>FAC-SIMILE a scopo didattico</strong>.
          Non ha validità legale. La struttura segue lo schema civilistico previsto dagli artt. 2424 e 2425 del Codice Civile
          e i principi contabili OIC.
        </p>
      </div>
    </div>
  );
}

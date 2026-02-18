'use client';

import { useStudy } from '@/lib/study-context';
import { getCollegamenti, type InfoContabile } from '@/lib/info-contabili';

function Section({ title, content, color }: { title: string; content: string; color: string }) {
  if (!content) return null;
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    slate: 'bg-slate-50 border-slate-200 text-slate-900',
  };
  const titleColors: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    slate: 'text-slate-600',
  };
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${colorClasses[color] || colorClasses.slate}`}>
      <h4 className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${titleColors[color] || titleColors.slate}`}>{title}</h4>
      <p className="text-xs leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}

export default function StudyPanel() {
  const { panelOpen, closePanel, selectedInfo, openPanel } = useStudy();

  if (!panelOpen || !selectedInfo) return null;

  const collegamenti = getCollegamenti(selectedInfo.id);

  const categoryLabels: Record<string, string> = {
    conto_attivo: 'Conto Attivo',
    conto_passivo: 'Conto Passivo',
    conto_pn: 'Patrimonio Netto',
    conto_ricavo: 'Conto Ricavo',
    conto_costo: 'Conto Costo',
    voce_bilancio: 'Voce di Bilancio',
    indice: 'Indice',
    assestamento: 'Assestamento',
    finanziario: 'Finanziario',
    gestionale: 'Gestionale',
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-5 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded">
                {categoryLabels[selectedInfo.categoria] || selectedInfo.categoria}
              </span>
              {selectedInfo.codice_conto && (
                <span className="text-[9px] font-mono bg-white/10 px-1.5 py-0.5 rounded">
                  {selectedInfo.codice_conto}
                </span>
              )}
            </div>
            <h2 className="text-base font-bold leading-tight">{selectedInfo.titolo}</h2>
          </div>
          <button onClick={closePanel} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-lg flex-shrink-0 ml-2">
            x
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {/* Definizione */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Definizione Teorica</h3>
          <p className="text-sm text-gray-800 leading-relaxed">{selectedInfo.definizione}</p>
        </div>

        {/* Spiegazione */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Spiegazione Pratica</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{selectedInfo.spiegazione}</p>
        </div>

        {/* Formula */}
        {selectedInfo.formula && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2.5">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-indigo-600">Formula</h4>
            <p className="text-xs font-mono text-indigo-900 whitespace-pre-line">{selectedInfo.formula}</p>
          </div>
        )}

        {/* Collocazione nel bilancio */}
        <Section title="Collocazione nel Bilancio" content={selectedInfo.collocazione_bilancio} color="blue" />

        {/* Scrittura tipica */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-slate-600">Scrittura Contabile Tipica</h4>
          <pre className="text-xs text-slate-800 font-mono whitespace-pre-line leading-relaxed">{selectedInfo.scrittura_tipica}</pre>
        </div>

        {/* Esempio pratico */}
        <Section title="Esempio Reale" content={selectedInfo.esempio_pratico} color="green" />

        {/* Effetti */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Impatto su...</h3>
          <div className="space-y-2">
            <Section title="Effetto sull'Utile" content={selectedInfo.effetto_utile} color="purple" />
            <Section title="Effetto sulla Cassa" content={selectedInfo.effetto_cassa} color="amber" />
            <Section title="Effetto sugli Indici" content={selectedInfo.effetto_indici} color="red" />
            <Section title="Effetto sul Bilancio" content={selectedInfo.effetto_bilancio} color="blue" />
          </div>
        </div>

        {/* Normativa */}
        {selectedInfo.normativa && (
          <Section title="Riferimento Normativo" content={selectedInfo.normativa} color="slate" />
        )}

        {/* Collegamenti */}
        {collegamenti.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Collegamenti Dinamici</h3>
            <div className="flex flex-wrap gap-1.5">
              {collegamenti.map(col => (
                <button
                  key={col.id}
                  onClick={() => openPanel(col)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-[11px] rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <span className="text-blue-400">→</span>
                  {col.titolo}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-[10px] text-gray-400 text-center">Modalit&agrave; Studio - Clicca i link per navigare tra le voci</p>
      </div>
    </div>
  );
}

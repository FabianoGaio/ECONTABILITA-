'use client';

import { useState } from 'react';
import { getDefinizione, type Definizione } from '@/lib/definizioni';
import { getInfoById, getInfoByCodice, getCollegamenti, type InfoContabile } from '@/lib/info-contabili';
import { useStudy } from '@/lib/study-context';

interface InfoButtonProps {
  chiave?: string;
  codice?: string;
  infoId?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function InfoButton({ chiave, codice, infoId, size = 'sm', className = '' }: InfoButtonProps) {
  const [open, setOpen] = useState(false);
  const study = useStudy();

  const def = chiave ? getDefinizione(chiave) : null;
  const info = codice ? getInfoByCodice(codice) : infoId ? getInfoById(infoId) : null;

  if (!def && !info) return null;

  const sizeClasses = size === 'sm'
    ? 'w-4 h-4 text-[10px]'
    : 'w-5 h-5 text-xs';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (info && study.studyMode) {
      study.openPanel(info);
    } else {
      setOpen(true);
    }
  };

  const collegamenti = info ? getCollegamenti(info.id) : [];

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition-colors flex-shrink-0 font-bold ${sizeClasses} ${className}`}
        title={`Info: ${info?.titolo || def?.titolo || ''}`}
      >
        i
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/40" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-white/20 rounded text-[10px] uppercase tracking-wider mb-1">
                    {info?.categoria || def?.categoria || ''}
                  </span>
                  <h2 className="text-lg font-bold">{info?.titolo || def?.titolo}</h2>
                  {info?.codice_conto && (
                    <span className="text-blue-200 text-xs font-mono">Codice: {info.codice_conto}</span>
                  )}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-xl"
                >
                  x
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Definizione */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Definizione Teorica</h3>
                <p className="text-sm text-gray-800 leading-relaxed">{info?.definizione || def?.definizione}</p>
              </div>

              {/* Spiegazione (solo info) */}
              {info?.spiegazione && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Spiegazione Pratica</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{info.spiegazione}</p>
                </div>
              )}

              {/* Formula */}
              {(info?.formula || def?.formula) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Formula</h3>
                  <p className="text-sm text-blue-900 font-mono whitespace-pre-line">{info?.formula || def?.formula}</p>
                </div>
              )}

              {/* Collocazione bilancio */}
              {info?.collocazione_bilancio && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
                  <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Collocazione nel Bilancio</h3>
                  <p className="text-sm text-indigo-900">{info.collocazione_bilancio}</p>
                </div>
              )}

              {/* Scrittura tipica */}
              {info?.scrittura_tipica && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Scrittura Contabile Tipica</h3>
                  <pre className="text-xs text-slate-800 font-mono whitespace-pre-line leading-relaxed">{info.scrittura_tipica}</pre>
                </div>
              )}

              {/* Normativa */}
              {(info?.normativa || def?.normativa) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                  <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Riferimento Normativo</h3>
                  <p className="text-sm text-amber-900">{info?.normativa || def?.normativa}</p>
                </div>
              )}

              {/* Esempio */}
              {(info?.esempio_pratico || def?.esempio) && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <h3 className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Esempio Reale</h3>
                  <p className="text-sm text-green-900">{info?.esempio_pratico || def?.esempio}</p>
                </div>
              )}

              {/* Effetti (solo info) */}
              {info && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Impatto su...</h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                    <h4 className="text-[10px] font-semibold text-purple-600 uppercase mb-1">Utile</h4>
                    <p className="text-sm text-purple-900">{info.effetto_utile}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    <h4 className="text-[10px] font-semibold text-amber-600 uppercase mb-1">Cassa</h4>
                    <p className="text-sm text-amber-900">{info.effetto_cassa}</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <h4 className="text-[10px] font-semibold text-red-600 uppercase mb-1">Indici</h4>
                    <p className="text-sm text-red-900">{info.effetto_indici}</p>
                  </div>
                </div>
              )}

              {/* Interpretazione (solo def) */}
              {def?.interpretazione && !info && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Interpretazione</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{def.interpretazione}</p>
                </div>
              )}

              {/* Collegamenti */}
              {collegamenti.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Voci Collegate</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {collegamenti.map(col => (
                      <button
                        key={col.id}
                        onClick={() => {
                          setOpen(false);
                          if (study.studyMode) {
                            study.openPanel(col);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 border border-blue-200"
                      >
                        {col.titolo}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Study mode hint */}
              {info && !study.studyMode && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                  <p className="text-xs text-gray-500">Attiva la <strong>Modalita Studio</strong> nella sidebar per navigare tra le voci collegate e aprire il pannello laterale.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

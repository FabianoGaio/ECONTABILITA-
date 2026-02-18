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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden flex flex-col sm:m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-700 to-blue-600 text-white px-5 sm:px-6 py-4 rounded-t-2xl flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="inline-block px-2 py-0.5 bg-white/20 rounded text-[10px] uppercase tracking-wider font-medium">
                      {info?.categoria?.replace(/_/g, ' ') || def?.categoria || ''}
                    </span>
                    {info?.codice_conto && (
                      <span className="inline-block px-2 py-0.5 bg-white/10 rounded text-[10px] font-mono">
                        {info.codice_conto}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold leading-tight">{info?.titolo || def?.titolo}</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-lg flex-shrink-0 mt-0.5"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
              {/* Definizione */}
              <div>
                <h3 className="info-section-title">Definizione Teorica</h3>
                <p className="info-text">{info?.definizione || def?.definizione}</p>
              </div>

              {/* Spiegazione */}
              {info?.spiegazione && (
                <div>
                  <h3 className="info-section-title">Spiegazione Pratica</h3>
                  <p className="info-text text-gray-600">{info.spiegazione}</p>
                </div>
              )}

              {/* Formula */}
              {(info?.formula || def?.formula) && (
                <div className="info-box bg-blue-50 border-blue-200">
                  <h3 className="info-box-title text-blue-700">Formula</h3>
                  <pre className="text-sm text-blue-900 font-mono whitespace-pre-wrap leading-relaxed">{info?.formula || def?.formula}</pre>
                </div>
              )}

              {/* Collocazione bilancio */}
              {info?.collocazione_bilancio && (
                <div className="info-box bg-indigo-50 border-indigo-200">
                  <h3 className="info-box-title text-indigo-700">Collocazione nel Bilancio</h3>
                  <p className="info-text text-indigo-900">{info.collocazione_bilancio}</p>
                </div>
              )}

              {/* Scrittura tipica */}
              {info?.scrittura_tipica && (
                <div className="info-box bg-slate-50 border-slate-200">
                  <h3 className="info-box-title text-slate-700">Scrittura Contabile Tipica</h3>
                  <pre className="text-[13px] text-slate-800 font-mono whitespace-pre-wrap leading-[1.7] overflow-x-auto">{info.scrittura_tipica}</pre>
                </div>
              )}

              {/* Normativa */}
              {(info?.normativa || def?.normativa) && (
                <div className="info-box bg-amber-50 border-amber-200">
                  <h3 className="info-box-title text-amber-700">Riferimento Normativo</h3>
                  <p className="info-text text-amber-900">{info?.normativa || def?.normativa}</p>
                </div>
              )}

              {/* Esempio */}
              {(info?.esempio_pratico || def?.esempio) && (
                <div className="info-box bg-green-50 border-green-200">
                  <h3 className="info-box-title text-green-700">Esempio Reale</h3>
                  <p className="info-text text-green-900">{info?.esempio_pratico || def?.esempio}</p>
                </div>
              )}

              {/* Effetti */}
              {info && (
                <div>
                  <h3 className="info-section-title mb-2.5">Impatto su...</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="info-box bg-purple-50 border-purple-200">
                      <h4 className="info-box-title text-purple-700">Utile</h4>
                      <p className="text-[13px] leading-relaxed text-purple-900">{info.effetto_utile}</p>
                    </div>
                    <div className="info-box bg-amber-50 border-amber-200">
                      <h4 className="info-box-title text-amber-700">Cassa</h4>
                      <p className="text-[13px] leading-relaxed text-amber-900">{info.effetto_cassa}</p>
                    </div>
                    <div className="info-box bg-red-50 border-red-200">
                      <h4 className="info-box-title text-red-700">Indici</h4>
                      <p className="text-[13px] leading-relaxed text-red-900">{info.effetto_indici}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Interpretazione (solo def) */}
              {def?.interpretazione && !info && (
                <div>
                  <h3 className="info-section-title">Interpretazione</h3>
                  <p className="info-text text-gray-600">{def.interpretazione}</p>
                </div>
              )}

              {/* Collegamenti */}
              {collegamenti.length > 0 && (
                <div>
                  <h3 className="info-section-title mb-2">Voci Collegate</h3>
                  <div className="flex flex-wrap gap-2">
                    {collegamenti.map(col => (
                      <button
                        key={col.id}
                        onClick={() => {
                          setOpen(false);
                          if (study.studyMode) {
                            study.openPanel(col);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-[13px] rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        <span className="text-blue-400">→</span>
                        {col.titolo}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Study mode hint */}
              {info && !study.studyMode && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                  <p className="text-[13px] text-gray-500">Attiva la <strong>Modalita Studio</strong> nella sidebar per navigare tra le voci collegate.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

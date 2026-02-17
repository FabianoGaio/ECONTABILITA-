'use client';

import { useState, useMemo } from 'react';
import { useStudy } from '@/lib/study-context';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface Scenario {
  ricavi: number;
  costi_variabili: number;
  costi_fissi: number;
  ammortamenti: number;
  interessi: number;
  imposte_perc: number;
  crediti: number;
  rimanenze: number;
  debiti_fornitori: number;
  immobilizzazioni: number;
  patrimonio_netto: number;
  debiti_finanziari: number;
}

const BASE: Scenario = {
  ricavi: 1000000,
  costi_variabili: 400000,
  costi_fissi: 250000,
  ammortamenti: 50000,
  interessi: 15000,
  imposte_perc: 27.9,
  crediti: 150000,
  rimanenze: 80000,
  debiti_fornitori: 100000,
  immobilizzazioni: 500000,
  patrimonio_netto: 400000,
  debiti_finanziari: 200000,
};

function calcola(s: Scenario) {
  const ebitda = s.ricavi - s.costi_variabili - s.costi_fissi;
  const ebit = ebitda - s.ammortamenti;
  const utile_ante = ebit - s.interessi;
  const imposte = utile_ante > 0 ? utile_ante * s.imposte_perc / 100 : 0;
  const utile = utile_ante - imposte;

  const attivo_corrente = s.crediti + s.rimanenze + 50000;
  const totale_attivo = s.immobilizzazioni + attivo_corrente;
  const passivo_corrente = s.debiti_fornitori + 30000;

  const mdc = s.ricavi - s.costi_variabili;
  const mdc_perc = s.ricavi > 0 ? (mdc / s.ricavi) * 100 : 0;
  const bep = mdc_perc > 0 ? (s.costi_fissi + s.ammortamenti) / (mdc_perc / 100) : 0;

  return {
    ebitda,
    ebit,
    utile_ante,
    utile,
    totale_attivo,
    roe: s.patrimonio_netto > 0 ? (utile / s.patrimonio_netto) * 100 : 0,
    roi: totale_attivo > 0 ? (ebit / totale_attivo) * 100 : 0,
    ros: s.ricavi > 0 ? (ebit / s.ricavi) * 100 : 0,
    ebitda_margin: s.ricavi > 0 ? (ebitda / s.ricavi) * 100 : 0,
    current_ratio: passivo_corrente > 0 ? attivo_corrente / passivo_corrente : 0,
    leverage: s.patrimonio_netto > 0 ? totale_attivo / s.patrimonio_netto : 0,
    autonomia: totale_attivo > 0 ? (s.patrimonio_netto / totale_attivo) * 100 : 0,
    bep,
    mdc_perc,
    cf_operativo: utile + s.ammortamenti,
    dso: s.ricavi > 0 ? (s.crediti / s.ricavi) * 365 : 0,
    dpo: (s.costi_variabili + s.costi_fissi) > 0 ? (s.debiti_fornitori / (s.costi_variabili + s.costi_fissi)) * 365 : 0,
  };
}

function Delta({ base, modified, format = 'currency' }: { base: number; modified: number; format?: string }) {
  const diff = modified - base;
  if (Math.abs(diff) < 0.01) return <span className="text-gray-400 text-[10px]">--</span>;

  const color = diff > 0 ? 'text-green-600' : 'text-red-600';
  const arrow = diff > 0 ? '▲' : '▼';
  const formatted = format === 'percentage' ? `${Math.abs(diff).toFixed(1)}pp` : formatCurrency(Math.abs(diff));

  return <span className={`text-[10px] font-medium ${color}`}>{arrow} {formatted}</span>;
}

function ResultRow({ label, baseVal, modVal, format = 'currency' }: { label: string; baseVal: number; modVal: number; format?: string }) {
  const fmtBase = format === 'percentage' ? `${baseVal.toFixed(1)}%` : format === 'ratio' ? `${baseVal.toFixed(2)}x` : format === 'days' ? `${baseVal.toFixed(0)} gg` : formatCurrency(baseVal);
  const fmtMod = format === 'percentage' ? `${modVal.toFixed(1)}%` : format === 'ratio' ? `${modVal.toFixed(2)}x` : format === 'days' ? `${modVal.toFixed(0)} gg` : formatCurrency(modVal);

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
      <span className="text-xs text-gray-600">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-gray-400 w-20 text-right">{fmtBase}</span>
        <span className="text-xs text-gray-300">→</span>
        <span className="text-xs font-mono font-medium w-20 text-right">{fmtMod}</span>
        <div className="w-16 text-right"><Delta base={baseVal} modified={modVal} format={format === 'percentage' ? 'percentage' : 'currency'} /></div>
      </div>
    </div>
  );
}

export default function SimulazionePanel() {
  const { simulationOpen, closeSimulation } = useStudy();
  const [scenario, setScenario] = useState<Scenario>({ ...BASE });

  const baseResults = useMemo(() => calcola(BASE), []);
  const modResults = useMemo(() => calcola(scenario), [scenario]);

  if (!simulationOpen) return null;

  const handleChange = (field: keyof Scenario, value: number) => {
    setScenario(prev => ({ ...prev, [field]: value }));
  };

  const sliders: { field: keyof Scenario; label: string; min: number; max: number; step: number }[] = [
    { field: 'ricavi', label: 'Ricavi vendite', min: 0, max: 2000000, step: 10000 },
    { field: 'costi_variabili', label: 'Costi variabili', min: 0, max: 1000000, step: 10000 },
    { field: 'costi_fissi', label: 'Costi fissi', min: 0, max: 500000, step: 5000 },
    { field: 'ammortamenti', label: 'Ammortamenti', min: 0, max: 200000, step: 5000 },
    { field: 'interessi', label: 'Interessi passivi', min: 0, max: 50000, step: 1000 },
    { field: 'crediti', label: 'Crediti vs clienti', min: 0, max: 500000, step: 10000 },
    { field: 'rimanenze', label: 'Rimanenze', min: 0, max: 300000, step: 5000 },
    { field: 'debiti_fornitori', label: 'Debiti fornitori', min: 0, max: 300000, step: 5000 },
    { field: 'immobilizzazioni', label: 'Immobilizzazioni nette', min: 0, max: 1500000, step: 10000 },
    { field: 'patrimonio_netto', label: 'Patrimonio netto', min: 50000, max: 1000000, step: 10000 },
    { field: 'debiti_finanziari', label: 'Debiti finanziari', min: 0, max: 500000, step: 10000 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex" onClick={closeSimulation}>
      <div className="fixed inset-0 bg-black/30" />
      <div className="relative ml-auto w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Simulazione What-If</h2>
              <p className="text-purple-200 text-xs">Modifica i valori e osserva l&apos;impatto su tutti gli indicatori</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setScenario({ ...BASE })}
                className="px-3 py-1 bg-white/20 text-white text-xs rounded-md hover:bg-white/30"
              >
                Reset
              </button>
              <button onClick={closeSimulation} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-lg">
                x
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            {/* Left: Sliders */}
            <div className="p-4 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Parametri</h3>
              {sliders.map(s => (
                <div key={s.field}>
                  <div className="flex justify-between mb-0.5">
                    <label className="text-[11px] text-gray-600">{s.label}</label>
                    <span className="text-[11px] font-mono text-gray-800">{formatCurrency(scenario[s.field])}</span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={scenario[s.field]}
                    onChange={e => handleChange(s.field, Number(e.target.value))}
                    className="w-full h-1.5 accent-purple-600"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400">
                    <span>{formatCurrency(s.min)}</span>
                    <span className="text-purple-400 font-medium">Base: {formatCurrency(BASE[s.field])}</span>
                    <span>{formatCurrency(s.max)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Results */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Risultati (Base → Modificato)</h3>

              <p className="text-[10px] font-semibold text-gray-400 uppercase mt-3 mb-1">Conto Economico</p>
              <ResultRow label="EBITDA" baseVal={baseResults.ebitda} modVal={modResults.ebitda} />
              <ResultRow label="EBIT" baseVal={baseResults.ebit} modVal={modResults.ebit} />
              <ResultRow label="Utile Netto" baseVal={baseResults.utile} modVal={modResults.utile} />
              <ResultRow label="CF Operativo (proxy)" baseVal={baseResults.cf_operativo} modVal={modResults.cf_operativo} />

              <p className="text-[10px] font-semibold text-gray-400 uppercase mt-4 mb-1">Redditivita</p>
              <ResultRow label="ROE" baseVal={baseResults.roe} modVal={modResults.roe} format="percentage" />
              <ResultRow label="ROI" baseVal={baseResults.roi} modVal={modResults.roi} format="percentage" />
              <ResultRow label="ROS" baseVal={baseResults.ros} modVal={modResults.ros} format="percentage" />
              <ResultRow label="EBITDA margin" baseVal={baseResults.ebitda_margin} modVal={modResults.ebitda_margin} format="percentage" />

              <p className="text-[10px] font-semibold text-gray-400 uppercase mt-4 mb-1">Solidita e Liquidita</p>
              <ResultRow label="Current Ratio" baseVal={baseResults.current_ratio} modVal={modResults.current_ratio} format="ratio" />
              <ResultRow label="Leverage" baseVal={baseResults.leverage} modVal={modResults.leverage} format="ratio" />
              <ResultRow label="Autonomia Fin." baseVal={baseResults.autonomia} modVal={modResults.autonomia} format="percentage" />

              <p className="text-[10px] font-semibold text-gray-400 uppercase mt-4 mb-1">Gestionale</p>
              <ResultRow label="Break-Even Point" baseVal={baseResults.bep} modVal={modResults.bep} />
              <ResultRow label="MdC %" baseVal={baseResults.mdc_perc} modVal={modResults.mdc_perc} format="percentage" />
              <ResultRow label="DSO" baseVal={baseResults.dso} modVal={modResults.dso} format="days" />
              <ResultRow label="DPO" baseVal={baseResults.dpo} modVal={modResults.dpo} format="days" />

              {/* Insight box */}
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="text-[10px] font-semibold text-purple-600 uppercase mb-1">Insight Didattico</h4>
                <p className="text-xs text-purple-800 leading-relaxed">
                  {modResults.roi > (scenario.interessi / scenario.debiti_finanziari * 100)
                    ? 'La leva finanziaria e\' POSITIVA: il ROI supera il costo del debito. Indebitarsi crea valore per i soci (ROE > ROI).'
                    : 'La leva finanziaria e\' NEGATIVA: il ROI e\' inferiore al costo del debito. L\'indebitamento distrugge valore (ROE < ROI).'
                  }
                  {modResults.current_ratio < 1 && ' ATTENZIONE: Current ratio < 1 indica tensione di liquidita.'}
                  {modResults.bep > scenario.ricavi && ' ATTENZIONE: I ricavi sono sotto il break-even point - l\'azienda e\' in perdita operativa.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

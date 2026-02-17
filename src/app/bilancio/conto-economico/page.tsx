'use client';

import { useBilancio, useEsercizio } from '@/lib/hooks';
import EsercizioSelector from '@/components/ui/EsercizioSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InfoButton from '@/components/ui/InfoButton';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { formatCurrency } from '@/lib/utils';
import type { ContoEconomico } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function Row({ label, value, indent = false, negative = false, infoId, chiave }: { label: string; value: number; indent?: boolean; negative?: boolean; infoId?: string; chiave?: string }) {
  return (
    <div className="bilancio-row">
      <span className={`flex items-center gap-1 ${indent ? 'pl-4 text-gray-600' : ''}`}>
        {infoId ? <InfoTooltip infoId={infoId}>{label}</InfoTooltip> : label}
        {(infoId || chiave) && <InfoButton infoId={infoId} chiave={chiave} size="sm" />}
      </span>
      <span className={`font-mono ${negative ? 'text-red-600' : 'text-gray-800'}`}>
        {negative ? `(${formatCurrency(value)})` : formatCurrency(value)}
      </span>
    </div>
  );
}

function SubTotal({ label, value }: { label: string; value: number }) {
  return (
    <div className="bilancio-row-bold">
      <span>{label}</span>
      <span className={`font-mono ${value >= 0 ? 'text-blue-700' : 'text-red-700'}`}>{formatCurrency(value)}</span>
    </div>
  );
}

function Total({ label, value }: { label: string; value: number }) {
  return (
    <div className="bilancio-total">
      <span>{label}</span>
      <span className={`font-mono ${value >= 0 ? '' : 'text-red-700'}`}>{formatCurrency(value)}</span>
    </div>
  );
}

export default function ContoEconomicoPage() {
  const { esercizio, setEsercizio } = useEsercizio();
  const { data, loading, error } = useBilancio(esercizio);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;
  if (!data) return <div className="text-gray-500 p-8">Nessun dato</div>;

  const ce = data.conto_economico as ContoEconomico;

  const marginiData = [
    { name: 'Valore Prod.', valore: ce.valore_produzione, fill: '#10b981' },
    { name: 'EBITDA', valore: ce.ebitda, fill: '#3b82f6' },
    { name: 'EBIT', valore: ce.ebit, fill: '#8b5cf6' },
    { name: 'Utile Ante Imp.', valore: ce.utile_ante_imposte, fill: '#f59e0b' },
    { name: 'Utile Netto', valore: ce.utile_netto, fill: ce.utile_netto >= 0 ? '#22c55e' : '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Conto Economico</h1>
          <p className="page-subtitle">Schema civilistico ex art. 2425 c.c.</p>
        </div>
        <EsercizioSelector value={esercizio} onChange={setEsercizio} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CE Dettagliato */}
        <div className="lg:col-span-2 card">
          <h3 className="card-header">Conto Economico Esercizio {esercizio}</h3>

          <div className="space-y-1 mb-4">
            <h4 className="section-title text-sm text-green-700">A) VALORE DELLA PRODUZIONE</h4>
            <Row label="1) Ricavi vendite e prestazioni" value={ce.ricavi_vendite} indent infoId="ricavi_vendite" />
            <Row label="2) Variazioni rimanenze" value={ce.variazione_rimanenze} indent infoId="rimanenze_pf" />
            <Row label="5) Altri ricavi e proventi" value={ce.altri_ricavi} indent />
            <div className="flex items-center gap-2"><SubTotal label="Totale valore della produzione (A)" value={ce.valore_produzione} /><InfoButton chiave="valore_produzione" /></div>
          </div>

          <div className="space-y-1 mb-4">
            <h4 className="section-title text-sm text-red-700">B) COSTI DELLA PRODUZIONE</h4>
            <Row label="6) Per materie prime, sussidiarie" value={ce.costi_acquisti} indent negative />
            <Row label="7) Per servizi" value={ce.costi_servizi} indent negative />
            <Row label="8) Per godimento beni di terzi" value={ce.godimento_beni_terzi} indent negative />
            <Row label="9) Per il personale" value={ce.costi_personale} indent negative />
            <Row label="10) Ammortamenti e svalutazioni" value={ce.ammortamenti} indent negative infoId="ammortamento_materiali" />
            <Row label="12-14) Altri costi operativi" value={ce.altri_costi} indent negative />
            <SubTotal label="Totale costi produzione (B)" value={ce.totale_costi_operativi} />
          </div>

          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2"><SubTotal label="EBITDA (Margine Operativo Lordo)" value={ce.ebitda} /><InfoButton chiave="ebitda" infoId="ebitda_voce" /></div>
            <div className="flex items-center gap-2"><SubTotal label="Differenza (A-B) = EBIT" value={ce.ebit} /><InfoButton chiave="ebit" infoId="ebit_voce" /></div>
          </div>

          <div className="space-y-1 mb-4">
            <h4 className="section-title text-sm text-amber-700">C) PROVENTI E ONERI FINANZIARI</h4>
            <Row label="16) Proventi finanziari" value={ce.proventi_finanziari} indent />
            <Row label="17) Oneri finanziari" value={ce.oneri_finanziari} indent negative infoId="interessi_passivi" />
          </div>

          <div className="space-y-1 mb-4">
            <SubTotal label="Risultato prima delle imposte" value={ce.utile_ante_imposte} />
            <Row label="20) Imposte sul reddito" value={ce.imposte} indent negative />
          </div>

          <div className="flex items-center gap-2"><Total label="21) UTILE (PERDITA) DELL'ESERCIZIO" value={ce.utile_netto} /><InfoButton chiave="utile_netto" /></div>
        </div>

        {/* Grafico Margini */}
        <div className="card">
          <h3 className="card-header">Margini di Gestione</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={marginiData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="valore" radius={[0, 4, 4, 0]}>
                {marginiData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Margini in percentuale */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Incidenza su ricavi</h4>
            {ce.ricavi_vendite > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">EBITDA margin</span>
                  <span className="font-medium">{((ce.ebitda / ce.ricavi_vendite) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">EBIT margin</span>
                  <span className="font-medium">{((ce.ebit / ce.ricavi_vendite) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Net margin</span>
                  <span className="font-medium">{((ce.utile_netto / ce.ricavi_vendite) * 100).toFixed(1)}%</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

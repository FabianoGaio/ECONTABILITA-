'use client';

import { useBilancio, useEsercizio } from '@/lib/hooks';
import EsercizioSelector from '@/components/ui/EsercizioSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InfoButton from '@/components/ui/InfoButton';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { formatCurrency } from '@/lib/utils';
import type { StatoPatrimoniale } from '@/types';

function Row({ label, value, indent = false, bold = false, infoId, chiave }: { label: string; value: number; indent?: boolean; bold?: boolean; infoId?: string; chiave?: string }) {
  const cls = bold ? 'bilancio-row-bold' : 'bilancio-row';
  return (
    <div className={cls}>
      <span className={`flex items-center gap-1 ${indent ? 'pl-4 text-gray-600' : ''}`}>
        {infoId ? <InfoTooltip infoId={infoId}>{label}</InfoTooltip> : label}
        {(infoId || chiave) && <InfoButton infoId={infoId} chiave={chiave} size="sm" />}
      </span>
      <span className={`font-mono ${bold ? '' : 'text-gray-800'}`}>{formatCurrency(value)}</span>
    </div>
  );
}

function Total({ label, value }: { label: string; value: number }) {
  return (
    <div className="bilancio-total">
      <span>{label}</span>
      <span className="font-mono">{formatCurrency(value)}</span>
    </div>
  );
}

export default function StatoPatrimonialePage() {
  const { esercizio, setEsercizio } = useEsercizio();
  const { data, loading, error } = useBilancio(esercizio);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Errore: {error}</div>;
  if (!data) return <div className="text-gray-500 p-8">Nessun dato</div>;

  const sp = data.stato_patrimoniale as StatoPatrimoniale;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Stato Patrimoniale</h1>
          <p className="page-subtitle">Schema civilistico ex art. 2424 c.c.</p>
        </div>
        <EsercizioSelector value={esercizio} onChange={setEsercizio} />
      </div>

      {/* Quadratura */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
        sp.quadratura ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
      }`}>
        <span className="text-lg">{sp.quadratura ? '✓' : '✗'}</span>
        {sp.quadratura
          ? 'Stato Patrimoniale quadrato: Totale Attivo = Totale Passivo'
          : 'ATTENZIONE: Stato Patrimoniale non quadrato!'
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ATTIVO */}
        <div className="card">
          <h3 className="card-header text-blue-800">ATTIVO <InfoButton chiave="totale_attivo" /></h3>

          <div className="mb-4">
            <h4 className="section-title text-sm">B) IMMOBILIZZAZIONI</h4>
            <div className="space-y-0.5">
              <Row label="B.I - Immobilizzazioni immateriali" value={sp.attivo.immobilizzazioni_immateriali} indent infoId="brevetti" chiave="immobilizzazioni_immateriali" />
              <Row label="B.II - Immobilizzazioni materiali" value={sp.attivo.immobilizzazioni_materiali} indent infoId="terreni_fabbricati" chiave="immobilizzazioni_materiali" />
              <Row label="B.III - Immobilizzazioni finanziarie" value={sp.attivo.immobilizzazioni_finanziarie} indent chiave="immobilizzazioni_finanziarie" />
              <Row label="Totale Immobilizzazioni (B)" value={sp.attivo.totale_immobilizzazioni} bold />
            </div>
          </div>

          <div className="mb-4">
            <h4 className="section-title text-sm">C) ATTIVO CIRCOLANTE</h4>
            <div className="space-y-0.5">
              <Row label="C.I - Rimanenze" value={sp.attivo.rimanenze} indent infoId="rimanenze_mp" chiave="rimanenze" />
              <Row label="C.II - Crediti" value={sp.attivo.crediti} indent infoId="crediti_clienti" chiave="crediti" />
              <Row label="C.IV - Disponibilita liquide" value={sp.attivo.disponibilita_liquide} indent infoId="banca_cc" chiave="disponibilita_liquide" />
              <Row label="Totale Attivo Circolante (C)" value={sp.attivo.totale_attivo_circolante} bold />
            </div>
          </div>

          <div className="mb-4">
            <h4 className="section-title text-sm">D) RATEI E RISCONTI <InfoButton chiave="ratei_risconti" infoId="ratei_attivi" /></h4>
            <Row label="Ratei e risconti attivi" value={sp.attivo.ratei_risconti_attivi} indent infoId="ratei_attivi" />
          </div>

          <Total label="TOTALE ATTIVO" value={sp.attivo.totale_attivo} />
        </div>

        {/* PASSIVO */}
        <div className="card">
          <h3 className="card-header text-green-800">PASSIVO <InfoButton chiave="totale_passivo" /></h3>

          <div className="mb-4">
            <h4 className="section-title text-sm">A) PATRIMONIO NETTO <InfoButton chiave="patrimonio_netto" infoId="capitale_sociale" /></h4>
            <div className="space-y-0.5">
              <Row label="A.I - Capitale" value={sp.passivo.capitale_sociale} indent infoId="capitale_sociale" chiave="patrimonio_netto" />
              <Row label="A.IV/VII - Riserve" value={sp.passivo.riserve} indent chiave="patrimonio_netto" />
              <Row label="A.IX - Utile (perdita) d'esercizio" value={sp.passivo.utile_esercizio} indent chiave="utile_esercizio" />
              <Row label="Totale Patrimonio Netto (A)" value={sp.passivo.totale_patrimonio_netto} bold />
            </div>
          </div>

          <div className="mb-4">
            <h4 className="section-title text-sm">B) FONDI PER RISCHI E ONERI <InfoButton chiave="fondi_rischi" infoId="fondi_rischi" /></h4>
            <Row label="Fondi rischi e oneri" value={sp.passivo.fondi_rischi} indent infoId="fondi_rischi" chiave="fondi_rischi" />
          </div>

          <div className="mb-4">
            <h4 className="section-title text-sm">C) TFR <InfoButton chiave="tfr" infoId="tfr_conto" /></h4>
            <Row label="Trattamento di fine rapporto" value={sp.passivo.tfr} indent infoId="tfr_conto" chiave="tfr" />
          </div>

          <div className="mb-4">
            <h4 className="section-title text-sm">D) DEBITI</h4>
            <div className="space-y-0.5">
              <Row label="Debiti finanziari" value={sp.passivo.debiti_finanziari} indent infoId="mutui_passivi" chiave="debiti_finanziari" />
              <Row label="Debiti commerciali" value={sp.passivo.debiti_commerciali} indent infoId="debiti_fornitori" chiave="debiti_commerciali" />
            </div>
          </div>

          <div className="mb-4">
            <h4 className="section-title text-sm">E) RATEI E RISCONTI <InfoButton chiave="ratei_risconti" infoId="ratei_passivi" /></h4>
            <Row label="Ratei e risconti passivi" value={sp.passivo.ratei_risconti_passivi} indent infoId="ratei_passivi" />
          </div>

          <Total label="TOTALE PASSIVO" value={sp.passivo.totale_passivo} />
        </div>
      </div>
    </div>
  );
}

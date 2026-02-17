'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PianoConto, Operazione, ScritturaAssestamento, Budget } from '@/types';
import { getCurrentEsercizio } from './utils';
import { useAuth } from './auth-context';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useConti() {
  const { isDemo, esercizioAttivo } = useAuth();
  const esercizioId = esercizioAttivo?.id;
  const url = isDemo ? '/api/conti' : `/api/conti?esercizio_id=${esercizioId || ''}`;
  return useFetch<PianoConto[]>(url);
}

export function useOperazioni(esercizio?: number) {
  const { isDemo, esercizioAttivo } = useAuth();
  const anno = esercizio || esercizioAttivo?.anno || getCurrentEsercizio();
  const esercizioId = esercizioAttivo?.id;
  const url = isDemo
    ? `/api/operazioni?esercizio=${anno}`
    : `/api/operazioni?esercizio_id=${esercizioId || ''}&esercizio=${anno}`;
  return useFetch<Operazione[]>(url);
}

export function useScritture(esercizio?: number) {
  const { isDemo, esercizioAttivo } = useAuth();
  const anno = esercizio || esercizioAttivo?.anno || getCurrentEsercizio();
  const esercizioId = esercizioAttivo?.id;
  const url = isDemo
    ? `/api/scritture?esercizio=${anno}`
    : `/api/scritture?esercizio_id=${esercizioId || ''}&esercizio=${anno}`;
  return useFetch<ScritturaAssestamento[]>(url);
}

export function useBilancio(esercizio?: number) {
  const { isDemo, esercizioAttivo } = useAuth();
  const anno = esercizio || esercizioAttivo?.anno || getCurrentEsercizio();
  const esercizioId = esercizioAttivo?.id;
  const url = isDemo
    ? `/api/bilancio?esercizio=${anno}`
    : `/api/bilancio?esercizio_id=${esercizioId || ''}&esercizio=${anno}`;
  return useFetch<{
    esercizio: number;
    saldi: unknown[];
    stato_patrimoniale: unknown;
    conto_economico: unknown;
    rendiconto_finanziario: unknown;
    riclassificazione: unknown;
    indici: unknown;
    gestionale: unknown;
    scritture: ScritturaAssestamento[];
    conti: PianoConto[];
  }>(url);
}

export function useBudget(esercizio?: number) {
  const { isDemo, esercizioAttivo } = useAuth();
  const anno = esercizio || esercizioAttivo?.anno || getCurrentEsercizio();
  const esercizioId = esercizioAttivo?.id;
  const url = isDemo
    ? `/api/budget?esercizio=${anno}`
    : `/api/budget?esercizio_id=${esercizioId || ''}&esercizio=${anno}`;
  return useFetch<Budget[]>(url);
}

export function useEsercizio() {
  const { isDemo, esercizioAttivo, esercizi, setEsercizioAttivo } = useAuth();
  const [localEsercizio, setLocalEsercizio] = useState(getCurrentEsercizio());

  if (isDemo) {
    return { esercizio: localEsercizio, esercizioId: null as string | null, setEsercizio: setLocalEsercizio };
  }

  return {
    esercizio: esercizioAttivo?.anno || getCurrentEsercizio(),
    esercizioId: esercizioAttivo?.id || null,
    setEsercizio: (anno: number) => {
      const found = esercizi.find(e => e.anno === anno);
      if (found) setEsercizioAttivo(found);
      else setLocalEsercizio(anno);
    },
  };
}

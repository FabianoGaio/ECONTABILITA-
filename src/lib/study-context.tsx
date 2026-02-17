'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { InfoContabile } from './info-contabili';

interface StudyContextType {
  studyMode: boolean;
  toggleStudyMode: () => void;
  selectedInfo: InfoContabile | null;
  panelOpen: boolean;
  openPanel: (info: InfoContabile) => void;
  closePanel: () => void;
  simulationOpen: boolean;
  openSimulation: () => void;
  closeSimulation: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [studyMode, setStudyMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('study_mode') === 'true';
    }
    return false;
  });
  const [selectedInfo, setSelectedInfo] = useState<InfoContabile | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [simulationOpen, setSimulationOpen] = useState(false);

  const toggleStudyMode = useCallback(() => {
    setStudyMode(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('study_mode', String(next));
      }
      if (!next) {
        setPanelOpen(false);
        setSimulationOpen(false);
      }
      return next;
    });
  }, []);

  const openPanel = useCallback((info: InfoContabile) => {
    setSelectedInfo(info);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
  }, []);

  const openSimulation = useCallback(() => {
    setSimulationOpen(true);
  }, []);

  const closeSimulation = useCallback(() => {
    setSimulationOpen(false);
  }, []);

  return (
    <StudyContext.Provider value={{
      studyMode,
      toggleStudyMode,
      selectedInfo,
      panelOpen,
      openPanel,
      closePanel,
      simulationOpen,
      openSimulation,
      closeSimulation,
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used inside StudyProvider');
  return ctx;
}

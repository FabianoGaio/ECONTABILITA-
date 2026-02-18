'use client';

import { useState, useRef, type ReactNode } from 'react';
import { useStudy } from '@/lib/study-context';
import { getInfoByCodice, getInfoById, type InfoContabile } from '@/lib/info-contabili';

interface InfoTooltipProps {
  codice?: string;
  infoId?: string;
  children: ReactNode;
  className?: string;
}

export default function InfoTooltip({ codice, infoId, children, className = '' }: InfoTooltipProps) {
  const { studyMode, openPanel } = useStudy();
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const info = codice ? getInfoByCodice(codice) : infoId ? getInfoById(infoId) : null;

  if (!studyMode || !info) {
    return <>{children}</>;
  }

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setShowTooltip(true), 400);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  };

  return (
    <span
      className={`relative inline-flex items-center gap-1 cursor-help ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => { e.stopPropagation(); openPanel(info); }}
    >
      {children}
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 text-[9px] font-bold flex-shrink-0 hover:bg-blue-200 transition-colors">
        i
      </span>

      {showTooltip && (
        <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl max-w-xs whitespace-normal break-words">
            <p className="font-semibold text-blue-300 mb-0.5">{info.titolo}</p>
            <p className="text-slate-300 leading-relaxed">{info.tooltip}</p>
            <p className="text-blue-400 text-[10px] mt-1">Clicca per approfondire</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </div>
        </div>
      )}
    </span>
  );
}

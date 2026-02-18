'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useStudy } from '@/lib/study-context';

const navigation = [
  {
    section: 'Generale',
    items: [
      { name: 'Dashboard', href: '/', icon: '📊' },
      { name: 'Piano dei Conti', href: '/piano-conti', icon: '📋' },
    ],
  },
  {
    section: 'Contabilita',
    items: [
      { name: 'Prima Nota', href: '/prima-nota', icon: '📝' },
      { name: 'Scritture Assestamento', href: '/scritture-assestamento', icon: '📐' },
    ],
  },
  {
    section: 'Bilancio',
    items: [
      { name: 'Stato Patrimoniale', href: '/bilancio/stato-patrimoniale', icon: '🏛️' },
      { name: 'Conto Economico', href: '/bilancio/conto-economico', icon: '📈' },
      { name: 'Rendiconto Finanziario', href: '/bilancio/rendiconto-finanziario', icon: '💰' },
    ],
  },
  {
    section: 'Analisi',
    items: [
      { name: 'Riclassificazione', href: '/analisi/riclassificazione', icon: '🔄' },
      { name: 'Indici di Bilancio', href: '/analisi/indici', icon: '📉' },
      { name: 'Analisi Gestionale', href: '/analisi/gestionale', icon: '🎯' },
      { name: 'Budget', href: '/analisi/budget', icon: '📅' },
    ],
  },
  {
    section: 'Documenti',
    items: [
      { name: 'Genera Bilancio PDF', href: '/bilancio/pdf', icon: '📄' },
    ],
  },
  {
    section: 'Supporto',
    items: [
      { name: 'Guida Utente', href: '/guida', icon: '📖' },
    ],
  },
];

interface SidebarInnerProps {
  collapsed: boolean;
  onClose: () => void;
  closeIcon: string;
}

function SidebarInner({ collapsed, onClose, closeIcon }: SidebarInnerProps) {
  const pathname = usePathname();
  const { user, profilo, isDemo, esercizi, esercizioAttivo, setEsercizioAttivo, signOut } = useAuth();
  const { studyMode, toggleStudyMode, openSimulation } = useStudy();

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
              eC
            </div>
            <div>
              <h1 className="text-sm font-bold">eContabilita</h1>
              <p className="text-[10px] text-slate-400">Piattaforma Didattica</p>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors text-slate-400"
        >
          {closeIcon}
        </button>
      </div>

      {/* Selettore Esercizio */}
      {!isDemo && !collapsed && esercizi.length > 0 && (
        <div className="px-3 py-3 border-b border-slate-700 flex-shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Esercizio</p>
          <select
            value={esercizioAttivo?.id || ''}
            onChange={(e) => {
              const found = esercizi.find(ex => ex.id === e.target.value);
              if (found) setEsercizioAttivo(found);
            }}
            className="w-full bg-slate-700 text-white text-xs rounded-md px-2 py-1.5 border border-slate-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            {esercizi.map((e) => (
              <option key={e.id} value={e.id}>
                {e.anno} - {e.descrizione}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Demo Mode Badge */}
      {isDemo && !collapsed && (
        <div className="px-3 py-2 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-md">
            <span className="text-amber-400 text-xs">⚡</span>
            <span className="text-amber-300 text-[10px] font-medium">Modalita Demo</span>
          </div>
        </div>
      )}

      {/* Study Mode Toggle */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-slate-700 space-y-2 flex-shrink-0">
          <button
            onClick={toggleStudyMode}
            className={cn(
              'w-full flex items-center gap-2 px-2 py-2 rounded-md text-xs font-medium transition-all',
              studyMode
                ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                : 'bg-slate-700/50 border border-slate-600 text-slate-400 hover:text-white'
            )}
          >
            <span className="text-base">{studyMode ? '📖' : '📕'}</span>
            <span>Modalita Studio</span>
            <span className={cn(
              'ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase',
              studyMode ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-400'
            )}>
              {studyMode ? 'ON' : 'OFF'}
            </span>
          </button>
          {studyMode && (
            <button
              onClick={openSimulation}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-all"
            >
              <span className="text-sm">🧪</span>
              <span>Simulazione What-If</span>
            </button>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navigation.map((group) => (
          <div key={group.section} className="mb-4">
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {group.section}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-0.5',
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer - User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          {!isDemo && user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                  {(profilo?.nome?.[0] || 'U').toUpperCase()}
                </div>
                <p className="text-xs font-medium text-white truncate flex-1 min-w-0">
                  {profilo?.nome || 'Utente'}
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full text-left text-[10px] text-slate-400 hover:text-red-400 transition-colors px-2 py-1"
              >
                Esci
              </button>
            </div>
          ) : (
            <div className="text-[10px] text-slate-500 text-center">
              Progetto didattico universitario
              <br />
              Contabilita e Bilancio
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-40 w-10 h-10 bg-slate-800 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-slate-700 transition-colors"
        aria-label="Apri menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar (drawer) */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 z-50 h-full w-72 flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarInner
          collapsed={false}
          onClose={() => setMobileOpen(false)}
          closeIcon="✕"
        />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex-shrink-0',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarInner
          collapsed={collapsed}
          onClose={() => setCollapsed(!collapsed)}
          closeIcon={collapsed ? '→' : '←'}
        />
      </aside>
    </>
  );
}

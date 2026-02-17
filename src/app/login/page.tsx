'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const { accedi, isDemo } = useAuth();
  const router = useRouter();

  const [nomeCognome, setNomeCognome] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isDemo) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await accedi(nomeCognome);
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white text-2xl font-bold mb-4">
            eC
          </div>
          <h1 className="text-3xl font-bold text-white">eContabilita</h1>
          <p className="text-blue-300 mt-2">Piattaforma Didattica di Contabilita Generale</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">Accedi</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Inserisci il tuo nome e cognome per accedere.
            <br />
            <span className="text-xs text-gray-400">Al primo accesso il tuo account viene creato automaticamente.</span>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome e Cognome</label>
              <input
                type="text"
                value={nomeCognome}
                onChange={(e) => setNomeCognome(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="es. Mario Rossi"
                autoComplete="name"
                autoFocus
                required
                minLength={2}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Caricamento...' : 'Accedi'}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-400 text-center">
            Al primo accesso verranno creati automaticamente 3 esercizi di esempio.
          </p>
        </div>

        <p className="text-center text-blue-400/60 text-xs mt-6">
          Progetto didattico universitario - Contabilita e Bilancio
        </p>
      </div>
    </div>
  );
}

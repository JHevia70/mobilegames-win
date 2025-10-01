'use client';

import { useState } from 'react';

interface AdminAuthProps {
  onAuthenticated: () => void;
}

export default function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple password check (you should change this)
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin2025';

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      onAuthenticated();
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Panel de Administración
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Introduce la contraseña para acceder
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="Contraseña"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-red-400 text-sm">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

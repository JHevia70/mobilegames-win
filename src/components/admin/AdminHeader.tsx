'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminHeader() {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = '/admin';
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex items-center space-x-3">
              <img
                src="/images/MGIcon.png"
                alt="MobileGames.win"
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
                <p className="text-xs text-gray-400">MobileGames.win</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/admin')
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/articles"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/admin/articles')
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Artículos
              </Link>
              <Link
                href="/admin/automatismos"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/admin/automatismos')
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Automatismos
              </Link>
              <Link
                href="/admin/newsletter"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/admin/newsletter')
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Newsletter
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
              >
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">¿Cerrar sesión?</h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que quieres cerrar la sesión?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

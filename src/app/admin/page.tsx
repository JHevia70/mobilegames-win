'use client';

import { useState, useEffect } from 'react';
import { getAllArticles, type Article } from '@/lib/articles';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/components/ui/ToastContainer';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Link from 'next/link';

function DashboardContent() {
  const { showSuccess, showError, showWarning } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getAllArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    drafts: articles.filter(a => a.status !== 'published').length,
    categories: Array.from(new Set(articles.map(a => a.category))).length,
  };

  const recentArticles = articles.slice(0, 5);

  const handleGenerateArticle = async (type: string) => {
    const typeNames = {
      'daily-opinion': 'Artículo de Opinión Diario',
      'weekly-top5': 'TOP 5 Semanal',
      'breaking-news': 'Noticia de Última Hora'
    };

    const workflowFiles = {
      'daily-opinion': 'daily-opinion.yml',
      'weekly-top5': 'weekly-top5.yml',
      'breaking-news': 'breaking-news.yml'
    };

    // Show confirmation dialog
    setConfirmDialog({
      isOpen: true,
      title: `¿Generar ${typeNames[type as keyof typeof typeNames]}?`,
      message: 'Esto ejecutará el workflow de GitHub Actions y creará un nuevo artículo automáticamente.',
      onConfirm: () => executeWorkflow(type)
    });
  };

  const executeWorkflow = async (type: string) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });

    setGenerating(true);

    try {
      const typeNames = {
        'daily-opinion': 'Artículo de Opinión Diario',
        'weekly-top5': 'TOP 5 Semanal',
        'breaking-news': 'Noticia de Última Hora'
      };

      const workflowFiles = {
        'daily-opinion': 'daily-opinion.yml',
        'weekly-top5': 'weekly-top5.yml',
        'breaking-news': 'breaking-news.yml'
      };

      // Get GitHub token from environment, localStorage, or prompt
      let githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN || localStorage.getItem('github_token');

      if (!githubToken) {
        const token = prompt(
          '🔑 GitHub Personal Access Token requerido\n\n' +
          'Pasos para crear el token:\n\n' +
          '1. Abre: https://github.com/settings/tokens/new\n' +
          '2. Note: "MobileGames Admin"\n' +
          '3. Expiration: 90 days (o lo que prefieras)\n' +
          '4. ⚠️ IMPORTANTE: Marca estos permisos:\n' +
          '   ✓ repo (Full control of private repositories)\n' +
          '   ✓ workflow (Update GitHub Action workflows)\n' +
          '5. Click "Generate token"\n' +
          '6. Copia y pega el token aquí\n\n' +
          'El token se guardará en tu navegador.'
        );

        if (!token) {
          showWarning('Se necesita un GitHub token para ejecutar workflows');
          setGenerating(false);
          return;
        }

        // Save token to localStorage
        localStorage.setItem('github_token', token);
        githubToken = token;
      }

      // Trigger GitHub Actions workflow
      const response = await fetch(
        `https://api.github.com/repos/JHevia70/mobilegames-win/actions/workflows/${workflowFiles[type as keyof typeof workflowFiles]}/dispatches`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ref: 'main' // or your default branch
          })
        }
      );

      if (response.status === 204) {
        showSuccess(`${typeNames[type as keyof typeof typeNames]} iniciado correctamente! Puedes ver el progreso en GitHub Actions.`);

        // Reload articles after a delay to show the new one
        setTimeout(() => {
          loadArticles();
        }, 5000);
      } else {
        const error = await response.json();
        console.error('GitHub API error:', error);
        showError(`Error al ejecutar workflow: ${error.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error triggering workflow:', error);
      showError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Bienvenido al panel de administración de MobileGames.win</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Artículos</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {loading ? '...' : stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Publicados</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {loading ? '...' : stats.published}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Borradores</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {loading ? '...' : stats.drafts}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Categorías</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {loading ? '...' : stats.categories}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Article Generation */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-2">Generación Automática de Artículos</h2>
          <p className="text-gray-400 text-sm mb-6">
            Genera artículos con IA basados en las últimas tendencias de gaming móvil
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleGenerateArticle('daily-opinion')}
              disabled={generating}
              className="flex items-center space-x-3 p-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 bg-blue-500 bg-opacity-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                {generating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Opinión Diario</p>
                <p className="text-blue-100 text-sm">{generating ? 'Generando...' : 'Generar ahora'}</p>
              </div>
            </button>

            <button
              onClick={() => handleGenerateArticle('weekly-top5')}
              disabled={generating}
              className="flex items-center space-x-3 p-4 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg transition group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 bg-purple-500 bg-opacity-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                {generating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <p className="text-white font-medium">TOP 5 Semanal</p>
                <p className="text-purple-100 text-sm">{generating ? 'Generando...' : 'Generar ahora'}</p>
              </div>
            </button>

            <button
              onClick={() => handleGenerateArticle('breaking-news')}
              disabled={generating}
              className="flex items-center space-x-3 p-4 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 bg-red-500 bg-opacity-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                {generating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Breaking News</p>
                <p className="text-red-100 text-sm">{generating ? 'Generando...' : 'Generar ahora'}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/articles?new=true"
              className="flex items-center space-x-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition group"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Nuevo Artículo</p>
                <p className="text-gray-400 text-sm">Crear contenido nuevo</p>
              </div>
            </Link>

            <Link
              href="/admin/articles"
              className="flex items-center space-x-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition group"
            >
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Ver Artículos</p>
                <p className="text-gray-400 text-sm">Gestionar contenido</p>
              </div>
            </Link>

            <Link
              href="/admin/newsletter"
              className="flex items-center space-x-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition group"
            >
              <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Newsletter</p>
                <p className="text-gray-400 text-sm">Gestionar suscriptores</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Artículos Recientes</h2>
            <Link
              href="/admin/articles"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-400 text-sm">Cargando...</p>
            </div>
          ) : recentArticles.length > 0 ? (
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/articles?edit=${article.id}`}
                  className="flex items-center space-x-4 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition group"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-16 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium group-hover:text-blue-400 transition">
                      {article.title}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {article.category} • {article.publishDate}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    article.status === 'published'
                      ? 'bg-green-900 text-green-200'
                      : 'bg-yellow-900 text-yellow-200'
                  }`}>
                    {article.status === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No hay artículos disponibles
            </div>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Generar"
        cancelText="Cancelar"
        type="info"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}

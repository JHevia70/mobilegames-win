'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllArticles, type Article } from '@/lib/articles';
import { deleteArticle } from '@/lib/admin-articles';
import { useToast } from '@/components/ui/ToastContainer';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ArticleEditor from '@/components/admin/ArticleEditor';
import AdminLayout from '@/components/admin/AdminLayout';

function ArticlesContent() {
  const { showSuccess, showError } = useToast();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [filter, setFilter] = useState('all'); // all, published, draft
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    articleId: string | null;
  }>({ isOpen: false, articleId: null });

  useEffect(() => {
    loadArticles();

    // Check URL params for auto-open editor
    const newParam = searchParams.get('new');
    const editParam = searchParams.get('edit');

    if (newParam === 'true') {
      setShowEditor(true);
    } else if (editParam) {
      // Find article by ID and open editor
      loadArticles().then(() => {
        const article = articles.find(a => a.id === editParam);
        if (article) {
          setEditingArticle(article);
          setShowEditor(true);
        }
      });
    }
  }, [searchParams]);

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

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleClose = () => {
    setEditingArticle(null);
    setShowEditor(false);
    loadArticles();
    // Clear URL params
    window.history.replaceState({}, '', '/admin/articles');
  };

  const handleDelete = (articleId: string) => {
    setDeleteConfirm({ isOpen: true, articleId });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.articleId) return;

    try {
      await deleteArticle(deleteConfirm.articleId);
      showSuccess('Artículo eliminado correctamente');
      loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      showError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setDeleteConfirm({ isOpen: false, articleId: null });
    }
  };

  const filteredArticles = articles.filter(article => {
    if (filter === 'published') return article.status === 'published';
    if (filter === 'draft') return article.status !== 'published';
    return true;
  });

  if (showEditor) {
    return <ArticleEditor article={editingArticle} onClose={handleClose} />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">Gestión de Artículos</h1>
            <p className="text-gray-400 mt-2">
              {filteredArticles.length} artículo{filteredArticles.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Artículo</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Todos ({articles.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'published'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Publicados ({articles.filter(a => a.status === 'published').length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'draft'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Borradores ({articles.filter(a => a.status !== 'published').length})
          </button>
        </div>

        {/* Articles Table */}
        {loading ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Cargando artículos...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-gray-300">Título</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-gray-300">Categoría</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-gray-300">Autor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-gray-300">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-gray-300">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-750 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-16 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-white">{article.title}</p>
                          {article.featured && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-900 text-purple-200 text-xs rounded">
                              Destacado
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{article.author}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{article.publishDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        article.status === 'published'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-yellow-900 text-yellow-200'
                      }`}>
                        {article.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-lg">No hay artículos disponibles</p>
            <button
              onClick={() => setShowEditor(true)}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Crear primer artículo
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="¿Eliminar artículo?"
        message="Esta acción no se puede deshacer. El artículo será eliminado permanentemente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, articleId: null })}
      />
    </>
  );
}

export default function ArticlesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Cargando...</p>
          </div>
        </div>
      }>
        <ArticlesContent />
      </Suspense>
    </AdminLayout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { getArticles, type Article } from '@/lib/articles';
import ArticleEditor from '@/components/admin/ArticleEditor';
import AdminAuth from '@/components/admin/AdminAuth';

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if already authenticated in session
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadArticles();
    }
  }, [isAuthenticated]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
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
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      return;
    }

    try {
      const response = await fetch('/api/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: articleId })
      });

      if (response.ok) {
        loadArticles();
      } else {
        alert('Error al eliminar el artículo');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error al eliminar el artículo');
    }
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  if (showEditor) {
    return <ArticleEditor article={editingArticle} onClose={handleClose} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Panel de Administración</h1>
          <button
            onClick={() => setShowEditor(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            + Nuevo Artículo
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Cargando artículos...</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Título</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Categoría</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Autor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-750 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-16 h-10 object-cover rounded"
                        />
                        <span className="font-medium">{article.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{article.author}</td>
                    <td className="px-6 py-4 text-gray-300">{article.publishDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
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
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {articles.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No hay artículos disponibles
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

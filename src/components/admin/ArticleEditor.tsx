'use client';

import { useState, useEffect } from 'react';
import type { Article } from '@/lib/articles';
import { createArticle, updateArticle } from '@/lib/admin-articles';
import { useToast } from '@/components/ui/ToastContainer';
import MarkdownEditor from './MarkdownEditor';

interface ArticleEditorProps {
  article: Article | null;
  onClose: () => void;
}

export default function ArticleEditor({ article, onClose }: ArticleEditorProps) {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: '',
    author: '',
    publishDate: '',
    readTime: 5,
    rating: 4.0,
    slug: '',
    featured: false,
    type: 'article',
    status: 'published'
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        image: article.image || '',
        category: article.category || '',
        author: article.author || '',
        publishDate: article.publishDate || '',
        readTime: article.readTime || 5,
        rating: article.rating || 4.0,
        slug: article.slug || '',
        featured: article.featured || false,
        type: article.type || 'article',
        status: article.status || 'published'
      });
    }
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: article ? prev.slug : generateSlug(newTitle)
    }));
  };

  const handleSave = async () => {
    // Validación de campos obligatorios
    if (!formData.title?.trim()) {
      showError('El título es obligatorio');
      return;
    }
    if (!formData.content?.trim()) {
      showError('El contenido es obligatorio');
      return;
    }
    if (!formData.slug?.trim()) {
      showError('El slug es obligatorio');
      return;
    }

    setSaving(true);

    try {
      if (article) {
        // Update existing article
        console.log('Actualizando artículo:', article.id);
        await updateArticle(article.id, formData);
        showSuccess('Artículo actualizado correctamente');
      } else {
        // Create new article
        console.log('Creando nuevo artículo');
        const id = await createArticle(formData as any);
        console.log('Artículo creado con ID:', id);
        showSuccess('Artículo creado correctamente');
      }

      onClose();
    } catch (error) {
      console.error('Error saving article:', error);
      showError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            {article ? 'Editar Artículo' : 'Nuevo Artículo'}
          </h1>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
          >
            ← Volver
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Título *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Título del artículo"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="slug-del-articulo"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold mb-2">Extracto</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Breve descripción del artículo"
            />
          </div>

          {/* Content with Markdown Editor */}
          <div>
            <label className="block text-sm font-semibold mb-2">Contenido (Markdown) *</label>
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              placeholder="Escribe el contenido del artículo en formato Markdown..."
              minHeight="600px"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Seleccionar categoría</option>
                <option value="RPG">RPG</option>
                <option value="Estrategia">Estrategia</option>
                <option value="Acción">Acción</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Deportes">Deportes</option>
                <option value="Aventura">Aventura</option>
                <option value="Simulación">Simulación</option>
                <option value="TOP 5">TOP 5</option>
                <option value="Análisis">Análisis</option>
                <option value="Guías">Guías</option>
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold mb-2">Autor</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Nombre del autor"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold mb-2">URL de Imagen</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://..."
              />
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-sm font-semibold mb-2">Fecha de Publicación</label>
              <input
                type="text"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="1 de enero de 2025"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Read Time */}
            <div>
              <label className="block text-sm font-semibold mb-2">Tiempo de Lectura (min)</label>
              <input
                type="number"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold mb-2">Valoración (1-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.1"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold mb-2">Tipo</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="article">Artículo</option>
                <option value="top5">TOP 5</option>
                <option value="analysis">Análisis</option>
                <option value="guide">Guía</option>
                <option value="comparison">Comparativa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold mb-2">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="published">Publicado</option>
                <option value="draft">Borrador</option>
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label className="ml-3 text-sm font-semibold">Artículo destacado</label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Artículo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

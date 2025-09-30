'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Grid, List } from 'lucide-react';
import { getArticlesByCategory, type Article } from '@/lib/articles';
import ArticleCard from './ArticleCard';
import Button from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { cn } from '@/lib/utils';

interface CategoryModalProps {
  isOpen: boolean;
  category: string | null;
  onClose: () => void;
  onArticleSelect: (slug: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  category,
  onClose,
  onArticleSelect
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (isOpen && category) {
      setLoading(true);
      const fetchArticles = async () => {
        try {
          const fetchedArticles = await getArticlesByCategory(category);
          setArticles(fetchedArticles);
        } catch (error) {
          console.error('Error fetching articles by category:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchArticles();
    }
  }, [isOpen, category]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleReadMore = (slug: string) => {
    onArticleSelect(slug);
  };

  return (
    <AnimatePresence>
      {isOpen && category && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 overflow-y-auto"
          onClick={handleOverlayClick}
        >
          <div className="min-h-screen px-4 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="mx-auto max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-headline font-bold text-gray-900 dark:text-white">
                        {category}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {loading ? 'Cargando...' : `${articles.length} artículos encontrados`}
                      </p>
                    </div>
                    <Button
                      onClick={onClose}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 sm:hidden"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    {/* View Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setViewMode('grid')}
                        variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                        size="sm"
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => setViewMode('list')}
                        variant={viewMode === 'list' ? 'primary' : 'ghost'}
                        size="sm"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Close Button for desktop */}
                    <Button
                      onClick={onClose}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hidden sm:flex"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : articles.length > 0 ? (
                  <div className={cn(
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-6'
                  )}>
                    {articles.map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ArticleCard
                          {...article}
                          size={viewMode === 'grid' ? 'medium' : 'large'}
                          onReadMore={handleReadMore}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Card>
                      <CardContent className="py-12">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                          No hay artículos en esta categoría
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Aún no hemos publicado artículos en la categoría "{category}".
                          ¡Vuelve pronto para ver nuevos contenidos!
                        </p>
                        <Button onClick={onClose} variant="outline">
                          Cerrar
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Footer with filters */}
              {articles.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-750">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-gaming-red focus:border-transparent">
                        <option>Más recientes</option>
                        <option>Más populares</option>
                        <option>Mejor valorados</option>
                      </select>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {articles.length} artículos
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;
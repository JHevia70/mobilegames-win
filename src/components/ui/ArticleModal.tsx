'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getArticleBySlug, type Article } from '@/lib/articles';
import Button from './Button';
import ArticleView from './ArticleView';

interface ArticleModalProps {
  isOpen: boolean;
  slug: string | null;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, slug, onClose }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && slug) {
      setLoading(true);
      const fetchArticle = async () => {
        try {
          const fetchedArticle = await getArticleBySlug(slug);
          setArticle(fetchedArticle);
        } catch (error) {
          console.error('Error fetching article:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [isOpen, slug]);

  const handleClose = () => {
    // Clean URL when closing
    window.history.pushState({}, '', '/');
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto"
          onClick={handleOverlayClick}
        >
          <div className="min-h-screen px-4 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="mx-auto max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Lectura de artículo
                  </div>
                  <Button
                    onClick={handleClose}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="p-8">
                  <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
              ) : article ? (
                <div className="p-6 md:p-8">
                  <ArticleView article={article} />
                </div>
              ) : (
                <div className="p-8 text-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Artículo no encontrado
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    El artículo que buscas no existe o no pudo ser cargado.
                  </p>
                  <Button onClick={handleClose} variant="outline">
                    Cerrar
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArticleModal;
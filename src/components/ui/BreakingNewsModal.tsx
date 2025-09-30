'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Radio, Calendar } from 'lucide-react';
import Button from './Button';

interface BreakingNews {
  id: string;
  title: string;
  content: string;
  publishDate: string;
}

interface BreakingNewsModalProps {
  isOpen: boolean;
  news: BreakingNews | null;
  onClose: () => void;
}

export default function BreakingNewsModal({ isOpen, news, onClose }: BreakingNewsModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!news) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gaming-red text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 animate-pulse" />
                  <span className="font-bold text-sm">ÚLTIMA HORA</span>
                </div>
                <button
                  onClick={onClose}
                  className="hover:bg-red-700 rounded-full p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <h2 className="text-2xl font-headline font-bold text-gray-900 dark:text-white mb-3">
                  {news.title}
                </h2>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <Calendar className="w-4 h-4" />
                  {news.publishDate}
                </div>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {news.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300 mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                <a
                  href="/teletipos"
                  className="text-sm text-gaming-red hover:text-red-700 font-medium"
                >
                  Ver más teletipos →
                </a>
                <Button onClick={onClose} variant="outline" size="sm">
                  Cerrar
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getArticleBySlug, type Article } from '@/lib/articles';
import Button from '@/components/ui/Button';
import NewspaperHeader from '@/components/layout/NewspaperHeader';
import Footer from '@/components/layout/Footer';
import ArticleView from '@/components/ui/ArticleView';

function ArticleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug');

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching article with slug:', slug);
        const fetchedArticle = await getArticleBySlug(slug);
        console.log('📄 Article fetched:', fetchedArticle);
        setArticle(fetchedArticle);
      } catch (error) {
        console.error('❌ Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NewspaperHeader locale="es" />

        {/* Breaking News Banner */}
        <div className="bg-gaming-red text-white py-2">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-2 text-sm font-medium">
              <span className="bg-white text-gaming-red px-2 py-1 rounded text-xs font-bold">ÚLTIMA HORA</span>
              <span>Nuevo análisis: Los mejores juegos móviles de enero 2024</span>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-4xl">
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
        </main>
        <Footer locale="es" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NewspaperHeader locale="es" />

        {/* Breaking News Banner */}
        <div className="bg-gaming-red text-white py-2">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-2 text-sm font-medium">
              <span className="bg-white text-gaming-red px-2 py-1 rounded text-xs font-bold">ÚLTIMA HORA</span>
              <span>Nuevo análisis: Los mejores juegos móviles de enero 2024</span>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Artículo no encontrado
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                El artículo que buscas no existe o no pudo ser cargado.
              </p>
              <Button onClick={() => router.push('/')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </div>
          </div>
        </main>
        <Footer locale="es" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NewspaperHeader locale="es" />

      {/* Breaking News Banner */}
      <div className="bg-gaming-red text-white py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 text-sm font-medium">
            <span className="bg-white text-gaming-red px-2 py-1 rounded text-xs font-bold">ÚLTIMA HORA</span>
            <span>Nuevo análisis: Los mejores juegos móviles de enero 2024</span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-4xl">
          <ArticleView article={article} showBackButton />
        </div>
      </main>
      <Footer locale="es" />
    </div>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NewspaperHeader locale="es" />

        {/* Breaking News Banner */}
        <div className="bg-gaming-red text-white py-2">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-2 text-sm font-medium">
              <span className="bg-white text-gaming-red px-2 py-1 rounded text-xs font-bold">ÚLTIMA HORA</span>
              <span>Nuevo análisis: Los mejores juegos móviles de enero 2024</span>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-4xl">
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
        </main>
      </div>
    }>
      <ArticleContent />
    </Suspense>
  );
}
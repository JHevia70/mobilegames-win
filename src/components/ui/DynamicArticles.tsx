'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ArticleCard from './ArticleCard';
import { getLatestArticles, getFeaturedArticles, type Article } from '@/lib/articles';

interface DynamicArticlesProps {
  fallbackArticles: Article[];
  renderSidebar: (articles: Article[]) => React.ReactNode;
}

const DynamicArticles: React.FC<DynamicArticlesProps> = ({ fallbackArticles, renderSidebar }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [heroArticle, setHeroArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('🔥 Starting to fetch articles from Firebase...');

        // Get 8 latest articles (1 hero + 4 main + 3 more)
        const latest = await getLatestArticles(8);
        console.log(`📊 getLatestArticles returned: ${latest.length} articles`);

        if (latest.length > 0) {
          console.log('✅ Articles found, setting state...');
          console.log('First article:', latest[0]);

          setArticles(latest);
          setHeroArticle(latest[0]);
          setError(null);
          setLoading(false);

          console.log('✅ SUCCESS: Articles loaded and displayed');
        } else {
          console.error('❌ No articles returned from getLatestArticles');
          setError('No se encontraron artículos en la base de datos');
          setArticles([]);
          setHeroArticle(null);
          setLoading(false);
        }
      } catch (error: any) {
        console.error('❌ ERROR in DynamicArticles:', error);
        console.error('Error stack:', error?.stack);

        setError(`Error al cargar artículos: ${error?.message || String(error)}`);
        setArticles([]);
        setHeroArticle(null);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleReadMore = (slug: string) => {
    window.location.href = `/article?slug=${slug}`;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        {/* Hero skeleton */}
        <div className="h-[500px] bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

        {/* Articles grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error de Base de Datos</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Por favor, verifica la conexión a Firebase Firestore.</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No hay artículos</h2>
          <p className="text-gray-600 dark:text-gray-400">La base de datos Firebase está vacía o no contiene artículos publicados.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Article */}
      {heroArticle && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ArticleCard
              {...heroArticle}
              size="hero"
              onReadMore={handleReadMore}
            />
          </div>
        </section>
      )}

      {/* Main Articles Grid */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Main Articles Column */}
            <div className="lg:col-span-3">
              {/* Section Header */}
              <div className="mb-8 pb-4 border-b-2 border-gaming-red">
                <h2 className="text-3xl font-headline font-bold text-gray-900 dark:text-white">
                  Últimas Reviews
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Los 5 artículos más recientes sobre gaming móvil
                </p>
              </div>

              {/* Articles Grid - 4 articles after hero */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {articles.slice(1, 5).map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    {...article}
                    size="medium"
                    onReadMore={handleReadMore}
                  />
                ))}
              </div>

              {/* More Articles */}
              {articles.length > 5 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-headline font-bold text-gray-900 dark:text-white mb-6">
                    Más Análisis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {articles.slice(5, 8).map((article) => (
                      <ArticleCard
                        key={article.id + '_more'}
                        {...article}
                        size="small"
                        onReadMore={handleReadMore}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {renderSidebar(articles)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DynamicArticles;
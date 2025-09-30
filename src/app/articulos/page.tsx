'use client';

import React, { useState, useEffect } from 'react';
import { getArticles, type Article } from '@/lib/articles';
import NewspaperHeader from '@/components/layout/NewspaperHeader';
import Footer from '@/components/layout/Footer';
import ArticleCard from '@/components/ui/ArticleCard';
import BreakingNewsBanner from '@/components/ui/BreakingNewsBanner';

export default function ArticulosPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const allArticles = await getArticles();
        // Filter for opinion articles (analysis, guide types)
        const opinionArticles = allArticles.filter(a =>
          a.type === 'analysis' || a.type === 'guide' || a.type === 'article'
        );
        setArticles(opinionArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleReadMore = (slug: string) => {
    window.location.href = `/article?slug=${slug}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NewspaperHeader locale="es" />
      <BreakingNewsBanner />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-headline font-bold text-gray-900 dark:text-white mb-2">
            Artículos de Opinión
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Análisis profundos, guías completas y artículos de opinión sobre el mundo del gaming móvil
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                excerpt={article.excerpt}
                image={article.image}
                category={article.category}
                author={article.author}
                publishDate={article.publishDate}
                readTime={article.readTime}
                rating={article.rating}
                slug={article.slug}
                onReadMore={handleReadMore}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No hay artículos disponibles en este momento.
            </p>
          </div>
        )}
      </main>

      <Footer locale="es" />
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { getArticles, type Article } from '@/lib/articles';
import NewspaperHeader from '@/components/layout/NewspaperHeader';
import Footer from '@/components/layout/Footer';
import ArticleCard from '@/components/ui/ArticleCard';
import BreakingNewsBanner from '@/components/ui/BreakingNewsBanner';
import { Trophy } from 'lucide-react';

export default function TopsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const allArticles = await getArticles();
        // Filter for TOP 5 articles
        const topArticles = allArticles.filter(a => a.type === 'top5');
        setArticles(topArticles);
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
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-10 h-10 text-gaming-gold" />
            <h1 className="text-4xl font-headline font-bold text-gray-900 dark:text-white">
              Rankings TOP 5
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Descubre los mejores juegos móviles organizados por categorías
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
              No hay rankings disponibles en este momento.
            </p>
          </div>
        )}
      </main>

      <Footer locale="es" />
    </div>
  );
}
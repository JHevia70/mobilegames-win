'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ArticleCard from './ArticleCard';
import { getLatestArticles, getFeaturedArticles, type Article } from '@/lib/articles';

interface DynamicArticlesProps {
  fallbackArticles: Article[];
}

const DynamicArticles: React.FC<DynamicArticlesProps> = ({ fallbackArticles }) => {
  const [articles, setArticles] = useState<Article[]>(fallbackArticles);
  const [heroArticle, setHeroArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Get featured articles for hero
        const featured = await getFeaturedArticles();

        // Get latest articles
        const latest = await getLatestArticles(8);

        if (featured.length > 0) {
          setHeroArticle(featured[0]);
        } else if (latest.length > 0) {
          setHeroArticle(latest[0]);
        }

        if (latest.length > 0) {
          setArticles(latest);
        }
      } catch (error) {
        console.error('Error fetching dynamic articles:', error);
        // Keep fallback articles on error
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleReadMore = (slug: string) => {
    window.location.href = `/articles/${slug}`;
  };

  // Use first article as hero if no specific hero article
  const displayHeroArticle = heroArticle || articles[0] || fallbackArticles[0];
  const displayArticles = articles.length > 0 ? articles : fallbackArticles;

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

  return (
    <>
      {/* Hero Article */}
      {displayHeroArticle && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ArticleCard
              {...displayHeroArticle}
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
                  Análisis profesionales de los mejores juegos móviles
                </p>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {displayArticles.slice(1, 5).map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    {...article}
                    size={index < 2 ? 'large' : 'medium'}
                    onReadMore={handleReadMore}
                  />
                ))}
              </div>

              {/* More Articles */}
              {displayArticles.length > 5 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-headline font-bold text-gray-900 dark:text-white mb-6">
                    Más Análisis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayArticles.slice(5, 8).map((article) => (
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

            {/* Sidebar with stats - you can keep your existing sidebar here */}
            <div className="lg:col-span-1">
              {/* Your existing sidebar content */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DynamicArticles;
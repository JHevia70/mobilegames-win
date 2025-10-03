'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Clock, Star, Calendar, FileText, Newspaper, Filter, X } from 'lucide-react';
import NewspaperHeader from '@/components/layout/NewspaperHeader';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { searchContent, type SearchResult } from '@/lib/search';
import { type Article } from '@/lib/articles';
import type { BreakingNews } from '@/lib/search';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'article' | 'breaking-news'>('all');

  // Realizar búsqueda
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setResults([]);
        setFilteredResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchContent(searchQuery);
        setResults(searchResults);
        setFilteredResults(searchResults);
      } catch (err: any) {
        console.error('Search error:', err);
        setError('Error al realizar la búsqueda. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery]);

  // Aplicar filtros
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredResults(results);
    } else {
      setFilteredResults(results.filter((r) => r.type === activeFilter));
    }
  }, [activeFilter, results]);

  // Actualizar query cuando cambia el parámetro de URL
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La búsqueda se realiza automáticamente via useEffect
  };

  const handleArticleClick = (item: SearchResult) => {
    if (item.type === 'article') {
      const article = item.data as Article;
      window.location.href = `/article?slug=${article.slug}`;
    } else {
      window.location.href = '/teletipos';
    }
  };

  const getFilterCounts = () => {
    return {
      all: results.length,
      article: results.filter((r) => r.type === 'article').length,
      breakingNews: results.filter((r) => r.type === 'breaking-news').length,
    };
  };

  const counts = getFilterCounts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NewspaperHeader locale="es" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Búsqueda de Contenido
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Encuentra artículos, reviews, rankings y noticias
            </p>
          </motion.div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artículos, juegos, categorías..."
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-lg focus:ring-2 focus:ring-gaming-red focus:border-gaming-red transition-all placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeFilter === 'all'
                  ? 'bg-gaming-red text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              Todos ({counts.all})
            </button>
            <button
              onClick={() => setActiveFilter('article')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeFilter === 'article'
                  ? 'bg-gaming-red text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              Artículos ({counts.article})
            </button>
            <button
              onClick={() => setActiveFilter('breaking-news')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeFilter === 'breaking-news'
                  ? 'bg-gaming-red text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              Breaking News ({counts.breakingNews})
            </button>
          </div>

          {/* Results Count */}
          {searchQuery && !loading && (
            <p className="text-center text-gray-600 dark:text-gray-400">
              {filteredResults.length > 0 ? (
                <>
                  <span className="font-semibold text-gaming-red">{filteredResults.length}</span>{' '}
                  {filteredResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}{' '}
                  para "<span className="font-medium">{searchQuery}</span>"
                </>
              ) : (
                <>
                  No se encontraron resultados para "
                  <span className="font-medium">{searchQuery}</span>"
                </>
              )}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-red"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="py-8 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        {!loading && !error && filteredResults.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResults.map((result, index) => {
              const isArticle = result.type === 'article';
              const item = result.data;

              return (
                <motion.div
                  key={`${result.type}-${item.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="h-full hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                    onClick={() => handleArticleClick(result)}
                  >
                    {isArticle && (item as Article).image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={(item as Article).image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-gaming-red text-white text-xs font-bold rounded-full">
                            {(item as Article).category}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {isArticle ? (
                          <FileText className="w-4 h-4 text-gaming-red" />
                        ) : (
                          <Newspaper className="w-4 h-4 text-gaming-red" />
                        )}
                        <span className="text-xs font-semibold text-gaming-red uppercase">
                          {isArticle ? 'Artículo' : 'Breaking News'}
                        </span>
                        {result.relevanceScore > 15 && (
                          <span className="ml-auto px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-medium rounded">
                            Muy relevante
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-gaming-red transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {isArticle
                          ? (item as Article).excerpt
                          : item.content.substring(0, 150) + '...'}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.publishDate}
                          </span>
                          {isArticle && (
                            <>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {(item as Article).readTime} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                {(item as Article).rating}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && searchQuery && filteredResults.length === 0 && (
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="py-16 text-center">
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Intenta con otros términos de búsqueda o explora nuestras categorías
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Sugerencias:</span>
                {['RPG', 'Estrategia', 'Acción', 'TOP 5', 'Review'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gaming-red hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Initial State (no search query) */}
        {!loading && !searchQuery && (
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="py-16 text-center">
              <Search className="w-16 h-16 text-gaming-red mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Comienza a buscar
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Escribe cualquier término para encontrar artículos, reviews y noticias
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Búsquedas populares:</span>
                {['RPG', 'Estrategia', 'Acción', 'Puzzle', 'TOP 5', 'Review'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gaming-red hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer locale="es" />
    </div>
  );
}

export default function BusquedaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-red"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

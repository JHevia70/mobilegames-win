'use client';

import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Article } from './articles';

export interface BreakingNews {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  active: boolean;
  createdAt?: any;
}

export interface SearchResult {
  type: 'article' | 'breaking-news';
  data: Article | BreakingNews;
  relevanceScore: number;
}

/**
 * Calcula un score de relevancia basado en coincidencias
 */
function calculateRelevance(item: Article | BreakingNews, searchTerm: string): number {
  const term = searchTerm.toLowerCase().trim();
  let score = 0;

  // Título (mayor peso)
  if (item.title.toLowerCase().includes(term)) {
    score += 10;
    // Bonus si el término está al inicio
    if (item.title.toLowerCase().startsWith(term)) {
      score += 5;
    }
  }

  // Contenido
  if (item.content.toLowerCase().includes(term)) {
    // Contar ocurrencias
    const occurrences = (item.content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
    score += Math.min(occurrences, 5); // Máximo 5 puntos
  }

  // Excerpt (solo en artículos)
  if ('excerpt' in item && item.excerpt.toLowerCase().includes(term)) {
    score += 3;
  }

  // Categoría (solo en artículos)
  if ('category' in item && item.category.toLowerCase().includes(term)) {
    score += 7;
  }

  // Author (solo en artículos)
  if ('author' in item && item.author.toLowerCase().includes(term)) {
    score += 2;
  }

  return score;
}

/**
 * Busca en artículos y breaking news
 */
export async function searchContent(searchTerm: string): Promise<SearchResult[]> {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  const term = searchTerm.toLowerCase().trim();
  const results: SearchResult[] = [];

  try {
    console.log(`🔍 Searching for: "${term}"`);

    // Buscar en artículos
    const articlesRef = collection(db, 'articles');
    const articlesSnapshot = await getDocs(articlesRef);

    articlesSnapshot.forEach((doc) => {
      const data = doc.data();
      const article: Article = {
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        image: data.image || '',
        category: data.category || '',
        author: data.author || '',
        publishDate: data.publishDate || '',
        readTime: data.readTime || 5,
        rating: data.rating || 4.0,
        slug: data.slug || '',
        type: data.type || 'article',
        status: data.status || 'published',
        createdAt: data.createdAt,
      };

      // Solo buscar en artículos publicados
      if (article.status === 'published') {
        const score = calculateRelevance(article, term);
        if (score > 0) {
          results.push({
            type: 'article',
            data: article,
            relevanceScore: score,
          });
        }
      }
    });

    // Buscar en breaking news
    const newsRef = collection(db, 'breaking_news');
    const newsSnapshot = await getDocs(newsRef);

    newsSnapshot.forEach((doc) => {
      const data = doc.data();
      const news: BreakingNews = {
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        publishDate: data.publishDate || '',
        active: data.active || false,
        createdAt: data.createdAt,
      };

      const score = calculateRelevance(news, term);
      if (score > 0) {
        results.push({
          type: 'breaking-news',
          data: news,
          relevanceScore: score,
        });
      }
    });

    // Ordenar por relevancia
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log(`✅ Found ${results.length} results`);
    return results;
  } catch (error) {
    console.error('❌ Search error:', error);
    throw error;
  }
}

/**
 * Obtiene sugerencias de búsqueda basadas en categorías y títulos populares
 */
export async function getSearchSuggestions(): Promise<string[]> {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const suggestions = new Set<string>();

    // Agregar categorías
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.category) {
        suggestions.add(data.category);
      }
    });

    // Agregar algunas palabras clave comunes
    suggestions.add('RPG');
    suggestions.add('Estrategia');
    suggestions.add('Acción');
    suggestions.add('Puzzle');
    suggestions.add('TOP 5');
    suggestions.add('Review');

    return Array.from(suggestions).slice(0, 10);
  } catch (error) {
    console.error('❌ Error getting suggestions:', error);
    return [];
  }
}

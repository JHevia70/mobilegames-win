'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCywwj_27AOLJVq_hrhArfN--k1eStHOdA",
  authDomain: "mobilegames-win.firebaseapp.com",
  projectId: "mobilegames-win",
  storageBucket: "mobilegames-win.appspot.com",
  messagingSenderId: "349527092795",
  appId: "1:349527092795:web:ef3419e5e6922861d4b61e",
  measurementId: "G-JXSCYN9SFZ"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  rating: number;
  slug: string;
  featured?: boolean;
  type: string;
  createdAt?: any;
  status: string;
}

// Fetch articles using Firebase SDK (same code as test.html that works)
async function fetchArticlesSDK(): Promise<Article[]> {
  try {
    console.log('🔍 Fetching articles with Firebase SDK...');

    const articlesRef = collection(db, 'articles');
    const snapshot = await getDocs(articlesRef);

    console.log(`📥 Received ${snapshot.size} documents`);

    const articles: Article[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        title: data.title || 'Sin título',
        content: data.content || 'Sin contenido',
        excerpt: data.excerpt || 'Sin descripción',
        image: data.image || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
        category: data.category || 'General',
        author: data.author || 'Redacción',
        publishDate: data.publishDate || 'Fecha desconocida',
        readTime: data.readTime || 5,
        rating: data.rating || 4.0,
        slug: data.slug || `article-${doc.id}`,
        type: data.type || 'article',
        status: data.status || 'published',
        featured: data.featured || false,
        createdAt: data.createdAt,
      } as Article);
    });

    // Filter published articles
    const publishedArticles = articles.filter(a => a.status === 'published');

    console.log(`✅ Firebase SDK returned ${publishedArticles.length} published articles`);
    return publishedArticles;

  } catch (error) {
    console.error('❌ Firebase SDK error:', error);
    throw error;
  }
}

// Get all published articles
export async function getArticles(): Promise<Article[]> {
  return fetchArticlesSDK();
}

// Get featured articles
export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await fetchArticlesSDK();
  return articles.filter(a => a.featured).slice(0, 5);
}

// Get latest articles
export async function getLatestArticles(count: number = 10): Promise<Article[]> {
  const articles = await fetchArticlesSDK();

  // Sort by createdAt timestamp (most recent first)
  const sortedArticles = articles.sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA; // Descending order (newest first)
  });

  return sortedArticles.slice(0, count);
}

// Get article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const articles = await fetchArticlesSDK();
    const article = articles.find(a => a.slug.toLowerCase() === slug.toLowerCase());
    return article || null;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}

// Get articles by category
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const articles = await fetchArticlesSDK();
    return articles.filter(a =>
      a.category.toLowerCase().includes(category.toLowerCase()) ||
      category.toLowerCase().includes(a.category.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
}
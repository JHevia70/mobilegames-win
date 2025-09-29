'use client';

import { db } from './firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

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

// Get all published articles
export async function getArticles(): Promise<Article[]> {
  try {
    const articlesQuery = query(
      collection(db, 'articles'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(articlesQuery);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      articles.push({ id: doc.id, ...doc.data() } as Article);
    });

    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Get featured articles
export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const articlesQuery = query(
      collection(db, 'articles'),
      where('status', '==', 'published'),
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const querySnapshot = await getDocs(articlesQuery);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      articles.push({ id: doc.id, ...doc.data() } as Article);
    });

    return articles;
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return [];
  }
}

// Get latest articles
export async function getLatestArticles(count: number = 10): Promise<Article[]> {
  try {
    const articlesQuery = query(
      collection(db, 'articles'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(count)
    );

    const querySnapshot = await getDocs(articlesQuery);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      articles.push({ id: doc.id, ...doc.data() } as Article);
    });

    return articles;
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    return [];
  }
}

// Get article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const articlesQuery = query(
      collection(db, 'articles'),
      where('slug', '==', slug),
      where('status', '==', 'published')
    );

    const querySnapshot = await getDocs(articlesQuery);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Article;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}

// Get articles by category
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const articlesQuery = query(
      collection(db, 'articles'),
      where('status', '==', 'published'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(articlesQuery);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      articles.push({ id: doc.id, ...doc.data() } as Article);
    });

    return articles;
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
}
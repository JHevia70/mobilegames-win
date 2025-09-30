import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

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

export async function getArticlesServer(): Promise<Article[]> {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection('articles')
      .where('status', '==', 'published')
      .get();

    const articles: Article[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Article));

    return articles;
  } catch (error) {
    console.error('Error fetching articles from server:', error);
    return [];
  }
}
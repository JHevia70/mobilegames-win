'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import NewspaperHeader from '@/components/layout/NewspaperHeader';
import Footer from '@/components/layout/Footer';
import BreakingNewsBanner from '@/components/ui/BreakingNewsBanner';
import { Radio, Clock, Calendar } from 'lucide-react';

interface BreakingNews {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  createdAt: any;
  active: boolean;
}

export default function TeletiposPage() {
  const [news, setNews] = useState<BreakingNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsRef = collection(db, 'breaking_news');
        const q = query(newsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const newsData: BreakingNews[] = [];
        querySnapshot.forEach((doc) => {
          newsData.push({ id: doc.id, ...doc.data() } as BreakingNews);
        });

        setNews(newsData);
      } catch (error) {
        console.error('Error fetching breaking news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NewspaperHeader locale="es" />
      <BreakingNewsBanner />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Radio className="w-10 h-10 text-gaming-red" />
            <h1 className="text-4xl font-headline font-bold text-gray-900 dark:text-white">
              Teletipos
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Archivo de noticias de última hora sobre gaming móvil
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {item.active && (
                    <span className="inline-block bg-gaming-red text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                      ÚLTIMA HORA
                    </span>
                  )}

                  <h2 className="text-2xl font-headline font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h2>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {item.publishDate}
                    </div>
                  </div>

                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {item.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-700 dark:text-gray-300 mb-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Radio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No hay teletipos disponibles en este momento.
            </p>
          </div>
        )}
      </main>

      <Footer locale="es" />
    </div>
  );
}

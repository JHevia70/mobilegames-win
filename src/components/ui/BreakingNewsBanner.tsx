'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import BreakingNewsModal from './BreakingNewsModal';

interface BreakingNews {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  active: boolean;
}

export default function BreakingNewsBanner() {
  const [news, setNews] = useState<BreakingNews | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveNews = async () => {
      try {
        console.log('🔍 Fetching breaking news with Firebase SDK...');
        const newsRef = collection(db, 'breaking_news');
        const q = query(
          newsRef,
          where('active', '==', true),
          orderBy('createdAt', 'desc'),
          limit(1)
        );

        const querySnapshot = await getDocs(q);
        console.log('📰 Query result:', querySnapshot.size, 'documents');

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const newsData = { id: doc.id, ...doc.data() } as BreakingNews;
          console.log('✅ Breaking news found:', newsData.title);
          setNews(newsData);
        } else {
          console.log('⚠️ No active breaking news found');
        }
      } catch (error) {
        console.error('❌ Error fetching breaking news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveNews();
  }, []);

  if (loading) {
    return (
      <div className="bg-gaming-red text-white py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 text-sm font-medium">
            <span className="bg-white text-gaming-red px-2 py-1 rounded text-xs font-bold">
              ÚLTIMA HORA
            </span>
            <span>Cargando noticias...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="bg-gaming-red text-white py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 text-sm font-medium">
            <span className="bg-white text-gaming-red px-2 py-1 rounded text-xs font-bold">
              ÚLTIMA HORA
            </span>
            <span>Mantente informado sobre las últimas novedades del gaming móvil</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-gaming-red text-white py-2 cursor-pointer hover:bg-red-700 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 text-sm font-medium">
            <span className="bg-white text-gaming-red px-2 py-1 rounded text-xs font-bold animate-pulse">
              ÚLTIMA HORA
            </span>
            <span className="truncate">{news.title}</span>
            <span className="text-red-200 text-xs hidden sm:inline">(Click para leer más)</span>
          </div>
        </div>
      </div>

      <BreakingNewsModal
        isOpen={isModalOpen}
        news={news}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

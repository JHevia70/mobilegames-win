'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Users, Award, Star, Clock, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import ArticleCard from '@/components/ui/ArticleCard';
import {
  FloatingParticles,
  StarRain,
} from '@/components/ui/VisualEffects';
import NewspaperHeader from '@/components/layout/NewspaperHeader';
import Footer from '@/components/layout/Footer';

const HomePage = () => {
  const heroArticle = {
    id: '1',
    title: 'El Futuro del Gaming Móvil: Análisis Completo de las Tendencias 2024',
    excerpt: 'Un análisis profundo de cómo la industria del gaming móvil está evolucionando, desde gráficos avanzados hasta nuevas mecánicas de juego que están redefiniendo la experiencia móvil.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop',
    category: 'Análisis',
    author: 'Carlos Martinez',
    publishDate: '15 Enero 2024',
    readTime: 12,
    rating: 4.9,
    slug: 'futuro-gaming-movil-2024',
  };

  const featuredArticles = [
    {
      id: '2',
      title: 'TOP 5 Mejores Juegos RPG para Android 2024',
      excerpt: 'Descubre los juegos de rol más épicos que puedes disfrutar en tu dispositivo Android este año, desde aventuras épicas hasta mundos abiertos.',
      image: 'https://images.unsplash.com/photo-1542549808-a69a91d4a10d?w=800&h=400&fit=crop',
      category: 'RPG',
      author: 'Ana García',
      publishDate: '12 Enero 2024',
      readTime: 8,
      rating: 4.8,
      slug: 'top-5-mejores-juegos-rpg-android-2024',
    },
    {
      id: '3',
      title: 'Estrategia Mobile: Los 5 Juegos Que Debes Probar',
      excerpt: 'Pon a prueba tu mente estratégica con estos increíbles juegos de estrategia para móvil que te mantendrán pensando.',
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop',
      category: 'Estrategia',
      author: 'Miguel Santos',
      publishDate: '10 Enero 2024',
      readTime: 6,
      rating: 4.6,
      slug: 'estrategia-mobile-5-juegos-que-debes-probar',
    },
    {
      id: '4',
      title: 'Acción Sin Límites: TOP 5 Juegos de Acción iOS',
      excerpt: 'Adrenalina pura en tu iPhone con los mejores juegos de acción del momento.',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=400&fit=crop',
      category: 'Acción',
      author: 'Laura Pérez',
      publishDate: '8 Enero 2024',
      readTime: 7,
      rating: 4.7,
      slug: 'accion-sin-limites-top-5-juegos-accion-ios',
    },
    {
      id: '5',
      title: 'Puzzle Games: Ejercita Tu Mente Mientras Te Diviertes',
      excerpt: 'Los mejores juegos de puzzle que combinarán diversión con desafío mental.',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=400&fit=crop',
      category: 'Puzzle',
      author: 'David López',
      publishDate: '5 Enero 2024',
      readTime: 5,
      rating: 4.5,
      slug: 'puzzle-games-ejercita-mente-mientras-diviertes',
    },
  ];

  const stats = [
    {
      icon: '🎮',
      value: '500+',
      label: 'Juegos Analizados',
      color: 'text-gaming-gold',
    },
    {
      icon: '👥',
      value: '10K+',
      label: 'Lectores Mensuales',
      color: 'text-gaming-cyan',
    },
    {
      icon: '📈',
      value: '95%',
      label: 'Precisión en Reviews',
      color: 'text-gaming-green',
    },
    {
      icon: '🏆',
      value: '50+',
      label: 'TOP 5 Publicados',
      color: 'text-gaming-purple',
    },
  ];

  const categories = [
    { name: 'RPG', count: 45, color: 'bg-gaming-purple', icon: '⚔️' },
    { name: 'Estrategia', count: 32, color: 'bg-gaming-cyan', icon: '🧠' },
    { name: 'Acción', count: 28, color: 'bg-gaming-red', icon: '💥' },
    { name: 'Puzzle', count: 24, color: 'bg-gaming-orange', icon: '🧩' },
    { name: 'Deportes', count: 18, color: 'bg-gaming-green', icon: '⚽' },
    { name: 'Simulación', count: 15, color: 'bg-gaming-pink', icon: '🏗️' },
  ];

  const handleReadMore = (slug: string) => {
    window.location.href = `/articles/${slug}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NewspaperHeader locale="es" />

      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <StarRain density="light" />
        <FloatingParticles density="light" />
      </div>

      <main className="relative">
        {/* Breaking News Banner */}
        <div className="bg-gaming-red text-white py-2">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-2 text-sm font-medium">
              <span className="bg-white text-gaming-red px-2 py-1 rounded text-xs font-bold">ÚLTIMA HORA</span>
              <span>Nuevo análisis: Los mejores juegos móviles de enero 2024</span>
            </div>
          </div>
        </div>

        {/* Hero Article */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ArticleCard
              {...heroArticle}
              size="hero"
              onReadMore={handleReadMore}
            />
          </div>
        </section>

        {/* Main Content Grid */}
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
                  {featuredArticles.slice(0, 4).map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      {...article}
                      size={index < 2 ? 'large' : 'medium'}
                      onReadMore={handleReadMore}
                    />
                  ))}
                </div>

                {/* More Articles */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-headline font-bold text-gray-900 dark:text-white mb-6">
                    Más Análisis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredArticles.slice(1).map((article) => (
                      <ArticleCard
                        key={article.id + '_more'}
                        {...article}
                        size="small"
                        onReadMore={handleReadMore}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Stats Card */}
                <Card className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gaming-red">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      En Números
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stats.map((stat, index) => (
                      <div key={stat.label} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{stat.icon}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                        </div>
                        <span className="font-bold text-gaming-red">{stat.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Categories Card */}
                <Card className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gaming-red">Categorías</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{category.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
                <Card className="bg-gradient-to-br from-gaming-red to-red-600 text-white border-0">
                  <CardContent className="p-6">
                    <h3 className="font-headline font-bold text-xl mb-2">Newsletter Gaming</h3>
                    <p className="text-red-100 text-sm mb-4">
                      Recibe las últimas reviews y noticias directamente en tu email
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        className="w-full px-3 py-2 rounded text-gray-900 text-sm focus:ring-2 focus:ring-white focus:outline-none"
                      />
                      <Button className="w-full bg-white text-gaming-red hover:bg-gray-100 font-medium">
                        Suscribirse
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </div>
  );
};

export default HomePage;
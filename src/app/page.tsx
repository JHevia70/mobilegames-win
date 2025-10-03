'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Users, Award, Star, Clock, User, Gamepad2, Swords, Brain, Zap, Puzzle, Circle, Settings, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import ArticleCard from '@/components/ui/ArticleCard';
import DynamicArticles from '@/components/ui/DynamicArticles';
import CategoryModal from '@/components/ui/CategoryModal';
import BreakingNewsBanner from '@/components/ui/BreakingNewsBanner';
import { type Article } from '@/lib/articles';
import NewspaperHeader from '@/components/layout/NewspaperHeader';
import Footer from '@/components/layout/Footer';
import { subscribeToNewsletter } from '@/lib/newsletter';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [sidebarEmail, setSidebarEmail] = React.useState('');
  const [sidebarLoading, setSidebarLoading] = React.useState(false);
  const [sidebarMessage, setSidebarMessage] = React.useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  });
  const heroArticle: Article = {
    id: '1',
    title: 'El Futuro del Gaming Móvil: Análisis Completo de las Tendencias 2024',
    content: 'Un análisis profundo de cómo la industria del gaming móvil está evolucionando...',
    excerpt: 'Un análisis profundo de cómo la industria del gaming móvil está evolucionando, desde gráficos avanzados hasta nuevas mecánicas de juego que están redefiniendo la experiencia móvil.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop',
    category: 'Análisis',
    author: 'Carlos Martinez',
    publishDate: '15 Enero 2024',
    readTime: 12,
    rating: 4.9,
    slug: 'futuro-gaming-movil-2024',
    type: 'analysis',
    status: 'published',
  };

  const featuredArticles: Article[] = [
    {
      id: '2',
      title: 'TOP 5 Mejores Juegos RPG para Android 2024',
      content: 'Descubre los juegos de rol más épicos...',
      excerpt: 'Descubre los juegos de rol más épicos que puedes disfrutar en tu dispositivo Android este año, desde aventuras épicas hasta mundos abiertos.',
      image: 'https://images.unsplash.com/photo-1542549808-a69a91d4a10d?w=800&h=400&fit=crop',
      category: 'RPG',
      author: 'Ana García',
      publishDate: '12 Enero 2024',
      readTime: 8,
      rating: 4.8,
      slug: 'top-5-mejores-juegos-rpg-android-2024',
      type: 'top5',
      status: 'published',
    },
    {
      id: '3',
      title: 'Estrategia Mobile: Los 5 Juegos Que Debes Probar',
      content: 'Pon a prueba tu mente estratégica...',
      excerpt: 'Pon a prueba tu mente estratégica con estos increíbles juegos de estrategia para móvil que te mantendrán pensando.',
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop',
      category: 'Estrategia',
      author: 'Miguel Santos',
      publishDate: '10 Enero 2024',
      readTime: 6,
      rating: 4.6,
      slug: 'estrategia-mobile-5-juegos-que-debes-probar',
      type: 'top5',
      status: 'published',
    },
    {
      id: '4',
      title: 'Acción Sin Límites: TOP 5 Juegos de Acción iOS',
      content: 'Adrenalina pura en tu iPhone...',
      excerpt: 'Adrenalina pura en tu iPhone con los mejores juegos de acción del momento.',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=400&fit=crop',
      category: 'Acción',
      author: 'Laura Pérez',
      publishDate: '8 Enero 2024',
      readTime: 7,
      rating: 4.7,
      slug: 'accion-sin-limites-top-5-juegos-accion-ios',
      type: 'top5',
      status: 'published',
    },
    {
      id: '5',
      title: 'Puzzle Games: Ejercita Tu Mente Mientras Te Diviertes',
      content: 'Los mejores juegos de puzzle...',
      excerpt: 'Los mejores juegos de puzzle que combinarán diversión con desafío mental.',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=400&fit=crop',
      category: 'Puzzle',
      author: 'David López',
      publishDate: '5 Enero 2024',
      readTime: 5,
      rating: 4.5,
      slug: 'puzzle-games-ejercita-mente-mientras-diviertes',
      type: 'guide',
      status: 'published',
    },
  ];

  const stats = [
    {
      icon: 'gamepad',
      value: '500+',
      label: 'Juegos Analizados',
      color: 'text-gaming-gold',
    },
    {
      icon: 'users',
      value: '10K+',
      label: 'Lectores Mensuales',
      color: 'text-gaming-cyan',
    },
    {
      icon: 'trending-up',
      value: '95%',
      label: 'Precisión en Reviews',
      color: 'text-gaming-green',
    },
    {
      icon: 'award',
      value: '50+',
      label: 'TOP 5 Publicados',
      color: 'text-gaming-purple',
    },
  ];

  const categories = [
    { name: 'RPG', count: 45, color: 'bg-gaming-purple', icon: 'sword' },
    { name: 'Estrategia', count: 32, color: 'bg-gaming-cyan', icon: 'brain' },
    { name: 'Acción', count: 28, color: 'bg-gaming-red', icon: 'zap' },
    { name: 'Puzzle', count: 24, color: 'bg-gaming-orange', icon: 'puzzle' },
    { name: 'Deportes', count: 18, color: 'bg-gaming-green', icon: 'circle' },
    { name: 'Simulación', count: 15, color: 'bg-gaming-pink', icon: 'settings' },
  ];

  const handleReadMore = (slug: string) => {
    window.location.href = `/article?slug=${slug}`;
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleSidebarSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSidebarLoading(true);
    setSidebarMessage({ type: null, text: '' });

    try {
      const result = await subscribeToNewsletter(sidebarEmail);
      
      if (result.success) {
        setSidebarMessage({ type: 'success', text: '¡Suscrito! Revisa tu email.' });
        setSidebarEmail('');
        // Redirigir a página de confirmación después de 2 segundos
        setTimeout(() => {
          window.location.href = '/newsletter/gracias';
        }, 2000);
      } else {
        setSidebarMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setSidebarMessage({ 
        type: 'error', 
        text: 'Error al procesar la suscripción.' 
      });
    } finally {
      setSidebarLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NewspaperHeader locale="es" onCategoryClick={handleCategoryClick} />

      <main className="relative">
        {/* Breaking News Banner */}
        <BreakingNewsBanner />

        {/* Dynamic Articles with Firestore integration */}
        <DynamicArticles
          fallbackArticles={[heroArticle, ...featuredArticles]}
          renderSidebar={(firebaseArticles) => (
            <>
              {/* TOP Articles Card */}
              <Card className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-gaming-red">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Trending
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {firebaseArticles.slice(0, 4).map((article, index) => (
                    <div
                      key={article.id}
                      className="group cursor-pointer"
                      onClick={() => handleReadMore(article.slug)}
                    >
                      <div className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex-shrink-0 relative">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                          <div className="absolute -top-2 -left-2 w-6 h-6 bg-gaming-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gaming-red transition-colors line-clamp-2 leading-snug mb-1">
                            {article.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {article.readTime} min
                            </span>
                            <span className="flex items-center">
                              <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                              {article.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-gaming-red">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    En Números
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.map((stat, index) => {
                    const getIcon = (iconName: string) => {
                      const iconProps = { className: "w-5 h-5 text-gaming-red" };
                      switch(iconName) {
                        case 'gamepad': return <Gamepad2 {...iconProps} />;
                        case 'users': return <Users {...iconProps} />;
                        case 'trending-up': return <TrendingUp {...iconProps} />;
                        case 'award': return <Award {...iconProps} />;
                        default: return <Star {...iconProps} />;
                      }
                    };

                    return (
                      <div key={stat.label} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getIcon(stat.icon)}
                          <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                        </div>
                        <span className="font-bold text-gaming-red">{stat.value}</span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Categories Card */}
              <Card className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gaming-red">Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map((category) => {
                      const getCategoryIcon = (iconName: string) => {
                        const iconProps = { className: "w-4 h-4 text-gaming-red" };
                        switch(iconName) {
                          case 'sword': return <Swords {...iconProps} />;
                          case 'brain': return <Brain {...iconProps} />;
                          case 'zap': return <Zap {...iconProps} />;
                          case 'puzzle': return <Puzzle {...iconProps} />;
                          case 'circle': return <Circle {...iconProps} />;
                          case 'settings': return <Settings {...iconProps} />;
                          default: return <Star {...iconProps} />;
                        }
                      };

                      return (
                        <div
                          key={category.name}
                          className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group cursor-pointer"
                          onClick={() => handleCategoryClick(category.name)}
                        >
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(category.icon)}
                            <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gaming-red transition-colors">{category.name}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{category.count}</span>
                        </div>
                      );
                    })}
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
                  <form onSubmit={handleSidebarSubscribe} className="space-y-3">
                    <input
                      type="email"
                      value={sidebarEmail}
                      onChange={(e) => setSidebarEmail(e.target.value)}
                      placeholder="tu@email.com"
                      disabled={sidebarLoading}
                      className="w-full px-3 py-2 rounded text-gray-900 text-sm focus:ring-2 focus:ring-white focus:outline-none disabled:opacity-50"
                      required
                    />
                    <Button 
                      type="submit"
                      disabled={sidebarLoading}
                      className="w-full bg-white text-gaming-red hover:bg-gray-100 font-medium disabled:opacity-50 flex items-center justify-center"
                    >
                      {sidebarLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Suscribiendo...
                        </>
                      ) : (
                        'Suscribirse'
                      )}
                    </Button>
                  </form>
                  
                  {/* Success/Error Messages */}
                  {sidebarMessage.type && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 flex items-center space-x-2 text-sm ${
                        sidebarMessage.type === 'success' ? 'text-green-100' : 'text-red-100'
                      }`}
                    >
                      {sidebarMessage.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span>{sidebarMessage.text}</span>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        />
      </main>
      <Footer locale="es" />

      {/* Modals */}
      <CategoryModal
        isOpen={selectedCategory !== null}
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onArticleSelect={(slug) => {
          setSelectedCategory(null);
          window.location.href = `/article?slug=${slug}`;
        }}
      />
    </div>
  );
};

export default HomePage;
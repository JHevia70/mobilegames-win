'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { subscribeToNewsletter } from '@/lib/newsletter';

interface FooterProps {
  locale: string;
}

const Footer: React.FC<FooterProps> = ({ locale }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setEmail('');
        // Redirigir a página de confirmación después de 2 segundos
        setTimeout(() => {
          window.location.href = '/newsletter/gracias';
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error al procesar la suscripción. Por favor, intenta de nuevo.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const footerLinks = [
    {
      title: 'Navegación',
      links: [
        { name: 'Inicio', href: '/' },
        { name: 'Artículos', href: '/articulos' },
        { name: 'Rankings', href: '/tops' },
        { name: 'Noticias', href: '/teletipos' },
      ]
    },
    {
      title: 'Categorías',
      links: [
        { name: 'RPG', href: '/articles?category=rpg' },
        { name: 'Estrategia', href: '/articles?category=strategy' },
        { name: 'Acción', href: '/articles?category=action' },
        { name: 'Puzzle', href: '/articles?category=puzzle' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Política de Privacidad', href: '/privacy' },
        { name: 'Términos de Uso', href: '/terms' },
        { name: 'Contacto', href: '/contact' },
      ]
    }
  ];

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-12 p-8 bg-gradient-to-r from-gaming-red/10 to-gaming-purple/10 rounded-xl border border-gaming-red/20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-gaming-red mr-2" />
              <h3 className="text-2xl font-bold text-foreground">
                Suscríbete a nuestra Newsletter
              </h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Recibe artículos diarios, rankings TOP5 y breaking news directamente en tu email
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-gaming-red focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gaming-red hover:bg-gaming-red/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Suscribirme
                  </>
                )}
              </button>
            </form>

            {/* Message feedback */}
            {message.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg flex items-center justify-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Logo y descripción */}
          <div className="lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center mb-4"
            >
              <img
                src="/images/MGlogoClear.png"
                alt="MobileGames.win"
                className="h-16 w-auto shadow-lg animate-glow"
              />
            </motion.div>
            <p className="text-sm text-muted-foreground mb-4">
              Tu fuente definitiva para reviews de juegos móviles. Descubre, compara y encuentra tu próximo juego favorito.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Hecho con</span>
              <Heart className="h-4 w-4 text-gaming-red animate-pulse" />
              <span>para gamers</span>
            </div>
          </div>

          {/* Enlaces */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-gaming-red transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              © 2024 MobileGames.win. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a
                href={`/${locale === 'es' ? 'en' : 'es'}`}
                className="text-xs text-muted-foreground hover:text-gaming-red transition-colors"
              >
                {locale === 'es' ? 'English' : 'Español'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
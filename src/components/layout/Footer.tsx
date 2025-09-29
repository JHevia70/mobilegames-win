'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

interface FooterProps {
  locale: string;
}

const Footer: React.FC<FooterProps> = ({ locale }) => {
  const footerLinks = [
    {
      title: 'Navegación',
      links: [
        { name: 'Inicio', href: '/' },
        { name: 'Artículos', href: '/articles' },
        { name: 'Categorías', href: '/categories' },
        { name: 'Acerca de', href: '/about' },
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
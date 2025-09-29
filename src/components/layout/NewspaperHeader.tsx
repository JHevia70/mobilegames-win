'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronDown, Bell } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

interface NewspaperHeaderProps {
  locale: string;
}

const NewspaperHeader: React.FC<NewspaperHeaderProps> = ({ locale }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigation = [
    { name: 'Inicio', href: '/', current: true },
    {
      name: 'Reviews',
      href: '/reviews',
      dropdown: [
        { name: 'RPG', href: '/reviews/rpg' },
        { name: 'Estrategia', href: '/reviews/strategy' },
        { name: 'Acción', href: '/reviews/action' },
        { name: 'Puzzle', href: '/reviews/puzzle' },
        { name: 'Deportes', href: '/reviews/sports' },
      ]
    },
    { name: 'TOP 5', href: '/top5' },
    { name: 'Noticias', href: '/news' },
    { name: 'Guías', href: '/guides' },
    { name: 'Análisis', href: '/analysis' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const handleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white dark:bg-gray-900 border-b-2 border-gaming-red shadow-sm">
      {/* Top bar con fecha y utils */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {today}
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gaming-red font-semibold">
                Tu revista digital de gaming móvil
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-600 dark:text-gray-300 hover:text-gaming-red transition-colors">
                <Bell className="h-4 w-4" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a href="/" className="flex items-center">
                <img
                  src="/images/MGlogoClear.png"
                  alt="MobileGames.win"
                  className="h-16 w-auto"
                />
              </a>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <nav className="flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  <button
                    onClick={() => item.dropdown && handleDropdown(item.name)}
                    className={cn(
                      'flex items-center px-1 py-2 text-sm font-medium border-b-2 transition-colors',
                      item.current
                        ? 'text-gaming-red border-gaming-red'
                        : 'text-gray-700 dark:text-gray-200 border-transparent hover:text-gaming-red hover:border-gaming-red/30'
                    )}
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.dropdown && activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-50"
                      >
                        <div className="py-2">
                          {item.dropdown.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gaming-red transition-colors"
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          {/* Search bar */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar reviews, juegos..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-gaming-red focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-700"
            >
              <div className="py-4 space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      className={cn(
                        'block px-3 py-3 text-base font-medium transition-colors',
                        item.current
                          ? 'text-gaming-red bg-red-50 dark:bg-red-900/20'
                          : 'text-gray-700 dark:text-gray-200 hover:text-gaming-red hover:bg-gray-50 dark:hover:bg-gray-800'
                      )}
                    >
                      {item.name}
                    </a>
                    {item.dropdown && (
                      <div className="ml-4 space-y-1">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gaming-red"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="px-3">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-gaming-red focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default NewspaperHeader;
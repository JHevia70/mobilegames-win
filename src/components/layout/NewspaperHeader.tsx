'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronDown, Bell } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SearchBar from '@/components/ui/SearchBar';
import { cn } from '@/lib/utils';

interface NewspaperHeaderProps {
  locale: string;
  onCategoryClick?: (category: string) => void;
}

const NewspaperHeader: React.FC<NewspaperHeaderProps> = ({ locale, onCategoryClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Artículos', href: '/articulos' },
    { name: 'Tops', href: '/tops' },
    { name: 'Teletipos', href: '/teletipos' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  };

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
                  <a
                    href={item.href}
                    className={cn(
                      'flex items-center px-1 py-2 text-sm font-medium border-b-2 transition-colors',
                      isActive(item.href)
                        ? 'text-gaming-red border-gaming-red'
                        : 'text-gray-700 dark:text-gray-200 border-transparent hover:text-gaming-red hover:border-gaming-red/30'
                    )}
                  >
                    {item.name}
                  </a>
                </div>
              ))}
            </nav>
          </div>

          {/* Search bar */}
          <div className="hidden md:block">
            <SearchBar className="w-64" placeholder="Buscar reviews, juegos..." />
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
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'w-full text-left block px-3 py-3 text-base font-medium transition-colors',
                      isActive(item.href)
                        ? 'text-gaming-red bg-gray-100 dark:bg-gray-800 border-l-4 border-gaming-red'
                        : 'text-gray-700 dark:text-gray-200 hover:text-gaming-red hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    {item.name}
                  </a>
                ))}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="px-3">
                    <SearchBar placeholder="Buscar..." isMobile={true} />
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
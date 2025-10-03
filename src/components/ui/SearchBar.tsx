'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  isMobile?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  placeholder = 'Buscar reviews, juegos...',
  isMobile = false,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      // Navegar a la página de búsqueda con el query
      router.push(`/busqueda?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} text-gray-400`} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            block w-full pl-10 pr-${searchQuery ? '10' : '3'} py-2 
            border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-700 
            text-gray-900 dark:text-white
            rounded-lg text-sm 
            focus:ring-2 focus:ring-gaming-red focus:border-transparent 
            placeholder-gray-500 dark:placeholder-gray-400
            transition-all
            ${isFocused ? 'ring-2 ring-gaming-red' : ''}
          `}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search hint */}
      <AnimatePresence>
        {isFocused && searchQuery.length > 0 && searchQuery.length < 2 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Escribe al menos 2 caracteres para buscar
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick search button hint */}
      <AnimatePresence>
        {isFocused && searchQuery.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50"
          >
            <button
              type="submit"
              className="w-full flex items-center gap-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:text-gaming-red transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>
                Buscar "<span className="font-semibold">{searchQuery}</span>"
              </span>
              <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                Enter
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default SearchBar;

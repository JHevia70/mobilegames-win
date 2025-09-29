'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  rating?: number;
  featured?: boolean;
  slug: string;
  size?: 'small' | 'medium' | 'large' | 'hero';
  onReadMore: (slug: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  excerpt,
  image,
  category,
  author,
  publishDate,
  readTime,
  rating,
  featured = false,
  slug,
  size = 'medium',
  onReadMore,
}) => {
  const sizeClasses = {
    small: 'h-64',
    medium: 'h-80',
    large: 'h-96',
    hero: 'h-[500px]',
  };

  const titleSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    hero: 'text-4xl md:text-5xl',
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={cn(
        'group cursor-pointer bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300',
        size === 'hero' && 'col-span-full'
      )}
      onClick={() => onReadMore(slug)}
    >
      <div className="relative">
        <div
          className={cn(
            'bg-cover bg-center bg-no-repeat relative',
            sizeClasses[size]
          )}
          style={{ backgroundImage: `url(${image})` }}
        >
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badge de categoría */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gaming-red text-white shadow-lg">
              <Tag className="w-3 h-3 mr-1" />
              {category}
            </span>
          </div>

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-gaming-gold text-sm">★</span>
                <span className="text-white text-sm font-semibold">{rating}</span>
              </div>
            </div>
          )}

          {/* Content overlay para hero */}
          {size === 'hero' && (
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className={cn(
                'font-headline font-bold text-white mb-4 leading-tight',
                titleSizes[size]
              )}>
                {title}
              </h1>
              <p className="text-gray-200 text-lg leading-relaxed mb-6 max-w-2xl">
                {excerpt}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{publishDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{readTime} min</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content para artículos no hero */}
      {size !== 'hero' && (
        <div className="p-6">
          <div className="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{publishDate}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{readTime} min</span>
            </div>
          </div>

          <h2 className={cn(
            'font-headline font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-gaming-red transition-colors',
            titleSizes[size]
          )}>
            {title}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
            {excerpt}
          </p>

          {rating && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-gaming-gold">★</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {rating}/5
                  </span>
                </div>
                <span className="text-xs text-gaming-red font-medium group-hover:underline">
                  Leer análisis completo →
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.article>
  );
};

export default ArticleCard;
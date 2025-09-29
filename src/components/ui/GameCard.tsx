'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, ExternalLink } from 'lucide-react';
import { Card, CardContent } from './Card';
import Button from './Button';
import { cn } from '@/lib/utils';

interface GameCardProps {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishDate: string;
  readTime: number;
  rating?: number;
  featured?: boolean;
  slug: string;
  onReadMore: (slug: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  excerpt,
  image,
  category,
  publishDate,
  readTime,
  rating,
  featured = false,
  slug,
  onReadMore,
}) => {
  const cardVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.05, y: -10 },
  };

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 1 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      className={cn(
        'group cursor-pointer',
        featured ? 'col-span-2 row-span-2' : ''
      )}
    >
      <Card variant="gaming" className="h-full overflow-hidden">
        <div className="relative">
          <div
            className={cn(
              'relative bg-cover bg-center bg-no-repeat',
              featured ? 'h-64' : 'h-48'
            )}
            style={{ backgroundImage: `url(${image})` }}
          >
            <motion.div
              variants={overlayVariants}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            />

            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center rounded-full bg-gaming-red px-3 py-1 text-xs font-semibold text-white shadow-lg">
                {category}
              </span>
            </div>

            {rating && (
              <div className="absolute top-3 right-3 flex items-center space-x-1 rounded-full bg-black/60 px-2 py-1 text-white">
                <Star className="h-3 w-3 fill-gaming-gold text-gaming-gold" />
                <span className="text-xs font-semibold">{rating}</span>
              </div>
            )}

            {featured && (
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="mb-2 text-2xl font-bold text-white">{title}</h2>
                <p className="text-sm text-gray-200 line-clamp-2">{excerpt}</p>
              </div>
            )}
          </div>

          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Button
              variant="gaming"
              size="sm"
              onClick={() => onReadMore(slug)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Leer Más
            </Button>
          </motion.div>
        </div>

        {!featured && (
          <CardContent className="p-4">
            <div className="mb-2 flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{publishDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{readTime} min</span>
              </div>
            </div>

            <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-2">
              {title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-3">
              {excerpt}
            </p>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

export default GameCard;
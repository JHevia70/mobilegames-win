'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, Star, Share2, Heart, MessageCircle, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { type Article } from '@/lib/articles';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ArticleViewProps {
  article: Article;
  showBackButton?: boolean;
}

export default function ArticleView({ article, showBackButton = false }: ArticleViewProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <>
      {showBackButton && (
        <div className="mb-6">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>
      )}

      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Hero Image */}
        {article.image && (
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="bg-gaming-red text-white px-3 py-1 rounded-full text-sm font-medium">
                {article.category}
              </span>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="p-6 md:p-8">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {article.publishDate}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {article.readTime} min lectura
            </div>
            {article.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-gaming-gold fill-current" />
                {article.rating}
              </div>
            )}
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium italic">
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Social Actions */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => setLiked(!liked)}
              variant="ghost"
              className={cn(
                "flex items-center gap-2",
                liked ? "text-red-500" : ""
              )}
            >
              <Heart className={cn("w-4 h-4", liked && "fill-current")} />
              Me gusta
            </Button>
            <Button onClick={handleShare} variant="ghost" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Comentarios
            </Button>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-headline font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b-2 border-gaming-red pb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-headline font-bold text-gray-900 dark:text-white mt-6 mb-3" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props} />
                ),
                img: ({ node, ...props }) => (
                  <div className="my-8">
                    <img
                      className="w-full rounded-lg shadow-md"
                      loading="lazy"
                      {...props}
                    />
                  </div>
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="ml-4" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold text-gray-900 dark:text-white" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-gaming-red pl-4 italic text-gray-600 dark:text-gray-400 my-4" {...props} />
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Article Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Etiquetas:</span>
              <span className="inline-block bg-gaming-red/10 text-gaming-red px-2 py-1 rounded text-xs font-medium">
                {article.category}
              </span>
              <span className="inline-block bg-gaming-red/10 text-gaming-red px-2 py-1 rounded text-xs font-medium">
                {article.type}
              </span>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Home, ArrowRight, Sparkles } from 'lucide-react';
import NewspaperHeader from '@/components/layout/NewspaperHeader';
import Footer from '@/components/layout/Footer';
import confetti from 'canvas-confetti';

export default function NewsletterGraciasPage() {
  useEffect(() => {
    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#dc2626', '#ef4444', '#f87171', '#fca5a5'],
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <NewspaperHeader locale="es" />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              ¡Bienvenido a la familia! 🎮
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            >
              Tu suscripción ha sido confirmada exitosamente.
            </motion.p>

            {/* Email notification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gaming-red/10 border border-gaming-red/20 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-gaming-red mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Revisa tu email
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Te hemos enviado un <strong>email de bienvenida</strong> desde{' '}
                <span className="text-gaming-red font-semibold">info@mobilegames.win</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Si no lo ves, revisa tu carpeta de spam 📬
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8 text-left"
            >
              <div className="flex items-center mb-4">
                <Sparkles className="w-5 h-5 text-gaming-red mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Ahora recibirás:
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: '🎯', text: 'Artículos diarios sobre los mejores juegos móviles' },
                  { icon: '🏆', text: 'Rankings TOP5 semanales actualizados' },
                  { icon: '📰', text: 'Breaking News del mundo gaming cada 12 horas' },
                  { icon: '💎', text: 'Reviews exclusivas y análisis profundos' },
                  { icon: '🎁', text: 'Contenido especial solo para suscriptores' },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gaming-red hover:bg-gaming-red/90 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                <Home className="w-5 h-5 mr-2" />
                Ir al Inicio
              </a>
              <a
                href="/articulos"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Ver Artículos
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </motion.div>

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-sm text-gray-500 dark:text-gray-400 mt-8"
            >
              ¿Tienes preguntas? Responde al email de bienvenida y te ayudaremos.
            </motion.p>
          </motion.div>

          {/* Additional Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-2xl">🎮</span>
              <p className="text-sm">
                Únete a más de <strong className="text-gaming-red">1,000+</strong> gamers que ya reciben nuestro contenido
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer locale="es" />
    </div>
  );
}

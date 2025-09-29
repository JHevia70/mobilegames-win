'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const FloatingParticles: React.FC<{ density?: 'light' | 'normal' | 'heavy' }> = ({ density = 'normal' }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; opacity: number }>>([]);

  useEffect(() => {
    const particleCount = density === 'light' ? 8 : density === 'normal' ? 12 : 16;

    const particleArray = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: (i * (100 / particleCount)) + Math.random() * (80 / particleCount),
      y: 20 + Math.random() * 60,
      size: Math.random() * 3 + 1.5,
      delay: i * 0.5 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.4,
    }));
    setParticles(particleArray);
  }, [density]);

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
};

export const StarRain: React.FC<{ density?: 'light' | 'normal' | 'heavy' }> = ({ density = 'normal' }) => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; delay: number; duration: number; size: number; icon: string }>>([]);

  useEffect(() => {
    const starCount = density === 'light' ? 4 : density === 'normal' ? 6 : 8;
    const starIcons = ['⭐', '✨', '💫', '🌟'];

    const starArray = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: (i * (100 / starCount)) + Math.random() * (100 / starCount),
      delay: i * 0.8 + Math.random() * 2,
      duration: 4 + Math.random() * 2,
      size: 0.8 + Math.random() * 0.4,
      icon: starIcons[Math.floor(Math.random() * starIcons.length)],
    }));
    setStars(starArray);
  }, [density]);

  return (
    <div className="star-rain">
      {stars.map((star) => (
        <div
          key={star.id}
          className="falling-star"
          style={{
            left: `${star.x}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            fontSize: `${star.size}rem`,
            opacity: 0.7 + Math.random() * 0.3,
          }}
        >
          {star.icon}
        </div>
      ))}
    </div>
  );
};

export const PrizeBox: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <motion.div
      className={`treasure-chest prize-glow animate-prize-pulse ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

export const SparkleText: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <span className={`diamond-sparkle neon-glow animate-neon-flicker ${className}`}>
      {children}
    </span>
  );
};

export const GiftButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => {
  return (
    <motion.button
      className={`gift-shine sparkle-effect ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export const RewardBadge: React.FC<{
  icon: string;
  label: string;
  value: string;
  color?: string;
}> = ({ icon, label, value, color = 'text-gaming-gold' }) => {
  return (
    <motion.div
      className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full p-4 shadow-2xl"
      whileHover={{ scale: 1.1, rotate: 5 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full animate-pulse opacity-75"></div>
      <div className="relative text-center">
        <div className={`text-3xl mb-1 ${color} drop-shadow-lg`}>{icon}</div>
        <div className="text-2xl font-bold text-white mb-1 drop-shadow-md">{value}</div>
        <div className="text-xs text-yellow-100 font-semibold uppercase tracking-wide">{label}</div>
      </div>

      {/* Sparkle effects */}
      <div className="absolute -top-2 -right-2 text-white text-lg animate-sparkle-rotate">✨</div>
      <div className="absolute -bottom-2 -left-2 text-white text-lg animate-sparkle-rotate" style={{animationDelay: '1s'}}>💫</div>
    </motion.div>
  );
};

export const GamingOrb: React.FC<{
  color: string;
  size?: number;
  children?: React.ReactNode;
}> = ({ color, size = 100, children }) => {
  return (
    <motion.div
      className={`relative rounded-full flex items-center justify-center ${color} shadow-2xl`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), ${color})`,
        boxShadow: `0 0 30px ${color}40, inset 0 0 20px ${color}20`
      }}
      whileHover={{ scale: 1.1 }}
      animate={{
        boxShadow: [
          `0 0 30px ${color}40, inset 0 0 20px ${color}20`,
          `0 0 40px ${color}60, inset 0 0 30px ${color}30`,
          `0 0 30px ${color}40, inset 0 0 20px ${color}20`
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
      <div className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ backgroundColor: color }}></div>
    </motion.div>
  );
};

export const TreasureHunt: React.FC = () => {
  const treasures = ['💎', '👑', '🏆', '🎁', '⭐', '🌟'];

  return (
    <div className="flex space-x-4 justify-center my-8">
      {treasures.map((treasure, index) => (
        <motion.div
          key={index}
          className="text-4xl cursor-pointer"
          whileHover={{ scale: 1.3, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2
          }}
        >
          {treasure}
        </motion.div>
      ))}
    </div>
  );
};
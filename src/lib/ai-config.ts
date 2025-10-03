'use client';

import { db } from './firebase';
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';

export interface AIPromptConfig {
  id: string;
  name: string;
  type: 'daily-opinion' | 'weekly-top5' | 'breaking-news';
  systemPrompt: string;
  userPromptTemplate: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
  updatedAt?: any;
}

export interface AIGeneralConfig {
  id: 'general';
  preferredModel: 'gemini' | 'huggingface';
  geminiModel: string;
  huggingfaceModel: string;
  unsplashEnabled: boolean;
  defaultCategory: string;
  defaultAuthor: string;
}

// Get all prompt configurations
export async function getAllPromptConfigs(): Promise<AIPromptConfig[]> {
  try {
    const snapshot = await getDocs(collection(db, 'ai_config'));
    const configs: AIPromptConfig[] = [];

    snapshot.forEach((doc) => {
      if (doc.id !== 'general') {
        configs.push({ id: doc.id, ...doc.data() } as AIPromptConfig);
      }
    });

    return configs;
  } catch (error) {
    console.error('❌ Error loading AI configs:', error);
    throw error;
  }
}

// Get specific prompt configuration
export async function getPromptConfig(type: string): Promise<AIPromptConfig | null> {
  try {
    const docRef = doc(db, 'ai_config', type);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as AIPromptConfig;
    }

    return null;
  } catch (error) {
    console.error('❌ Error loading prompt config:', error);
    throw error;
  }
}

// Update prompt configuration
export async function updatePromptConfig(config: AIPromptConfig): Promise<void> {
  try {
    const docRef = doc(db, 'ai_config', config.id);
    await setDoc(docRef, {
      ...config,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log('✅ Prompt config updated:', config.id);
  } catch (error) {
    console.error('❌ Error updating prompt config:', error);
    throw error;
  }
}

// Get general configuration
export async function getGeneralConfig(): Promise<AIGeneralConfig | null> {
  try {
    const docRef = doc(db, 'ai_config', 'general');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as AIGeneralConfig;
    }

    return null;
  } catch (error) {
    console.error('❌ Error loading general config:', error);
    throw error;
  }
}

// Update general configuration
export async function updateGeneralConfig(config: Partial<AIGeneralConfig>): Promise<void> {
  try {
    const docRef = doc(db, 'ai_config', 'general');
    await setDoc(docRef, config, { merge: true });

    console.log('✅ General config updated');
  } catch (error) {
    console.error('❌ Error updating general config:', error);
    throw error;
  }
}

// Initialize default configurations (run once)
export async function initializeDefaultConfigs(): Promise<void> {
  try {
    // Daily Opinion Config
    await setDoc(doc(db, 'ai_config', 'daily-opinion'), {
      id: 'daily-opinion',
      name: 'Artículo de Opinión Diario',
      type: 'daily-opinion',
      systemPrompt: 'Eres un experto analista de juegos móviles con años de experiencia en la industria del gaming. Tu estilo es profesional, informado y objetivo.',
      userPromptTemplate: 'Escribe un artículo de opinión sobre las tendencias actuales en juegos móviles. El artículo debe tener entre 1800-2200 palabras, estar en español, y incluir análisis profundo de mecánicas, monetización, y experiencia del usuario. Formato en Markdown.',
      temperature: 0.7,
      maxTokens: 3000,
      enabled: true,
    }, { merge: true });

    // Weekly TOP5 Config
    await setDoc(doc(db, 'ai_config', 'weekly-top5'), {
      id: 'weekly-top5',
      name: 'TOP 5 Semanal',
      type: 'weekly-top5',
      systemPrompt: 'Eres un crítico especializado en juegos móviles con conocimiento profundo del mercado actual. Tus recomendaciones son precisas y bien fundamentadas.',
      userPromptTemplate: 'Crea un artículo TOP 5 de los mejores juegos móviles de {category} en {year}. Incluye descripción detallada de cada juego, pros/contras, y por qué destacan. Entre 1800-2200 palabras en español. Formato Markdown.',
      temperature: 0.8,
      maxTokens: 3000,
      enabled: true,
    }, { merge: true });

    // Breaking News Config
    await setDoc(doc(db, 'ai_config', 'breaking-news'), {
      id: 'breaking-news',
      name: 'Breaking News',
      type: 'breaking-news',
      systemPrompt: 'Eres un periodista especializado en noticias de gaming móvil. Tu estilo es conciso, informativo y directo al punto.',
      userPromptTemplate: 'Escribe una noticia de última hora sobre {topic} en el mundo de los juegos móviles. Debe ser concisa (200-250 palabras), informativa y en español. Formato Markdown.',
      temperature: 0.6,
      maxTokens: 500,
      enabled: true,
    }, { merge: true });

    // General Config
    await setDoc(doc(db, 'ai_config', 'general'), {
      id: 'general',
      preferredModel: 'gemini',
      geminiModel: 'gemini-2.0-flash-exp',
      huggingfaceModel: 'Qwen/Qwen2.5-72B-Instruct',
      unsplashEnabled: true,
      defaultCategory: 'Análisis',
      defaultAuthor: 'Redacción MobileGames',
    }, { merge: true });

    console.log('✅ Default AI configurations initialized');
  } catch (error) {
    console.error('❌ Error initializing configs:', error);
    throw error;
  }
}

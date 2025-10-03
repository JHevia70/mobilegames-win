// Load dotenv only if not in production (GitHub Actions provides env vars directly)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
}

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { HfInference } = require('@huggingface/inference');
const admin = require('firebase-admin');
const { createApi } = require('unsplash-js');
const { createClient } = require('pexels');
const gplay = require('google-play-scraper').default || require('google-play-scraper');
const fs = require('fs');

// Initialize services
// Use HuggingFace with Qwen as fallback when Gemini quota is exceeded
const USE_HUGGINGFACE = process.env.USE_HUGGINGFACE === 'true';
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;

console.log(`🤖 AI Provider: ${USE_HUGGINGFACE ? 'HuggingFace (Qwen 2.5 7B)' : 'Gemini'}`);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const hf = HUGGINGFACE_TOKEN ? new HfInference(HUGGINGFACE_TOKEN) : null;
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});
const pexels = createClient('l3oFCkkLv3MWsfAMDKKaimq8mqVindRDg6JzpzWM6XY48ywkCQc5pM7P');

// Cache for game data
const gameCache = new Map();

// HuggingFace API helper function using Qwen 2.5
async function callHuggingFace(prompt, systemPrompt = '') {
  if (!hf) {
    throw new Error('HuggingFace client not initialized. Set HUGGINGFACE_TOKEN environment variable.');
  }

  const fullPrompt = systemPrompt
    ? `${systemPrompt}\n\n${prompt}`
    : prompt;

  try {
    // Using Qwen 2.5 7B Instruct model (smaller, faster, free)
    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-7B-Instruct',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('   ❌ HuggingFace API error:', error.message);
    throw error;
  }
}

// Search for a game in Google Play Store
async function searchGameInPlayStore(gameName) {
  try {
    console.log(`   🔍 Searching Play Store for: "${gameName}"`);

    // Check cache first
    if (gameCache.has(gameName.toLowerCase())) {
      console.log(`   ✓ Found in cache`);
      return gameCache.get(gameName.toLowerCase());
    }

    const results = await gplay.search({
      term: gameName,
      num: 3,
      lang: 'es',
      country: 'es'
    });

    if (results.length > 0) {
      const game = results[0];
      console.log(`   ✓ Found: ${game.title} (${game.appId})`);

      // Get detailed info
      const details = await gplay.app({ appId: game.appId, lang: 'es', country: 'es' });

      const gameData = {
        title: details.title,
        appId: details.appId,
        icon: details.icon,
        screenshots: details.screenshots || [],
        score: details.score,
        scoreText: details.scoreText,
        ratings: details.ratings,
        url: details.url,
        genre: details.genre,
        developer: details.developer,
        developerUrl: details.developerWebsite,
        description: details.summary,
        released: details.released,
        updated: details.updated,
        version: details.version,
        minInstalls: details.minInstalls,
        maxInstalls: details.maxInstalls,
        price: details.price,
        free: details.free,
        size: details.size,
        androidVersion: details.androidVersion,
        contentRating: details.contentRating
      };

      // Cache it
      gameCache.set(gameName.toLowerCase(), gameData);

      return gameData;
    }

    console.log(`   ⚠️ Game not found in Play Store`);
    return null;
  } catch (error) {
    console.error(`   ❌ Error searching Play Store:`, error.message);
    return null;
  }
}

// Get top games by category
async function getTopGamesByCategory(category, num = 10) {
  try {
    console.log(`📱 Getting top ${num} ${category} games from Play Store...`);

    const categoryMap = {
      'rpg': gplay.category.ROLE_PLAYING,
      'estrategia': gplay.category.STRATEGY,
      'acción': gplay.category.ACTION,
      'action': gplay.category.ACTION,
      'puzzle': gplay.category.PUZZLE,
      'deportes': gplay.category.SPORTS,
      'sports': gplay.category.SPORTS,
      'simulación': gplay.category.SIMULATION,
      'simulation': gplay.category.SIMULATION,
      'aventura': gplay.category.ADVENTURE,
      'adventure': gplay.category.ADVENTURE
    };

    const playCategory = categoryMap[category.toLowerCase()] || gplay.category.GAME;

    const results = await gplay.list({
      category: playCategory,
      collection: gplay.collection.TOP_FREE,
      num: num,
      lang: 'es',
      country: 'es'
    });

    console.log(`✓ Found ${results.length} games`);
    return results;
  } catch (error) {
    console.error(`❌ Error getting top games:`, error.message);
    return [];
  }
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require('../mobilegames-win-firebase-adminsdk-fbsvc-e75d0dfbc9.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'mobilegames-win'
  });
}

const db = admin.firestore();

// Article templates and topics
const articleTypes = [
  {
    type: 'top5',
    template: 'TOP 5 Mejores Juegos {category} para {platform} {month} {year}',
    categories: ['RPG', 'Estrategia', 'Acción', 'Puzzle', 'Deportes', 'Simulación'],
    platforms: ['Android', 'iOS', 'Mobile']
  },
  {
    type: 'analysis',
    template: 'Análisis: {topic} en Gaming Móvil {year}',
    topics: ['Nuevas Tendencias', 'Monetización', 'Gráficos 3D', 'Realidad Aumentada', 'Multijugador', 'Cloud Gaming']
  },
  {
    type: 'comparison',
    template: 'Comparativa: {topic1} vs {topic2} en Juegos Móviles',
    comparisons: [
      ['Android', 'iOS'],
      ['Juegos Gratis', 'Juegos Premium'],
      ['Gaming Casual', 'Gaming Hardcore'],
      ['Controles Touch', 'Controles con Gamepad']
    ]
  },
  {
    type: 'guide',
    templates: [
      '{topic} para Gamers Móviles: Todo lo que Necesitas Saber',
      'Domina {topic} en Juegos Móviles',
      '{topic}: La Guía Definitiva para Móviles',
      'Cómo Mejorar en {topic} - Guía Práctica',
      '{topic} en Gaming Móvil: Consejos y Trucos'
    ],
    topics: ['Optimizar Batería', 'Mejores Accesorios', 'Configuración Gráfica', 'Trucos y Consejos']
  }
];

// Discover trending topics in mobile gaming
async function discoverTrendingTopics() {
  const discoveryPrompt = `Analiza las tendencias actuales en gaming móvil y proporciona:

1. Los 3 temas MÁS TRENDING en juegos móviles en este momento (basado en búsquedas, discusiones, lanzamientos recientes)
2. Los 3 juegos móviles más populares/discutidos del momento
3. Controversias o debates actuales en la comunidad de gaming móvil
4. Novedades tecnológicas o mecánicas de juego que están ganando popularidad

Formato de respuesta:
TRENDING_TOPICS: [tema1, tema2, tema3]
HOT_GAMES: [juego1, juego2, juego3]
DEBATES: [debate1, debate2]
TECH: [novedad1, novedad2]

Sé específico y actual. Solo menciona cosas que estén realmente siendo tendencia AHORA.`;

  try {
    console.log('🔥 Discovering trending topics in mobile gaming...');

    let response;
    if (USE_HUGGINGFACE) {
      console.log('   Using HuggingFace (Qwen 2.5 7B)...');
      response = await callHuggingFace(discoveryPrompt);
    } else {
      const model = genAI.getGenerativeModel({
        model: 'models/gemini-2.0-flash-exp',
        tools: [{
          googleSearch: {}
        }],
      });
      const result = await model.generateContent(discoveryPrompt);
      response = await result.response.text();
    }

    console.log('📊 Trending topics discovered');
    return response;
  } catch (error) {
    console.error('⚠️  Error discovering trends:', error.message);
    return null;
  }
}

// Extract a random trending topic from discovery response
function extractTrendingTopic(trendingData) {
  if (!trendingData) return null;

  try {
    // Extract topics from different sections
    const topics = [];

    // Extract TRENDING_TOPICS
    const trendingMatch = trendingData.match(/TRENDING_TOPICS:\s*\[([^\]]+)\]/i);
    if (trendingMatch) {
      const items = trendingMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
      topics.push(...items);
    }

    // Extract DEBATES
    const debatesMatch = trendingData.match(/DEBATES:\s*\[([^\]]+)\]/i);
    if (debatesMatch) {
      const items = debatesMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
      topics.push(...items);
    }

    // Extract TECH
    const techMatch = trendingData.match(/TECH:\s*\[([^\]]+)\]/i);
    if (techMatch) {
      const items = techMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
      topics.push(...items);
    }

    if (topics.length > 0) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      console.log(`   ✅ Selected trending topic: "${randomTopic}"`);
      return randomTopic;
    }

    return null;
  } catch (error) {
    console.error('   ⚠️  Error extracting topic:', error.message);
    return null;
  }
}

// Search web for current gaming trends
async function searchGamingTrends(topic) {
  const searchPrompt = `Busca información actualizada sobre "${topic}" en juegos móviles.
Necesito:
- Juegos móviles reales y populares relacionados con ${topic}
- Tendencias actuales en gaming móvil sobre este tema
- Datos y estadísticas recientes
- Periféricos o accesorios relevantes si aplica

Proporciona información verificable y actual.`;

  try {
    console.log(`🔍 Searching web for: ${topic}`);

    if (USE_HUGGINGFACE) {
      console.log('   Using HuggingFace (Qwen 2.5 7B)...');
      return await callHuggingFace(searchPrompt);
    } else {
      const model = genAI.getGenerativeModel({
        model: 'models/gemini-2.0-flash-exp',
        tools: [{
          googleSearch: {}
        }],
      });
      const result = await model.generateContent(searchPrompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error('Error searching trends:', error);
    return '';
  }
}

// Generate article content with Gemini or OpenRouter
async function generateArticleContent(title, type, category = '') {
  const searchTerm = category || type;

  // First, search for current trends and real games
  const trendsInfo = await searchGamingTrends(searchTerm);

  // Different content structure based on article type
  const isTop5 = type === 'top5';

  const structurePrompt = isTop5 ? `
ESTRUCTURA OBLIGATORIA (TOP 5 - Análisis detallado de cada juego):

## Introducción
Introducción atractiva y contextualizada (200-250 palabras)

## 1. [Nombre del Juego 1]
[IMG_PLACEHOLDER_1: nombre exacto del juego]

Análisis completo del juego (300-400 palabras):
- Descripción detallada y características principales
- Mecánicas de juego y jugabilidad
- Puntos fuertes y débiles
- Por qué destaca en su categoría
- Valoración y recomendación

## 2. [Nombre del Juego 2]
[IMG_PLACEHOLDER_2: nombre exacto del juego]

Análisis completo del juego (300-400 palabras):
- Descripción detallada y características principales
- Mecánicas de juego y jugabilidad
- Puntos fuertes y débiles
- Por qué destaca en su categoría
- Valoración y recomendación

## 3. [Nombre del Juego 3]
[IMG_PLACEHOLDER_3: nombre exacto del juego]

Análisis completo del juego (300-400 palabras):
- Descripción detallada y características principales
- Mecánicas de juego y jugabilidad
- Puntos fuertes y débiles
- Por qué destaca en su categoría
- Valoración y recomendación

## 4. [Nombre del Juego 4]
[IMG_PLACEHOLDER_4: nombre exacto del juego]

Análisis completo del juego (300-400 palabras)

## 5. [Nombre del Juego 5]
[IMG_PLACEHOLDER_5: nombre exacto del juego]

Análisis completo del juego (300-400 palabras)

## Conclusión
Conclusión con comparativa final y recomendaciones (200-250 palabras)
` : `
ESTRUCTURA OBLIGATORIA (Artículo de opinión/análisis - El tema es lo importante):

## Introducción
Introducción atractiva sobre el tema principal (250-300 palabras)

## [Primer aspecto del tema]
Desarrollo del primer punto del tema (400-500 palabras)
Menciona 2-3 juegos como EJEMPLOS ilustrativos del punto
[IMG_PLACEHOLDER_1: nombre de un juego mencionado como ejemplo]

## [Segundo aspecto del tema]
Desarrollo del segundo punto del tema (400-500 palabras)
Menciona 2-3 juegos como EJEMPLOS ilustrativos del punto
[IMG_PLACEHOLDER_2: nombre de un juego mencionado como ejemplo]

## [Tercer aspecto del tema]
Desarrollo del tercer punto del tema (400-500 palabras)
Menciona 2-3 juegos como EJEMPLOS ilustrativos del punto
[IMG_PLACEHOLDER_3: nombre de un juego mencionado como ejemplo]

## Conclusión
Reflexión final sobre el tema y tendencias futuras (250-300 palabras)

IMPORTANTE:
- El FOCO está en desarrollar el TEMA, no en analizar juegos
- Los juegos son EJEMPLOS BREVES para ilustrar los puntos
- NO hagas análisis extensos de cada juego
- Menciona cada juego en 2-3 líneas máximo
- La ficha del juego ya proporciona la información detallada
`;

  const prompt = `
Escribe un artículo profesional COMPLETO sobre juegos móviles con el título: "${title}"

INFORMACIÓN DE CONTEXTO (extraída de búsquedas web actuales):
${trendsInfo}

REQUISITOS OBLIGATORIOS:
- Escribe en español de España
- Estilo periodístico profesional y detallado
- IMPORTANTE: El artículo debe estar COMPLETO, sin cortes ni texto incompleto
- Longitud: 1800-2200 palabras
- SOLO menciona juegos REALES que existan en las tiendas (App Store / Google Play)
- PROHIBIDO inventar juegos, desarrolladoras o datos falsos
- Usa SOLO información verificable de la búsqueda web proporcionada
- Incluye datos específicos y tendencias actuales
- Tono experto pero accesible

${structurePrompt}

CRÍTICO:
- Completa TODAS las secciones hasta el final
- La conclusión debe estar COMPLETA con párrafo final
- NO cortes el texto a mitad de oración
- Asegúrate de cerrar todas las ideas presentadas

IMÁGENES - MUY IMPORTANTE:
- Cada [IMG_PLACEHOLDER_X] debe tener el nombre EXACTO del juego mencionado
- Ejemplos CORRECTOS:
  * [IMG_PLACEHOLDER_1: Clash of Clans]
  * [IMG_PLACEHOLDER_2: PUBG Mobile]
  * [IMG_PLACEHOLDER_3: Genshin Impact]
- NO uses descripciones genéricas
- Cada imagen debe ser de un juego DIFERENTE
`;

  try {
    if (USE_HUGGINGFACE) {
      console.log('   Using HuggingFace (Qwen 2.5 7B) for article generation...');
      return await callHuggingFace(prompt, 'You are an expert gaming journalist specializing in mobile games. Write detailed, accurate, and engaging articles in Spanish.');
    } else {
      const model = genAI.getGenerativeModel({
        model: 'models/gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

// Get relevant image from Unsplash
async function getArticleImage(searchTerm, size = 'hero', pageOverride = null) {
  try {
    const page = pageOverride || Math.floor(Math.random() * 3) + 1;

    // Simplify search term
    let simplifiedTerm = searchTerm.toLowerCase();

    // Extract key gaming concepts
    const gameGenres = ['rpg', 'strategy', 'action', 'puzzle', 'racing', 'shooter', 'moba', 'fps'];
    const foundGenre = gameGenres.find(genre => simplifiedTerm.includes(genre));

    // Search strategies - mix of people playing and gaming devices for variety
    const searchStrategies = [
      foundGenre ? `people playing ${foundGenre} mobile game` : null,
      foundGenre ? `${foundGenre} mobile game` : null,
      'people playing mobile games',
      'smartphone gaming lifestyle',
      'mobile gaming',
      'video game controller',
      'gaming phone',
      'mobile gamer'
    ].filter(Boolean);

    for (let strategy of searchStrategies) {
      console.log(`   🔍 Searching Unsplash: "${strategy}" (page ${page})`);

      try {
        const result = await unsplash.search.getPhotos({
          query: strategy,
          page: page,
          perPage: 30,
          orientation: 'landscape'
        });

        if (result.response && result.response.results && result.response.results.length > 0) {
          // Pick a random photo
          const randomIndex = Math.floor(Math.random() * result.response.results.length);
          const photo = result.response.results[randomIndex];

          const imageUrl = size === 'hero'
            ? photo.urls.regular
            : photo.urls.small;

          console.log(`   ✓ Found image: ${photo.id} (${randomIndex + 1}/${result.response.results.length}) from "${strategy}"`);
          return imageUrl;
        }
      } catch (err) {
        console.log(`   ⚠️ Failed to search "${strategy}": ${err.message}`);
        continue;
      }
    }

    // If all fails, use a variety of curated mobile gaming images from Unsplash (people playing)
    console.log(`   🎲 Using random curated mobile gaming image`);
    const curatedImages = [
      'https://images.unsplash.com/photo-1556438064-2d7646166914?w=1200', // Person with gaming setup
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=1200', // Mobile gaming
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200', // Gaming lifestyle
      'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=1200', // Mobile phone gaming
      'https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=1200', // Smartphone gaming
      'https://images.unsplash.com/photo-1580234931426-e0c97857b519?w=1200', // Mobile player
      'https://images.unsplash.com/photo-1616499452689-1920f7c45df6?w=1200', // Gaming phone
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200'  // Mobile esports
    ];

    const randomImage = curatedImages[Math.floor(Math.random() * curatedImages.length)];
    return randomImage;

  } catch (error) {
    console.error('   ❌ Error fetching image:', error.message);
    // Ultimate fallback - person playing mobile game
    return 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=1200';
  }
}

// Process content and replace image placeholders with game info cards
async function processContentImages(content, searchTerm) {
  console.log('🖼️  Processing article images...');

  // Find all image placeholders
  const placeholderRegex = /\[IMG_PLACEHOLDER_(\d+):\s*([^\]]+)\]/g;
  let match;
  const replacements = [];

  while ((match = placeholderRegex.exec(content)) !== null) {
    const [fullMatch, index, description] = match;
    replacements.push({ fullMatch, index, description });
  }

  console.log(`Found ${replacements.length} image placeholders`);

  // Fetch images for each placeholder with specific search terms
  let processedContent = content;
  for (let i = 0; i < replacements.length; i++) {
    const { fullMatch, index, description } = replacements[i];

    console.log(`\n📸 Processing image ${i + 1}/${replacements.length}:`);
    console.log(`   Description: "${description}"`);

    // Extract potential game name from description
    let gameName = description.trim();
    gameName = gameName
      .replace(/\s+(mobile\s+game|gameplay|screenshot|graphics|showing|showcasing|in-game).*$/i, '')
      .trim();

    console.log(`   Game name: "${gameName}"`);

    let imageHtml = '';
    let gameData = null;

    // Try to find game in Play Store
    if (gameName) {
      gameData = await searchGameInPlayStore(gameName);

      if (gameData && gameData.screenshots.length > 0) {
        // Use a random screenshot from the game
        const randomScreenshot = gameData.screenshots[Math.floor(Math.random() * Math.min(gameData.screenshots.length, 5))];

        // Format dates
        const formatDate = (dateStr) => {
          if (!dateStr) return 'N/A';
          const date = new Date(dateStr);
          return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        };

        // Format installs
        const formatInstalls = (minInstalls) => {
          if (!minInstalls) return 'N/A';
          if (minInstalls >= 1000000000) return `${(minInstalls / 1000000000).toFixed(1)}B+`;
          if (minInstalls >= 1000000) return `${(minInstalls / 1000000).toFixed(0)}M+`;
          if (minInstalls >= 1000) return `${(minInstalls / 1000).toFixed(0)}K+`;
          return `${minInstalls}+`;
        };

        // Create beautiful game card
        imageHtml = `

<div class="game-card-pro" style="border: 3px solid #374151; border-radius: 16px; padding: 24px; margin: 40px 0; background: #1f2937; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">

  <div class="game-visual-section" style="margin-bottom: 16px;">
    <div class="game-screenshot-frame" style="width: 100%; border-radius: 12px; overflow: hidden; border: 3px solid #374151; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 12px; background: #111827;">
      <img src="${randomScreenshot}" alt="${description}" style="max-height: 280px !important; width: 100% !important; height: auto !important; object-fit: contain !important; display: block; border-radius: 8px;" />
    </div>
  </div>

  <div class="game-caption" style="font-size: 13px; color: #9ca3af; font-style: italic; line-height: 1.6; margin-bottom: 8px; padding: 0 4px;">
    <strong style="color: #f3f4f6; font-size: 14px;">${gameData.title}</strong> · ${gameData.developer} · ${gameData.genre || 'Juego móvil'} · ⭐ ${gameData.score ? gameData.score.toFixed(1) : 'N/A'}/5 · Descargas: ${formatInstalls(gameData.minInstalls)} · ${gameData.free ? 'Gratis' : gameData.price}
  </div>

  <div class="game-dates" style="font-size: 12px; color: #6b7280; margin-bottom: 12px; padding: 0 4px;">
    Lanzamiento: ${formatDate(gameData.released)} · Última actualización: ${formatDate(gameData.updated)}
  </div>

  <a href="${gameData.url}" target="_blank" rel="noopener" class="google-play-button" style="display: inline-block; margin-bottom: 0; transition: all 0.3s;">
    <img src="/assets/images/googlesc.png" alt="Get it on Google Play" class="play-badge" style="height: 35px !important; width: auto !important; max-width: 130px !important; display: block;" />
  </a>
</div>

`;

        console.log(`   ✓ Used Play Store screenshot for ${gameData.title}`);
      }
    }

    // Fallback to generic gaming images if Play Store fails
    if (!imageHtml) {
      console.log(`   ⚠️ Play Store not available, using generic image`);
      const pageNumber = (i + 1) + Math.floor(Math.random() * 3);
      const imageUrl = await getArticleImage(gameName || description, 'inline', pageNumber);
      imageHtml = `\n\n<img src="${imageUrl}" alt="${description}" class="article-image" />\n\n`;
    }

    processedContent = processedContent.replace(fullMatch, imageHtml);
    console.log(`   ✅ Replaced placeholder ${index}\n`);

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log('✅ All images processed\n');
  return processedContent;
}

// Generate article slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Authors pool
const authors = [
  'Carlos Martinez',
  'Ana García',
  'Miguel Santos',
  'Laura Pérez',
  'David López',
  'Sofia Rodriguez',
  'Pablo Fernandez'
];

// Generate random rating
function generateRating() {
  return (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
}

// Calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Main function to generate and publish article
async function generateAndPublishArticle() {
  try {
    console.log('🤖 Generating new article...');

    // Select article type (forced or random)
    let articleType;
    if (process.env.FORCE_ARTICLE_TYPE) {
      console.log(`🎯 Forcing article type: ${process.env.FORCE_ARTICLE_TYPE}`);
      articleType = articleTypes.find(t => t.type === process.env.FORCE_ARTICLE_TYPE);
      if (!articleType) {
        console.warn(`⚠️ Article type "${process.env.FORCE_ARTICLE_TYPE}" not found, using random`);
        articleType = articleTypes[Math.floor(Math.random() * articleTypes.length)];
      }
    } else {
      articleType = articleTypes[Math.floor(Math.random() * articleTypes.length)];
    }

    // Generate title based on type
    let title = '';
    let searchTerm = '';

    const currentDate = new Date();
    const month = currentDate.toLocaleDateString('es-ES', { month: 'long' });
    const year = currentDate.getFullYear();

    // For non-TOP5 articles, try to find trending topics first
    let trendingTopic = null;
    if (articleType.type !== 'top5') {
      const trendingData = await discoverTrendingTopics();
      trendingTopic = extractTrendingTopic(trendingData);
    }

    switch (articleType.type) {
      case 'top5':
        // TOP5 always uses predefined categories (can rotate monthly)
        const category = articleType.categories[Math.floor(Math.random() * articleType.categories.length)];
        const platform = articleType.platforms[Math.floor(Math.random() * articleType.platforms.length)];
        title = articleType.template
          .replace('{category}', category)
          .replace('{platform}', platform)
          .replace('{month}', month)
          .replace('{year}', year);
        searchTerm = category;
        break;

      case 'analysis':
        // Try trending topic first, fallback to predefined
        const topic = trendingTopic || articleType.topics[Math.floor(Math.random() * articleType.topics.length)];
        title = articleType.template
          .replace('{topic}', topic)
          .replace('{year}', year);
        searchTerm = topic;
        if (trendingTopic) {
          console.log('   🔥 Using TRENDING topic for analysis');
        } else {
          console.log('   📋 Using predefined topic (no trending found)');
        }
        break;

      case 'comparison':
        // If trending topic exists, create comparison with it
        if (trendingTopic) {
          console.log('   🔥 Using TRENDING topic for comparison');
          // Try to create a comparison based on trending topic
          const predefinedComparison = articleType.comparisons[Math.floor(Math.random() * articleType.comparisons.length)];
          title = `Comparativa: ${trendingTopic} en ${predefinedComparison[0]} vs ${predefinedComparison[1]}`;
          searchTerm = trendingTopic;
        } else {
          console.log('   📋 Using predefined comparison (no trending found)');
          const comparison = articleType.comparisons[Math.floor(Math.random() * articleType.comparisons.length)];
          title = articleType.template
            .replace('{topic1}', comparison[0])
            .replace('{topic2}', comparison[1]);
          searchTerm = comparison[0];
        }
        break;

      case 'guide':
        // Try trending topic first, fallback to predefined
        const guideTopic = trendingTopic || articleType.topics[Math.floor(Math.random() * articleType.topics.length)];
        const randomTemplate = articleType.templates[Math.floor(Math.random() * articleType.templates.length)];
        title = randomTemplate.replace('{topic}', guideTopic);
        searchTerm = guideTopic;
        if (trendingTopic) {
          console.log('   🔥 Using TRENDING topic for guide');
        } else {
          console.log('   📋 Using predefined topic (no trending found)');
        }
        break;
    }

    console.log(`📝 Title: ${title}`);

    // Generate content
    console.log('📄 Generating article content...');
    let content = await generateArticleContent(title, articleType.type, searchTerm);

    // Process images in content
    content = await processContentImages(content, searchTerm);

    // Get hero image
    console.log('🖼️  Fetching hero image...');
    const imageUrl = await getArticleImage(searchTerm, 'hero');

    // Create article object
    const article = {

      title,
      content,
      excerpt: content.replace(/<img[^>]*>/g, '').substring(0, 200) + '...',
      image: imageUrl,
      category: searchTerm,
      author: authors[Math.floor(Math.random() * authors.length)],
      publishDate: currentDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      readTime: calculateReadTime(content),
      rating: parseFloat(generateRating()),
      slug: generateSlug(title),
      featured: Math.random() > 0.7, // 30% chance of being featured
      type: articleType.type,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'published'
    };

    // Save to Firestore
    const docRef = await db.collection('articles').add(article);
    await docRef.update({ id: docRef.id });

    console.log('✅ Article published successfully!');
    console.log(`📖 Slug: ${article.slug}`);
    console.log(`👤 Author: ${article.author}`);
    console.log(`⭐ Rating: ${article.rating}`);
    console.log(`⏱️ Read time: ${article.readTime} min`);

    return article;

  } catch (error) {
    console.error('❌ Error generating article:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateAndPublishArticle()
    .then(() => {
      console.log('🎉 Article generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to generate article:', error);
      process.exit(1);
    });
}

module.exports = { generateAndPublishArticle };
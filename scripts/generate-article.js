const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');
const { createApi } = require('unsplash-js');
const fs = require('fs');

// Initialize services
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

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
    template: 'Guía Completa: {topic} para Gamers Móviles',
    topics: ['Optimizar Batería', 'Mejores Accesorios', 'Configuración Gráfica', 'Trucos y Consejos']
  }
];

// Search web for current gaming trends
async function searchGamingTrends(topic) {
  const model = genAI.getGenerativeModel({
    model: 'models/gemini-2.0-flash-exp',
    tools: [{
      googleSearch: {}
    }],
  });

  const searchPrompt = `Busca información actualizada sobre "${topic}" en juegos móviles.
Necesito:
- Juegos móviles reales y populares relacionados con ${topic}
- Tendencias actuales en gaming móvil sobre este tema
- Datos y estadísticas recientes
- Periféricos o accesorios relevantes si aplica

Proporciona información verificable y actual.`;

  try {
    console.log(`🔍 Searching web for: ${topic}`);
    const result = await model.generateContent(searchPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error searching trends:', error);
    return '';
  }
}

// Generate article content with Gemini
async function generateArticleContent(title, type, category = '') {
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

  const searchTerm = category || type;

  // First, search for current trends and real games
  const trendsInfo = await searchGamingTrends(searchTerm);

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
- Menciona periféricos o accesorios reales si es relevante para el tema
- Incluye datos específicos y tendencias actuales
- Tono experto pero accesible

ESTRUCTURA OBLIGATORIA:

## Introducción
Introducción atractiva y contextualizada (250-300 palabras)

## [Apartado 1 - título específico relacionado con el tema]
Primer punto principal desarrollado completamente (350-400 palabras)
[IMG_PLACEHOLDER_1: nombre del juego específico o concepto visual exacto mencionado en esta sección]

## [Apartado 2 - título específico relacionado con el tema]
Segundo punto principal desarrollado completamente (350-400 palabras)
[IMG_PLACEHOLDER_2: nombre del juego específico o concepto visual exacto mencionado en esta sección]

## [Apartado 3 - título específico relacionado con el tema]
Tercer punto principal desarrollado completamente (350-400 palabras)
[IMG_PLACEHOLDER_3: nombre del juego específico o concepto visual exacto mencionado en esta sección]

## Conclusión
Conclusión completa con recomendaciones claras y llamado a la acción (250-300 palabras)

CRÍTICO:
- Completa TODAS las secciones hasta el final
- La conclusión debe estar COMPLETA con párrafo final
- NO cortes el texto a mitad de oración
- Asegúrate de cerrar todas las ideas presentadas
- Menciona 5-8 juegos reales verificables

IMÁGENES - MUY IMPORTANTE:
- Cada [IMG_PLACEHOLDER_X] debe tener una descripción ÚNICA y ESPECÍFICA
- Usa nombres EXACTOS de juegos mencionados en esa sección
- Ejemplos CORRECTOS:
  * [IMG_PLACEHOLDER_1: Clash of Clans strategy gameplay]
  * [IMG_PLACEHOLDER_2: PUBG Mobile battle royale action]
  * [IMG_PLACEHOLDER_3: Razer Kishi mobile controller]
- NO uses descripciones genéricas como "juego de estrategia"
- Cada imagen debe ser de un juego o concepto DIFERENTE
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

// Get relevant image from Unsplash
async function getArticleImage(searchTerm, size = 'hero', pageOverride = null) {
  try {
    const dimensions = size === 'hero'
      ? 'w=1200&h=600&fit=crop'
      : 'w=800&h=500&fit=crop';

    // Use pageOverride if provided, otherwise random
    const page = pageOverride || Math.floor(Math.random() * 5) + 1;

    const result = await unsplash.search.getPhotos({
      query: `${searchTerm} mobile gaming`,
      page: page,
      perPage: 10, // Get more results to pick from
      orientation: 'landscape'
    });

    if (result.response && result.response.results.length > 0) {
      // Pick a random photo from the results for more variety
      const randomIndex = Math.floor(Math.random() * result.response.results.length);
      const photo = result.response.results[randomIndex];
      return `${photo.urls.regular}?${dimensions}&sig=${Date.now()}`;
    }

    // Fallback image
    return `https://images.unsplash.com/photo-1511512578047-dfb367046420?${dimensions}`;
  } catch (error) {
    console.error('Error fetching image:', error);
    return `https://images.unsplash.com/photo-1511512578047-dfb367046420?${dimensions}`;
  }
}

// Process content and replace image placeholders
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
    // Use the description directly as it should contain game names or specific topics
    const specificSearchTerm = description.includes('mobile game')
      ? description
      : `${description} mobile game gameplay`;

    // Add page parameter to get different results for each image
    const imageUrl = await getArticleImage(specificSearchTerm, 'inline', i + 1);
    const imageHtml = `\n\n<img src="${imageUrl}" alt="${description}" class="article-image" />\n\n`;
    processedContent = processedContent.replace(fullMatch, imageHtml);
    console.log(`✓ Replaced placeholder ${index}: "${description}" (page ${i + 1})`);

    // Add delay to avoid rate limiting and get different images
    await new Promise(resolve => setTimeout(resolve, 800));
  }

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

    // Select random article type
    const articleType = articleTypes[Math.floor(Math.random() * articleTypes.length)];

    // Generate title based on type
    let title = '';
    let searchTerm = '';

    const currentDate = new Date();
    const month = currentDate.toLocaleDateString('es-ES', { month: 'long' });
    const year = currentDate.getFullYear();

    switch (articleType.type) {
      case 'top5':
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
        const topic = articleType.topics[Math.floor(Math.random() * articleType.topics.length)];
        title = articleType.template
          .replace('{topic}', topic)
          .replace('{year}', year);
        searchTerm = topic;
        break;

      case 'comparison':
        const comparison = articleType.comparisons[Math.floor(Math.random() * articleType.comparisons.length)];
        title = articleType.template
          .replace('{topic1}', comparison[0])
          .replace('{topic2}', comparison[1]);
        searchTerm = comparison[0];
        break;

      case 'guide':
        const guideTopic = articleType.topics[Math.floor(Math.random() * articleType.topics.length)];
        title = articleType.template.replace('{topic}', guideTopic);
        searchTerm = guideTopic;
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
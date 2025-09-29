const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');
const { createApi } = require('unsplash-js');
const fs = require('fs');

// Initialize services
const genAI = new GoogleGenerativeAI('AIzaSyCywwj_27AOLJVq_hrhArfN--k1eStHOdA');
const unsplash = createApi({
  accessKey: '4qjo4eTlRYPjt-EJ1romAUY9VGg2Pbqb3Fd8uyorge0',
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

// Generate article content with Gemini
async function generateArticleContent(title, type, category = '') {
  const model = genAI.getGenerativeModel({
    model: 'models/gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    }
  });

  const searchTerm = category || type;
  const prompt = `
Escribe un artículo profesional sobre juegos móviles con el título: "${title}"

Requisitos:
- Escribe en español
- Estilo periodístico profesional
- 800-1200 palabras
- Incluye introducción, desarrollo y conclusión
- Menciona juegos específicos (pueden ser ficticios pero realistas)
- Usa un tono experto pero accesible
- Incluye datos y tendencias del gaming móvil
- Finaliza con una recomendación clara

Estructura:
1. Introducción atractiva
2. Desarrollo con puntos clave
3. Análisis detallado
4. Conclusión con recomendación

Genera solo el contenido del artículo, sin títulos de secciones.
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
async function getArticleImage(searchTerm) {
  try {
    const result = await unsplash.search.getPhotos({
      query: `mobile gaming smartphone games ${searchTerm}`,
      page: 1,
      perPage: 1,
      orientation: 'landscape'
    });

    if (result.response && result.response.results.length > 0) {
      const photo = result.response.results[0];
      return `${photo.urls.regular}?w=1200&h=600&fit=crop`;
    }

    // Fallback image
    return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop';
  } catch (error) {
    console.error('Error fetching image:', error);
    return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop';
  }
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

    // Generate content and get image
    const [content, imageUrl] = await Promise.all([
      generateArticleContent(title, articleType.type, searchTerm),
      getArticleImage(searchTerm)
    ]);

    // Create article object
    const article = {
      id: Date.now().toString(),
      title,
      content,
      excerpt: content.substring(0, 200) + '...',
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
    await db.collection('articles').doc(article.id).set(article);

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
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');

// Initialize services
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccount = require('../mobilegames-win-firebase-adminsdk-fbsvc-e75d0dfbc9.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'mobilegames-win'
  });
}

const db = admin.firestore();

// Search web for breaking news
async function searchBreakingNews() {
  const model = genAI.getGenerativeModel({
    model: 'models/gemini-2.0-flash-exp',
    tools: [{
      googleSearch: {}
    }],
  });

  const searchPrompt = `Busca las últimas noticias de última hora sobre juegos móviles en las últimas 12 horas.
Necesito:
- Noticias recientes y relevantes (lanzamientos, actualizaciones, eventos, torneos)
- Información verificable y actual
- Juegos reales y populares
- Noticias de la industria del gaming móvil

Dame las 3 noticias más importantes y recientes.`;

  try {
    console.log('🔍 Searching for breaking news...');
    const result = await model.generateContent(searchPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error searching breaking news:', error);
    return '';
  }
}

// Generate breaking news content
async function generateBreakingNewsContent(trendsInfo) {
  const model = genAI.getGenerativeModel({
    model: 'models/gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
      responseMimeType: "text/plain",
    }
  });

  const prompt = `
Escribe UNA noticia de última hora sobre gaming móvil basándote en esta información de búsquedas web:

INFORMACIÓN ACTUAL:
${trendsInfo}

REQUISITOS:
- Formato de teletipo/noticia breve
- Máximo 200-250 palabras
- Título impactante y llamativo (máximo 80 caracteres)
- Contenido conciso y directo al punto
- Menciona SOLO juegos o eventos REALES y verificables
- Incluye datos específicos si están disponibles
- Estilo periodístico profesional pero dinámico

ESTRUCTURA:
1. Un título corto y potente
2. Un párrafo principal con la noticia (100-150 palabras)
3. Un párrafo adicional con contexto o detalles (50-100 palabras)

Responde en formato:
TÍTULO: [título aquí]
---
[contenido de la noticia]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating breaking news:', error);
    throw error;
  }
}

// Parse the generated content
function parseBreakingNews(content) {
  const lines = content.split('\n');
  let title = '';
  let newsContent = '';
  let foundSeparator = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('TÍTULO:')) {
      title = line.replace('TÍTULO:', '').trim();
    } else if (line === '---') {
      foundSeparator = true;
    } else if (foundSeparator && line) {
      newsContent += line + '\n\n';
    }
  }

  return {
    title: title || 'Última Hora en Gaming Móvil',
    content: newsContent.trim()
  };
}

// Generate and publish breaking news
async function generateBreakingNews() {
  try {
    console.log('📰 Generating breaking news...');
    console.log(`🕐 Scheduled time: Every 12 hours`);

    // Search for current breaking news
    const trendsInfo = await searchBreakingNews();

    // Generate the news content
    const rawContent = await generateBreakingNewsContent(trendsInfo);
    const { title, content } = parseBreakingNews(rawContent);

    console.log(`📢 Title: ${title}`);

    // Create breaking news object
    const breakingNews = {
      title,
      content,
      type: 'breaking',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      publishDate: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      active: true, // This will be the current breaking news
      read: false
    };

    // Deactivate previous breaking news
    const previousNews = await db.collection('breaking_news')
      .where('active', '==', true)
      .get();

    const batch = db.batch();
    previousNews.forEach((doc) => {
      batch.update(doc.ref, { active: false });
    });

    // Add new breaking news
    const docRef = db.collection('breaking_news').doc();
    batch.set(docRef, { ...breakingNews, id: docRef.id });

    await batch.commit();

    console.log('✅ Breaking news published successfully!');
    console.log(`📖 ID: ${docRef.id}`);
    console.log(`📄 Preview: ${content.substring(0, 100)}...`);

    return breakingNews;

  } catch (error) {
    console.error('❌ Error generating breaking news:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateBreakingNews()
    .then(() => {
      console.log('🎉 Breaking news generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to generate breaking news:', error);
      process.exit(1);
    });
}

module.exports = { generateBreakingNews };

const { generateAndPublishArticle } = require('./generate-article');

// Force article type to be opinion-focused
const originalArticleTypes = [
  {
    type: 'analysis',
    template: 'Análisis: {topic} en Gaming Móvil {year}',
    topics: [
      'Nuevas Tendencias',
      'Monetización Free-to-Play',
      'Gráficos de Nueva Generación',
      'Realidad Aumentada',
      'Competitivo y eSports',
      'Cloud Gaming',
      'Cross-Platform Play',
      'Inteligencia Artificial en Juegos',
      'Streaming de Juegos Móviles',
      'Accesibilidad en Gaming Móvil'
    ]
  },
  {
    type: 'guide',
    template: 'Guía: {topic} para Gamers Móviles {year}',
    topics: [
      'Optimización de Rendimiento',
      'Mejores Accesorios del Mercado',
      'Trucos y Consejos Avanzados',
      'Configuración Óptima de Gráficos',
      'Ahorro de Batería y Datos',
      'Controles y Personalización',
      'Mejores Prácticas de Juego Competitivo',
      'Protección de Cuenta y Seguridad'
    ]
  }
];

async function generateDailyOpinion() {
  console.log('📰 Generating daily opinion article...');
  console.log(`🕐 Scheduled time: 9:00 AM`);

  try {
    // Temporarily override article types in the module
    const generateModule = require('./generate-article');
    const originalTypes = generateModule.articleTypes;

    // Monkey-patch for this execution
    Object.defineProperty(generateModule, 'articleTypes', {
      value: originalArticleTypes,
      writable: true,
      configurable: true
    });

    const article = await generateAndPublishArticle();

    // Restore original
    Object.defineProperty(generateModule, 'articleTypes', {
      value: originalTypes,
      writable: true,
      configurable: true
    });

    console.log('✅ Daily opinion article published successfully!');
    console.log(`📖 Title: ${article.title}`);
    return article;
  } catch (error) {
    console.error('❌ Error generating daily opinion:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateDailyOpinion()
    .then(() => {
      console.log('🎉 Daily opinion generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to generate daily opinion:', error);
      process.exit(1);
    });
}

module.exports = { generateDailyOpinion };

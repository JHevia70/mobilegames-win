const { generateAndPublishArticle } = require('./generate-article');

// Force article type to be TOP5
const top5ArticleTypes = [
  {
    type: 'top5',
    template: 'TOP 5 Mejores Juegos {category} para {platform} {month} {year}',
    categories: [
      'RPG',
      'Estrategia',
      'Acción',
      'Puzzle',
      'Deportes',
      'Simulación',
      'Aventura',
      'Shooter',
      'Carreras',
      'Plataformas',
      'Battle Royale',
      'MOBA',
      'Card Games',
      'Roguelike'
    ],
    platforms: ['Android', 'iOS', 'Mobile']
  }
];

async function generateWeeklyTop5() {
  console.log('🏆 Generating weekly TOP 5 article...');
  console.log(`🕐 Scheduled time: Tuesdays 10:00 AM`);
  console.log(`📅 Current day: ${new Date().toLocaleDateString('es-ES', { weekday: 'long' })}`);

  try {
    // Temporarily override article types in the module
    const generateModule = require('./generate-article');
    const originalTypes = generateModule.articleTypes;

    // Monkey-patch for this execution
    Object.defineProperty(generateModule, 'articleTypes', {
      value: top5ArticleTypes,
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

    console.log('✅ Weekly TOP 5 article published successfully!');
    console.log(`📖 Title: ${article.title}`);
    return article;
  } catch (error) {
    console.error('❌ Error generating weekly TOP 5:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateWeeklyTop5()
    .then(() => {
      console.log('🎉 Weekly TOP 5 generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to generate weekly TOP 5:', error);
      process.exit(1);
    });
}

module.exports = { generateWeeklyTop5 };

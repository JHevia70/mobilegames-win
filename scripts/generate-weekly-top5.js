// Set environment variable to force TOP5 generation
process.env.FORCE_ARTICLE_TYPE = 'top5';

const { generateAndPublishArticle } = require('./generate-article');

async function generateWeeklyTop5() {
  console.log('🏆 Generating weekly TOP 5 article...');
  console.log(`🕐 Scheduled time: Tuesdays 10:00 AM`);
  console.log(`📅 Current day: ${new Date().toLocaleDateString('es-ES', { weekday: 'long' })}`);

  try {
    const article = await generateAndPublishArticle();

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

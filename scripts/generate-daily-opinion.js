// Set environment variable to force ANALYSIS generation (opinion/analysis articles)
process.env.FORCE_ARTICLE_TYPE = 'analysis';

const { generateAndPublishArticle } = require('./generate-article');

async function generateDailyOpinion() {
  console.log('📰 Generating daily opinion article...');
  console.log(`🕐 Scheduled time: 9:00 AM`);

  try {
    const article = await generateAndPublishArticle();

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

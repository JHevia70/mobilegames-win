const { generateAndPublishArticle } = require('./generate-article');

console.log('🧪 Testing article generation...');

generateAndPublishArticle()
  .then((article) => {
    console.log('\n🎉 Test successful!');
    console.log('📄 Generated article:');
    console.log(`  Title: ${article.title}`);
    console.log(`  Author: ${article.author}`);
    console.log(`  Category: ${article.category}`);
    console.log(`  Rating: ${article.rating}`);
    console.log(`  Read time: ${article.readTime} min`);
    console.log(`  Slug: ${article.slug}`);
    console.log(`  Content length: ${article.content.length} characters`);

    if (article.featured) {
      console.log('  ⭐ This article is featured!');
    }

    console.log('\n✅ Article saved to Firestore successfully!');
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
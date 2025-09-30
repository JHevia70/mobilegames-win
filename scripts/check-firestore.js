const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = require('../mobilegames-win-firebase-adminsdk-fbsvc-e75d0dfbc9.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'mobilegames-win'
    });
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
    process.exit(1);
  }
}

const db = admin.firestore();

async function checkFirestore() {
  try {
    console.log('\n🔍 Checking Firestore connection...\n');

    // Get all articles
    const articlesRef = db.collection('articles');
    const snapshot = await articlesRef.get();

    console.log(`📊 Total documents in 'articles' collection: ${snapshot.size}\n`);

    if (snapshot.empty) {
      console.log('⚠️  No articles found in Firestore');
      console.log('💡 Run "npm run generate-article" to create your first article\n');
      return;
    }

    // List all articles
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Article:', {
        id: doc.id,
        title: data.title || 'No title',
        status: data.status || 'No status',
        category: data.category || 'No category',
        publishDate: data.publishDate || 'No date',
        createdAt: data.createdAt ? data.createdAt.toDate() : 'No timestamp'
      });
      console.log('---\n');
    });

    // Check for published articles
    const publishedSnapshot = await articlesRef.where('status', '==', 'published').get();
    console.log(`✅ Published articles: ${publishedSnapshot.size}`);

    // Check recent articles
    const recentSnapshot = await articlesRef
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    console.log(`📅 Recent articles (last 5): ${recentSnapshot.size}\n`);

  } catch (error) {
    console.error('❌ Error checking Firestore:', error);
    console.error('Error details:', error.message);
  }
}

checkFirestore()
  .then(() => {
    console.log('✅ Firestore check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
// Simple script to test Firebase connection
const { db } = require('../src/lib/firebase.cjs'); // Need to check if this exists or if we need to create a server-side version
const { collection, getDocs, query, where } = require('firebase/firestore');

async function testFirebaseConnection() {
  console.log('🧪 Testing Firebase connection...');
  
  try {
    // Test basic collection access
    console.log('🔍 Accessing articles collection...');
    const articlesQuery = query(collection(db, 'articles'));
    const snapshot = await getDocs(articlesQuery);
    
    console.log(`✅ Connected successfully! Found ${snapshot.size} documents in articles collection.`);
    
    // Show some sample data
    if (snapshot.size > 0) {
      console.log('📋 Sample documents:');
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`  - ID: ${doc.id}`);
        console.log(`    Title: ${data.title || 'No title'}`);
        console.log(`    Status: ${data.status || 'No status'}`);
        console.log('    ---');
      });
    } else {
      console.log('⚠️ No documents found in the articles collection.');
    }
    
    // Test published articles specifically
    console.log('🔍 Testing published articles...');
    const publishedQuery = query(
      collection(db, 'articles'),
      where('status', '==', 'published')
    );
    const publishedSnapshot = await getDocs(publishedQuery);
    
    console.log(`✅ Found ${publishedSnapshot.size} published articles.`);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      name: error.name
    });
    return false;
  }
}

// If running directly
if (require.main === module) {
  testFirebaseConnection()
    .then((success) => {
      console.log(success ? '🎉 Firebase test completed successfully!' : '💥 Firebase test failed!');
      process.exit(success ? 0 : 1);
    });
}

module.exports = { testFirebaseConnection };
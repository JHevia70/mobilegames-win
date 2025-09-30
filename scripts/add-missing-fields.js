const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require('../mobilegames-win-firebase-adminsdk-fbsvc-e75d0dfbc9.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'mobilegames-win'
  });
}

const db = admin.firestore();

// List of author names to randomly assign
const authors = [
  'Carlos Ruiz',
  'Ana García',
  'Miguel Santos',
  'Laura Pérez',
  'David López',
  'María Torres',
  'Javier Moreno',
  'Elena Martín'
];

async function addMissingFields() {
  try {
    console.log('🔍 Checking articles for missing fields...\n');

    const articlesRef = db.collection('articles');
    const snapshot = await articlesRef.get();

    console.log(`📊 Found ${snapshot.size} articles\n`);

    let updated = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const updates = {};

      // Check for missing author
      if (!data.author) {
        updates.author = authors[Math.floor(Math.random() * authors.length)];
        console.log(`➕ Adding author to article ${doc.id}: ${updates.author}`);
      }

      // Check for missing fields
      if (!data.featured) {
        updates.featured = false;
      }

      // Update if there are changes
      if (Object.keys(updates).length > 0) {
        await articlesRef.doc(doc.id).update(updates);
        updated++;
        console.log(`✅ Updated article ${doc.id}:`, updates);
      } else {
        console.log(`✓ Article ${doc.id} has all fields`);
      }
    }

    console.log(`\n✅ Process complete. Updated ${updated} articles.`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addMissingFields()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
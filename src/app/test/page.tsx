'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWithSDK() {
      try {
        console.log('🔍 Iniciando fetch con Firebase SDK...');

        // Import Firebase dynamically
        const { initializeApp, getApps } = await import('firebase/app');
        const { getFirestore, collection, getDocs } = await import('firebase/firestore');

        const firebaseConfig = {
          apiKey: "AIzaSyCywwj_27AOLJVq_hrhArfN--k1eStHOdA",
          authDomain: "mobilegames-win.firebaseapp.com",
          projectId: "mobilegames-win",
          storageBucket: "mobilegames-win.appspot.com",
          messagingSenderId: "349527092795",
          appId: "1:349527092795:web:ef3419e5e6922861d4b61e",
          measurementId: "G-JXSCYN9SFZ"
        };

        console.log('📦 Config:', firebaseConfig);

        // Initialize Firebase
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        console.log('✅ Firebase initialized');

        const db = getFirestore(app);
        console.log('✅ Firestore initialized');

        // Get articles
        const articlesRef = collection(db, 'articles');
        console.log('📡 Fetching from collection: articles');

        const snapshot = await getDocs(articlesRef);
        console.log(`📥 Received ${snapshot.size} documents`);

        const docs: any[] = [];
        snapshot.forEach((doc) => {
          docs.push({
            id: doc.id,
            ...doc.data()
          });
        });

        console.log('✅ Articles processed:', docs.length);
        setArticles(docs);
        setError(null);

      } catch (err: any) {
        console.error('❌ Error:', err);
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchWithSDK();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Test Firebase SDK</h1>
        <p>⏳ Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Test Firebase SDK</h1>
        <div style={{ background: '#fee', padding: '15px', border: '1px solid red', borderRadius: '5px' }}>
          <p style={{ color: 'red', fontWeight: 'bold' }}>❌ Error:</p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Firebase SDK</h1>
      <div style={{ background: '#efe', padding: '15px', border: '1px solid green', borderRadius: '5px', marginBottom: '20px' }}>
        <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Conexión exitosa!</p>
        <p><strong>Total de artículos:</strong> {articles.length}</p>
      </div>

      {articles.length > 0 && (
        <>
          <h2>Artículos encontrados:</h2>
          {articles.map((article, index) => (
            <div key={article.id} style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '5px',
              background: '#f9f9f9'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>
                {index + 1}. {article.title || 'Sin título'}
              </h3>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>ID:</strong> {article.id}<br />
                <strong>Categoría:</strong> {article.category || 'N/A'}<br />
                <strong>Autor:</strong> {article.author || 'N/A'}<br />
                <strong>Estado:</strong> {article.status || 'N/A'}<br />
                <strong>Fecha:</strong> {article.publishDate || 'N/A'}
              </p>
              {article.excerpt && (
                <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                  {article.excerpt.substring(0, 150)}...
                </p>
              )}
            </div>
          ))}
        </>
      )}

      {articles.length === 0 && (
        <p style={{ color: 'orange' }}>⚠️ No se encontraron artículos en la base de datos</p>
      )}
    </div>
  );
}
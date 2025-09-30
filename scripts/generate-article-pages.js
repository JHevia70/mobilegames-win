const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = require('../mobilegames-win-firebase-adminsdk-fbsvc-e75d0dfbc9.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'mobilegames-win'
    });
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
    process.exit(1);
  }
}

const db = admin.firestore();

// HTML template for article page
function generateArticleHTML(article) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} - MobileGames.win</title>
    <meta name="description" content="${article.excerpt}">
    <link rel="icon" href="/favicon.ico">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --bg-primary: #ffffff;
            --bg-secondary: #f9fafb;
            --bg-tertiary: #f3f4f6;
            --text-primary: #111827;
            --text-secondary: #4b5563;
            --text-tertiary: #6b7280;
            --border-color: #e5e7eb;
            --gaming-red: #dc2626;
            --shadow: rgba(0, 0, 0, 0.1);
        }

        [data-theme="dark"] {
            --bg-primary: #1f2937;
            --bg-secondary: #111827;
            --bg-tertiary: #374151;
            --text-primary: #f9fafb;
            --text-secondary: #d1d5db;
            --text-tertiary: #9ca3af;
            --border-color: #374151;
            --shadow: rgba(0, 0, 0, 0.3);
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background: var(--bg-secondary);
            transition: background-color 0.3s, color 0.3s;
        }

        /* Header */
        .header {
            background: var(--bg-primary);
            border-bottom: 2px solid var(--gaming-red);
            box-shadow: 0 1px 3px var(--shadow);
        }
        .top-bar {
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-tertiary);
        }
        .top-bar-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            font-size: 0.75rem;
        }
        .date { color: var(--text-secondary); font-weight: 500; }
        .tagline { color: var(--gaming-red); font-weight: 600; }
        .theme-toggle {
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0.25rem;
            color: var(--text-secondary);
            font-size: 1rem;
        }
        .theme-toggle:hover { color: var(--gaming-red); }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .logo { height: 60px; cursor: pointer; }
        .nav {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        .nav a {
            color: var(--text-primary);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.875rem;
            border-bottom: 2px solid transparent;
            padding-bottom: 0.5rem;
            transition: all 0.3s;
        }
        .nav a:hover {
            color: var(--gaming-red);
            border-bottom-color: var(--gaming-red);
        }

        /* Container */
        .container {
            max-width: 900px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        /* Back button */
        .back-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            margin-bottom: 1.5rem;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.3s;
        }
        .back-button:hover {
            color: var(--gaming-red);
            background: var(--bg-tertiary);
        }

        /* Article */
        .article {
            background: var(--bg-primary);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px var(--shadow);
        }
        .hero-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
        }
        .hero-overlay {
            position: relative;
        }
        .category-badge {
            position: absolute;
            top: 1rem;
            left: 1rem;
            background: var(--gaming-red);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
        }

        .content {
            padding: 2rem;
        }
        h1 {
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--text-primary);
            margin-bottom: 1rem;
            line-height: 1.2;
        }
        .meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-color);
        }
        .meta-item { display: flex; align-items: center; gap: 0.5rem; }
        .excerpt {
            background: var(--bg-tertiary);
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            font-size: 1.125rem;
            font-style: italic;
            color: var(--text-secondary);
        }
        .article-content {
            font-size: 1.125rem;
            line-height: 1.8;
            color: var(--text-secondary);
        }
        .article-content p {
            margin-bottom: 1.5rem;
        }
        .article-footer {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
        }
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            align-items: center;
        }
        .tags-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        .tag {
            background: rgba(220, 38, 38, 0.1);
            color: var(--gaming-red);
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
        }

        /* Footer */
        .site-footer {
            background: var(--bg-primary);
            border-top: 1px solid var(--border-color);
            margin-top: 4rem;
            padding: 2rem 0;
        }
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            text-align: center;
        }
        .footer-logo {
            height: 50px;
            margin-bottom: 1rem;
        }
        .footer-text {
            color: var(--text-tertiary);
            font-size: 0.875rem;
        }
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin: 1rem 0;
            flex-wrap: wrap;
        }
        .footer-links a {
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.875rem;
        }
        .footer-links a:hover {
            color: var(--gaming-red);
        }

        @media (max-width: 768px) {
            h1 { font-size: 1.875rem; }
            .hero-image { height: 250px; }
            .content { padding: 1.5rem; }
            .nav { display: none; }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="top-bar">
            <div class="top-bar-content">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <span class="date" id="current-date"></span>
                    <span style="color: var(--text-tertiary);">|</span>
                    <span class="tagline">Tu revista digital de gaming móvil</span>
                </div>
                <button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()">
                    <span id="theme-icon">🌙</span>
                </button>
            </div>
        </div>
        <div class="header-content">
            <a href="/">
                <img src="/images/MGlogoClear.png" alt="MobileGames.win" class="logo">
            </a>
            <nav class="nav">
                <a href="/">Inicio</a>
                <a href="/">Artículos</a>
                <a href="/">Tops</a>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <div class="container">
        <a href="/" class="back-button">
            ← Volver
        </a>

        <article class="article">
            <div class="hero-overlay">
                <img src="${article.image}" alt="${article.title}" class="hero-image">
                <span class="category-badge">${article.category}</span>
            </div>

            <div class="content">
                <h1>${article.title}</h1>

                <div class="meta">
                    <span class="meta-item">👤 ${article.author}</span>
                    <span class="meta-item">📅 ${article.publishDate}</span>
                    <span class="meta-item">⏱️ ${article.readTime} min lectura</span>
                    <span class="meta-item">⭐ ${article.rating}</span>
                </div>

                <div class="excerpt">
                    ${article.excerpt}
                </div>

                <div class="article-content">
                    ${article.content.split('\n\n').map(p => `<p>${p}</p>`).join('\n')}
                </div>

                <div class="article-footer">
                    <div class="tags">
                        <span class="tags-label">Etiquetas:</span>
                        <span class="tag">${article.category}</span>
                        <span class="tag">${article.type}</span>
                    </div>
                </div>
            </div>
        </article>
    </div>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="footer-content">
            <img src="/images/MGlogoClear.png" alt="MobileGames.win" class="footer-logo">
            <div class="footer-links">
                <a href="/">Inicio</a>
                <a href="/">Artículos</a>
                <a href="/">Tops</a>
                <a href="/">Sobre Nosotros</a>
                <a href="/">Contacto</a>
            </div>
            <p class="footer-text">
                © 2024 MobileGames.win - Tu fuente de información sobre gaming móvil
            </p>
        </div>
    </footer>

    <script>
        // Initialize theme immediately to prevent flash
        (function() {
            // Get theme from Zustand storage (same as main page)
            const themeStorage = localStorage.getItem('theme-storage');
            let theme = 'dark'; // Default theme

            if (themeStorage) {
                try {
                    const parsed = JSON.parse(themeStorage);
                    theme = parsed.state?.theme || 'dark';
                } catch (e) {
                    console.error('Error parsing theme storage:', e);
                }
            }

            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
    <script>
        // Theme management
        function getTheme() {
            const themeStorage = localStorage.getItem('theme-storage');
            if (themeStorage) {
                try {
                    const parsed = JSON.parse(themeStorage);
                    return parsed.state?.theme || 'dark';
                } catch (e) {
                    return 'dark';
                }
            }
            return 'dark';
        }

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);

            // Save to Zustand storage format (same as main page)
            const themeStorage = {
                state: { theme: theme },
                version: 0
            };
            localStorage.setItem('theme-storage', JSON.stringify(themeStorage));

            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) {
                themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
        }

        function toggleTheme() {
            const currentTheme = getTheme();
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        }

        // Initialize theme icon
        window.addEventListener('DOMContentLoaded', function() {
            const theme = getTheme();
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) {
                themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }

            // Set current date
            const today = new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const dateElement = document.getElementById('current-date');
            if (dateElement) {
                dateElement.textContent = today;
            }
        });
    </script>
</body>
</html>`;
}

async function main() {
  try {
    console.log('📄 Generating static article pages...');

    // Fetch all published articles
    const snapshot = await db.collection('articles')
      .where('status', '==', 'published')
      .get();

    console.log(`📥 Found ${snapshot.size} published articles`);

    // Create articles directory
    const articlesDir = path.join(__dirname, '../out/articles');
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }

    let count = 0;
    snapshot.forEach((doc) => {
      const article = { id: doc.id, ...doc.data() };

      // Create slug directory
      const slugDir = path.join(articlesDir, article.slug);
      if (!fs.existsSync(slugDir)) {
        fs.mkdirSync(slugDir, { recursive: true });
      }

      // Write index.html
      const html = generateArticleHTML(article);
      fs.writeFileSync(path.join(slugDir, 'index.html'), html);

      count++;
      console.log(`✅ Generated: /articles/${article.slug}`);
    });

    console.log(`\n✨ Successfully generated ${count} article pages!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
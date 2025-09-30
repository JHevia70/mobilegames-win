# MobileGames.win - AI-Powered Mobile Game Reviews

## Project Overview

MobileGames.win is a Next.js-based website that automatically generates daily mobile game reviews and articles using Google Gemini AI. The system creates fresh content completely automatically, without manual intervention, and publishes it to a Firebase-hosted website.

### Key Features
- **AI-powered content generation** with Google Gemini 2.5 Flash
- **Daily automated article publishing** via GitHub Actions
- **Responsive newspaper-style design** with Tailwind CSS
- **Firebase Firestore database** for dynamic content storage
- **Automatic image fetching** from Unsplash API
- **SEO-optimized** for search engines

### Tech Stack
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom gaming theme
- **Backend**: Firebase (Firestore, Hosting, Auth)
- **AI Integration**: Google Gemini 2.5 Flash
- **Deployment**: GitHub Actions + Firebase Hosting
- **Images**: Unsplash API integration

## Project Structure

```
mobilegames-win/
├── .github/workflows/
│   └── generate-article.yml          # GitHub Actions automation
├── scripts/
│   ├── generate-article.js           # Main AI article generator
│   ├── generate-article-template.js  # Template backup system
│   ├── test-gemini-models.js         # Gemini testing
│   ├── debug-gemini.js               # Debugging utilities
│   └── test-working-gemini.js        # System verification
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── ArticleCard.tsx       # Article display component
│   │   │   ├── DynamicArticles.tsx   # Firestore data fetcher
│   │   │   └── VisualEffects.tsx     # Gaming visual effects
│   │   └── layout/
│   │       ├── NewspaperHeader.tsx   # Newspaper-style header
│   │       └── Footer.tsx            # Page footer
│   ├── lib/
│   │   ├── articles.ts               # Firestore article functions
│   │   ├── firebase.ts               # Firebase client config
│   │   └── utils.ts                  # Utility functions
│   └── app/
│       ├── page.tsx                  # Main page
│       └── layout.tsx                # Root layout
├── package.json                      # Dependencies and scripts
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind styling
└── firebase.json                     # Firebase configuration
```

## Building and Running

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev
# → http://localhost:3000

# Build for production
npm run build

# Run tests
npm test  # if tests exist
```

### AI Article Generation
```bash
# Generate article with Gemini AI (main system)
npm run generate-article

# Generate with templates (backup system)
npm run generate-article-template

# Test AI functionality
node scripts/debug-gemini.js
```

### Production Deployment
The site uses automated deployment through GitHub Actions:
1. GitHub Actions runs daily at 9:00 AM UTC
2. Generates a new article with Gemini AI
3. Saves to Firestore
4. Builds the Next.js site
5. Deploys to Firebase Hosting

For manual deployment:
```bash
# Manual build
npm run build

# Manual Firebase deploy
firebase deploy --only hosting
```

## Key Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate-article` - Generate article with Gemini AI
- `npm run generate-article-template` - Generate article with templates
- `node scripts/debug-gemini.js` - Debug Gemini API connection
- `npm run generate-article-ai` - Test AI generation only

## Development Conventions

### Code Style
- TypeScript for type safety
- React with Next.js App Router
- Tailwind CSS for styling with custom gaming theme
- Component-based architecture
- ESLint and TypeScript for code quality

### File Naming
- Use PascalCase for React components (e.g., `ArticleCard.tsx`)
- Use camelCase for utility functions and scripts
- Use kebab-case for file names that become URLs

### API Integration
- Gemini AI for content generation
- Firebase Firestore for data persistence
- Unsplash API for article images
- All API keys stored in environment variables or secrets

## Content Structure

### Firestore Article Schema
```typescript
interface Article {
  id: string;           // Firestore document ID
  title: string;        // Article title
  content: string;      // Full article content (HTML/Markdown)
  excerpt: string;      // 200 character summary
  image: string;        // Unsplash image URL
  category: string;     // Article category
  author: string;       // Randomly assigned author name
  publishDate: string;  // Formatted as '30 de septiembre de 2025'
  readTime: number;     // Estimated reading time in minutes
  rating: number;       // 4.0-5.0 rating
  slug: string;         // URL-friendly version of title
  featured: boolean;    // Whether article is featured
  type: string;         // 'top5', 'analysis', 'comparison', 'guide'
  status: 'published';  // Publication status
}
```

### Article Types
- **TOP 5**: Lists of best games by category
- **Analysis**: Trend analysis in mobile gaming
- **Comparisons**: Head-to-head game comparisons
- **Guides**: Tips and guides for mobile gamers

## Environment Configuration

The project uses several environment variables and secrets:

### Local Development
- `.env.local` for local development secrets
- `GEMINI_API_KEY` for Google Gemini API
- `UNSPLASH_ACCESS_KEY` for Unsplash API

### Deployment
- GitHub repository secrets:
  - `FIREBASE_SERVICE_ACCOUNT` - JSON credentials for Firebase
  - `GEMINI_API_KEY` - For GitHub Actions to use Gemini
  - `UNSPLASH_ACCESS_KEY` - For GitHub Actions to use Unsplash

## Important Files

- `README.md` - Project overview and setup instructions
- `DOCUMENTATION.md` - Detailed technical documentation
- `CONFIG.md` - Configuration specifics and API keys
- `QUICK-START.md` - Quick start guide
- `scripts/generate-article.js` - Core article generation logic
- `.github/workflows/generate-article.yml` - Automation workflow
- `firebase.json` - Firebase hosting and Firestore configuration
- `tailwind.config.js` - Custom gaming-themed styling

## System Health and Monitoring

### URLs to Monitor
- **Website**: https://mobilegames-win.web.app
- **GitHub Actions**: https://github.com/JHevia70/mobilegames-win/actions
- **Firebase Console**: https://console.firebase.google.com/project/mobilegames-win
- **Firestore Data**: Firebase Console → Firestore Database

### Health Indicators
- ✅ Daily articles generated automatically
- ✅ GitHub Actions running without errors
- ✅ New content appearing on the website
- ✅ Gemini API responding correctly
- ✅ Firebase Firestore storing articles

### Troubleshooting
- If articles aren't generating: Check GitHub Actions logs
- If Gemini API fails: Run `node scripts/debug-gemini.js`
- If deployment fails: Verify Firebase service account secret
- For local testing: Use `npm run generate-article`
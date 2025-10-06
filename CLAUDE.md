# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MobileGames.win is an automated mobile gaming review website that generates daily articles using Google Gemini AI. The system operates autonomously via GitHub Actions, creating fresh content and deploying to Firebase Hosting without manual intervention.

**Tech Stack**: Next.js 14 (App Router), TypeScript, Firebase (Firestore/Hosting), Google Gemini 2.0 Flash (Free), Tailwind CSS

**Live Site**: https://mobilegames-win.web.app

## ⚠️ CRITICAL: Content Generation Strategy - NO DUPLICATION

**IMPORTANT**: This project has **3 SPECIFIC GitHub Actions workflows** for content generation. DO NOT create duplicate workflows or modify their schedules without reviewing this section.

### Configured Workflows (DO NOT DUPLICATE)

1. **Daily Opinion Articles** - `.github/workflows/daily-opinion.yml`
   - Schedule: `0 9 * * *` (9:00 AM UTC daily)
   - Script: `scripts/generate-daily-opinion.js`
   - Purpose: Opinion articles, trends, news analysis
   - Command: `npm run generate-daily-opinion`

2. **Weekly TOP5 Rankings** - `.github/workflows/weekly-top5.yml`
   - Schedule: `0 10 * * 2` (Tuesdays at 10:00 AM UTC)
   - Script: `scripts/generate-weekly-top5.js`
   - Purpose: TOP5 game rankings by category
   - Command: `npm run generate-weekly-top5`

3. **Breaking News** - `.github/workflows/breaking-news.yml`
   - Schedule: `0 0,12 * * *` (Every 12 hours: midnight and noon UTC)
   - Script: `scripts/generate-breaking-news.js`
   - Purpose: Short breaking news items (200-250 words)
   - Command: `npm run generate-breaking-news`
   - Special: Stores in `breaking_news` collection, only 1 active at a time

### Breaking News System Architecture

**Components**:
- `src/components/ui/BreakingNewsBanner.tsx` - Fetches and displays active breaking news from Firestore
- `src/components/ui/BreakingNewsModal.tsx` - Modal popup when clicking banner
- `src/app/teletipos/page.tsx` - Archive page showing all breaking news history

**Data Flow**:
- Script generates news → Firestore `breaking_news` collection
- Banner queries `where('active', '==', true)` → displays latest
- Only ONE news item has `active: true` at any time
- Modal opens on banner click, shows full content
- "Teletipos" page shows all news ordered by `createdAt desc`

**Navigation**: "Teletipos" link added to header navigation in `src/components/layout/NewspaperHeader.tsx`

## Essential Commands

### Development
```bash
npm run dev                    # Start development server (localhost:3000)
npm run build                  # Production build (exports to /out)
npm run type-check            # TypeScript validation
npm run lint                  # ESLint checks
```

### Article Generation (Core Functionality)
```bash
# === Automated Content Generation (scheduled via GitHub Actions) ===
npm run generate-daily-opinion   # Generate daily opinion/analysis article
npm run generate-weekly-top5     # Generate weekly TOP5 ranking
npm run generate-breaking-news   # Generate breaking news (every 12h)

# === Manual/Testing Scripts ===
npm run generate-article         # Legacy manual article generation
npm run test-article             # Test article generation without publishing
node scripts/debug-gemini.js     # Debug Gemini API connection issues
```

### Deployment
```bash
firebase deploy --only hosting   # Manual Firebase deployment
firebase login                   # Authenticate Firebase CLI
```

## Architecture Overview

### Content Generation Pipeline

**Daily Opinion (9:00 AM UTC)**:
1. GitHub Actions triggers `daily-opinion.yml`
2. Runs `scripts/generate-daily-opinion.js`
3. Gemini AI generates opinion/analysis article
4. Unsplash API fetches gaming images
5. Firebase Admin SDK stores in `articles` collection

**Weekly TOP5 (Tuesdays 10:00 AM UTC)**:
1. GitHub Actions triggers `weekly-top5.yml`
2. Runs `scripts/generate-weekly-top5.js`
3. Gemini AI generates TOP5 ranking
4. Stores in `articles` collection with `type: 'top5'`

**Breaking News (Every 12 hours)**:
1. GitHub Actions triggers `breaking-news.yml`
2. Runs `scripts/generate-breaking-news.js`
3. Searches web for latest mobile gaming news
4. Gemini AI generates 200-250 word news item
5. Stores in `breaking_news` collection
6. Deactivates previous news (`active: false`)
7. Sets new news as active (`active: true`)

**Frontend Display**:
- Next.js pages fetch from Firestore in real-time
- No rebuild needed - content appears dynamically
- Static build only required for code changes

### Data Flow
- **Server-side**: Firebase Admin SDK (scripts) writes articles to Firestore
- **Client-side**: Firebase Client SDK (src/lib/firebase.ts) reads from Firestore
- **State Management**: Zustand for local UI state
- **Real-time Sync**: Firestore queries with automatic fallback mechanisms

### Key Files & Responsibilities

**Article Generation (Scheduled Scripts)**
- `scripts/generate-daily-opinion.js` - Daily opinion/analysis articles
- `scripts/generate-weekly-top5.js` - Weekly TOP5 rankings
- `scripts/generate-breaking-news.js` - Breaking news every 12h
- `scripts/generate-article.js` - Legacy manual generation
- `scripts/generate-article-template.js` - Template-based fallback
- Requires: Firebase service account JSON file (not in git)

**Firebase Configuration**
- `src/lib/firebase.ts` - Client SDK initialization (browser)
- `src/lib/articles.ts` - Article queries with extensive fallback logic
- `firebase.json` - Hosting config (serves from /out directory)
- `firestore.rules` - Database security rules
- Service account file: `mobilegames-win-firebase-adminsdk-fbsvc-e75d0dfbc9.json` (local only)

**Component Structure**
- `src/components/ui/DynamicArticles.tsx` - Fetches and displays Firestore articles
- `src/components/ui/ArticleCard.tsx` - Individual article rendering
- `src/components/ui/BreakingNewsBanner.tsx` - Breaking news banner (fetches active news)
- `src/components/ui/BreakingNewsModal.tsx` - Modal for breaking news details
- `src/components/ui/CategoryModal.tsx` - Category filtering modal
- `src/components/ui/ArticleModal.tsx` - Article detail modal
- `src/components/layout/NewspaperHeader.tsx` - Gaming-themed header with Teletipos nav
- `src/app/page.tsx` - Main landing page with article grid and breaking news
- `src/app/teletipos/page.tsx` - Breaking news archive page

**Styling System**
- Tailwind CSS with custom gaming theme (`tailwind.config.js`)
- Purple/cyan gaming color palette
- Framer Motion for animations
- Newspaper-style responsive layout

## Firestore Schema

### Collection: `articles`

```typescript
interface Article {
  id: string;            // Auto-generated Firestore doc ID
  title: string;         // Generated by Gemini AI
  content: string;       // 1800-2200 words, Spanish, professional tone
  excerpt: string;       // 150-200 char summary
  image: string;         // Unsplash URL (gaming-related)
  category: string;      // RPG, Estrategia, Acción, Puzzle, etc.
  author: string;        // Random from pool (Ana García, Carlos Ruiz, etc.)
  publishDate: string;   // Spanish format: "30 de septiembre de 2025"
  readTime: number;      // Minutes (5-8)
  rating: number;        // 4.0-5.0
  slug: string;          // URL-friendly title
  featured: boolean;     // Highlight flag
  type: string;          // 'top5', 'analysis', 'comparison', 'guide'
  status: 'published';   // Publication status
  createdAt: Timestamp;  // Firebase server timestamp
}
```

### Collection: `breaking_news`

```typescript
interface BreakingNews {
  id: string;            // Auto-generated Firestore doc ID
  title: string;         // Short headline
  content: string;       // 200-250 words
  publishDate: string;   // Spanish format
  type: 'breaking';      // Always 'breaking'
  active: boolean;       // ONLY ONE can be true at a time
  createdAt: Timestamp;  // Firebase server timestamp
}
```

**Critical**: Only ONE breaking news document can have `active: true`. Each new news item sets previous to `active: false`.

## Environment Variables

**Local Development** (`.env.local`):
- `GEMINI_API_KEY` - Google AI Studio API key
- `UNSPLASH_ACCESS_KEY` - Unsplash API key

**GitHub Secrets** (for Actions):
- `FIREBASE_SERVICE_ACCOUNT` - Full JSON credentials
- `GEMINI_API_KEY`
- `UNSPLASH_ACCESS_KEY`

## Important Development Notes

### Firebase Service Account
The file `mobilegames-win-firebase-adminsdk-fbsvc-e75d0dfbc9.json` is required for article generation but is NOT in git (in .gitignore). For local testing, ensure this file exists in the project root.

### Firestore Security
- Client reads are public (Firebase rules allow read without auth)
- Writes require authentication via Admin SDK only (scripts use service account)
- Production data is in `articles` collection

### Next.js Configuration
- **Static Export**: `output: 'export'` builds to `/out` directory
- **Image Optimization**: Configured for Firebase Storage, Unsplash, and app store domains
- **External Packages**: `firebase-admin` marked as server-only

### GitHub Actions Workflows

**Three separate workflows** (DO NOT DUPLICATE):

1. **`daily-opinion.yml`** (9:00 AM UTC daily)
   - Installs dependencies
   - Creates Firebase service account JSON
   - Runs `npm run generate-daily-opinion`
   - Cleans up secrets

2. **`weekly-top5.yml`** (Tuesdays 10:00 AM UTC)
   - Same process as daily
   - Runs `npm run generate-weekly-top5`

3. **`breaking-news.yml`** (Every 12 hours)
   - Same process as daily
   - Runs `npm run generate-breaking-news`

**Note**: NO build/deploy step - articles appear dynamically from Firestore

## Troubleshooting

### Article generation fails
```bash
# Check Gemini API connectivity
node scripts/debug-gemini.js

# Test generation without publishing
npm run test-article
```

### Firestore connection issues
- Verify Firebase config in `src/lib/firebase.ts` matches project
- Check browser console for client-side errors
- Extensive debug logging in `getLatestArticles()` function

### Build failures
```bash
# Clear cache and rebuild
rm -rf .next out
npm run build
```

### Firebase deployment issues
```bash
# Re-authenticate
firebase logout
firebase login

# Check project configuration
cat .firebaserc
```

## Content Types Generated

1. **TOP 5** - "TOP 5 Mejores Juegos {category} para {platform} {month} {year}"
2. **Analysis** - "Análisis: {topic} en Gaming Móvil {year}"
3. **Comparison** - "Comparativa: {topic1} vs {topic2} en Juegos Móviles"
4. **Guide** - "Guía Completa: {topic} para Gamers Móviles"

Categories rotate through: RPG, Estrategia, Acción, Puzzle, Deportes, Simulación

## Deployment Architecture

- **Hosting**: Firebase Hosting (static site from /out)
- **Database**: Cloud Firestore (NoSQL document store)
- **CI/CD**: GitHub Actions (automated daily workflow)
- **DNS**: `.web.app` subdomain (Firebase default)

## Testing Locally

1. Ensure service account JSON exists in root
2. Set environment variables in `.env.local`
3. Run `npm run generate-article` to create test article
4. Run `npm run dev` to view locally
5. Check Firestore in Firebase Console to verify article was created

## IMPORTANT: Testing Protocol

**DO NOT test Firebase/Firestore connections yourself** - local testing environments cannot properly verify Firebase client-side data fetching. Testing must be done by the user after deployment to production.

**Testing workflow:**
1. Make code changes
2. Build: `npm run build`
3. Deploy: `firebase deploy --only hosting`
4. **Notify user to test on production site**
5. User verifies at https://mobilegames-win.web.app

Never assume local tests validate Firebase data fetching - always defer to production testing by the user.
# Notas para Claude - MobileGames.win

## Workflow de Artículos

### ⚠️ IMPORTANTE: Deploy vs Artículos

- **Generar artículo**: `node scripts/generate-article.js`
  - Se guarda automáticamente en Firestore
  - Ya está visible en la web inmediatamente
  - **NO hace falta hacer deploy**

- **Deploy solo cuando**:
  - Cambias código (componentes, páginas)
  - Modificas estilos (CSS)
  - Actualizas configuración
  - Cambias estructura HTML

### Comandos

```bash
# Generar artículo aleatorio (NO requiere deploy después)
node scripts/generate-article.js
# O usando npm:
npm run generate-article

# Generar artículo específico
npm run generate-daily-opinion    # Artículo de opinión/análisis diario
npm run generate-weekly-top5      # TOP 5 semanal (Martes)
npm run generate-breaking-news    # Noticias de última hora (cada 12h)

# Deploy (SOLO cuando cambias código)
npm run build && firebase deploy --only hosting
```

### Automatización con GitHub Actions

El proyecto tiene 3 workflows configurados que se ejecutan automáticamente:

**1. Daily Opinion (`daily-opinion.yml`)**
- ⏰ **Cuándo**: Todos los días a las 9:00 AM UTC
- 📝 **Qué genera**: Artículo de opinión/análisis sobre tendencias
- 🔧 **Comando**: `npm run generate-daily-opinion`

**2. Weekly TOP 5 (`weekly-top5.yml`)**
- ⏰ **Cuándo**: Todos los martes a las 10:00 AM UTC
- 📝 **Qué genera**: Artículo TOP 5 de una categoría aleatoria
- 🔧 **Comando**: `npm run generate-weekly-top5`

**3. Breaking News (`breaking-news.yml`)**
- ⏰ **Cuándo**: Cada 12 horas (00:00 y 12:00 UTC)
- 📝 **Qué genera**: Noticias y novedades del mundo gaming móvil
- 🔧 **Comando**: `npm run generate-breaking-news`

**Secrets requeridos en GitHub:**
- `FIREBASE_SERVICE_ACCOUNT`: Contenido completo del archivo JSON de credenciales de Firebase Admin
- `GEMINI_API_KEY`: API key de Google Gemini
- `UNSPLASH_ACCESS_KEY`: Access key de Unsplash

**Ejecución manual:**
Todos los workflows tienen `workflow_dispatch` habilitado, lo que permite ejecutarlos manualmente desde la pestaña "Actions" en GitHub.

## Arquitectura

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **AI**: HuggingFace (Qwen 2.5 7B) o Gemini
- **Imágenes**: Google Play Store scraper + Pexels (fallback)

## Configuración AI

- Por defecto usa Gemini (50 requests/día gratis)
- Si se agota, usar HuggingFace:
  - `USE_HUGGINGFACE=true` en `.env.local`
  - Token en `HUGGINGFACE_TOKEN`
  - 14,400 requests/día gratis

## Fichas de Juegos

Las fichas de juegos se generan automáticamente desde Google Play Store con:
- Screenshot del juego
- Título, desarrollador, género
- Valoración, descargas, tamaño, precio
- Fecha de lanzamiento y última actualización
- Versión, Android requerido, clasificación de edad
- Botón de descarga a Google Play

Layout: Panel oscuro (#1f2937) → Screenshot arriba → Caption estilo pie de foto → Fechas → Botón Google Play

## Panel de Administración

**URL**: `/admin`
**Contraseña**: `admin2025` (cambiar en `NEXT_PUBLIC_ADMIN_PASSWORD`)

### Funcionalidades:
- ✅ Ver todos los artículos en tabla
- ✅ Editar artículos existentes
- ✅ Crear nuevos artículos manualmente
- ✅ Eliminar artículos
- ✅ Cambiar estado (publicado/borrador)
- ✅ Marcar como destacado
- ✅ Editor Markdown completo

### Campos editables:
- Título, slug, extracto, contenido (Markdown)
- Categoría, autor, imagen hero
- Fecha de publicación, tiempo de lectura
- Valoración (1-5), tipo de artículo
- Estado (publicado/borrador), destacado (sí/no)

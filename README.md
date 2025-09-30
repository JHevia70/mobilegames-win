# 🎮 MobileGames.win

Sitio web profesional de reviews de juegos móviles con **generación automática de artículos usando Gemini AI**.

## 🚀 Características

- **🤖 Artículos automáticos diarios** generados con Gemini 2.0 Flash Experimental
- **📰 Breaking News cada 12h** con sistema de notificaciones
- **🏆 Rankings TOP5 semanales** de los mejores juegos
- **📱 Diseño periodístico responsive** estilo newspaper
- **🔥 Firebase Firestore** para base de datos dinámica
- **⚡ GitHub Actions** para automatización completa
- **🎨 Tailwind CSS** con tema gaming personalizado
- **📸 Unsplash API** para imágenes dinámicas

## 🌐 Sitio Web

**🔗 [https://mobilegames-win.web.app](https://mobilegames-win.web.app)**

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Hosting, Auth)
- **IA**: Google Gemini 2.0 Flash Experimental
- **Automatización**: GitHub Actions (3 workflows programados)
- **Imágenes**: Unsplash API

## 📋 Scripts Disponibles

```bash
# === Generación de Contenido Automática ===
npm run generate-daily-opinion    # Artículo diario (9:00 AM UTC)
npm run generate-weekly-top5       # TOP5 semanal (Martes 10:00 AM UTC)
npm run generate-breaking-news     # Noticias cada 12h

# === Scripts Manuales/Testing ===
npm run generate-article           # Generar artículo manualmente
npm run generate-article-template  # Generar con templates (respaldo)

# === Desarrollo ===
npm run dev                        # Servidor desarrollo
npm run build                      # Build producción
node scripts/debug-gemini.js       # Debug Gemini API
```

## 🤖 Sistema Automático

### ⚠️ IMPORTANTE: 3 Workflows Configurados (NO DUPLICAR)

El sistema tiene **3 GitHub Actions workflows específicos**. NO crear duplicados.

#### 1. **Artículos Diarios de Opinión** (9:00 AM UTC)
- **Workflow**: `.github/workflows/daily-opinion.yml`
- **Script**: `scripts/generate-daily-opinion.js`
- **Contenido**: Opinión, análisis de tendencias, novedades
- **Frecuencia**: Diaria

#### 2. **Rankings TOP5** (Martes 10:00 AM UTC)
- **Workflow**: `.github/workflows/weekly-top5.yml`
- **Script**: `scripts/generate-weekly-top5.js`
- **Contenido**: Rankings de 5 mejores juegos por categoría
- **Frecuencia**: Semanal (Martes)

#### 3. **Breaking News** (Cada 12 horas: 00:00 y 12:00 UTC)
- **Workflow**: `.github/workflows/breaking-news.yml`
- **Script**: `scripts/generate-breaking-news.js`
- **Contenido**: Noticias cortas de última hora (200-250 palabras)
- **Especial**: Se almacena en colección `breaking_news`, solo 1 activa
- **UI**: Banner clickeable → Modal → Archivo en página Teletipos

### Proceso de Generación
1. **GitHub Actions** se ejecuta según schedule
2. **Gemini AI** genera contenido único
3. **Unsplash API** obtiene imágenes relevantes
4. **Firestore** almacena el contenido
5. **Sitio web** muestra contenido dinámicamente (sin rebuild)

## 🔧 Configuración Local

1. **Clonar repositorio**:
   ```bash
   git clone https://github.com/JHevia70/mobilegames-win.git
   cd mobilegames-win
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Firebase** (archivo de service account requerido):
   ```bash
   # Añadir: mobilegames-win-firebase-adminsdk-fbsvc-e75d0dfbc9.json
   ```

4. **Desarrollo local**:
   ```bash
   npm run dev
   ```

## 📊 Base de Datos

### Estructura de Artículos (Firestore)
```typescript
interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  rating: number;
  slug: string;
  featured: boolean;
  status: 'published';
}
```

## 🔐 APIs Configuradas

- **Gemini AI**: `models/gemini-2.0-flash-exp`
- **Firebase**: Project `mobilegames-win`
  - Colección `articles`: Artículos principales
  - Colección `breaking_news`: Noticias de última hora
- **Unsplash**: Para imágenes de artículos

## 📈 Métricas

- **Artículos diarios**: 1 artículo de opinión/análisis (9:00 AM UTC)
- **Rankings semanales**: 1 TOP5 cada martes (10:00 AM UTC)
- **Breaking News**: 2 noticias/día (cada 12 horas)
- **Longitud artículos**: 1800-2200 palabras
- **Longitud breaking news**: 200-250 palabras
- **Lectura**: 5-8 minutos (artículos), 1 min (breaking news)
- **SEO**: Optimizado con meta tags y URLs amigables

## 🛡️ Automatización

### GitHub Actions
- **3 Workflows programados** (ver sección Sistema Automático)
- **Triggers**: Cron schedules + manual (workflow_dispatch)
- **Monitoreo**: [Actions Tab](https://github.com/JHevia70/mobilegames-win/actions)
- **Secrets configurados**:
  - `FIREBASE_SERVICE_ACCOUNT`: Credenciales Firebase
  - `GEMINI_API_KEY`: API key de Gemini AI
  - `UNSPLASH_ACCESS_KEY`: API key de Unsplash

## 📚 Documentación

📖 **[Ver documentación completa](./DOCUMENTATION.md)** con todos los detalles técnicos, troubleshooting y configuración avanzada.

## 🔄 Estado del Sistema

✅ **Completamente operativo**
✅ **Generación automática funcionando**
✅ **Deploy automático configurado**
✅ **Base de datos activa**

## 🎯 Funcionalidades Implementadas

- [x] Generación automática de artículos diarios
- [x] Rankings TOP5 semanales
- [x] Sistema de Breaking News cada 12h
- [x] Banner de última hora clickeable
- [x] Modal de noticias
- [x] Página de archivo de Teletipos
- [x] Diseño responsive estilo periódico
- [x] Dark mode
- [x] Integración completa con Firestore

## 🎯 Próximas Funcionalidades

- [ ] Páginas individuales de artículos completos
- [ ] Sistema de comentarios
- [ ] Newsletter funcional con envíos
- [ ] Panel de administración
- [ ] Soporte multi-idioma (ES/EN)

---

**🤖 Desarrollado con Gemini AI y Claude Code**
**📅 Última actualización**: Septiembre 2025

---

*Sistema completamente automatizado - Los artículos se generan y publican automáticamente sin intervención manual.*
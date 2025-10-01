# MobileGames.win - Documentación Completa del Sistema

## 📋 Resumen del Proyecto

**MobileGames.win** es un sitio web de reviews de juegos móviles con generación automática de artículos usando IA. El sistema genera contenido profesional diariamente sin intervención manual.

### 🎯 Características Principales
- **Generación automática de artículos** con HuggingFace (Qwen 2.5 7B) o Gemini AI
- **Descubrimiento de tendencias** mediante IA y Google Search
- **Fichas de juegos** con datos reales de Google Play Store
- **Panel de administración** para edición manual de artículos
- **Diseño periodístico profesional** estilo newspaper con modo oscuro
- **Publicación automática programada** vía GitHub Actions
- **Base de datos dinámica** con Firestore
- **Deploy automático** a Firebase Hosting

---

## 🏗️ Arquitectura del Sistema

### **Frontend**
- **Framework**: Next.js 14 con App Router
- **Estilos**: Tailwind CSS con tema gaming personalizado
- **Animaciones**: Framer Motion
- **Componentes**: React TypeScript

### **Backend & Database**
- **Base de datos**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Autenticación**: Firebase Auth (preparado)
- **Storage**: Firebase Storage (preparado)

### **IA y Automatización**
- **IA Principal**: HuggingFace (Qwen 2.5 7B Instruct) - 14,400 requests/día gratis
- **IA Backup**: Google Gemini 2.0 Flash Exp - 50 requests/día gratis
- **CI/CD**: GitHub Actions con 3 workflows programados
- **Datos de Juegos**: Google Play Store scraper (google-play-scraper)
- **Imágenes**: Google Play Store screenshots + Unsplash API (fallback)
- **Scheduling**: Cron jobs (diario, semanal, cada 12h)

---

## 🔧 Configuración Técnica

### **APIs y Servicios Configurados**

#### 1. Gemini AI
- **API Key**: `AIzaSyCywwj_27AOLJVq_hrhArfN--k1eStHOdA`
- **Modelo**: `models/gemini-2.5-flash`
- **Configuración**:
  ```javascript
  {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048
  }
  ```

#### 2. Firebase
- **Project ID**: `mobilegames-win`
- **Hosting URL**: https://mobilegames-win.web.app
- **Service Account**: `mobilegames-win-firebase-adminsdk-fbsvc-e75d0dfbc9.json`

#### 3. Unsplash
- **Access Key**: `4qjo4eTlRYPjt-EJ1romAUY9VGg2Pbqb3Fd8uyorge0`
- **Uso**: Generación automática de imágenes para artículos

#### 4. GitHub
- **Repository**: https://github.com/JHevia70/mobilegames-win
- **Secret configurado**: `FIREBASE_SERVICE_ACCOUNT`

### **Estructura de Archivos Clave**

```
mobilegames-win/
├── .github/workflows/
│   ├── daily-opinion.yml            # Workflow para opinión diaria (9:00 AM)
│   ├── weekly-top5.yml              # Workflow para TOP5 semanal (Martes 10:00 AM)
│   └── breaking-news.yml            # Workflow para noticias (cada 12h)
├── scripts/
│   ├── generate-daily-opinion.js    # Generador de artículos de opinión
│   ├── generate-weekly-top5.js      # Generador de rankings TOP5
│   ├── generate-breaking-news.js    # Generador de noticias de última hora
│   ├── generate-article.js          # Generador principal (legacy, manual)
│   ├── generate-article-template.js # Sistema de respaldo con templates
│   ├── test-gemini-models.js        # Testing de modelos Gemini
│   ├── debug-gemini.js             # Debugging de Gemini API
│   └── test-working-gemini.js       # Verificación de funcionamiento
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── ArticleCard.tsx        # Componente de artículo
│   │   │   ├── DynamicArticles.tsx    # Artículos dinámicos de Firestore
│   │   │   ├── BreakingNewsBanner.tsx # Banner de última hora (activo)
│   │   │   ├── BreakingNewsModal.tsx  # Modal para ver noticia completa
│   │   │   ├── CategoryModal.tsx      # Modal de categorías
│   │   │   ├── ArticleModal.tsx       # Modal de artículo completo
│   │   │   └── VisualEffects.tsx      # Efectos visuales gaming
│   │   ├── layout/
│   │   │   ├── NewspaperHeader.tsx    # Header estilo periódico
│   │   │   └── Footer.tsx             # Footer del sitio
│   │   └── admin/
│   │       ├── ArticleEditor.tsx      # Editor de artículos con Markdown
│   │       └── AdminAuth.tsx          # Autenticación para admin panel
│   ├── lib/
│   │   ├── articles.ts               # Funciones para artículos de Firestore
│   │   ├── firebase.ts               # Configuración Firebase cliente
│   │   └── utils.ts                  # Utilidades generales
│   └── app/
│       ├── page.tsx                  # Página principal
│       ├── teletipos/page.tsx        # Página de archivo de noticias
│       ├── admin/page.tsx            # Panel de administración (/admin)
│       ├── api/articles/route.ts     # API routes para CRUD de artículos
│       └── layout.tsx                # Layout base
├── package.json                      # Dependencias y scripts
├── tailwind.config.js               # Configuración Tailwind con tema gaming
├── firebase.json                    # Configuración Firebase Hosting
└── .firebaserc                      # Proyecto Firebase
```

---

## 🤖 Sistema de Generación de Artículos

### **Sistema Híbrido de Descubrimiento de Temas**

El sistema ahora utiliza un **enfoque híbrido** para seleccionar temas de artículos:

**Para artículos TOP 5:**
- Usa categorías predefinidas (RPG, Acción, Estrategia, Puzzle, etc.)
- Analiza juegos reales de cada categoría desde Google Play Store
- Rotación mensual de categorías

**Para artículos de Análisis/Guías/Comparativas:**
1. **Búsqueda de tendencias** (prioridad):
   - Consulta Google Search sobre tendencias actuales en gaming móvil
   - Identifica temas trending, debates, tecnologías emergentes
   - Extrae juegos más discutidos del momento

2. **Fallback a temas predefinidos**:
   - Si no encuentra tendencias relevantes, usa lista predefinida
   - Asegura que siempre se genere contenido de calidad

**Estructura de contenido según tipo:**

- **TOP 5**: Análisis detallado de cada juego (300-400 palabras por juego)
- **Análisis/Guías**: Desarrollo del tema principal con juegos como ejemplos breves (2-3 líneas por juego)
- Las fichas de juegos (Google Play) proporcionan información detallada automáticamente

### **IMPORTANTE: Estrategia de Contenidos y No Duplicación**

⚠️ **EVITAR DUPLICACIONES**: Este proyecto tiene configurados 3 workflows de GitHub Actions específicos. NO crear workflows adicionales con los mismos horarios.

#### **Workflows Configurados (NO DUPLICAR)**

1. **Daily Opinion Articles** - `.github/workflows/daily-opinion.yml`
   - **Horario**: `0 9 * * *` (9:00 AM UTC diariamente)
   - **Script**: `npm run generate-daily-opinion`
   - **Propósito**: Artículos de opinión, tendencias y novedades

2. **Weekly TOP5** - `.github/workflows/weekly-top5.yml`
   - **Horario**: `0 10 * * 2` (Martes 10:00 AM UTC)
   - **Script**: `npm run generate-weekly-top5`
   - **Propósito**: Rankings TOP5 de juegos por categoría

3. **Breaking News** - `.github/workflows/breaking-news.yml`
   - **Horario**: `0 0,12 * * *` (Cada 12 horas: 00:00 y 12:00 UTC)
   - **Script**: `npm run generate-breaking-news`
   - **Propósito**: Noticias cortas de última hora

### **Flujo de Generación Automática**

#### 1. **Sistema de Artículos Diarios (9:00 AM UTC)**
```yaml
# .github/workflows/daily-opinion.yml
schedule:
  - cron: '0 9 * * *'  # Diario a las 9:00 AM UTC
```

**Proceso**:
1. **GitHub Actions se ejecuta**
2. **Script instala dependencias**
3. **Crea archivo de service account de Firebase**
4. **Ejecuta generación de artículo de opinión**:
   ```bash
   node scripts/generate-daily-opinion.js
   ```
5. **Gemini AI genera contenido de opinión/análisis**
6. **Sistema obtiene imagen de Unsplash**
7. **Artículo se guarda en Firestore**

#### 2. **Sistema de TOP5 Semanal (Martes 10:00 AM UTC)**
```yaml
# .github/workflows/weekly-top5.yml
schedule:
  - cron: '0 10 * * 2'  # Martes a las 10:00 AM UTC
```

**Proceso**:
1. **GitHub Actions se ejecuta semanalmente**
2. **Ejecuta generación de TOP5**:
   ```bash
   node scripts/generate-weekly-top5.js
   ```
3. **Gemini AI genera ranking de 5 juegos**
4. **Artículo se guarda en Firestore con type: 'top5'**

#### 3. **Sistema de Breaking News (Cada 12 horas)**
```yaml
# .github/workflows/breaking-news.yml
schedule:
  - cron: '0 0,12 * * *'  # Medianoche y mediodía UTC
```

**Proceso**:
1. **GitHub Actions se ejecuta cada 12 horas**
2. **Ejecuta generación de noticia corta**:
   ```bash
   node scripts/generate-breaking-news.js
   ```
3. **Busca tendencias actuales de gaming móvil**
4. **Gemini AI genera noticia de 200-250 palabras**
5. **Se guarda en colección `breaking_news` en Firestore**
6. **Desactiva noticias anteriores (solo 1 activa a la vez)**

#### 4. **Tipos de Artículos Generados**
- **Opinión/Análisis**: Tendencias, monetización, nuevas tecnologías
- **Guías**: Optimización, mejores prácticas, consejos
- **TOP 5**: Listas de mejores juegos por categoría
- **Breaking News**: Noticias cortas de última hora (< 250 palabras)

### **Scripts Disponibles**

```bash
# === Scripts de Generación de Contenido ===
npm run generate-daily-opinion    # Artículo de opinión/análisis diario
npm run generate-weekly-top5       # Ranking TOP5 semanal
npm run generate-breaking-news     # Noticia de última hora

# === Scripts Legacy (mantener por compatibilidad) ===
npm run generate-article           # Generador principal (uso manual)
npm run generate-article-template  # Sistema de respaldo con templates
npm run generate-article-ai        # Prueba solo generación IA
npm run test-article               # Test del sistema de artículos

# === Build y Deploy ===
npm run build                      # Build estático a /out
firebase deploy --only hosting     # Deploy manual a Firebase
```

---

## 🎨 Diseño y UI

### **Tema Visual**
- **Estilo**: Periódico digital profesional
- **Colores principales**:
  ```css
  --gaming-red: #dc191b
  --gaming-gold: #FFD700
  --gaming-dark-blue: #22374e
  ```
- **Tipografía**:
  - **Headlines**: Playfair Display (serif)
  - **Body**: Inter (sans-serif)

### **Componentes Clave**

#### 1. **ArticleCard**
```typescript
interface ArticleCardProps {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  rating?: number;
  size?: 'small' | 'medium' | 'large' | 'hero';
  onReadMore: (slug: string) => void;
}
```

#### 2. **DynamicArticles**
- Consume artículos de Firestore
- Fallback a contenido estático
- Loading states y error handling

#### 3. **NewspaperHeader**
- Header estilo periódico con fecha actual
- Navegación responsive
- Buscador integrado

---

## 🔐 Panel de Administración

### **Acceso al Panel**
- **URL**: `https://mobilegames-win.web.app/admin`
- **Contraseña por defecto**: `admin2025`
- **Configuración**: Variable `NEXT_PUBLIC_ADMIN_PASSWORD` en `.env.local`

### **Funcionalidades del Panel**

#### 1. **Lista de Artículos**
- Tabla completa con todos los artículos publicados
- Vista previa de imagen miniatura
- Información de categoría, autor, fecha y estado
- Acciones rápidas: Editar y Eliminar
- Botón para crear nuevos artículos

#### 2. **Editor de Artículos**
El editor permite modificar todos los campos de un artículo:

**Campos principales:**
- **Título**: Título del artículo
- **Slug**: URL amigable (se genera automáticamente del título)
- **Extracto**: Resumen breve para listados
- **Contenido**: Editor Markdown completo con textarea grande

**Metadatos:**
- **Categoría**: RPG, Estrategia, Acción, Puzzle, Deportes, Aventura, Simulación, TOP 5, Análisis, Guías
- **Autor**: Nombre del autor
- **URL de Imagen**: Imagen hero del artículo
- **Fecha de Publicación**: Texto libre (ej: "1 de enero de 2025")

**Configuración:**
- **Tiempo de Lectura**: Minutos estimados
- **Valoración**: De 1.0 a 5.0
- **Tipo**: article, top5, analysis, guide, comparison
- **Estado**: published (publicado) o draft (borrador)
- **Destacado**: Checkbox para marcar como featured

#### 3. **API Routes** (`/api/articles`)
El panel utiliza API routes de Next.js para interactuar con Firestore:

```typescript
POST /api/articles
// Crear nuevo artículo
Body: { title, content, excerpt, ... }
Response: { success: true, id: "doc_id" }

PUT /api/articles
// Actualizar artículo existente
Body: { id, title, content, excerpt, ... }
Response: { success: true, id: "doc_id" }

DELETE /api/articles
// Eliminar artículo
Body: { id }
Response: { success: true, id: "doc_id" }
```

#### 4. **Autenticación**
- Sistema simple con contraseña almacenada en `sessionStorage`
- La sesión persiste hasta cerrar el navegador
- No hay cuentas de usuario múltiples (single admin)

### **Flujo de Trabajo**

1. **Editar artículo existente**:
   - Ir a `/admin` e ingresar contraseña
   - Buscar artículo en la lista
   - Click en "Editar"
   - Modificar campos necesarios
   - Click en "Guardar Artículo"
   - Los cambios se ven inmediatamente en el sitio (sin deploy)

2. **Crear nuevo artículo**:
   - Ir a `/admin` e ingresar contraseña
   - Click en "+ Nuevo Artículo"
   - Completar todos los campos
   - Click en "Guardar Artículo"
   - El artículo aparece inmediatamente en el sitio

3. **Eliminar artículo**:
   - Buscar artículo en la lista
   - Click en "Eliminar"
   - Confirmar eliminación
   - El artículo se elimina de Firestore inmediatamente

### **Notas de Seguridad**

⚠️ **Importante**: Este es un sistema de autenticación básico adecuado para administración personal. Para uso en producción con múltiples usuarios, se recomienda:
- Implementar Firebase Authentication
- Agregar roles y permisos
- Usar HTTPS en todas las conexiones
- Configurar Firestore Security Rules restrictivas

---

## 🔄 Base de Datos (Firestore)

### **Colección: `articles`**

#### Estructura de Documento:
```javascript
{
  id: "timestamp_string",
  title: "Título del artículo",
  content: "Contenido completo del artículo (HTML/Markdown)",
  excerpt: "Resumen del artículo (200 chars)",
  image: "URL de imagen de Unsplash",
  category: "RPG | Estrategia | Acción | Puzzle | Análisis | Guías",
  author: "Nombre del autor (aleatorio del pool)",
  publishDate: "formato español: '30 de septiembre de 2025'",
  readTime: 5, // minutos de lectura calculados
  rating: 4.8, // rating entre 4.0-5.0
  slug: "titulo-en-formato-url-amigable",
  featured: true/false, // 30% probabilidad
  type: "top5 | analysis | comparison | guide",
  createdAt: "Firebase Timestamp",
  status: "published"
}
```

### **Colección: `breaking_news`**

#### Estructura de Documento:
```javascript
{
  id: "auto_generated_firestore_id",
  title: "Título de la noticia de última hora",
  content: "Contenido corto (200-250 palabras)",
  publishDate: "formato español: '30 de septiembre de 2025'",
  type: "breaking",
  active: true/false,  // Solo 1 noticia puede estar activa
  createdAt: "Firebase Timestamp"
}
```

**Comportamiento**:
- Solo UNA noticia con `active: true` a la vez
- Cada nueva noticia desactiva las anteriores
- El banner muestra solo la noticia activa
- Todas las noticias se archivan en la página de Teletipos

### **Funciones de Base de Datos** (`src/lib/articles.ts`)
```typescript
// Obtener todos los artículos publicados
getArticles(): Promise<Article[]>

// Obtener artículos destacados
getFeaturedArticles(): Promise<Article[]>

// Obtener últimos N artículos
getLatestArticles(count: number): Promise<Article[]>

// Obtener artículo por slug
getArticleBySlug(slug: string): Promise<Article | null>

// Obtener artículos por categoría
getArticlesByCategory(category: string): Promise<Article[]>
```

---

## 🚀 Deployment y Hosting

### **Firebase Hosting**
- **URL**: https://mobilegames-win.web.app
- **Configuración**:
  ```json
  {
    "hosting": {
      "public": "out",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  }
  ```

### **Build Process**
1. **Next.js static export**: `npm run build`
2. **Output directory**: `out/`
3. **Firebase deploy**: `firebase deploy --only hosting`

### **GitHub Actions CI/CD**
- **Trigger**: Daily cron + manual
- **Steps**:
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies
  4. Create Firebase service account
  5. Generate article with AI
  6. Build Next.js site
  7. Deploy to Firebase
  8. Cleanup secrets

---

## 🛠️ Mantenimiento y Troubleshooting

### **Comandos de Debugging**

#### 1. **Verificar Gemini API**
```bash
node scripts/debug-gemini.js
```

#### 2. **Probar Modelos Gemini**
```bash
node scripts/test-gemini-models.js
```

#### 3. **Test Generación Completa**
```bash
node scripts/test-working-gemini.js
```

### **Logs y Monitoreo**

#### GitHub Actions
- **URL**: https://github.com/JHevia70/mobilegames-win/actions
- **Workflow**: "Generate Daily Article"
- **Logs**: Disponibles por 90 días

#### Firebase Console
- **URL**: https://console.firebase.google.com/project/mobilegames-win
- **Firestore**: Ver artículos generados
- **Hosting**: Métricas de tráfico

### **Problemas Comunes y Soluciones**

#### 1. **Gemini API Falla**
- **Síntoma**: Error 404 en modelos
- **Solución**: Verificar `scripts/debug-gemini.js`
- **Fallback**: Sistema usará templates automáticamente

#### 2. **Firebase Deploy Falla**
- **Síntoma**: Error en GitHub Actions
- **Verificar**: Secret `FIREBASE_SERVICE_ACCOUNT` en GitHub
- **Solución**: Regenerar service account JSON

#### 3. **Artículos No Aparecen**
- **Verificar**: Firestore tiene nuevos documentos
- **Debug**: Ejecutar `npm run generate-article` localmente
- **Fallback**: Artículos estáticos se mostrarán

#### 4. **Unsplash Imágenes Fallan**
- **Fallback automático**: URL de imagen por defecto
- **Verificar**: API key de Unsplash válida

---

## 📈 Métricas y Analytics

### **KPIs del Sistema**
- **Frecuencia**: 1 artículo/día automático
- **Longitud promedio**: 600-1000 palabras
- **Tiempo lectura**: 2-4 minutos
- **Categorías**: 6 tipos diferentes
- **Autores**: Pool de 7 autores ficticios

### **SEO Optimizado**
- **Meta tags**: Título, descripción, keywords
- **URLs amigables**: Slugs automáticos
- **Contenido fresco**: Diario
- **Estructura semántica**: Headers H1-H3
- **Imágenes optimizadas**: Con alt text

---

## 🔐 Seguridad y Secrets

### **Secrets Configurados**

#### GitHub Secrets
- `FIREBASE_SERVICE_ACCOUNT`: JSON completo del service account

#### API Keys en Código
```javascript
// Gemini AI
const API_KEY = 'AIzaSyCywwj_27AOLJVq_hrhArfN--k1eStHOdA';

// Unsplash
const ACCESS_KEY = '4qjo4eTlRYPjt-EJ1romAUY9VGg2Pbqb3Fd8uyorge0';
```

### **Consideraciones de Seguridad**
- **API Keys**: Renovar cada 6 meses
- **Firebase Rules**: Configurar reglas de escritura
- **CORS**: Configurado para el dominio
- **Rate Limiting**: Gemini tiene límites automáticos

---

## 🚀 Próximos Pasos y Extensiones

### **Funcionalidades Preparadas**
1. **Sistema de categorías dinámico**
2. **Páginas individuales de artículos**
3. **Sistema de comentarios**
4. **Newsletter funcional**
5. **Admin panel**
6. **Analytics avanzados**

### **Mejoras Sugeridas**
1. **Multi-idioma**: Inglés/Español automático
2. **RSS Feed**: Para suscriptores
3. **Social Media**: Auto-posting a redes
4. **SEO avanzado**: Schema markup
5. **Performance**: Caching avanzado

### **Escalabilidad**
- **Múltiples artículos por día**
- **Diferentes tipos de contenido**
- **Integración con más APIs**
- **Sistema de moderación**

---

## 📞 Contacto y Soporte

### **URLs Importantes**
- **Sitio Web**: https://mobilegames-win.web.app
- **GitHub**: https://github.com/JHevia70/mobilegames-win
- **Firebase Console**: https://console.firebase.google.com/project/mobilegames-win

### **Archivos de Configuración Críticos**
- `.firebaserc` - Proyecto Firebase
- `firebase.json` - Configuración hosting
- `.github/workflows/generate-article.yml` - Automatización
- `scripts/generate-article.js` - Generador principal

### **Backup y Recovery**
- **Código**: Git repository en GitHub
- **Base de datos**: Firestore (backup automático por Google)
- **Configuración**: Documentada en este archivo
- **API Keys**: Documentadas y regenerables

---

## ✅ Checklist de Funcionamiento

### **Sistema Funcionando Correctamente Si:**
- [ ] GitHub Actions se ejecuta diariamente sin errores
- [ ] Nuevos artículos aparecen en Firestore cada día
- [ ] Sitio web se actualiza automáticamente
- [ ] Artículos son únicos y de alta calidad
- [ ] Imágenes se cargan correctamente
- [ ] No hay errores en logs de Firebase
- [ ] Gemini API responde correctamente

### **Para Verificar Manualmente:**
```bash
# 1. Test local de generación
npm run generate-article

# 2. Verificar Gemini
node scripts/debug-gemini.js

# 3. Build local
npm run build

# 4. Deploy manual
firebase deploy --only hosting
```

---

**📅 Documentación actualizada**: 1 de octubre de 2025
**👨‍💻 Desarrollado con**: Claude Code
**🔄 Última actualización del sistema**:
- Panel de administración completo (/admin)
- Sistema híbrido de descubrimiento de tendencias
- Integración con Google Play Store para fichas de juegos
- Modo oscuro para paneles de juegos
- Variación en títulos de artículos tipo guía

---

*Este sistema está completamente automatizado y funcionando. Los artículos se generarán automáticamente cada día a las 9:00 AM UTC sin intervención manual necesaria.*
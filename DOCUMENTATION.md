# MobileGames.win - Documentación Completa del Sistema

## 📋 Resumen del Proyecto

**MobileGames.win** es un sitio web de reviews de juegos móviles con generación automática de artículos usando IA. El sistema genera contenido profesional diariamente sin intervención manual.

### 🎯 Características Principales
- **Generación automática de artículos** con Gemini AI
- **Diseño periodístico profesional** estilo newspaper
- **Publicación diaria automática** vía GitHub Actions
- **Base de datos dinámica** con Firestore
- **Deploy automático** a Firebase Hosting
- **Sistema de respaldo** con templates predefinidos

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
- **IA**: Google Gemini 2.5 Flash
- **CI/CD**: GitHub Actions
- **Imágenes**: Unsplash API
- **Scheduling**: Cron jobs diarios

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
│   └── generate-article.yml          # GitHub Actions para automatización
├── scripts/
│   ├── generate-article.js           # Generador principal con Gemini AI
│   ├── generate-article-template.js  # Sistema de respaldo con templates
│   ├── test-gemini-models.js         # Testing de modelos Gemini
│   ├── debug-gemini.js              # Debugging de Gemini API
│   └── test-working-gemini.js        # Verificación de funcionamiento
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── ArticleCard.tsx       # Componente de artículo
│   │   │   ├── DynamicArticles.tsx   # Artículos dinámicos de Firestore
│   │   │   └── VisualEffects.tsx     # Efectos visuales gaming
│   │   └── layout/
│   │       ├── NewspaperHeader.tsx   # Header estilo periódico
│   │       └── Footer.tsx            # Footer del sitio
│   ├── lib/
│   │   ├── articles.ts              # Funciones para artículos de Firestore
│   │   ├── firebase.ts              # Configuración Firebase cliente
│   │   └── utils.ts                 # Utilidades generales
│   └── app/
│       ├── page.tsx                 # Página principal
│       └── layout.tsx               # Layout base
├── package.json                     # Dependencias y scripts
├── tailwind.config.js              # Configuración Tailwind con tema gaming
├── firebase.json                   # Configuración Firebase Hosting
└── .firebaserc                     # Proyecto Firebase
```

---

## 🤖 Sistema de Generación de Artículos

### **Flujo de Generación Automática**

#### 1. **Trigger Diario** (9:00 AM UTC)
```yaml
# .github/workflows/generate-article.yml
schedule:
  - cron: '0 9 * * *'  # Diario a las 9:00 AM UTC
```

#### 2. **Proceso de Generación**
1. **GitHub Actions se ejecuta**
2. **Script instala dependencias**
3. **Crea archivo de service account de Firebase**
4. **Ejecuta generación de artículo**:
   ```bash
   node scripts/generate-article.js
   ```
5. **Gemini AI genera contenido único**
6. **Sistema obtiene imagen de Unsplash**
7. **Artículo se guarda en Firestore**
8. **Sitio se rebuilds automáticamente**
9. **Deploy a Firebase Hosting**

#### 3. **Tipos de Artículos Generados**
- **TOP 5**: Listas de mejores juegos por categoría
- **Análisis**: Tendencias y análisis profundos del gaming móvil
- **Comparativas**: Comparaciones entre plataformas/juegos
- **Guías**: Guías completas para gamers móviles

### **Scripts Disponibles**

```bash
# Generar artículo con Gemini AI (sistema principal)
npm run generate-article

# Generar artículo con templates (sistema de respaldo)
npm run generate-article-template

# Probar solo la generación con IA
npm run generate-article-ai

# Probar sistema de artículos
npm run test-article

# Build y deploy
npm run build
firebase deploy --only hosting
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

**📅 Documentación actualizada**: 30 de septiembre de 2025
**👨‍💻 Desarrollado con**: Claude Code
**🔄 Última actualización del sistema**: Integración completa de Gemini AI

---

*Este sistema está completamente automatizado y funcionando. Los artículos se generarán automáticamente cada día a las 9:00 AM UTC sin intervención manual necesaria.*
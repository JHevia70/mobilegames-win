# 🔧 Configuración del Sistema - MobileGames.win

## 📋 Datos de Configuración Críticos

### 🔑 API Keys y Credenciales

#### Gemini AI
```
API Key: AIzaSyCywwj_27AOLJVq_hrhArfN--k1eStHOdA
Modelo: models/gemini-2.5-flash
Configuración:
  - temperature: 0.7
  - topP: 0.8
  - topK: 40
  - maxOutputTokens: 2048
```

#### Firebase
```
Project ID: mobilegames-win
Service Account: mobilegames-win-firebase-adminsdk-fbsvc-e75d0dfbc9.json
Hosting URL: https://mobilegames-win.web.app
Console: https://console.firebase.google.com/project/mobilegames-win
```

#### Unsplash
```
Access Key: 4qjo4eTlRYPjt-EJ1romAUY9VGg2Pbqb3Fd8uyorge0
```

#### GitHub
```
Repository: https://github.com/JHevia70/mobilegames-win
Secret configurado: FIREBASE_SERVICE_ACCOUNT
Actions: https://github.com/JHevia70/mobilegames-win/actions
```

### 🤖 Configuración de Automatización

#### GitHub Actions
```yaml
Nombre: Generate Daily Article
Trigger: Cron '0 9 * * *' (9:00 AM UTC diario)
Manual: workflow_dispatch habilitado
```

#### Scripts Principales
```bash
Generación principal: npm run generate-article
Sistema de respaldo: npm run generate-article-template
Testing IA: npm run generate-article-ai
Debug Gemini: node scripts/debug-gemini.js
```

### 📊 Estructura de Base de Datos

#### Colección: articles
```javascript
Campos principales:
- id: string (timestamp)
- title: string
- content: string (artículo completo)
- excerpt: string (200 chars)
- image: string (URL Unsplash)
- category: string
- author: string
- publishDate: string
- readTime: number
- rating: number (4.0-5.0)
- slug: string
- featured: boolean
- status: 'published'
```

### 🎨 Configuración de Diseño

#### Colores Gaming
```css
--gaming-red: #dc191b
--gaming-gold: #FFD700
--gaming-dark-blue: #22374e
--gaming-cyan: #06B6D4
--gaming-purple: #8B5CF6
```

#### Tipografías
```css
Headlines: 'Playfair Display', serif
Body: 'Inter', sans-serif
```

## 🔄 Flujo de Trabajo Automático

### 1. Ejecución Diaria (9:00 AM UTC)
```
GitHub Actions →
Install Dependencies →
Create Firebase Service Account →
Generate Article (Gemini AI) →
Save to Firestore →
Build Next.js →
Deploy to Firebase →
Cleanup
```

### 2. Generación de Artículo
```
Seleccionar tipo aleatorio →
Generar título con fecha actual →
Llamar Gemini AI con prompt →
Obtener imagen de Unsplash →
Calcular tiempo de lectura →
Generar metadatos →
Guardar en Firestore
```

## 🛠️ Comandos de Mantenimiento

### Testing del Sistema
```bash
# Verificar Gemini AI
node scripts/debug-gemini.js

# Probar modelos disponibles
node scripts/test-gemini-models.js

# Test generación completa
node scripts/test-working-gemini.js

# Generar artículo test
npm run generate-article
```

### Build y Deploy Manual
```bash
# Build local
npm run build

# Deploy a Firebase
firebase deploy --only hosting

# Verificar deployment
curl -I https://mobilegames-win.web.app
```

### Verificación de Base de Datos
```bash
# Conectar a Firestore
firebase firestore:databases:list

# Ver últimos artículos (manual en consola)
# https://console.firebase.google.com/project/mobilegames-win/firestore
```

## 📈 Monitoreo y Logs

### URLs de Monitoreo
```
GitHub Actions: https://github.com/JHevia70/mobilegames-win/actions
Firebase Console: https://console.firebase.google.com/project/mobilegames-win
Sitio Web: https://mobilegames-win.web.app
Firestore: https://console.firebase.google.com/project/mobilegames-win/firestore
```

### Indicadores de Salud
```
✅ Artículo nuevo en Firestore cada 24h
✅ GitHub Actions ejecutándose sin errores
✅ Sitio web actualizándose automáticamente
✅ Logs sin errores críticos
✅ Gemini API respondiendo correctamente
```

## 🚨 Troubleshooting Rápido

### Problema: Gemini API falla
```bash
# Verificar API
node scripts/debug-gemini.js

# Fallback automático
# Sistema usa templates si IA falla
```

### Problema: GitHub Actions falla
```bash
# Verificar secret
# GitHub → Settings → Secrets → FIREBASE_SERVICE_ACCOUNT

# Regenerar service account si es necesario
# Firebase Console → Project Settings → Service Accounts
```

### Problema: Deploy falla
```bash
# Build local
npm run build

# Verificar Firebase login
firebase login

# Deploy manual
firebase deploy --only hosting
```

### Problema: Artículos no aparecen
```bash
# Verificar Firestore
# Console → Firestore → articles collection

# Test generación local
npm run generate-article

# Verificar componente DynamicArticles
# src/components/ui/DynamicArticles.tsx
```

## 📁 Archivos Críticos

### No Modificar Sin Backup
```
.firebaserc                           # Configuración proyecto Firebase
firebase.json                         # Configuración hosting
.github/workflows/generate-article.yml # Automatización GitHub
scripts/generate-article.js           # Generador principal
package.json                          # Scripts y dependencias
```

### Regenerables
```
mobilegames-win-firebase-adminsdk-*.json  # Service account
src/lib/firebase.ts                       # Config cliente Firebase
tailwind.config.js                        # Configuración Tailwind
```

## 🔐 Seguridad

### Secrets Actuales
```
GitHub Secret: FIREBASE_SERVICE_ACCOUNT (JSON completo)
API Keys en código: Gemini + Unsplash (públicamente visibles)
Firebase Rules: Por defecto (configurar si es necesario)
```

### Rotación de Keys (cada 6 meses)
```
1. Gemini AI: https://makersuite.google.com/app/apikey
2. Unsplash: https://unsplash.com/developers
3. Firebase Service Account: Firebase Console
```

## 📅 Información de Versiones

```
Next.js: 14.2.33
React: 18.3.1
Firebase: 10.12.0
Gemini AI SDK: 0.24.1
Tailwind CSS: 3.4.4
```

## 🎯 KPIs del Sistema

```
Uptime objetivo: 99.9%
Artículos por día: 1
Tiempo promedio de generación: 2-3 minutos
Longitud promedio: 600-1000 palabras
Categorías activas: 5 (RPG, Estrategia, Acción, Puzzle, Análisis)
```

---

**⚡ Sistema Status**: Completamente Operativo
**🕒 Última verificación**: 30 Septiembre 2025
**🔄 Próxima ejecución automática**: Mañana 9:00 AM UTC

---

*Mantener este archivo actualizado cuando se realicen cambios en la configuración.*
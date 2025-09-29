# ⚡ Quick Start - MobileGames.win

## 🚀 Para Continuar Trabajando

### 1. **Verificar Estado del Sistema**
```bash
# Clonar si es necesario
git clone https://github.com/JHevia70/mobilegames-win.git
cd mobilegames-win

# Instalar dependencias
npm install

# Verificar que Gemini funciona
node scripts/debug-gemini.js

# Generar artículo de prueba
npm run generate-article
```

### 2. **Verificar Automatización**
- **GitHub Actions**: https://github.com/JHevia70/mobilegames-win/actions
- **Último artículo**: Revisar Firestore en Firebase Console
- **Sitio actualizado**: https://mobilegames-win.web.app

### 3. **Desarrollo Local**
```bash
# Servidor de desarrollo
npm run dev
# → http://localhost:3000

# Test de build
npm run build

# Deploy manual si es necesario
firebase deploy --only hosting
```

## 🔧 Comandos Más Usados

```bash
# GENERACIÓN DE ARTÍCULOS
npm run generate-article        # Con Gemini AI (principal)
npm run generate-article-template  # Con templates (backup)

# DEBUGGING
node scripts/debug-gemini.js   # Verificar Gemini API
node scripts/test-working-gemini.js  # Test completo

# DESARROLLO
npm run dev                     # Servidor desarrollo
npm run build                   # Build producción
firebase deploy --only hosting # Deploy manual

# GIT
git add .
git commit -m "mensaje"
git push
```

## 📊 URLs Importantes

- **🌐 Sitio Web**: https://mobilegames-win.web.app
- **📱 GitHub**: https://github.com/JHevia70/mobilegames-win
- **🔥 Firebase Console**: https://console.firebase.google.com/project/mobilegames-win
- **⚙️ GitHub Actions**: https://github.com/JHevia70/mobilegames-win/actions

## 🔍 Verificación Rápida

### ✅ Sistema Funcionando Si:
- [ ] GitHub Actions ejecutándose diariamente sin errores
- [ ] Nuevos artículos en Firestore cada día
- [ ] Sitio web mostrando contenido actualizado
- [ ] Gemini API respondiendo: `node scripts/debug-gemini.js`

### ❌ Problemas Comunes:
1. **Gemini falla**: Verificar API key en scripts
2. **GitHub Actions falla**: Revisar secret FIREBASE_SERVICE_ACCOUNT
3. **Deploy falla**: `firebase login` y probar deploy manual
4. **Artículos no aparecen**: Verificar Firestore en console

## 📁 Archivos Clave para Modificar

### **Contenido y Diseño**
```
src/app/page.tsx                 # Página principal
src/components/ui/ArticleCard.tsx  # Tarjetas de artículos
src/components/layout/NewspaperHeader.tsx  # Header
tailwind.config.js               # Estilos y colores
```

### **Generación de Artículos**
```
scripts/generate-article.js      # Generador principal (Gemini)
scripts/generate-article-template.js  # Sistema backup
.github/workflows/generate-article.yml  # Automatización
```

### **Base de Datos**
```
src/lib/articles.ts             # Funciones Firestore
src/lib/firebase.ts             # Configuración Firebase
```

## 🎯 Próximas Funcionalidades Sugeridas

### **Inmediatas** (1-2 días)
- [ ] Páginas individuales de artículos (`/articles/[slug]`)
- [ ] Filtros por categoría funcionales
- [ ] Newsletter signup funcional

### **Corto Plazo** (1 semana)
- [ ] Panel de administración básico
- [ ] Sistema de comentarios
- [ ] RSS feed
- [ ] Sitemap automático

### **Mediano Plazo** (1 mes)
- [ ] Multi-idioma (English/Español)
- [ ] Analytics integrado
- [ ] SEO avanzado
- [ ] Social media integration

## 📞 Si Algo Falla

### **Contacto con el Sistema**
1. **Revisar documentación**: `DOCUMENTATION.md`
2. **Verificar configuración**: `CONFIG.md`
3. **Logs de GitHub Actions**: Link en sección URLs
4. **Firebase Console**: Revisar Firestore y Hosting

### **Regenerar Componentes Críticos**
```bash
# Si se perdió service account
# Firebase Console → Project Settings → Service Accounts → Generate new key

# Si Gemini API falla
# https://makersuite.google.com/app/apikey → Create new key

# Si GitHub Actions falla
# GitHub → Settings → Secrets → Update FIREBASE_SERVICE_ACCOUNT
```

## ⏰ Horarios Importantes

- **Generación automática**: Diario 9:00 AM UTC (10:00 AM CET)
- **Verificación sugerida**: Semanal los lunes
- **Rotación de API keys**: Cada 6 meses

---

**🎮 Sistema completamente operativo desde**: 30 Septiembre 2025
**🤖 Última integración**: Gemini AI 2.5 Flash
**📈 Status**: Generando contenido automáticamente

---

*Para desarrollo continuo, simplemente clonar el repo, ejecutar `npm install` y `npm run dev`. El sistema funciona completamente de forma autónoma.*
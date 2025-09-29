# 🎮 MobileGames.win

Sitio web profesional de reviews de juegos móviles con **generación automática de artículos usando Gemini AI**.

## 🚀 Características

- **🤖 Artículos automáticos diarios** generados con Gemini 2.5 Flash
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
- **IA**: Google Gemini 2.5 Flash
- **Automatización**: GitHub Actions
- **Imágenes**: Unsplash API

## 📋 Scripts Disponibles

```bash
# Generar artículo con IA (principal)
npm run generate-article

# Generar con templates (respaldo)
npm run generate-article-template

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Debug Gemini API
node scripts/debug-gemini.js
```

## 🤖 Sistema Automático

### Funcionamiento Diario
1. **9:00 AM UTC**: GitHub Actions se ejecuta automáticamente
2. **Gemini AI** genera un artículo único sobre gaming móvil
3. **Firestore** almacena el artículo con metadatos completos
4. **Firebase Hosting** se actualiza automáticamente
5. **Sitio web** muestra el nuevo contenido

### Tipos de Artículos
- **TOP 5**: Mejores juegos por categoría
- **Análisis**: Tendencias del gaming móvil
- **Guías**: Consejos para gamers
- **Comparativas**: Plataformas y juegos

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

- **Gemini AI**: `models/gemini-2.5-flash`
- **Firebase**: Project `mobilegames-win`
- **Unsplash**: Para imágenes de artículos

## 📈 Métricas

- **Frecuencia**: 1 artículo/día automático
- **Longitud**: 600-1000 palabras
- **Lectura**: 2-4 minutos promedio
- **SEO**: Optimizado con meta tags y URLs amigables

## 🛡️ Automatización

### GitHub Actions
- **Trigger**: Diario (cron) + manual
- **Workflow**: `.github/workflows/generate-article.yml`
- **Monitoreo**: [Actions Tab](https://github.com/JHevia70/mobilegames-win/actions)

## 📚 Documentación

📖 **[Ver documentación completa](./DOCUMENTATION.md)** con todos los detalles técnicos, troubleshooting y configuración avanzada.

## 🔄 Estado del Sistema

✅ **Completamente operativo**
✅ **Generación automática funcionando**
✅ **Deploy automático configurado**
✅ **Base de datos activa**

## 🎯 Próximas Funcionalidades

- [ ] Páginas individuales de artículos
- [ ] Sistema de comentarios
- [ ] Newsletter funcional
- [ ] Panel de administración
- [ ] Soporte multi-idioma

---

**🤖 Desarrollado con Gemini AI y Claude Code**
**📅 Última actualización**: Septiembre 2025

---

*Sistema completamente automatizado - Los artículos se generan y publican automáticamente sin intervención manual.*
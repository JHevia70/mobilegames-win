# Fix: Rate Limits Gemini 2.0 Flash → 2.5 Flash-Lite

## ❌ Problema Encontrado

**Error en producción:**
```
[429 Too Many Requests] You exceeded your current quota
* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 200
* Model: gemini-2.0-flash
```

**Límite real de Gemini 2.0 Flash**: Solo **200 requests/día** (no 1,500 como se pensaba inicialmente)

## ✅ Solución

### Modelo Actualizado: Gemini 2.5 Flash-Lite

**Características:**
- ✅ **1,000 requests/día** (5x más que 2.0 Flash)
- ✅ **100% Gratuito**
- ✅ **Google Search integrado**
- ✅ **1M tokens de contexto**
- ✅ **65,536 tokens output**

### Comparación de Límites (Free Tier)

| Modelo | Requests/Día | Contexto | Output | Google Search |
|--------|--------------|----------|---------|---------------|
| Gemini 2.0 Flash | ❌ 200 | 1M tokens | 8K tokens | ✅ |
| **Gemini 2.5 Flash-Lite** | ✅ **1,000** | 1M tokens | 65K tokens | ✅ |
| Gemini 2.5 Flash | ⚠️ 500 | 1M tokens | 65K tokens | ✅ |

**Fuente oficial**: https://ai.google.dev/gemini-api/docs/rate-limits

## 📝 Cambios Realizados

### 1. Scripts Actualizados

```javascript
// ANTES
model: 'models/gemini-2.0-flash'

// DESPUÉS
model: 'models/gemini-2.5-flash-lite'
```

**Archivos modificados:**
- ✅ `scripts/generate-article.js`
- ✅ `scripts/generate-breaking-news.js`
- ✅ `scripts/test-gemini.js`

### 2. Configuración

**`.env.local`:**
```bash
# ANTES
# Google Gemini 2.0 Flash - 1,500 requests/día gratis
GEMINI_API_KEY=AIzaSy...

# DESPUÉS
# Google Gemini 2.5 Flash-Lite - 1,000 requests/día gratis
GEMINI_API_KEY=AIzaSy...
```

### 3. Documentación

- ✅ `CLAUDE.md` - Tech Stack actualizado
- ✅ `MIGRATION-TO-GEMINI-2.0.md` - Corregido con info real
- ✅ `RATE-LIMITS-FIX.md` - Este documento (nuevo)

## 🧪 Testing

### Test de Conexión
```bash
node scripts/test-gemini.js
```

**Resultado:**
```
✅ Response: ¡Hola!
✅ Google Search: OK
✅ Article generation: OK

📊 Model: gemini-2.5-flash-lite
📈 Free tier: 1,000 requests/day
🔍 Google Search: ✅ Enabled
```

### Test de Artículo Completo
```bash
npm run generate-article
```

**Resultado:**
```
🤖 AI Provider: Google Gemini 2.5 Flash-Lite (100% GRATIS - 1,000 requests/día)
✅ Article published successfully!
📖 Slug: comparativa-gaming-casual-vs-gaming-hardcore-en-juegos-moviles
⏱️ Read time: 14 min
```

## 📊 Capacidad del Sistema

**Con 1,000 requests/día podemos generar:**

### Workflows Automáticos
- **Daily Opinion** (9:00 AM): ~3-5 requests
- **Weekly TOP5** (Martes 10:00 AM): ~4-6 requests
- **Breaking News** (cada 12h): ~2-3 requests × 2 = 4-6 requests/día

**Total workflows/día**: ~11-17 requests

**Margen restante**: ~983-989 requests para testing y generación manual

### Análisis de Uso
✅ **Consumo diario normal**: ~20-30 requests (workflows + testing)
✅ **Capacidad sobrante**: ~970-980 requests
✅ **Margen de seguridad**: 33x el uso normal

## ⚠️ Lecciones Aprendidas

1. **Siempre verificar límites reales**: La documentación inicial decía "1,500 RPD" pero era para otros modelos
2. **Probar en producción temprano**: El límite de 200 RPD se descubrió en el primer día de uso
3. **Monitorear cuotas**: Implementar tracking de uso de API
4. **Tener plan B**: Considerar múltiples modelos según necesidad

## 🚀 Próximos Pasos

### Recomendaciones

1. **Implementar retry con backoff** en caso de rate limit
2. **Cachear trending topics** para reducir calls
3. **Monitorear uso diario** de API
4. **Considerar upgrade** si se necesita más capacidad en el futuro

### Monitoreo

Crear script para verificar uso diario:
```bash
# Verificar cuota actual
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite?key=APIKEY"
```

## 📅 Fecha de Fix

**6 de octubre de 2025**

---

**Estado**: ✅ Fix aplicado y probado exitosamente
**Modelo actual**: `gemini-2.5-flash-lite` (1,000 RPD)

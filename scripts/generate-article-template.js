const admin = require('firebase-admin');
const { createApi } = require('unsplash-js');

// Initialize Unsplash
const unsplash = createApi({
  accessKey: '4qjo4eTlRYPjt-EJ1romAUY9VGg2Pbqb3Fd8uyorge0',
});

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require('../mobilegames-win-firebase-adminsdk-fbsvc-e75d0dfbc9.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'mobilegames-win'
  });
}

const db = admin.firestore();

// Article templates with pre-written content
const articleTemplates = [
  {
    title: 'TOP 5 Mejores Juegos RPG para Android {month} {year}',
    category: 'RPG',
    content: `Los juegos de rol para Android han alcanzado un nivel de calidad excepcional en {year}, ofreciendo experiencias épicas que rivalizan con las consolas tradicionales. Esta selección presenta los cinco mejores títulos RPG que todo gamer móvil debe probar.

**1. Genshin Impact**
Este impresionante RPG de mundo abierto sigue liderando el género con sus gráficos espectaculares y sistema de combate dinámico. La última actualización ha añadido nuevas regiones explorables y personajes únicos que enriquecen la experiencia de juego.

**2. Final Fantasy VII: Ever Crisis**
La reimaginación móvil del clásico de Square Enix ofrece una narrativa profunda y combate estratégico por turnos. Sus gráficos renovados y banda sonora remasterizada lo convierten en una experiencia nostálgica perfecta.

**3. Honkai: Star Rail**
Este RPG de ciencia ficción destaca por su sistema de combate táctico y narrativa cinematográfica. Los desarrolladores de miHoYo han creado un universo rico en detalles que mantiene a los jugadores enganchados durante horas.

**4. Raid: Shadow Legends**
A pesar de su controvertida publicidad, este RPG de colección ofrece una profundidad estratégica sorprendente. El sistema de construcción de equipos y las batallas táticas proporcionan un desafío constante.

**5. AFK Arena**
Perfecto para jugadores casuales, este RPG idle permite progresar incluso cuando no estás jugando activamente. Su arte distintivo y mecánicas de progresión automático lo hacen ideal para sesiones cortas.

**Conclusión**
Estos cinco títulos representan lo mejor del RPG móvil actual, cada uno ofreciendo una experiencia única que satisface diferentes preferencias de juego. Ya sea que busques acción en tiempo real o estrategia por turnos, encontrarás una opción perfecta en esta lista.`,
    searchTerm: 'RPG mobile games'
  },
  {
    title: 'Análisis: Nuevas Tendencias en Gaming Móvil {year}',
    category: 'Análisis',
    content: `El gaming móvil continúa evolucionando a un ritmo acelerado en {year}, estableciendo nuevos estándares tecnológicos y experiencias de usuario que redefinen lo que esperamos de los juegos en smartphones.

**Gráficos de Nueva Generación**
Los dispositivos móviles actuales están alcanzando capacidades gráficas que antes eran exclusivas de consolas. Tecnologías como el ray tracing móvil y la iluminación global en tiempo real están transformando la calidad visual de los juegos.

**Cloud Gaming y Streaming**
La integración de servicios de cloud gaming permite acceder a títulos AAA desde cualquier dispositivo móvil. Plataformas como GeForce NOW y Xbox Cloud Gaming están democratizando el acceso a juegos de alta calidad.

**Realidad Aumentada Inmersiva**
Más allá de Pokémon GO, nuevos títulos están explorando formas innovadoras de integrar AR. Los juegos ahora utilizan el entorno real de forma más sofisticada, creando experiencias verdaderamente inmersivas.

**Monetización Ética**
La industria está adoptando modelos de monetización más transparentes y justos. Los battle passes opcionales y las compras cosméticas están reemplazando gradualmente las mecánicas pay-to-win más agresivas.

**Controles Adaptativos**
Los desarrolladores están perfeccionando controles táctiles más intuitivos y responsive. La implementación de feedback háptico avanzado está mejorando significativamente la sensación de control.

**Social Gaming Evolucionado**
Las funciones sociales se están volviendo más sofisticadas, con sistemas de guilds, eventos en tiempo real y streaming integrado que fomentan comunidades más fuertes.

**Conclusión**
Estas tendencias indican que el gaming móvil no solo está madurando como plataforma, sino que está liderando la innovación en la industria de videojuegos en general.`,
    searchTerm: 'mobile gaming trends'
  },
  {
    title: 'Guía Completa: Optimizar Batería para Gaming Móvil',
    category: 'Guías',
    content: `La duración de la batería es crucial para una experiencia de gaming móvil satisfactoria. Esta guía exhaustiva te ayudará a maximizar el tiempo de juego sin comprometer el rendimiento.

**Ajustes de Sistema Esenciales**

*Modo de Rendimiento Inteligente*
Configura tu dispositivo para usar el modo de rendimiento adaptativo que ajusta automáticamente la CPU y GPU según las demandas del juego.

*Gestión de Aplicaciones en Segundo Plano*
Cierra aplicaciones innecesarias antes de jugar. Las apps de redes sociales y sincronización en la nube pueden consumir recursos significativos.

**Configuración Gráfica Óptima**

*Resolución Dinámica*
Reduce la resolución de renderizado al 80-90% de la nativa. La diferencia visual es mínima pero el ahorro energético es considerable.

*Frame Rate Limitado*
Limita los FPS a 60 en lugar de usar frecuencias más altas. Los 120 FPS consumen el doble de energía sin beneficio perceptible en muchos juegos.

*Efectos Visuales Selectivos*
Desactiva sombras dinámicas, reflejos en tiempo real y partículas complejas. Mantén texturas en alta calidad para preservar la experiencia visual.

**Accesorios y Hardware**

*Coolers y Ventiladores*
Un dispositivo fresco es un dispositivo eficiente. Los coolers externos pueden mejorar el rendimiento y reducir el throttling térmico.

*Power Banks Especializados*
Invierte en un power bank con carga rápida y múltiples puertos para sesiones de gaming extendidas.

**Consejos Avanzados**

*Perfiles de Juego*
Configura perfiles específicos para diferentes tipos de juegos. Los RPG por turnos requieren menos recursos que los shooters en tiempo real.

*Gestión Térmica*
Evita jugar mientras cargas el dispositivo. El calor adicional reduce la eficiencia de la batería y puede causar degradación.

**Monitoreo y Mantenimiento**

Utiliza aplicaciones como AccuBattery para monitorear el consumo energético y identificar aplicaciones problemáticas.

**Conclusión**
Siguiendo estas optimizaciones, puedes extender tu tiempo de juego en un 30-50% sin sacrificar significativamente la calidad visual o el rendimiento.`,
    searchTerm: 'mobile gaming battery optimization'
  },
  {
    title: 'Comparativa: Android vs iOS para Gaming {year}',
    category: 'Comparativas',
    content: `La eterna batalla entre Android e iOS se intensifica en el ámbito del gaming móvil. Analizamos las fortalezas y debilidades de cada plataforma para ayudarte a tomar la mejor decisión.

**Rendimiento Bruto**

*Android*
Los dispositivos Android flagship como los Samsung Galaxy S24 Ultra ofrecen especificaciones técnicas superiores: más RAM, procesadores más potentes y sistemas de refrigeración avanzados.

*iOS*
A pesar de especificaciones aparentemente menores, la optimización de Apple resulta en rendimiento consistente y estable, especialmente en el iPhone 15 Pro Max.

**Biblioteca de Juegos**

*Android*
Mayor variedad de juegos, incluyendo emuladores y títulos no disponibles en otras plataformas. Google Play Store tiene políticas más flexibles para desarrolladores indie.

*iOS*
Catálogo más curado con énfasis en calidad. Los desarrolladores tienden a lanzar primero en iOS debido a las mejores tasas de monetización.

**Experiencia de Usuario**

*Android*
Personalización extensa, controles de juego externos nativos y capacidad de modificar profundamente la experiencia de gaming.

*iOS*
Experiencia uniforme y predecible. Las actualizaciones simultáneas garantizan compatibilidad consistente con juegos nuevos.

**Ecosistema y Servicios**

*Android*
Google Play Games ofrece guardado en la nube robusto y funciones sociales integradas. Compatible con múltiples tiendas de aplicaciones.

*iOS*
Game Center proporciona integración perfecta con otros dispositivos Apple. AirPlay permite streaming a Apple TV sin latencia adicional.

**Precio y Accesibilidad**

*Android*
Rango de precios más amplio, desde dispositivos económicos hasta flagships. Opciones de gaming especializado como ROG Phone.

*iOS*
Precio premium pero retiene valor por más tiempo. Soporte de software extendido garantiza compatibilidad a largo plazo.

**Innovación y Futuro**

*Android*
Adopción más rápida de tecnologías emergentes como displays de 144Hz y carga ultrarrápida.

*iOS*
Innovaciones más pulidas y maduras, como la integración de Machine Learning para optimización automática.

**Veredicto**
Para entusiastas del rendimiento y personalización: Android. Para usuarios que priorizan estabilidad y ecosistema integrado: iOS. Ambas plataformas ofrecen experiencias de gaming excepcionales en {year}.`,
    searchTerm: 'Android vs iOS gaming'
  },
  {
    title: 'TOP 5 Juegos de Estrategia Mobile Imperdibles {month} {year}',
    category: 'Estrategia',
    content: `Los juegos de estrategia móvil han evolucionado hacia experiencias complejas y gratificantes que desafían la mente. Esta selección presenta los títulos más destacados que todo estratega debe conocer.

**1. Clash Royale**
El perfecto equilibrio entre estrategia en tiempo real y accesibilidad. Sus partidas de 3 minutos lo convierten en el título ideal para sesiones rápidas sin sacrificar profundidad estratégica.

**2. Civilization VI**
La versión móvil del clásico de Firaxis mantiene toda la complejidad del original. Perfecto para estrategas que buscan experiencias largas y reflexivas con decisiones que impactan durante horas.

**3. Total War Battles: Kingdom**
Combina gestión de ciudades con batallas tácticas en tiempo real. La estrategia a gran escala se fusiona con combates detallados que requieren microgestión constante.

**4. Plants vs. Zombies 2**
Tower defense refinado con elementos RPG. Su progresión de plantas y zombies únicos mantiene la frescura a través de cientos de niveles desafiantes.

**5. XCOM: Enemy Within**
Estrategia por turnos profunda con elementos de gestión de recursos. Las decisiones permanentes y la dificultad elevada proporcionan tensión constante.

**Elementos Clave de la Estrategia Móvil Moderna**

*Accesibilidad Intuitiva*
Los mejores juegos logran equilibrar complejidad con controles táctiles naturales. La interfaz debe ser clara incluso en pantallas pequeñas.

*Progresión Satisfactoria*
Sistemas de upgrade y desbloqueo que mantienen motivación a largo plazo sin recurrir a mecánicas predatorias.

*Balanceado Competitivo*
Matchmaking justo que permite competir sin necesidad de realizar compras para mantenerse competitivo.

**Consejos para Nuevos Estrategas**
Comienza con títulos más simples como Clash Royale antes de avanzar a experiencias complejas como Civilization VI. La curva de aprendizaje gradual es clave para desarrollar habilidades estratégicas sólidas.

**Conclusión**
Estos cinco títulos representan la evolución de la estrategia móvil, cada uno ofreciendo enfoques únicos que satisfacen desde el casual más relajado hasta el hardcore más exigente.`,
    searchTerm: 'mobile strategy games'
  }
];

// Get article image from Unsplash - intelligent search based on content
async function getArticleImage(searchTerm) {
  try {
    // Extract keywords from search term
    const simplifiedTerm = searchTerm.toLowerCase();
    const keywords = simplifiedTerm
      .replace(/[^\w\s]/g, ' ')
      .split(' ')
      .filter(word => word.length > 3 && !['para', 'los', 'las', 'del', 'con', 'the', 'and', 'for'].includes(word));
    
    // Detect specific game categories
    const isBattleRoyale = /battle royale|fortnite|pubg|apex/i.test(simplifiedTerm);
    const isMOBA = /moba|league|dota|arena/i.test(simplifiedTerm);
    const isCard = /card|deck|hearthstone/i.test(simplifiedTerm);
    const isSports = /soccer|football|basketball|fifa|sports/i.test(simplifiedTerm);
    const isRacing = /racing|car|driving/i.test(simplifiedTerm);
    const isRPG = /rpg|role playing/i.test(simplifiedTerm);
    
    // Build smart search strategies based on detected content
    const searchStrategies = [];
    
    // Add specific category searches first (most relevant)
    if (isBattleRoyale) {
      searchStrategies.push('battle royale mobile', 'fortnite mobile game');
    }
    if (isMOBA) {
      searchStrategies.push('moba mobile game', 'mobile arena game');
    }
    if (isCard) {
      searchStrategies.push('card game mobile phone', 'mobile card game');
    }
    if (isSports) {
      searchStrategies.push('mobile sports game', 'fifa mobile soccer');
    }
    if (isRacing) {
      searchStrategies.push('racing mobile game', 'mobile car racing');
    }
    if (isRPG) {
      searchStrategies.push('rpg mobile game', 'mobile adventure rpg');
    }
    
    // Add keyword-based searches if we have good keywords
    if (keywords.length > 0) {
      searchStrategies.push(`${keywords[0]} mobile game`);
      if (keywords.length > 1) {
        searchStrategies.push(`${keywords.slice(0, 2).join(' ')} mobile`);
      }
    }
    
    // Add original term searches
    searchStrategies.push(
      `${searchTerm} mobile game`,
      `people playing ${searchTerm}`,
      'people playing mobile games',
      'smartphone gaming',
      'gaming phone',
      'mobile gamer'
    );

    for (let query of searchStrategies) {
      try {
        const result = await unsplash.search.getPhotos({
          query: query,
          page: 1,
          perPage: 10,
          orientation: 'landscape'
        });

        if (result.response && result.response.results.length > 0) {
          // Pick a random photo from results for variety
          const randomIndex = Math.floor(Math.random() * result.response.results.length);
          const photo = result.response.results[randomIndex];
          return `${photo.urls.regular}?w=1200&h=600&fit=crop`;
        }
      } catch (err) {
        continue;
      }
    }

    // Fallback to curated mobile gaming image
    return 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=1200&h=600&fit=crop';
  } catch (error) {
    console.error('Error fetching image:', error);
    return 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=1200&h=600&fit=crop';
  }
}

// Generate article slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Authors pool
const authors = [
  'Carlos Martinez',
  'Ana García',
  'Miguel Santos',
  'Laura Pérez',
  'David López',
  'Sofia Rodriguez',
  'Pablo Fernandez'
];

// Generate random rating
function generateRating() {
  return (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
}

// Calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Main function to generate and publish article
async function generateAndPublishArticle() {
  try {
    console.log('🤖 Generating new article from template...');

    // Select random article template
    const template = articleTemplates[Math.floor(Math.random() * articleTemplates.length)];

    const currentDate = new Date();
    const month = currentDate.toLocaleDateString('es-ES', { month: 'long' });
    const year = currentDate.getFullYear();

    // Generate title with current date
    const title = template.title
      .replace('{month}', month)
      .replace('{year}', year);

    // Generate content with current date
    const content = template.content
      .replace(/\{month\}/g, month)
      .replace(/\{year\}/g, year);

    console.log(`📝 Title: ${title}`);

    // Get image
    const imageUrl = await getArticleImage(template.searchTerm);

    // Create article object
    const article = {
      id: Date.now().toString(),
      title,
      content,
      excerpt: content.substring(0, 200).replace(/\*/g, '') + '...',
      image: imageUrl,
      category: template.category,
      author: authors[Math.floor(Math.random() * authors.length)],
      publishDate: currentDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      readTime: calculateReadTime(content),
      rating: parseFloat(generateRating()),
      slug: generateSlug(title),
      featured: Math.random() > 0.7, // 30% chance of being featured
      type: template.category.toLowerCase(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'published'
    };

    // Save to Firestore
    await db.collection('articles').doc(article.id).set(article);

    console.log('✅ Article published successfully!');
    console.log(`📖 Slug: ${article.slug}`);
    console.log(`👤 Author: ${article.author}`);
    console.log(`⭐ Rating: ${article.rating}`);
    console.log(`⏱️ Read time: ${article.readTime} min`);

    return article;

  } catch (error) {
    console.error('❌ Error generating article:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateAndPublishArticle()
    .then(() => {
      console.log('🎉 Article generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to generate article:', error);
      process.exit(1);
    });
}

module.exports = { generateAndPublishArticle };
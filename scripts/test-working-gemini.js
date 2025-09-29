const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyCywwj_27AOLJVq_hrhArfN--k1eStHOdA');

async function testWorkingGemini() {
  console.log('🔍 Testing with available Gemini models...\n');

  // Usar los modelos que vimos que están disponibles
  const availableModels = [
    'models/gemini-2.5-flash',
    'models/gemini-2.5-pro-preview-03-25',
    'models/gemini-2.5-flash-preview-05-20'
  ];

  for (const modelName of availableModels) {
    try {
      console.log(`🧪 Testing model: ${modelName}`);

      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        }
      });

      const prompt = "Escribe un párrafo corto sobre gaming móvil en español, mencionando tendencias actuales.";

      console.log(`📤 Sending request...`);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text && text.length > 10) {
        console.log(`✅ SUCCESS: ${modelName} is working!`);
        console.log(`📝 Response (${text.length} chars):`);
        console.log(`"${text}"`);
        console.log('');

        // Test full article generation
        console.log('🚀 Testing full article generation...');

        const articlePrompt = `
Escribe un artículo profesional sobre juegos móviles con el título: "TOP 5 Mejores Juegos de Estrategia Móvil Octubre 2024"

Requisitos:
- Escribe en español
- Estilo periodístico profesional
- 600-1000 palabras
- Incluye introducción, desarrollo y conclusión
- Menciona 5 juegos específicos reales de estrategia móvil
- Usa un tono experto pero accesible
- Incluye detalles sobre gameplay, gráficos y mecánicas
- Finaliza con una recomendación clara

Estructura:
1. Introducción atractiva sobre el estado actual de los juegos de estrategia móvil
2. Análisis detallado de cada uno de los 5 juegos
3. Comparación entre ellos
4. Conclusión con recomendación

Genera solo el contenido del artículo, sin títulos de secciones.
`;

        const articleResult = await model.generateContent(articlePrompt);
        const articleResponse = await articleResult.response;
        const articleText = articleResponse.text();

        console.log(`✅ Full article generated successfully!`);
        console.log(`📊 Article length: ${articleText.length} characters`);
        console.log(`📝 Article preview:`);
        console.log(`"${articleText.substring(0, 400)}..."`);

        return {
          success: true,
          model: modelName,
          shortResponse: text,
          fullArticle: articleText
        };
      }
    } catch (error) {
      console.log(`❌ FAILED: ${modelName} - ${error.message}`);
      console.log('');
    }
  }

  return { success: false, error: 'No working model found' };
}

// Run test
testWorkingGemini()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 Gemini is working perfectly!');
      console.log(`🔧 Working model: "${result.model}"`);
      console.log(`📏 Generated article length: ${result.fullArticle.length} characters`);
      console.log('\n✅ Ready to update the article generation system!');
    } else {
      console.log('\n💥 All models failed.');
    }
  })
  .catch(error => {
    console.error('💥 Test failed:', error);
  });
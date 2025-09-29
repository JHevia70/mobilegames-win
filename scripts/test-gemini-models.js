const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyCywwj_27AOLJVq_hrhArfN--k1eStHOdA');

async function testGeminiModels() {
  console.log('🔍 Testing different Gemini model configurations...\n');

  // Lista de modelos y configuraciones a probar
  const modelConfigurations = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro',
    'models/gemini-pro',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest'
  ];

  let workingModel = null;

  for (const modelName of modelConfigurations) {
    try {
      console.log(`🧪 Testing model: ${modelName}`);

      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = "Escribe un párrafo corto sobre gaming móvil en español.";
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text && text.length > 10) {
        console.log(`✅ SUCCESS: ${modelName} is working!`);
        console.log(`📝 Response preview: ${text.substring(0, 100)}...`);
        workingModel = modelName;
        break;
      }
    } catch (error) {
      console.log(`❌ FAILED: ${modelName} - ${error.message.substring(0, 100)}...`);
    }
  }

  if (workingModel) {
    console.log(`\n🎉 Found working model: ${workingModel}`);

    // Test full article generation
    console.log('\n🚀 Testing full article generation...');
    try {
      const model = genAI.getGenerativeModel({ model: workingModel });

      const fullPrompt = `
Escribe un artículo profesional sobre juegos móviles con el título: "TOP 5 Mejores Juegos RPG Móviles 2024"

Requisitos:
- Escribe en español
- Estilo periodístico profesional
- 500-800 palabras
- Incluye introducción, desarrollo y conclusión
- Menciona juegos específicos reales
- Usa un tono experto pero accesible

Genera solo el contenido del artículo, sin títulos de secciones.
`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const fullText = response.text();

      console.log(`✅ Full article generated successfully!`);
      console.log(`📊 Article length: ${fullText.length} characters`);
      console.log(`📝 Article preview:\n${fullText.substring(0, 300)}...`);

      return {
        model: workingModel,
        success: true,
        previewText: fullText.substring(0, 300)
      };

    } catch (error) {
      console.log(`❌ Failed to generate full article: ${error.message}`);
      return { model: workingModel, success: false, error: error.message };
    }
  } else {
    console.log('\n❌ No working model found. Check your API key configuration.');
    return { success: false, error: 'No working model found' };
  }
}

// Run test
testGeminiModels()
  .then(result => {
    if (result.success) {
      console.log('\n🎯 Gemini configuration successful!');
      console.log(`🔧 Use model: "${result.model}" in your scripts`);
    } else {
      console.log('\n💥 Gemini configuration failed.');
      if (result.error) {
        console.log(`Error: ${result.error}`);
      }
    }
  })
  .catch(error => {
    console.error('💥 Test script failed:', error);
  });
// Test Gemini 1.5 Flash connection
require('dotenv').config({ path: '.env.local' });

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiConnection() {
  console.log('🧪 Testing Gemini 1.5 Flash connection...\n');

  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Test 1: Simple text generation
    console.log('📝 Test 1: Simple text generation');
    const model = genAI.getGenerativeModel({
      model: 'models/gemini-2.5-flash-lite'
    });

    const prompt = 'Di "Hola" en español y confirma que funcionas correctamente.';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log('✅ Response:', response.text());
    console.log();

    // Test 2: Google Search integration
    console.log('📝 Test 2: Google Search integration');
    const searchModel = genAI.getGenerativeModel({
      model: 'models/gemini-2.5-flash-lite',
      tools: [{
        googleSearch: {}
      }],
    });

    const searchPrompt = 'Busca el juego móvil más popular del momento y dame su nombre exacto.';
    const searchResult = await searchModel.generateContent(searchPrompt);
    const searchResponse = await searchResult.response;
    console.log('✅ Response:', searchResponse.text());
    console.log();

    // Test 3: Gaming article generation (short version)
    console.log('📝 Test 3: Gaming article generation (short)');
    const articleModel = genAI.getGenerativeModel({
      model: 'models/gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 500,
        responseMimeType: "text/plain",
      }
    });

    const articlePrompt = `Escribe un párrafo de 100 palabras sobre las tendencias en juegos móviles 2025.`;
    const articleResult = await articleModel.generateContent(articlePrompt);
    const articleResponse = await articleResult.response;
    console.log('✅ Response:', articleResponse.text());
    console.log();

    console.log('🎉 All tests passed! Gemini 2.5 Flash-Lite is working correctly.');
    console.log('📊 Model: gemini-2.5-flash-lite');
    console.log('📈 Free tier: 1,000 requests/day');
    console.log('🔍 Google Search: ✅ Enabled');

  } catch (error) {
    console.error('❌ Error testing Gemini:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run test
testGeminiConnection();

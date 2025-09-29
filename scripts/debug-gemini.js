const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyCywwj_27AOLJVq_hrhArfN--k1eStHOdA';

async function debugGeminiAPI() {
  console.log('🔍 Debugging Gemini API configuration...\n');

  // Verificar formato del API key
  console.log(`🔑 API Key format: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 5)}`);
  console.log(`📏 API Key length: ${API_KEY.length} characters`);

  if (!API_KEY.startsWith('AIza')) {
    console.log('❌ Invalid API key format. Should start with "AIza"');
    return;
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  // Intentar diferentes endpoints y configuraciones
  const testConfigurations = [
    {
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      }
    },
    {
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      }
    }
  ];

  for (const config of testConfigurations) {
    try {
      console.log(`🧪 Testing: ${config.model} with generation config`);

      const model = genAI.getGenerativeModel({
        model: config.model,
        generationConfig: config.generationConfig
      });

      const prompt = "Hola, ¿puedes responder en español?";

      console.log(`📤 Sending request to ${config.model}...`);
      const result = await model.generateContent(prompt);
      console.log(`📥 Response received`);

      const response = await result.response;
      const text = response.text();

      console.log(`✅ SUCCESS with ${config.model}!`);
      console.log(`📝 Response: ${text}`);
      console.log(`📊 Response length: ${text.length} characters\n`);

      return { success: true, model: config.model, config: config.generationConfig };

    } catch (error) {
      console.log(`❌ ${config.model} failed:`);
      console.log(`   Status: ${error.status || 'Unknown'}`);
      console.log(`   Message: ${error.message}`);

      if (error.errorDetails) {
        console.log(`   Details: ${JSON.stringify(error.errorDetails)}`);
      }
      console.log('');
    }
  }

  // Intentar con configuración mínima
  console.log('🧪 Testing with minimal configuration...');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Test');
    console.log('✅ Minimal config works!');
    return { success: true, model: 'gemini-pro' };
  } catch (error) {
    console.log(`❌ Minimal config failed: ${error.message}`);
  }

  return { success: false, error: 'All configurations failed' };
}

// Verificar también la conectividad básica
async function testConnectivity() {
  console.log('🌐 Testing basic connectivity to Google AI...');

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      method: 'GET',
      headers: {
        'x-goog-api-key': API_KEY
      }
    });

    console.log(`📡 Response status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API endpoint accessible');
      console.log(`📋 Available models: ${data.models ? data.models.length : 'unknown'}`);

      if (data.models && data.models.length > 0) {
        console.log('🎯 Available models:');
        data.models.slice(0, 5).forEach(model => {
          console.log(`   - ${model.name} (${model.displayName || 'no display name'})`);
        });
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ API error: ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Connectivity error: ${error.message}`);
  }
}

// Run both tests
async function runAllTests() {
  await testConnectivity();
  console.log('\n' + '='.repeat(50) + '\n');
  const result = await debugGeminiAPI();

  if (result.success) {
    console.log('\n🎉 Gemini is working!');
    console.log(`✅ Use model: "${result.model}"`);
    if (result.config) {
      console.log(`⚙️  Config: ${JSON.stringify(result.config, null, 2)}`);
    }
  } else {
    console.log('\n💥 Gemini configuration failed completely.');
    console.log('🔧 Possible solutions:');
    console.log('   1. Regenerate your API key at https://makersuite.google.com/app/apikey');
    console.log('   2. Check if your API key has proper permissions');
    console.log('   3. Verify your Google Cloud project has Generative AI API enabled');
    console.log('   4. Try creating a new API key from Google AI Studio');
  }
}

runAllTests().catch(console.error);
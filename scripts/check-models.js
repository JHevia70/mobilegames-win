const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyCywwj_27AOLJVq_hrhArfN--k1eStHOdA');

async function listModels() {
  try {
    console.log('🔍 Checking available models...');

    // Try to get models list
    const models = await genAI.listModels();

    console.log('✅ Available models:');
    models.forEach((model) => {
      console.log(`  - ${model.name} (${model.displayName})`);
      if (model.supportedGenerationMethods) {
        console.log(`    Methods: ${model.supportedGenerationMethods.join(', ')}`);
      }
    });

  } catch (error) {
    console.error('❌ Error listing models:', error.message);

    // Try with simple model names
    const modelsToTest = [
      'gemini-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'text-bison-001',
      'chat-bison-001'
    ];

    console.log('\n🧪 Testing common model names...');

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Test');
        console.log(`✅ ${modelName} - Working`);
        break; // Stop on first working model
      } catch (testError) {
        console.log(`❌ ${modelName} - ${testError.message}`);
      }
    }
  }
}

listModels();
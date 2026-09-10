const path = require('path');
process.chdir(path.join(__dirname, '..'));

const originalFetch = global.fetch;
const originalEnv = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL,
  GROQ_FALLBACK_MODEL: process.env.GROQ_FALLBACK_MODEL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL,
  HF_API_KEY: process.env.HF_API_KEY,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY
};

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function jsonResponse(status, data) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(data)
  };
}

function restoreEnvironment() {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  global.fetch = originalFetch;
}

async function run() {
  const { matchOfflineResponse, getLocationContext, getAIResponse } = require('../services/ai-service');
  const { createAICompletion } = require('../services/ai-provider-service');

  console.log('\n=== Teranga AI — AI Service Tests ===\n');

  delete process.env.GROQ_API_KEY;
  delete process.env.GEMINI_API_KEY;
  delete process.env.HF_API_KEY;
  delete process.env.HUGGINGFACE_API_KEY;

  const greeting = matchOfflineResponse('Bonjour !');
  const bakelQuestion = matchOfflineResponse('Bonjour, que puis-je cultiver à Bakel ?');
  assert(greeting.includes('Comment puis-je vous aider'), 'Une salutation courte utilise l’accueil');
  assert(bakelQuestion.includes('Bakel'), 'Une question commençant par Bonjour reste contextuelle');
  assert(bakelQuestion.includes('Fleuve Sénégal'), 'Le fallback Bakel contient le contexte local');
  assert(getLocationContext('Je cultive à Saint-Louis').includes('SAINT LOUIS'), 'Les alias de ville sont reconnus');

  const offline = await getAIResponse([
    { role: 'user', content: 'Bonjour, que puis-je cultiver à Bakel ?' }
  ], 'fr');
  assert(offline.source === 'offline', 'Sans clé, le conseiller utilise le fallback hors ligne');
  assert(typeof offline.message === 'string' && offline.message.includes('Bakel'), 'Le contrat structuré contient une réponse utile');

  process.env.GROQ_API_KEY = 'test-groq';
  process.env.GEMINI_API_KEY = 'test-gemini';
  process.env.GROQ_MODEL = 'primary-test-model';
  process.env.GROQ_FALLBACK_MODEL = 'secondary-test-model';
  process.env.GEMINI_MODEL = 'gemini-test-model';

  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    if (url.includes('generativelanguage.googleapis.com')) {
      return jsonResponse(503, { error: { status: 'UNAVAILABLE' } });
    }
    return jsonResponse(200, {
      choices: [{ message: { content: 'Conseil Groq contextuel pour Bakel.' } }]
    });
  };

  const groqFallback = await createAICompletion([
    { role: 'system', content: 'Réponds en français.' },
    { role: 'user', content: 'Que cultiver à Bakel ?' }
  ]);
  assert(groqFallback.provider === 'groq', 'Groq prend le relais quand Gemini échoue');
  assert(groqFallback.usedFallback === true, 'Le relais Groq est signalé comme dégradé');
  assert(groqFallback.content.includes('Bakel'), 'La réponse Groq est renvoyée');
  assert(calls[0].url.includes('gemini-test-model'), 'Le modèle Gemini vient de l’environnement');
  assert(calls[1].body.model === 'primary-test-model', 'Le modèle Groq vient de l’environnement');

  global.fetch = async url => {
    if (url.includes('generativelanguage.googleapis.com')) {
      return jsonResponse(200, { candidates: [] });
    }
    return jsonResponse(200, {
      choices: [{ message: { content: 'Groq après réponse Gemini malformée.' } }]
    });
  };
  const malformedFallback = await createAICompletion([{ role: 'user', content: 'Question' }]);
  assert(malformedFallback.provider === 'groq', 'Une réponse Gemini malformée déclenche Groq');

  delete process.env.GROQ_API_KEY;
  global.fetch = async () => jsonResponse(200, {
    candidates: [{ content: { parts: [{ text: 'Gemini seul fonctionne.' }] } }]
  });
  const geminiOnly = await createAICompletion([{ role: 'user', content: 'Question' }]);
  assert(geminiOnly.provider === 'gemini', 'Gemini fonctionne même sans clé Groq');
  assert(geminiOnly.usedFallback === false, 'Gemini seul n’est pas marqué comme échec fournisseur');

  delete process.env.GEMINI_API_KEY;
  let missingProviderError;
  try {
    await createAICompletion([{ role: 'user', content: 'Question' }]);
  } catch (error) {
    missingProviderError = error;
  }
  assert(missingProviderError?.code === 'all_providers_unavailable', 'L’absence de clés produit une erreur stable');

  console.log(`\n${passed} passed, ${failed} failed\n`);
  restoreEnvironment();
  process.exitCode = failed > 0 ? 1 : 0;
}

run().catch(error => {
  restoreEnvironment();
  console.error(error);
  process.exitCode = 1;
});

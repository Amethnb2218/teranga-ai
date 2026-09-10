const { createChatCompletion } = require('./groq-service');
const { createGeminiCompletion } = require('./gemini-service');

function sanitizedDiagnostic(provider, error) {
  return {
    provider,
    code: error.code || 'unknown_error',
    category: error.category || 'unknown',
    status: error.status || 500
  };
}

async function createAICompletion(messages, options = {}) {
  const failures = [];

  if (process.env.GEMINI_API_KEY) {
    try {
      const result = await createGeminiCompletion(messages, options);
      return { ...result, provider: 'gemini' };
    } catch (error) {
      failures.push(sanitizedDiagnostic('gemini', error));
    }
  }

  if (process.env.GROQ_API_KEY) {
    try {
      const result = await createChatCompletion(messages, options);
      return {
        ...result,
        provider: 'groq',
        usedFallback: failures.length > 0 || result.usedFallback,
        providerFailures: failures
      };
    } catch (error) {
      failures.push(sanitizedDiagnostic('groq', error));
    }
  }

  const error = new Error('Aucun fournisseur IA disponible');
  error.status = 503;
  error.code = 'all_providers_unavailable';
  error.category = 'provider';
  error.diagnostics = failures;
  throw error;
}

module.exports = { createAICompletion };

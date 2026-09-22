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

// Groq (LPU) repond en 1-3 s avec un modele 120B -> primaire par defaut :
// rapide ET intelligent. Gemini 3.x flash est un modele "thinking" (lent, budget
// de sortie consomme par le raisonnement) -> garde en secours quand Groq est
// indisponible ou a atteint son quota journalier.
// AI_PRIMARY=gemini permet d'inverser l'ordre sans toucher au code.
function getProviderOrder() {
  const providers = [
    { name: 'gemini', enabled: !!process.env.GEMINI_API_KEY, run: createGeminiCompletion },
    { name: 'groq', enabled: !!process.env.GROQ_API_KEY, run: createChatCompletion }
  ];
  const primary = (process.env.AI_PRIMARY || 'groq').toLowerCase();
  providers.sort((a, b) => (a.name === primary ? -1 : b.name === primary ? 1 : 0));
  return providers.filter(p => p.enabled);
}

async function createAICompletion(messages, options = {}) {
  const failures = [];
  const order = getProviderOrder();

  for (const provider of order) {
    try {
      const result = await provider.run(messages, options);
      return {
        ...result,
        provider: provider.name,
        usedFallback: failures.length > 0 || result.usedFallback,
        providerFailures: failures
      };
    } catch (error) {
      failures.push(sanitizedDiagnostic(provider.name, error));
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

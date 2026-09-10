const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-120b';
const DEFAULT_FALLBACK_MODEL = 'openai/gpt-oss-20b';
const DEFAULT_TIMEOUT_MS = 20000;

let state = {
  status: 'configured_unverified',
  activeModel: null,
  lastCheckedAt: null
};

function getGroqConfig() {
  return {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || DEFAULT_MODEL,
    fallbackModel: process.env.GROQ_FALLBACK_MODEL || DEFAULT_FALLBACK_MODEL,
    timeoutMs: Number(process.env.GROQ_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS
  };
}

function createGroqError(message, { status = 502, code = 'groq_unavailable', category = 'provider' } = {}) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.category = category;
  return error;
}

function shouldTryFallback(error) {
  return error.status === 404 || ['model_not_found', 'model_decommissioned', 'model_unavailable'].includes(error.code);
}

async function requestModel(model, messages, options, config) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages,
        max_tokens: options.maxTokens || 1500,
        temperature: options.temperature ?? 0.7
      })
    });

    const rawBody = await response.text();
    let data = {};
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      throw createGroqError('Réponse Groq invalide', { status: 502, code: 'invalid_response' });
    }

    if (!response.ok) {
      const providerCode = data?.error?.code;
      const category = response.status === 401 || response.status === 403 ? 'authentication'
        : response.status === 429 ? 'rate_limit'
          : 'provider';
      throw createGroqError('Appel Groq impossible', {
        status: response.status,
        code: providerCode || `http_${response.status}`,
        category
      });
    }

    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw createGroqError('Réponse Groq vide', { status: 502, code: 'empty_response' });
    }

    return content;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw createGroqError('Délai Groq dépassé', { status: 504, code: 'timeout', category: 'network' });
    }
    if (error.code) throw error;
    throw createGroqError('Connexion Groq impossible', { status: 503, code: 'network_error', category: 'network' });
  } finally {
    clearTimeout(timer);
  }
}

async function createChatCompletion(messages, options = {}) {
  const config = getGroqConfig();
  if (!config.apiKey) {
    state = { status: 'not_configured', activeModel: null, lastCheckedAt: new Date().toISOString() };
    throw createGroqError('Groq non configuré', { status: 503, code: 'not_configured', category: 'configuration' });
  }

  const models = [config.model];
  if (config.fallbackModel && config.fallbackModel !== config.model) models.push(config.fallbackModel);
  let primaryError;

  for (let index = 0; index < models.length; index++) {
    const model = models[index];
    try {
      const content = await requestModel(model, messages, options, config);
      state = {
        status: index === 0 ? 'available' : 'degraded',
        activeModel: model,
        lastCheckedAt: new Date().toISOString()
      };
      return { content, model, usedFallback: index > 0 };
    } catch (error) {
      primaryError ||= error;
      if (index === 0 && models.length > 1 && shouldTryFallback(error)) continue;
      state = { status: 'unavailable', activeModel: null, lastCheckedAt: new Date().toISOString() };
      throw error;
    }
  }

  state = { status: 'unavailable', activeModel: null, lastCheckedAt: new Date().toISOString() };
  throw primaryError;
}

function getGroqStatus() {
  const config = getGroqConfig();
  if (!config.apiKey) return { status: 'not_configured', configuredModel: config.model, activeModel: null, lastCheckedAt: state.lastCheckedAt };
  return { ...state, configuredModel: config.model };
}

module.exports = {
  createChatCompletion,
  getGroqConfig,
  getGroqStatus,
  DEFAULT_MODEL,
  DEFAULT_FALLBACK_MODEL
};

const DEFAULT_MODEL = 'gemini-3.6-flash';
const DEFAULT_TIMEOUT_MS = 20000;

let state = {
  status: 'configured_unverified',
  activeModel: null,
  lastCheckedAt: null
};

function getGeminiConfig() {
  return {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS
  };
}

function createGeminiError(message, { status = 502, code = 'gemini_unavailable', category = 'provider' } = {}) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.category = category;
  return error;
}

function toGeminiRequest(messages) {
  const systemMessages = messages.filter(message => message.role === 'system');
  const conversation = messages.filter(message => message.role !== 'system');
  const contents = conversation.map(message => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(message.content || '') }]
  }));

  return {
    ...(systemMessages.length ? {
      systemInstruction: {
        parts: [{ text: systemMessages.map(message => message.content).join('\n\n') }]
      }
    } : {}),
    contents,
  };
}

async function createGeminiCompletion(messages, options = {}) {
  const config = getGeminiConfig();
  if (!config.apiKey) {
    state = { status: 'not_configured', activeModel: null, lastCheckedAt: new Date().toISOString() };
    throw createGeminiError('Gemini non configuré', {
      status: 503,
      code: 'not_configured',
      category: 'configuration'
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.apiKey
      },
      signal: controller.signal,
      body: JSON.stringify({
        ...toGeminiRequest(messages),
        generationConfig: {
          maxOutputTokens: options.maxTokens || 1500,
          temperature: options.temperature ?? 0.7
        }
      })
    });

    const rawBody = await response.text();
    let data = {};
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      throw createGeminiError('Réponse Gemini invalide', { code: 'invalid_response' });
    }

    if (!response.ok) {
      const category = response.status === 401 || response.status === 403 ? 'authentication'
        : response.status === 429 ? 'rate_limit'
          : 'provider';
      console.error(`Gemini API ${response.status} (${config.model}):`, data?.error?.message || rawBody?.slice(0, 200));
      throw createGeminiError('Appel Gemini impossible', {
        status: response.status,
        code: data?.error?.status?.toLowerCase() || `http_${response.status}`,
        category
      });
    }

    const content = data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || '')
      .join('')
      .trim();
    if (!content) {
      throw createGeminiError('Réponse Gemini vide', { code: 'empty_response' });
    }

    state = {
      status: 'available',
      activeModel: config.model,
      lastCheckedAt: new Date().toISOString()
    };
    return { content, model: config.model, usedFallback: false };
  } catch (error) {
    state = { status: 'unavailable', activeModel: null, lastCheckedAt: new Date().toISOString() };
    if (error.name === 'AbortError') {
      throw createGeminiError('Délai Gemini dépassé', {
        status: 504,
        code: 'timeout',
        category: 'network'
      });
    }
    if (error.code) throw error;
    throw createGeminiError('Connexion Gemini impossible', {
      status: 503,
      code: 'network_error',
      category: 'network'
    });
  } finally {
    clearTimeout(timer);
  }
}

function getGeminiStatus() {
  const config = getGeminiConfig();
  if (!config.apiKey) {
    return {
      status: 'not_configured',
      configuredModel: config.model,
      activeModel: null,
      lastCheckedAt: state.lastCheckedAt
    };
  }
  return { ...state, configuredModel: config.model };
}

module.exports = {
  createGeminiCompletion,
  getGeminiConfig,
  getGeminiStatus,
  DEFAULT_MODEL
};

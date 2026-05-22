const { getSystemPrompt } = require('../config/prompts');
const { OFFLINE_RESPONSES } = require('../data/offline-responses');

function matchOfflineResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim();

  if (msg.match(/^(bonjour|salut|bonsoir|hello|hi|hey|salam|na nga def|assalamou|waw)/)) return OFFLINE_RESPONSES.bonjour;
  if (msg.includes('arachide') || msg.includes('gerte')) return OFFLINE_RESPONSES.arachide;
  if (msg.includes('tomate') || msg.includes('tamaat')) return OFFLINE_RESPONSES.tomate;
  if (msg.includes('mil') || msg.includes('souna') || msg.includes('dugar')) return OFFLINE_RESPONSES.mil;
  if (msg.includes('irrig') || msg.includes('eau') || msg.includes('ndox') || msg.includes('arros')) return OFFLINE_RESPONSES.irrigation;
  if (msg.includes('oignon')) return OFFLINE_RESPONSES.oignon;
  if (msg.includes('maladie') || msg.includes('insecte') || msg.includes('puceron') || msg.includes('parasite')) return OFFLINE_RESPONSES.maladies;
  if (msg.includes('prix') || msg.includes('marché') || msg.includes('vendre')) return OFFLINE_RESPONSES.marche;
  if (msg.includes('riz') || msg.includes('malo')) return OFFLINE_RESPONSES.riz;
  if (msg.includes('mais') || msg.includes('maïs') || msg.includes('mbay')) return OFFLINE_RESPONSES.mais;
  if (msg.includes('niébé') || msg.includes('niebe') || msg.includes('nebe')) return OFFLINE_RESPONSES.niebe;
  if (msg.includes('semer') || msg.includes('semis') || msg.includes('quand planter') || msg.includes('calendrier')) return OFFLINE_RESPONSES.calendrier;
  if (msg.includes('engrais') || msg.includes('fertilis') || msg.includes('npk') || msg.includes('urée') || msg.includes('uree')) return OFFLINE_RESPONSES.engrais;
  if (msg.includes('sol') || msg.includes('terre') || msg.includes('dior') || msg.includes('deck')) return OFFLINE_RESPONSES.sols;
  if (msg.includes('crédit') || msg.includes('credit') || msg.includes('financement') || msg.includes('prêt') || msg.includes('pret')) return OFFLINE_RESPONSES.financement;
  if (msg.includes('climat') || msg.includes('sécheresse') || msg.includes('pluie') || msg.includes('hivernage')) return OFFLINE_RESPONSES.climat;
  if (msg.includes('saison') || msg.includes('maintenant') || msg.includes('faire') || msg.includes('quoi')) return OFFLINE_RESPONSES.saison;

  return OFFLINE_RESPONSES.default;
}

async function callGroqAPI(messages, language) {
  const systemMessage = {
    role: 'system',
    content: getSystemPrompt(language)
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [systemMessage, ...messages],
      max_tokens: 1000,
      temperature: 0.7
    })
  });

  if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

async function getAIResponse(messages, language) {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

  if (process.env.GROQ_API_KEY) {
    try {
      return await callGroqAPI(messages, language);
    } catch (error) {
      console.error('Groq API error, falling back to offline:', error.message);
    }
  }

  return matchOfflineResponse(lastUserMessage);
}

module.exports = { getAIResponse };

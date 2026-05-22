const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

let openai = null;
function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

const SYSTEM_PROMPT = `Tu es Teranga AI, un assistant agronomique expert spécialisé dans l'agriculture en Afrique de l'Ouest, particulièrement au Sénégal.

Tu aides les petits exploitants agricoles avec :
- Des conseils de plantation (calendrier cultural adapté aux zones sahéliennes et soudaniennes)
- La gestion de l'eau et de l'irrigation
- L'identification et le traitement des maladies des cultures
- Les meilleures pratiques pour les cultures locales : mil, arachide, riz, maïs, niébé, manioc, tomate, oignon
- Les conseils adaptés aux saisons (hivernage de juin à octobre, saison sèche de novembre à mai)
- L'adaptation au changement climatique

Règles :
- Réponds de manière simple et pratique, adaptée à des agriculteurs
- Utilise le système métrique
- Tiens compte du contexte climatique sahélien/soudanien
- Si l'utilisateur parle en wolof, réponds en wolof
- Si la question n'est pas liée à l'agriculture, redirige poliment vers ton domaine d'expertise
- Donne des conseils actionnables et concrets
- Mentionne les variétés locales quand c'est pertinent (ISRA, etc.)

Contexte climatique Sénégal :
- Zone sahélienne (nord) : 200-500mm pluie/an
- Zone soudanienne (centre-sud) : 500-1200mm pluie/an
- Zone casamançaise (sud) : 1200-1500mm pluie/an
- Température moyenne : 25-35°C
- Saison des pluies (hivernage) : juin-octobre`;

router.post('/', async (req, res) => {
  try {
    const { messages, language = 'fr' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    const systemMessage = {
      role: 'system',
      content: language === 'wo'
        ? SYSTEM_PROMPT + '\n\nIMPORTANT: Réponds en wolof sénégalais.'
        : SYSTEM_PROMPT
    };

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      max_tokens: 1000,
      temperature: 0.7,
    });

    res.json({
      message: completion.choices[0].message.content,
      usage: completion.usage
    });
  } catch (error) {
    console.error('Chat error:', error.message);

    if (error.message.includes('API key')) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'API key not configured. Please set OPENAI_API_KEY.'
      });
    }

    res.status(500).json({
      error: 'Service temporarily unavailable',
      message: 'Veuillez réessayer dans quelques instants.'
    });
  }
});

module.exports = router;

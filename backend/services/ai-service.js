const { getSystemPrompt } = require('../config/prompts');
const { OFFLINE_RESPONSES } = require('../data/offline-responses');
const { translateForChat, translateText, isTranslationAvailable } = require('./translate-service');

async function translateUserInput(text, language) {
  if (language === 'fr' || language === 'en') return text;
  if (!process.env.GROQ_API_KEY) return text;

  const langName = { wo: 'wolof', pu: 'pulaar', sr: 'sérère', di: 'diola', mn: 'mandinka', sn: 'soninké', ar: 'arabe' }[language] || 'wolof';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: `Traduis ce texte du ${langName} vers le français. Donne UNIQUEMENT la traduction, rien d'autre. Si tu ne comprends pas, essaie de deviner le sens. Texte : "${text}"` }],
        max_tokens: 500,
        temperature: 0.2
      })
    });
    if (!response.ok) return text;
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || text;
  } catch (e) {
    return text;
  }
}

const ZONE_DATA = {
  dakar: { zone: 'Niayes', cultures: 'tomate, oignon, chou, piment, salade', sol: 'sablonneux riche (Niayes)', pluviometrie: '400mm', irrigation: 'nappe phréatique accessible', conseil: 'Zone maraîchère par excellence. Culture toute l\'année avec irrigation. Privilégiez les légumes à haute valeur (tomate, oignon, piment).' },
  thies: { zone: 'Bassin arachidier / Niayes', cultures: 'arachide, mil, pastèque, manioc', sol: 'Dior (sablonneux)', pluviometrie: '500mm', conseil: 'Bonne zone pour arachide variété 55-437 (cycle court). Association mil+niébé recommandée.' },
  kaolack: { zone: 'Bassin arachidier (cœur)', cultures: 'arachide, mil, niébé, maïs', sol: 'Dior/Deck', pluviometrie: '700mm', conseil: 'Capitale de l\'arachide. Variétés 55-437 et 73-33 très adaptées. Rotation arachide→mil essentielle.' },
  fatick: { zone: 'Sine Saloum', cultures: 'arachide, mil, riz pluvial, sel', sol: 'Deck (argilo-sableux)', pluviometrie: '650mm', conseil: 'Zone mixte agriculture/pêche. Riz dans les bas-fonds, arachide sur les plateaux.' },
  diourbel: { zone: 'Bassin arachidier', cultures: 'arachide, mil, niébé, pastèque', sol: 'Dior', pluviometrie: '550mm', conseil: 'Zone importante pour l\'arachide. Sol léger, privilégiez fumure organique (5-10t/ha).' },
  kaffrine: { zone: 'Bassin arachidier sud', cultures: 'arachide, mil, maïs, sésame, niébé', sol: 'Deck', pluviometrie: '750mm', conseil: 'Bonne pluviométrie pour maïs et arachide de bouche (73-33). Zone en expansion.' },
  touba: { zone: 'Bassin arachidier', cultures: 'arachide, mil, niébé', sol: 'Dior', pluviometrie: '500mm', conseil: 'Zone arachidière classique. Variétés à cycle court (55-437, IBV 8004) recommandées.' },
  nioro_du_rip: { zone: 'Sine Saloum sud', cultures: 'arachide, mil, maïs, coton, sésame', sol: 'Deck fertile', pluviometrie: '800mm', conseil: 'Une des zones les plus productives. Excellent pour maïs SWAN et arachide 73-33.' },
  saint_louis: { zone: 'Fleuve', cultures: 'riz irrigué, tomate industrielle, oignon', sol: 'Hollaldé (argileux)', pluviometrie: '300mm mais irrigué', irrigation: 'Fleuve Sénégal', conseil: 'Riz irrigué 2 campagnes/an (Sahel 108, Sahel 202). Rendements 6-8t/ha possibles.' },
  richard_toll: { zone: 'Fleuve (delta)', cultures: 'riz irrigué, canne à sucre, tomate', sol: 'Hollaldé', pluviometrie: '250mm mais irrigué', irrigation: 'Lac de Guiers + Fleuve', conseil: 'Zone industrielle du riz (CSS). 2 campagnes/an, rendements records 8-9t/ha avec Sahel 202.' },
  podor: { zone: 'Fleuve (moyenne vallée)', cultures: 'riz irrigué, mil, gomme arabique', sol: 'Hollaldé / Fondé', pluviometrie: '250mm', irrigation: 'Fleuve Sénégal', conseil: 'Riz irrigué en décrue et en hivernage. Zone de walo (culture de décrue) traditionnelle.' },
  matam: { zone: 'Fleuve (haute vallée)', cultures: 'riz irrigué, mil, sorgho, maraîchage', sol: 'Hollaldé / Diéri', pluviometrie: '400mm', conseil: 'Riz en walo (inondation), mil et sorgho sur le diéri. Très chaud — variétés résistantes chaleur obligatoires.' },
  louga: { zone: 'Sylvo-pastorale', cultures: 'mil, niébé, arachide (cycle court), élevage', sol: 'Dior léger', pluviometrie: '350mm', conseil: 'Zone sèche. Mil IBV 8004 (75j) et niébé Melakh (60j) indispensables. Élevage dominant.' },
  linguere: { zone: 'Ferlo', cultures: 'mil, niébé, élevage extensif', sol: 'Sablonneux/ferrugineux', pluviometrie: '300mm', conseil: 'Zone pastorale. Agriculture limitée aux variétés très précoces. Priorité à l\'élevage bovin.' },
  tambacounda: { zone: 'Sénégal oriental', cultures: 'maïs, arachide, coton, sorgho, sésame', sol: 'Ferrugineux / Deck', pluviometrie: '800mm', conseil: 'Bonne pluviométrie. Zone de diversification (coton, sésame, anacarde). Maïs SWAN excellent.' },
  bakel: { zone: 'Sénégal oriental (est)', cultures: 'mil, sorgho, maïs, arachide, maraîchage irrigué', sol: 'Ferrugineux', pluviometrie: '600mm', irrigation: 'Fleuve Sénégal + Falémé', conseil: 'Zone très chaude. Cultures pluviales (mil, sorgho) + maraîchage irrigué en bord de fleuve. Températures extrêmes — variétés résistantes chaleur.' },
  kedougou: { zone: 'Sénégal oriental sud', cultures: 'maïs, riz pluvial, fonio, arachide, anacarde', sol: 'Ferrugineux profond', pluviometrie: '1100mm', conseil: 'Plus forte pluviométrie après Casamance. Idéale pour riz pluvial NERICA, fonio, et vergers (mangue, anacarde).' },
  ziguinchor: { zone: 'Basse Casamance', cultures: 'riz pluvial, maïs, arachide, huile de palme, anacarde', sol: 'Ferralitique / mangrove', pluviometrie: '1300mm', conseil: 'Grenier à riz du Sénégal. NERICA 4 et WAR 77 très productifs. Potentiel arboriculture (anacarde, mangue, agrumes).' },
  bignona: { zone: 'Basse Casamance', cultures: 'riz pluvial, arachide, palmier à huile, agrumes', sol: 'Ferralitique', pluviometrie: '1200mm', conseil: 'Excellente zone rizicole. Tradition de riz de bas-fond. Bonne diversification avec agrumes et palmier.' },
  oussouye: { zone: 'Basse Casamance (sud)', cultures: 'riz pluvial, vin de palme, huile de palme, agrumes', sol: 'Ferralitique / mangrove', pluviometrie: '1400mm', conseil: 'Plus forte pluviométrie du Sénégal. Riz en rizière + exploitation du palmier (vin, huile). Potentiel immense en arboriculture.' },
  kolda: { zone: 'Haute Casamance', cultures: 'arachide, maïs, riz, mil, coton', sol: 'Ferrugineux / Deck', pluviometrie: '1000mm', conseil: 'Zone polyvalente. Arachide de bouche (GC 8-35), maïs JDB, et riz pluvial. Bonne productivité.' },
  sedhiou: { zone: 'Moyenne Casamance', cultures: 'arachide, riz, anacarde, maïs', sol: 'Ferralitique', pluviometrie: '1100mm', conseil: 'Zone émergente pour l\'anacarde (noix de cajou). Riz de bas-fond très productif. Arachide GC 8-35.' },
  velingara: { zone: 'Haute Casamance (est)', cultures: 'arachide, maïs, coton, mil, sorgho', sol: 'Ferrugineux', pluviometrie: '900mm', conseil: 'Zone de transition. Bon pour coton, arachide, et maïs. Élevage important (zone Peul).' },
  mbour: { zone: 'Petite Côte / Niayes', cultures: 'maraîchage (tomate, oignon, chou), pêche', sol: 'Sablonneux Niayes', pluviometrie: '450mm', irrigation: 'Nappe phréatique', conseil: 'Zone maraîchère et touristique. Cultures irriguées toute l\'année. Bon marché local (tourisme).' }
};

function matchOfflineResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim();

  if (msg.match(/^(bonjour|salut|bonsoir|hello|hi|hey|salam|na nga def|assalamou|waw|nanga def)/)) return OFFLINE_RESPONSES.bonjour;

  // Location-specific questions
  const locationMatch = msg.match(/(?:à|a|de|vers|dans|zone|region|région)\s+(dakar|thies|thiès|kaolack|saint.?louis|tambacounda|tamba|ziguinchor|zigui|kolda|fatick|louga|matam|bakel|kedougou|kédougou|sédhiou|sedhiou|diourbel|kaffrine|touba|richard.?toll|podor|velingara|vélingara|bignona|oussouye|mbour|nioro|linguère|linguere)/i);
  const cityInMessage = msg.match(/\b(dakar|thies|thiès|kaolack|saint.?louis|tambacounda|tamba|ziguinchor|zigui|kolda|fatick|louga|matam|bakel|kedougou|kédougou|sédhiou|sedhiou|diourbel|kaffrine|touba|richard.?toll|podor|velingara|vélingara|bignona|oussouye|mbour|nioro|linguère|linguere)\b/i);

  const cityName = (locationMatch?.[1] || cityInMessage?.[1] || '').toLowerCase()
    .replace('thiès', 'thies').replace('tamba', 'tambacounda').replace('zigui', 'ziguinchor')
    .replace('kédougou', 'kedougou').replace('sédhiou', 'sedhiou').replace('vélingara', 'velingara')
    .replace('linguère', 'linguere').replace(/saint.?louis/, 'saint_louis').replace(/richard.?toll/, 'richard_toll')
    .replace('nioro', 'nioro_du_rip');

  if (cityName && ZONE_DATA[cityName]) {
    const z = ZONE_DATA[cityName];
    const isQuoiCultiver = msg.includes('culti') || msg.includes('semer') || msg.includes('planter') || msg.includes('quoi') || msg.includes('que') || msg.includes('faire') || msg.includes('conseil');
    if (isQuoiCultiver || msg.includes('zone') || msg.includes('region') || msg.includes('région')) {
      return `**Conseils agricoles pour ${cityName.charAt(0).toUpperCase() + cityName.slice(1).replace('_', ' ')}** (zone ${z.zone})\n\n**Cultures adaptées :** ${z.cultures}\n**Sol :** ${z.sol}\n**Pluviométrie :** ${z.pluviometrie}/an\n${z.irrigation ? `**Irrigation :** ${z.irrigation}\n` : ''}\n**Conseil :** ${z.conseil}\n\n**Actions maintenant (pré-hivernage) :**\n- Préparer vos parcelles (labour 15-20cm)\n- Acheter semences certifiées ISRA\n- Retirer engrais subventionnés au point de vente agréé`;
    }
  }

  if (msg.includes('arachide') || msg.includes('gerte')) return OFFLINE_RESPONSES.arachide;
  if (msg.includes('tomate') || msg.includes('tamaat')) return OFFLINE_RESPONSES.tomate;
  if ((msg.includes('mil') && !msg.includes('mill') && !msg.includes('mila')) || msg.includes('souna') || msg.includes('dugar')) return OFFLINE_RESPONSES.mil;
  if (msg.includes('irrig') || msg.includes('arros') || (msg.includes('eau') && (msg.includes('besoin') || msg.includes('combien') || msg.includes('goutte')))) return OFFLINE_RESPONSES.irrigation;
  if (msg.includes('oignon')) return OFFLINE_RESPONSES.oignon;
  if (msg.includes('maladie') || msg.includes('insecte') || msg.includes('puceron') || msg.includes('parasite') || msg.includes('chenille') || msg.includes('ravageur')) return OFFLINE_RESPONSES.maladies;
  if (msg.includes('prix') || msg.includes('marché') || msg.includes('vendre') || msg.includes('marche')) return OFFLINE_RESPONSES.marche;
  if (msg.includes('riz') || msg.includes('malo')) return OFFLINE_RESPONSES.riz;
  if (msg.includes('mais') || msg.includes('maïs') || msg.includes('mbay')) return OFFLINE_RESPONSES.mais;
  if (msg.includes('niébé') || msg.includes('niebe') || msg.includes('nebe')) return OFFLINE_RESPONSES.niebe;
  if (msg.includes('semer') || msg.includes('semis') || msg.includes('quand planter') || msg.includes('calendrier')) return OFFLINE_RESPONSES.calendrier;
  if (msg.includes('engrais') || msg.includes('fertilis') || msg.includes('npk') || msg.includes('urée') || msg.includes('uree') || msg.includes('fumier') || msg.includes('compost')) return OFFLINE_RESPONSES.engrais;
  if (msg.includes('sol') || msg.includes('terre') || msg.includes('dior') || msg.includes('deck') || msg.includes('hollal')) return OFFLINE_RESPONSES.sols;
  if (msg.includes('crédit') || msg.includes('credit') || msg.includes('financement') || msg.includes('prêt') || msg.includes('pret') || msg.includes('banque') || msg.includes('der')) return OFFLINE_RESPONSES.financement;
  if (msg.includes('climat') || msg.includes('sécheresse') || msg.includes('secheresse') || msg.includes('adaptation')) return OFFLINE_RESPONSES.climat;
  if (msg.includes('pluie') || msg.includes('hivernage') || msg.includes('saison') || msg.includes('maintenant') || msg.includes('quand')) return OFFLINE_RESPONSES.saison;
  if (msg.includes('oignon') || msg.includes('soupou')) return OFFLINE_RESPONSES.oignon;

  // Questions about what to grow (general)
  if (msg.includes('cultiver') || msg.includes('planter') || msg.includes('que faire') || msg.includes('quoi faire')) {
    return OFFLINE_RESPONSES.saison;
  }

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
      model: 'llama-3.3-70b-versatile',
      messages: [systemMessage, ...messages],
      max_tokens: 1500,
      temperature: 0.7
    })
  });

  if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

const LANGS_NEED_TRANSLATION = ['wo', 'pu', 'sr', 'di', 'mn', 'sn'];

async function getAIResponse(messages, language) {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

  let frenchResponse = '';

  // Translate user input to French if in local language
  let messagesForLLM = messages;
  if (LANGS_NEED_TRANSLATION.includes(language) && lastUserMessage) {
    const translatedInput = await translateUserInput(lastUserMessage, language);
    messagesForLLM = messages.map(m => {
      if (m.role === 'user' && m.content === lastUserMessage) {
        return { ...m, content: translatedInput };
      }
      return m;
    });
  }

  if (process.env.GROQ_API_KEY) {
    try {
      if (LANGS_NEED_TRANSLATION.includes(language)) {
        frenchResponse = await callGroqAPI(messagesForLLM, 'fr');
      } else {
        return await callGroqAPI(messagesForLLM, language);
      }
    } catch (error) {
      console.error('Groq API error, falling back to offline:', error.message);
    }
  }

  if (!frenchResponse) {
    frenchResponse = matchOfflineResponse(lastUserMessage);
  }

  if (language === 'fr') return frenchResponse;

  if (LANGS_NEED_TRANSLATION.includes(language)) {
    if (isTranslationAvailable()) {
      try {
        const translated = await translateForChat(frenchResponse, language);
        if (translated && translated !== frenchResponse) {
          return translated;
        }
      } catch (e) {
        console.error('NLLB translation failed:', e.message);
      }
    }

    if (process.env.GROQ_API_KEY) {
      try {
        const langName = { wo: 'wolof', pu: 'pulaar', sr: 'sérère', di: 'diola', mn: 'mandinka', sn: 'soninké' }[language];
        const translateMessages = [
          { role: 'user', content: `Traduis ce texte en ${langName}. Garde les noms propres, variétés, chiffres et sigles tels quels. Ne répète jamais de phrases. Sois naturel.\n\nTexte :\n${frenchResponse}` }
        ];
        return await callGroqAPI(translateMessages, 'fr');
      } catch (e) {
        console.error('Groq translation failed:', e.message);
      }
    }

    return frenchResponse;
  }

  if (language !== 'fr' && !LANGS_NEED_TRANSLATION.includes(language)) {
    if (process.env.GROQ_API_KEY) {
      try {
        return await callGroqAPI(messages, language);
      } catch (e) {
        console.error('Groq API error:', e.message);
      }
    }
  }

  return frenchResponse;
}

module.exports = { getAIResponse };

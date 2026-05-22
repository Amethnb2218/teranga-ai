const { getSystemPrompt } = require('../config/prompts');
const { OFFLINE_RESPONSES } = require('../data/offline-responses');
const { translateForChat, isTranslationAvailable } = require('./translate-service');

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
  bakel: { zone: 'Sénégal oriental (est)', cultures: 'mil, sorgho, maïs, arachide, maraîchage irrigué', sol: 'Ferrugineux', pluviometrie: '600mm', irrigation: 'Fleuve Sénégal + Falémé', conseil: 'Zone très chaude. Cultures pluviales (mil, sorgho) + maraîchage irrigué en bord de fleuve.' },
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

// Local language agricultural vocabulary → French equivalents
const LOCAL_VOCAB = {
  // Wolof
  'gerte': 'arachide', 'dugub': 'mil', 'maalo': 'riz', 'mboq': 'maïs',
  'niebe': 'niébé', 'sëbëtaan': 'oignon', 'tamaat': 'tomate', 'diw': 'huile',
  'waral': 'cultiver', 'mbey': 'agriculture', 'tool': 'champ', 'nawet': 'hivernage',
  'taw': 'pluie', 'noor': 'saison sèche', 'suuf': 'sol', 'lekk': 'nourriture',
  'ndox': 'eau', 'fetal': 'engrais', 'njëg': 'prix', 'jaay': 'vendre',
  'jënd': 'acheter', 'naka': 'comment', 'lañu': 'on/nous', 'kañ': 'quand',
  'fan': 'où', 'lu': 'quoi', 'nit': 'personne', 'wax': 'dire/parler',
  'souna': 'mil souna', 'dugar': 'mil dugar',
  // Pulaar
  'gerte': 'arachide', 'gawri': 'mil', 'maaro': 'riz', 'mbay': 'maïs',
  'nyiiri': 'nourriture', 'ndiyam': 'eau', 'leydi': 'terre', 'dunndu': 'hivernage',
  'ngesa': 'champ', 'hakkunde': 'entre', 'fof': 'tout', 'remooɓe': 'agriculteurs',
  // Sérère
  'noong': 'cultiver', 'xoox': 'patron/chef',
  // Common
  'nakamou': 'comment', 'yangui': 'faire', 'diam': 'bien/paix',
  'nanga': 'tu/vous', 'def': 'faire', 'am': 'avoir',
};

function translateWithVocab(text) {
  let result = text.toLowerCase();
  // Replace known local words with French equivalents
  for (const [local, french] of Object.entries(LOCAL_VOCAB)) {
    result = result.replace(new RegExp(`\\b${local}\\b`, 'gi'), french);
  }
  return result;
}

async function translateUserInput(text, language) {
  // First try vocabulary-based translation for keyword detection
  const vocabTranslation = translateWithVocab(text);

  // Use NLLB for translation (it actually knows Wolof)
  if (isTranslationAvailable()) {
    const { translateText } = require('./translate-service');
    try {
      const nllbResult = await Promise.race([
        translateText(text, language, 'fr'),
        new Promise(resolve => setTimeout(() => resolve(null), 5000))
      ]);
      if (nllbResult && nllbResult !== text) return nllbResult;
    } catch (e) {}
  }

  // Fallback: Groq with vocabulary hints
  if (!process.env.GROQ_API_KEY) return vocabTranslation;
  const langName = { wo: 'wolof', pu: 'pulaar', sr: 'sérère', di: 'diola', mn: 'mandinka', sn: 'soninké' }[language];
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: `Traduis ce texte du ${langName} vers le français. Vocabulaire agricole ${langName}: gerte=arachide, dugub=mil, maalo=riz, mboq=maïs, tool=champ, nawet=hivernage, taw=pluie, ndox=eau, fetal=engrais, njëg=prix, waral=cultiver, naka=comment, lañu=on/nous, kañ=quand, fan=où.\n\nDonne UNIQUEMENT la traduction française:\n"${text}"` }],
        max_tokens: 500, temperature: 0.2
      })
    });
    if (!response.ok) return vocabTranslation;
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || vocabTranslation;
  } catch (e) { return vocabTranslation; }
}

async function getAIResponse(messages, language) {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

  // For non-local languages (fr, en, ar): generate directly
  if (!LANGS_NEED_TRANSLATION.includes(language)) {
    if (process.env.GROQ_API_KEY) {
      try {
        return await callGroqAPI(messages, language);
      } catch (error) {
        console.error('Groq API error:', error.message);
      }
    }
    return matchOfflineResponse(lastUserMessage);
  }

  // For local African languages:
  // Step 1: Translate user input to French so LLM understands
  let messagesForLLM = messages;
  if (lastUserMessage) {
    const translatedInput = await translateUserInput(lastUserMessage, language);
    messagesForLLM = messages.map(m => {
      if (m.role === 'user' && m.content === lastUserMessage) {
        return { ...m, content: translatedInput };
      }
      return m;
    });
  }

  // Step 2: Get French response from LLM
  let frenchResponse = '';
  if (process.env.GROQ_API_KEY) {
    try {
      frenchResponse = await callGroqAPI(messagesForLLM, 'fr');
    } catch (error) {
      console.error('Groq API error:', error.message);
    }
  }
  if (!frenchResponse) {
    frenchResponse = matchOfflineResponse(lastUserMessage);
  }

  // Try NLLB translation (keep-alive pings every 10min so it should be warm)
  if (isTranslationAvailable()) {
    try {
      const nllbResult = await Promise.race([
        translateForChat(frenchResponse, language),
        new Promise(resolve => setTimeout(() => resolve(null), 10000))
      ]);
      if (nllbResult && nllbResult !== frenchResponse) {
        return nllbResult;
      }
    } catch (e) {
      console.log('NLLB translation failed:', e.message);
    }
  }

  // Fallback: Ask Groq to rewrite in bilingual local+French style
  if (process.env.GROQ_API_KEY) {
    try {
      const langConfig = {
        wo: { name: 'wolof', greeting: 'Jërejëf ci sa laaj.', style: 'wolof-français comme on parle au Sénégal' },
        pu: { name: 'pulaar', greeting: 'A jaaraama.', style: 'pulaar-français comme on parle en Afrique de l\'Ouest' },
        sr: { name: 'sérère', greeting: 'Mbind a fiid.', style: 'sérère-français' },
        di: { name: 'diola', greeting: 'Kasumay.', style: 'diola-français' },
        mn: { name: 'mandinka', greeting: 'I ni ce.', style: 'mandinka-français' },
        sn: { name: 'soninké', greeting: 'An maarandi.', style: 'soninké-français' }
      };
      const cfg = langConfig[language] || langConfig.wo;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'user',
            content: `Réécris ce conseil agricole en style ${cfg.style}. Commence par "${cfg.greeting}" puis donne le contenu technique en français simple et clair. Les termes agricoles, chiffres, noms de variétés restent en français. Le but est que ce soit COMPRÉHENSIBLE et UTILE pour un agriculteur ${cfg.name}phone. Ne génère PAS de ${cfg.name} inventé. Si tu ne connais pas le mot en ${cfg.name}, laisse-le en français.\n\nTexte à réécrire :\n${frenchResponse}`
          }],
          max_tokens: 2000,
          temperature: 0.3
        })
      });

      if (response.ok) {
        const data = await response.json();
        const translated = data.choices?.[0]?.message?.content?.trim();
        if (translated && translated.length > 10 && translated !== frenchResponse) {
          return translated;
        }
      }
    } catch (e) {
      console.log('Groq bilingual fallback failed:', e.message);
    }
  }

  // Last resort: return French
  return frenchResponse;
}

module.exports = { getAIResponse };

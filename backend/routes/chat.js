const express = require('express');
const router = express.Router();

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
- Donne des conseils actionnables et concrets
- Mentionne les variétés locales quand c'est pertinent (ISRA, etc.)

Contexte climatique Sénégal :
- Zone sahélienne (nord) : 200-500mm pluie/an
- Zone soudanienne (centre-sud) : 500-1200mm pluie/an
- Zone casamançaise (sud) : 1200-1500mm pluie/an
- Température moyenne : 25-35°C
- Saison des pluies (hivernage) : juin-octobre`;

const OFFLINE_RESPONSES = {
  arachide: `**Conseils pour la culture de l'arachide au Sénégal** 🥜

**Période de semis :** Dès les premières pluies utiles (mi-juin à mi-juillet selon votre zone)

**Préparation du sol :**
- Labour à 15-20 cm de profondeur
- Apport de phosphate (100 kg/ha de superphosphate simple)

**Variétés recommandées (ISRA) :**
- 55-437 (cycle court, 90 jours) — zone sahélienne
- 73-33 (cycle moyen, 105 jours) — zone soudanienne
- GH 119-20 (huilerie) — Casamance

**Densité de semis :** 50 cm entre lignes, 15 cm entre poquets

**Entretien :**
- 1er sarclage à 15 jours après levée
- 2ème sarclage + buttage à 30-35 jours
- Ne pas toucher les plantes après floraison (45 jours)

**Récolte :** Quand les feuilles jaunissent et que l'intérieur des coques est foncé (90-120 jours selon variété)`,

  tomate: `**Conseils pour la culture de la tomate au Sénégal** 🍅

**Meilleure période :** Saison sèche (novembre à mai) en culture irriguée

**Variétés adaptées :**
- Xina (résistante, bon rendement)
- Roma VF (transformation)
- Mongal F1 (marché frais)

**Pépinière :**
- Semis en pépinière pendant 3-4 semaines
- Repiquage quand les plants ont 4-5 feuilles

**Irrigation :**
- Goutte-à-goutte recommandé (économie d'eau de 40%)
- Arrosage régulier mais éviter l'excès (favorise les maladies)

**Problèmes courants :**
- **Pucerons :** Traitement au savon noir (50g/L) ou neem
- **Mildiou :** Bouillie bordelaise préventive
- **Nématodes :** Rotation avec céréales, solarisation du sol

**Espacement :** 80 cm entre lignes, 40 cm entre plants
**Rendement potentiel :** 20-40 tonnes/ha en irrigué`,

  mil: `**Conseils pour la culture du mil au Sénégal** 🌾

**Le mil (souna) est la céréale n°1 du Sénégal.**

**Période de semis :** Dès la 1ère pluie utile de 20mm (juin-juillet)

**Variétés ISRA recommandées :**
- Souna 3 (90 jours, zone sahélienne, tolérante sécheresse)
- IBV 8004 (75 jours, très précoce)
- ISMI 9507 (bon rendement, résistant mildiou)

**Préparation :**
- Semis direct en poquets (5-7 graines/poquet)
- Espacement : 90 cm × 90 cm
- Démariage à 3 plants/poquet après 15 jours

**Fertilisation :**
- 150 kg/ha NPK (15-15-15) au semis
- 50 kg/ha urée au tallage (30 jours)

**Protection :**
- Contre les foreurs de tige : traitement précoce
- Contre les oiseaux (phase maturation) : gardiennage

**Rotation conseillée :** Mil → Arachide → Mil (restaure l'azote)
**Rendement moyen :** 800-1200 kg/ha (peut atteindre 2000 avec bonnes pratiques)`,

  irrigation: `**Guide d'irrigation pour la saison sèche au Sénégal** 💧

**Systèmes adaptés aux petits exploitants :**

1. **Goutte-à-goutte simplifié**
   - Kit de 500m² : ~150 000 FCFA
   - Économie d'eau : 40-60%
   - Idéal pour : tomate, oignon, piment

2. **Irrigation par bassins**
   - Coût faible
   - Adapté au riz de contre-saison
   - Zones : Fleuve Sénégal, Casamance

3. **Pompage solaire**
   - Investissement initial mais coût zéro en énergie
   - Programmes PAPSEN/PAIS pour subventions

**Besoins en eau des cultures (L/m²/jour) :**
- Tomate : 5-7 L
- Oignon : 4-6 L
- Chou : 4-5 L
- Piment : 3-5 L

**Conseils pratiques :**
- Arroser tôt le matin ou en fin d'après-midi
- Pailler autour des plants (réduit évaporation de 30%)
- Vérifier l'humidité du sol à 10cm avant d'arroser
- Eau de puits : vérifier la salinité en zone côtière`,

  default: `**Merci pour votre question !** 🌱

Je suis Teranga AI, votre assistant agricole. Voici ce que je peux vous aider à faire :

**Cultures principales du Sénégal :**
- 🥜 Arachide — 1ère culture de rente
- 🌾 Mil/Sorgho — base alimentaire
- 🍅 Maraîchage — tomate, oignon, chou
- 🌿 Riz — vallée du fleuve et Casamance

**Calendrier cultural simplifié :**
| Période | Activité |
|---------|----------|
| Mars-Mai | Préparation parcelles, maraîchage irrigué |
| Juin-Juillet | Semis (mil, arachide, maïs) |
| Août-Sept | Entretien, sarclage, fertilisation |
| Oct-Nov | Récoltes |
| Nov-Fév | Cultures de contre-saison irriguées |

**Posez-moi une question précise** sur :
- Une culture spécifique (ex: "comment cultiver l'arachide ?")
- Un problème (ex: "pucerons sur mes tomates")
- La météo ou les prix du marché

Je suis là pour vous aider à améliorer vos rendements ! 💪`
};

function getOfflineResponse(userMessage) {
  const msg = userMessage.toLowerCase();

  if (msg.includes('arachide') || msg.includes('gerte')) return OFFLINE_RESPONSES.arachide;
  if (msg.includes('tomate') || msg.includes('tamaat')) return OFFLINE_RESPONSES.tomate;
  if (msg.includes('mil') || msg.includes('souna') || msg.includes('dugar')) return OFFLINE_RESPONSES.mil;
  if (msg.includes('irrig') || msg.includes('eau') || msg.includes('ndox') || msg.includes('arros')) return OFFLINE_RESPONSES.irrigation;
  if (msg.includes('oignon')) return `**Culture de l'oignon au Sénégal** 🧅\n\n**Variété star :** Violet de Galmi\n**Zones :** Niayes, Fleuve, Louga\n**Période :** Pépinière en octobre, repiquage novembre-décembre\n**Récolte :** Mars-Avril\n**Rendement :** 20-30 t/ha\n\n**Conseils :**\n- Espacement 20×10 cm\n- Irrigation régulière mais stop 2 semaines avant récolte\n- Séchage 1 semaine au champ après arrachage\n- Stockage en claies ventilées`;
  if (msg.includes('maladie') || msg.includes('insecte') || msg.includes('puceron') || msg.includes('parasite')) return `**Lutte contre les ravageurs** 🐛\n\n**Solutions naturelles (recommandées) :**\n- **Neem (Nébédaye)** : Macération de feuilles (1kg/10L), efficace contre pucerons et chenilles\n- **Savon noir** : 50g/L d'eau, contre pucerons et mouches blanches\n- **Cendre de bois** : Saupoudrer, contre limaces et escargots\n- **Piment + ail** : Macération, répulsif général\n\n**Prévention :**\n- Rotation des cultures (jamais 2x la même famille)\n- Association cultures (tomate + basilic, maïs + niébé)\n- Éliminer les résidus de culture infectés\n- Favoriser les auxiliaires (coccinelles mangent les pucerons)`;
  if (msg.includes('prix') || msg.includes('marché') || msg.includes('vendre')) return `**Consultez l'onglet "Tableau de bord"** pour voir les prix actuels du marché dans votre ville.\n\n**Conseils de vente :**\n- Stockez si les prix sont bas après récolte (offre élevée)\n- Vendez en période de soudure (avril-juin) pour de meilleurs prix\n- Les marchés hebdomadaires (loumas) offrent souvent de meilleurs prix\n- Groupez-vous en coopérative pour négocier avec les bana-bana`;

  return OFFLINE_RESPONSES.default;
}

async function callGroqAPI(messages, language) {
  const systemMessage = {
    role: 'system',
    content: language === 'wo'
      ? SYSTEM_PROMPT + '\n\nIMPORTANT: Réponds en wolof sénégalais.'
      : SYSTEM_PROMPT
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

router.post('/', async (req, res) => {
  try {
    const { messages, language = 'fr' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

    if (process.env.GROQ_API_KEY) {
      try {
        const aiResponse = await callGroqAPI(messages, language);
        return res.json({ message: aiResponse });
      } catch (error) {
        console.error('Groq API error, falling back to offline:', error.message);
      }
    }

    const response = getOfflineResponse(lastUserMessage);
    res.json({ message: response });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({
      error: 'Service temporarily unavailable',
      message: 'Veuillez réessayer dans quelques instants.'
    });
  }
});

module.exports = router;

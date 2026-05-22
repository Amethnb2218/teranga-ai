const OFFLINE_RESPONSES = {
  arachide: `**Conseils pour la culture de l'arachide au Sénégal** 🥜

**Période de semis :** Dès les premières pluies utiles (mi-juin à mi-juillet selon votre zone)

**Préparation du sol :**
- Labour à 15-20 cm de profondeur
- Apport de phosphate (100 kg/ha de superphosphate simple)

**Variétés recommandées (ISRA) :**
- 55-437 (huilière, cycle 90 jours) — bassin arachidier
- 73-33 (bouche/confiserie, gros grains) — zone soudanienne
- Fleur 11 (huilière, résistante sécheresse) — zone sahélienne
- GC 8-35 (cycle 105 jours, bon rendement) — Casamance

**Densité de semis :** 50 cm entre lignes, 15 cm entre poquets

**Entretien :**
- 1er sarclage à 15 jours après levée
- 2ème sarclage + buttage à 30-35 jours
- Ne pas toucher les plantes après floraison (45 jours)

**Récolte :** Quand les feuilles jaunissent et que l'intérieur des coques est foncé (90-120 jours selon variété)`,

  tomate: `**Conseils pour la culture de la tomate au Sénégal** 🍅

**Meilleure période :** Saison sèche (novembre à mai) en culture irriguée

**Variétés adaptées (ISRA) :**
- Xina (résistante, bon rendement)
- Mongal F1 (marché frais, gros fruits)
- Tropimech (résistante chaleur, polyvalente)

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
- Souna 3 (90 jours, zone sahélienne, rendement 1,5-2 t/ha)
- Thialack 2 (variété améliorée, bon rendement)
- IBV 8004 (75 jours, très précoce, zone sahélienne)

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

  oignon: `**Culture de l'oignon au Sénégal** 🧅

**Variété star :** Violet de Galmi
**Zones :** Niayes, Fleuve, Louga
**Période :** Pépinière en octobre, repiquage novembre-décembre
**Récolte :** Mars-Avril
**Rendement :** 20-30 t/ha

**Conseils :**
- Espacement 20×10 cm
- Irrigation régulière mais stop 2 semaines avant récolte
- Séchage 1 semaine au champ après arrachage
- Stockage en claies ventilées`,

  maladies: `**Lutte contre les ravageurs** 🐛

**Solutions naturelles (recommandées) :**
- **Neem (Nébédaye)** : Macération de feuilles (1kg/10L), efficace contre pucerons et chenilles
- **Savon noir** : 50g/L d'eau, contre pucerons et mouches blanches
- **Cendre de bois** : Saupoudrer, contre limaces et escargots
- **Piment + ail** : Macération, répulsif général

**Prévention :**
- Rotation des cultures (jamais 2x la même famille)
- Association cultures (tomate + basilic, maïs + niébé)
- Éliminer les résidus de culture infectés
- Favoriser les auxiliaires (coccinelles mangent les pucerons)`,

  marche: `**Consultez l'onglet "Tableau de bord"** pour voir les prix actuels du marché dans votre ville.

**Conseils de vente :**
- Stockez si les prix sont bas après récolte (offre élevée)
- Vendez en période de soudure (avril-juin) pour de meilleurs prix
- Les marchés hebdomadaires (loumas) offrent souvent de meilleurs prix
- Groupez-vous en coopérative pour négocier avec les bana-bana`,

  bonjour: `Bonjour ! Je suis votre conseiller agricole. Comment puis-je vous aider aujourd'hui ?

Vous pouvez me poser des questions sur vos cultures, la météo, les prix du marché ou un problème dans votre champ.`,

  default: `Je suis votre conseiller agricole. Posez-moi une question précise et je vous aiderai du mieux possible.

Par exemple :
- "Comment cultiver l'arachide ?"
- "Pucerons sur mes tomates"
- "Quand semer le mil à Kaolack ?"
- "Prix du riz au marché"`
};

module.exports = { OFFLINE_RESPONSES };

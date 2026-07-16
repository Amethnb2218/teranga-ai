const { SAHEL_CITIES } = require('../config/constants');

// In-memory store (production would use a database)
const observations = [];
const groups = [];

// Seed with realistic community observations
function seedData() {
  const seedObservations = [
    {
      id: 'obs_001', city: 'kaolack', country: 'Senegal',
      type: 'crop_status', author: 'Fatou Diop', authorGender: 'F',
      content: 'Le mil a bien leve malgre le retard des pluies. Les varietes Souna III resistent bien.',
      crop: 'mil', severity: 'info', likes: 12, verified: true,
      createdAt: new Date('2026-07-10T08:30:00Z')
    },
    {
      id: 'obs_002', city: 'maradi', country: 'Niger',
      type: 'pest_alert', author: 'Aminata Moussa', authorGender: 'F',
      content: 'Presence de chenilles legionnaires sur les parcelles de mais. Traitement naturel au neem en cours.',
      crop: 'mais', severity: 'high', likes: 28, verified: true,
      createdAt: new Date('2026-07-12T14:20:00Z')
    },
    {
      id: 'obs_003', city: 'bamako', country: 'Mali',
      type: 'market_info', author: 'Mariam Traore', authorGender: 'F',
      content: 'Le prix du sorgho a baisse de 25% au marche de Medine. Bon moment pour acheter les semences.',
      crop: 'sorgho', severity: 'info', likes: 34, verified: false,
      createdAt: new Date('2026-07-14T10:00:00Z')
    },
    {
      id: 'obs_004', city: 'tillaberi', country: 'Niger',
      type: 'weather_local', author: 'Ibrahim Hamidou', authorGender: 'M',
      content: 'Pas de pluie depuis 18 jours. Les jeunes pousses de mil commencent a faner. Besoin de semences de remplacement.',
      crop: 'mil', severity: 'critical', likes: 45, verified: true,
      createdAt: new Date('2026-07-13T07:45:00Z')
    },
    {
      id: 'obs_005', city: 'ouagadougou', country: 'Burkina Faso',
      type: 'technique', author: 'Aissatou Ouedraogo', authorGender: 'F',
      content: 'Le zaï ameliore fonctionne bien cette annee. 3x plus de rendement sur les parcelles degradees.',
      crop: 'sorgho', severity: 'info', likes: 67, verified: true,
      createdAt: new Date('2026-07-11T16:30:00Z')
    },
    {
      id: 'obs_006', city: 'ziguinchor', country: 'Senegal',
      type: 'crop_status', author: 'Adama Coly', authorGender: 'F',
      content: 'Le riz de bas-fond se developpe bien. Repiquage termine sur 2 hectares. Les femmes du GIE sont optimistes.',
      crop: 'riz', severity: 'info', likes: 22, verified: true,
      createdAt: new Date('2026-07-09T11:15:00Z')
    },
    {
      id: 'obs_007', city: 'niamey', country: 'Niger',
      type: 'pest_alert', author: 'Haoua Garba', authorGender: 'F',
      content: 'Oiseaux granivores tres presents sur le mil en epiaison. Surveillance collective organisee par le groupement feminin.',
      crop: 'mil', severity: 'medium', likes: 19, verified: true,
      createdAt: new Date('2026-07-15T06:00:00Z')
    },
    {
      id: 'obs_008', city: 'sikasso', country: 'Mali',
      type: 'technique', author: 'Kadiatou Coulibaly', authorGender: 'F',
      content: 'Association mais-niebe sur la meme parcelle. Le niebe fixe l\'azote et protege le sol. Technique validee par le groupement.',
      crop: 'mais', severity: 'info', likes: 53, verified: true,
      createdAt: new Date('2026-07-08T09:00:00Z')
    },
    {
      id: 'obs_009', city: 'kolda', country: 'Senegal',
      type: 'market_info', author: 'Binta Balde', authorGender: 'F',
      content: 'Les mangues se vendent bien cette saison. Le groupement feminin a negocie un prix de gros avec le collecteur.',
      crop: 'mangue', severity: 'info', likes: 31, verified: false,
      createdAt: new Date('2026-07-14T15:30:00Z')
    },
    {
      id: 'obs_010', city: 'maroua', country: 'Cameroun',
      type: 'weather_local', author: 'Djamilatou Aoudou', authorGender: 'F',
      content: 'Fortes pluies hier soir (environ 80mm). Inondation des parcelles basses. Replanter le gombo et les legumes.',
      crop: 'gombo', severity: 'high', likes: 38, verified: true,
      createdAt: new Date('2026-07-15T08:30:00Z')
    }
  ];

  const seedGroups = [
    {
      id: 'grp_001', name: 'Femmes Resilientes du Sahel',
      description: 'Reseau de femmes agricultrices partageant techniques et alertes pour la securite alimentaire.',
      country: 'multi', members: 847, womenPercent: 92,
      topics: ['maraichage', 'cereales', 'transformation', 'microcredit'],
      createdAt: new Date('2026-03-01')
    },
    {
      id: 'grp_002', name: 'Maraicheres de Niamey',
      description: 'Groupement feminin specialise en cultures maraicheres irriguees (oignon, tomate, chou).',
      country: 'Niger', members: 234, womenPercent: 98,
      topics: ['irrigation', 'oignon', 'tomate', 'commercialisation'],
      createdAt: new Date('2026-01-15')
    },
    {
      id: 'grp_003', name: 'Sentinelles Climat Kaolack',
      description: 'Observateurs locaux qui remontent les donnees terrain en temps reel pour le systeme d\'alerte.',
      country: 'Senegal', members: 156, womenPercent: 65,
      topics: ['pluviometrie', 'ravageurs', 'semis', 'alerte_precoce'],
      createdAt: new Date('2026-02-20')
    },
    {
      id: 'grp_004', name: 'GIE Barakah - Cereales Burkina',
      description: 'Productrices de cereales (mil, sorgho) partageant un stock commun et un acces au marche.',
      country: 'Burkina Faso', members: 312, womenPercent: 88,
      topics: ['mil', 'sorgho', 'stockage', 'prix_marche'],
      createdAt: new Date('2026-04-10')
    },
    {
      id: 'grp_005', name: 'Rizicultrices de Casamance',
      description: 'Femmes productrices de riz de bas-fond. Echange de semences et techniques de repiquage.',
      country: 'Senegal', members: 189, womenPercent: 95,
      topics: ['riz', 'bas-fond', 'semences', 'repiquage'],
      createdAt: new Date('2026-05-05')
    }
  ];

  observations.push(...seedObservations);
  groups.push(...seedGroups);
}

seedData();

function getObservations(filters = {}) {
  let result = [...observations];

  if (filters.country) {
    result = result.filter(o => o.country === filters.country);
  }
  if (filters.city) {
    result = result.filter(o => o.city === filters.city);
  }
  if (filters.type) {
    result = result.filter(o => o.type === filters.type);
  }
  if (filters.severity) {
    result = result.filter(o => o.severity === filters.severity);
  }

  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const limit = filters.limit || 20;
  return {
    observations: result.slice(0, limit),
    total: result.length,
    stats: getStats()
  };
}

function getStats() {
  const totalObs = observations.length;
  const womenAuthors = observations.filter(o => o.authorGender === 'F').length;
  const countries = [...new Set(observations.map(o => o.country))].length;
  const verified = observations.filter(o => o.verified).length;
  const totalMembers = groups.reduce((sum, g) => sum + g.members, 0);
  const avgWomen = groups.length > 0
    ? Math.round(groups.reduce((sum, g) => sum + g.womenPercent, 0) / groups.length)
    : 0;

  return {
    totalObservations: totalObs,
    womenContributions: womenAuthors,
    womenPercent: Math.round((womenAuthors / totalObs) * 100),
    countriesCovered: countries,
    verifiedObservations: verified,
    totalGroups: groups.length,
    totalMembers,
    avgWomenPercent: avgWomen
  };
}

function getGroups(filters = {}) {
  let result = [...groups];

  if (filters.country && filters.country !== 'multi') {
    result = result.filter(g => g.country === filters.country || g.country === 'multi');
  }

  return {
    groups: result,
    total: result.length
  };
}

function addObservation(data) {
  const obs = {
    id: `obs_${Date.now()}`,
    city: data.city,
    country: SAHEL_CITIES[data.city]?.country || 'Unknown',
    type: data.type || 'crop_status',
    author: data.author || 'Anonyme',
    authorGender: data.authorGender || 'F',
    content: data.content,
    crop: data.crop || null,
    severity: data.severity || 'info',
    likes: 0,
    verified: false,
    createdAt: new Date()
  };

  observations.unshift(obs);
  return obs;
}

function likeObservation(obsId) {
  const obs = observations.find(o => o.id === obsId);
  if (obs) {
    obs.likes++;
    return obs;
  }
  return null;
}

module.exports = {
  getObservations,
  getGroups,
  getStats,
  addObservation,
  likeObservation
};

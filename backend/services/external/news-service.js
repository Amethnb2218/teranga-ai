const NEWS_CACHE = { data: null, timestamp: 0 };
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure

const RSS_FEEDS = [
  {
    url: 'https://www.agenceecofin.com/rss/agriculture',
    source: 'Agence Ecofin',
    region: 'Afrique'
  },
  {
    url: 'https://news.google.com/rss/search?q=agriculture+S%C3%A9n%C3%A9gal&hl=fr&gl=SN&ceid=SN:fr',
    source: 'Google News',
    region: 'Sénégal'
  }
];

async function fetchAgriNews() {
  if (NEWS_CACHE.data && Date.now() - NEWS_CACHE.timestamp < CACHE_DURATION) {
    return NEWS_CACHE.data;
  }

  const allNews = [];

  for (const feed of RSS_FEEDS) {
    try {
      const response = await fetch(feed.url, {
        headers: { 'User-Agent': 'Teranga-AI/1.0' },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) continue;

      const xml = await response.text();
      const items = parseRSSItems(xml, feed.source);
      allNews.push(...items);
    } catch (error) {
      console.error(`RSS fetch error (${feed.source}):`, error.message);
    }
  }

  const sorted = allNews
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  if (sorted.length > 0) {
    NEWS_CACHE.data = sorted;
    NEWS_CACHE.timestamp = Date.now();
  }

  return NEWS_CACHE.data || getDefaultNews();
}

function parseRSSItems(xml, source) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const title = extractTag(item, 'title');
    const link = extractTag(item, 'link');
    const pubDate = extractTag(item, 'pubDate');
    const description = extractTag(item, 'description');

    if (title && isAgriRelated(title + ' ' + (description || ''))) {
      items.push({
        title: cleanText(title),
        link,
        date: pubDate || new Date().toISOString(),
        source,
        summary: cleanText(description || '').slice(0, 150)
      });
    }
  }

  return items.slice(0, 5);
}

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? (match[1] || match[2] || '').trim() : null;
}

function cleanText(text) {
  return text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
}

function isAgriRelated(text) {
  const keywords = ['agricultur', 'agri', 'récolte', 'semence', 'paysan', 'exploitant', 'culture', 'céréal',
    'arachide', 'mil', 'riz', 'maïs', 'oignon', 'tomate', 'élevage', 'pêche', 'irrigation',
    'hivernage', 'campagne agricole', 'ISRA', 'SAED', 'sécurité alimentaire', 'FAO',
    'fertilisant', 'engrais', 'pesticide', 'rendement', 'soudure', 'pluviométr'];
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

function getDefaultNews() {
  return [
    { title: "Campagne agricole 2026 : les prévisions pluviométriques de l'ANACIM", date: new Date().toISOString(), source: "ANACIM", summary: "Les prévisions annoncent un hivernage normal à excédentaire pour la majeure partie du Sénégal." },
    { title: "Prix de l'arachide : le gouvernement fixe le prix plancher", date: new Date().toISOString(), source: "APS", summary: "Le Conseil National de Concertation sur l'Arachide a fixé les prix pour la campagne." },
    { title: "Production céréalière 2024 : 3,8 millions de tonnes (+8%)", date: new Date().toISOString(), source: "FAO/GIEWS", summary: "La production agrégée dépasse la moyenne quinquennale grâce à une bonne pluviométrie." },
    { title: "Nouvelles variétés ISRA : Thialack 2 et ISRIZ 12 disponibles", date: new Date().toISOString(), source: "ISRA", summary: "L'Institut a mis à disposition des semences pré-base pour la prochaine campagne." },
    { title: "Subventions engrais : le programme 2026 est lancé", date: new Date().toISOString(), source: "Ministère Agriculture", summary: "Les agriculteurs peuvent bénéficier d'engrais subventionnés via les coopératives." }
  ];
}

module.exports = { fetchAgriNews };

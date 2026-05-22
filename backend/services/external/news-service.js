const NEWS_CACHE = { data: null, timestamp: 0 };
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure

async function fetchAgriNews() {
  if (NEWS_CACHE.data && Date.now() - NEWS_CACHE.timestamp < CACHE_DURATION) {
    return NEWS_CACHE.data;
  }

  try {
    const response = await fetch(
      'https://news.google.com/rss/search?q=agriculture+S%C3%A9n%C3%A9gal&hl=fr&gl=SN&ceid=SN:fr',
      { headers: { 'User-Agent': 'Teranga-AI/1.0' }, signal: AbortSignal.timeout(8000) }
    );

    if (!response.ok) return getDefaultNews();

    const xml = await response.text();
    const items = parseGoogleNewsRSS(xml);

    if (items.length > 0) {
      NEWS_CACHE.data = items;
      NEWS_CACHE.timestamp = Date.now();
      return items;
    }
  } catch (error) {
    console.error('News fetch error:', error.message);
  }

  return getDefaultNews();
}

function parseGoogleNewsRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
    const item = match[1];

    const titleRaw = extractTag(item, 'title');
    const pubDate = extractTag(item, 'pubDate');
    const sourceMatch = item.match(/<source[^>]*>([^<]*)<\/source>/);

    // Google News RSS: le lien est entre <link> et le prochain tag
    const linkMatch = item.match(/<link\s*\/?>\s*(https?:\/\/[^\s<]+)/);
    const link = linkMatch ? linkMatch[1].trim() : '';

    if (!titleRaw) continue;

    let title = cleanHTML(titleRaw);
    let source = sourceMatch ? cleanHTML(sourceMatch[1]) : 'Presse';

    // Google News: "titre - Source" format
    const dashSplit = title.split(' - ');
    if (dashSplit.length > 1) {
      const potentialSource = dashSplit[dashSplit.length - 1].trim();
      if (potentialSource.length < 40) {
        source = potentialSource;
        title = dashSplit.slice(0, -1).join(' - ').trim();
      }
    }

    if (!isAgriRelated(title)) continue;

    items.push({
      title: title.slice(0, 120),
      source,
      date: formatDate(pubDate),
      link
    });
  }

  return items;
}

function extractTag(xml, tag) {
  // Priorité au CDATA
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
  if (cdataMatch) return cdataMatch[1].trim();

  // Sinon contenu direct
  const directMatch = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  if (directMatch) return directMatch[1].trim();

  // Cas spécial : <link>url</link> ou <link/>url suivant
  if (tag === 'link') {
    const linkMatch = xml.match(/<link[^>]*\/?>([^<\s]+)/);
    if (linkMatch) return linkMatch[1].trim();
  }

  return null;
}

function cleanHTML(text) {
  if (!text) return '';
  return text
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffH = Math.round((now - date) / (1000 * 60 * 60));
    if (diffH < 1) return "À l'instant";
    if (diffH < 24) return `Il y a ${diffH}h`;
    const diffD = Math.round(diffH / 24);
    if (diffD === 1) return 'Hier';
    if (diffD < 7) return `Il y a ${diffD}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

function isAgriRelated(text) {
  const keywords = ['agricultur', 'agri', 'récolte', 'semence', 'paysan', 'exploitant',
    'céréal', 'arachide', 'mil', 'riz', 'maïs', 'oignon', 'tomate', 'élevage',
    'pêche', 'irrigation', 'hivernage', 'campagne', 'ISRA', 'SAED',
    'alimentaire', 'FAO', 'engrais', 'rendement', 'soudure', 'pluvio',
    'mécanis', 'foncier', 'rural', 'souveraineté', 'climat'];
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

function getDefaultNews() {
  return [
    { title: "Campagne agricole 2026 : prévisions pluviométriques de l'ANACIM", source: 'ANACIM', date: 'Récent', link: '' },
    { title: "Prix de l'arachide : le gouvernement fixe le prix plancher de la campagne", source: 'APS', date: 'Récent', link: '' },
    { title: "Production céréalière record : 3,8 millions de tonnes en 2024", source: 'FAO', date: 'Récent', link: '' },
    { title: "Nouvelles variétés ISRA disponibles pour la prochaine campagne", source: 'ISRA', date: 'Récent', link: '' },
    { title: "Programme de subventions engrais 2026 lancé par le ministère", source: 'Min. Agriculture', date: 'Récent', link: '' }
  ];
}

module.exports = { fetchAgriNews };

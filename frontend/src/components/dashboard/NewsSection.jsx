import ProvenanceNotice from '../common/ProvenanceNotice'

function formatNewsDate(dateStr) {
  if (!dateStr) return '';
  // Si déjà formaté ("Il y a 2h", "Hier", etc.)
  if (dateStr.startsWith('Il y a') || dateStr === 'Hier' || dateStr === "À l'instant" || dateStr === 'Récent') return dateStr;
  // Sinon, parser la date brute
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const now = new Date();
    const diffH = Math.round((now - date) / (1000 * 60 * 60));
    if (diffH < 1) return "À l'instant";
    if (diffH < 24) return `Il y a ${diffH}h`;
    const diffD = Math.round(diffH / 24);
    if (diffD === 1) return 'Hier';
    if (diffD < 7) return `Il y a ${diffD}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  } catch { return dateStr; }
}

function isRealUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function NewsSection({ news, provenance }) {
  const hasNews = news?.news?.length > 0;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-stone-900 text-sm">Actualités agricoles</h3>
        <span className="text-xs text-stone-400">Flux externe si disponible</span>
      </div>
      <ProvenanceNotice
        provenance={provenance}
        scope="news"
        title="Origine des actualités"
        fallback={news?.provenance || {
          type: hasNews && news.news.some(item => isRealUrl(item.link)) ? 'live' : 'static',
          availability: hasNews && news.news.some(item => isRealUrl(item.link)) ? 'available' : 'unavailable',
          source: 'Google News RSS',
          source_url: 'https://news.google.com/',
          note: hasNews && news.news.some(item => isRealUrl(item.link))
            ? 'Articles issus du flux RSS ; seuls les éléments ayant une URL réelle sont cliquables.'
            : 'Le flux RSS est indisponible. Aucun faux article ni titre de secours n’est affiché.'
        }}
        className="mb-4"
      />
      {hasNews ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {news.news.slice(0, 6).map((item, i) => {
          const linked = isRealUrl(item.link);
          const Card = linked ? 'a' : 'article';
          return (
          <Card
            key={i}
            {...(linked ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`block bg-white rounded-lg border border-stone-200 p-4 transition-all ${linked ? 'hover:border-amber-300 hover:shadow-sm cursor-pointer' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-amber-700">{item.source?.charAt(0) || 'A'}</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-stone-800 leading-snug line-clamp-2 hover:text-amber-800 transition-colors">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-amber-700 font-medium">{item.source}</span>
                  {item.date && <span className="text-xs text-stone-400">{formatNewsDate(item.date)}</span>}
                </div>
              </div>
              {linked && (
                <svg className="w-4 h-4 text-stone-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
            </div>
          </Card>
          );
        })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
          Flux d’actualités indisponible. Aucun article de secours n’est généré.
        </div>
      )}
    </section>
  );
}

export default NewsSection

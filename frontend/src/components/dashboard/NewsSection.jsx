function NewsSection({ news }) {
  if (!news || !news.news || news.news.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-stone-900 text-sm">Actualités agricoles</h3>
        <span className="text-xs text-stone-400">Sources : presse sénégalaise</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {news.news.slice(0, 6).map((item, i) => (
          <article key={i} className="bg-white rounded-lg border border-stone-200 p-4 hover:border-amber-300 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-stone-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-stone-500">{item.source?.charAt(0) || 'A'}</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-stone-800 leading-snug line-clamp-2">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-amber-700 font-medium">{item.source}</span>
                  {item.date && <span className="text-xs text-stone-400">{item.date}</span>}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NewsSection

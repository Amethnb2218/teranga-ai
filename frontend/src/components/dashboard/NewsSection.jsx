function NewsSection({ news }) {
  if (!news || !news.news || news.news.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="font-semibold text-stone-900 text-sm mb-3">Actualités agricoles</h3>
      <div className="space-y-3">
        {news.news.slice(0, 5).map((item, i) => (
          <div key={i} className="bg-white rounded-lg border border-stone-200 p-4 hover:border-stone-300 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-medium text-stone-800 mb-1">{item.title}</h4>
                {item.summary && (
                  <p className="text-xs text-stone-500 line-clamp-2">{item.summary}</p>
                )}
              </div>
              <span className="text-xs text-stone-400 whitespace-nowrap flex-shrink-0">{item.source}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NewsSection

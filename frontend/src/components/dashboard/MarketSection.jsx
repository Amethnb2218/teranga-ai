import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi'

function getTrendIcon(trend) {
  if (trend === 'hausse') return <FiTrendingUp size={12} className="text-red-500" />;
  if (trend === 'baisse') return <FiTrendingDown size={12} className="text-leaf-600" />;
  return <FiMinus size={12} className="text-stone-300" />;
}

function getCategoryLabel(category) {
  switch (category) {
    case 'cereales': return 'Céréales';
    case 'legumineuses': return 'Légumineuses';
    case 'maraichage': return 'Maraîchage';
    case 'fruits': return 'Fruits';
    default: return category;
  }
}

function MarketSection({ market }) {
  if (!market) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-stone-900 text-sm">Prix du marché</h3>
        <span className="text-xs text-stone-400">FCFA/kg · {market.last_updated}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(market.data).map(([category, products]) => (
          products.length > 0 && (
            <div key={category} className="bg-white rounded-lg border border-stone-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-100">
                <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                  {getCategoryLabel(category)}
                </h4>
              </div>
              <div className="divide-y divide-stone-50">
                {products.map((product, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm text-stone-700">{product.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-medium text-stone-900">
                        {product.price_local}
                      </span>
                      {getTrendIcon(product.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </section>
  );
}

export default MarketSection

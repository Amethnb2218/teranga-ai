import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi'

function getTrendIcon(trend) {
  if (trend === 'hausse') return <FiTrendingUp className="text-red-500" />;
  if (trend === 'baisse') return <FiTrendingDown className="text-green-600" />;
  return <FiMinus className="text-gray-400" />;
}

function getCategoryLabel(category) {
  switch (category) {
    case 'cereales': return '🌾 Céréales';
    case 'legumineuses': return '🫘 Légumineuses';
    case 'maraichage': return '🥬 Maraîchage';
    case 'fruits': return '🍎 Fruits';
    default: return category;
  }
}

function MarketSection({ market }) {
  if (!market) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <FiTrendingUp className="text-primary-600" />
        <h3 className="font-semibold text-gray-900">Prix du marché (FCFA)</h3>
        <span className="text-xs text-gray-500">Mis à jour : {market.last_updated}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(market.data).map(([category, products]) => (
          products.length > 0 && (
            <div key={category} className="card">
              <h4 className="font-medium text-gray-900 capitalize mb-3 pb-2 border-b border-gray-100">
                {getCategoryLabel(category)}
              </h4>
              <div className="space-y-2">
                {products.map((product, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{product.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {product.price_local} F/{product.unit}
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

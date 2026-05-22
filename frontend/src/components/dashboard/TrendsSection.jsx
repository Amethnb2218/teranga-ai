import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

function TrendsSection({ trends }) {
  if (!trends || !trends.trends.length) return null;

  return (
    <section>
      <h3 className="font-semibold text-stone-900 text-sm mb-3">Alertes & recommandations</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {trends.trends.map((trend, i) => (
          <div
            key={i}
            className={`rounded-lg p-3.5 border ${
              trend.trend === 'hausse'
                ? 'bg-orange-50 border-orange-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {trend.trend === 'hausse'
                ? <FiTrendingUp size={13} className="text-orange-600" />
                : <FiTrendingDown size={13} className="text-blue-600" />
              }
              <span className="font-medium text-sm text-stone-800">{trend.product}</span>
            </div>
            <p className="text-xs text-stone-600 ml-5">{trend.advice}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrendsSection

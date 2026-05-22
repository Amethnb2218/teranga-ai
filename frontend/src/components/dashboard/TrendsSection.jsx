import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

function TrendsSection({ trends }) {
  if (!trends || !trends.trends.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <FiTrendingUp className="text-primary-600" />
        <h3 className="font-semibold text-gray-900">Alertes et tendances</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {trends.trends.map((trend, i) => (
          <div
            key={i}
            className={`card p-4 border-l-4 ${
              trend.trend === 'hausse'
                ? 'border-l-orange-400 bg-orange-50/50'
                : 'border-l-blue-400 bg-blue-50/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {trend.trend === 'hausse'
                ? <FiTrendingUp className="text-red-500" />
                : <FiTrendingDown className="text-green-600" />
              }
              <span className="font-medium text-sm text-gray-900">{trend.product}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                trend.trend === 'hausse'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {trend.trend === 'hausse' ? '↑ Hausse' : '↓ Baisse'}
              </span>
            </div>
            <p className="text-sm text-gray-600">{trend.advice}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrendsSection

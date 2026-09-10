import { useState, useEffect } from 'react'
import { FiAlertTriangle, FiCloudRain, FiSun, FiMapPin, FiFilter, FiRefreshCw } from 'react-icons/fi'
import { fetchAlerts, fetchAlertsSummary } from '../../services/api'

const COUNTRIES = [
  { id: 'all', name: 'Tous les pays' },
  { id: 'burkina_faso', name: '🇧🇫 Burkina Faso' },
  { id: 'cameroun', name: '🇨🇲 Cameroun' },
  { id: 'gambie', name: '🇬🇲 Gambie' },
  { id: 'guinee', name: '🇬🇳 Guinee' },
  { id: 'mali', name: '🇲🇱 Mali' },
  { id: 'mauritanie', name: '🇲🇷 Mauritanie' },
  { id: 'niger', name: '🇳🇪 Niger' },
  { id: 'nigeria', name: '🇳🇬 Nigeria' },
  { id: 'senegal', name: '🇸🇳 Senegal' },
  { id: 'tchad', name: '🇹🇩 Tchad' },
];

const SEVERITY_LEVELS = [
  { id: 'all', name: 'Toutes', color: 'bg-slate-200' },
  { id: 'critical', name: 'Critique', color: 'bg-red-500' },
  { id: 'high', name: 'Élevé', color: 'bg-orange-500' },
  { id: 'medium', name: 'Moyen', color: 'bg-amber-500' },
  { id: 'low', name: 'Faible', color: 'bg-blue-500' },
];

const SEVERITY_CONFIG = {
  critical: { bg: 'bg-red-50', border: 'border-l-red-600', badge: 'bg-red-100 text-red-800', label: 'Critique', icon: '\u{1F534}' },
  high: { bg: 'bg-orange-50', border: 'border-l-orange-500', badge: 'bg-orange-100 text-orange-800', label: 'Élevé', icon: '\u{1F7E0}' },
  medium: { bg: 'bg-amber-50', border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-800', label: 'Moyen', icon: '\u{1F7E1}' },
  low: { bg: 'bg-blue-50', border: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-800', label: 'Faible', icon: '\u{1F535}' },
};

const TYPE_ICONS = {
  drought: FiSun,
  flood: FiCloudRain,
  food_crisis: FiAlertTriangle,
  pest: FiAlertTriangle,
  conflict: FiAlertTriangle,
};

const TYPE_LABELS = {
  drought: 'Sécheresse',
  flood: 'Inondation',
  food_crisis: 'Crise alimentaire',
  pest: 'Invasion acridienne',
  conflict: 'Conflit',
};

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('Chargement des scénarios indicatifs…');
  const [countryFilter, setCountryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadAlerts();
    loadSummary();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await fetchAlerts({});
      const mapped = (Array.isArray(data?.alerts) ? data.alerts : []).map(a => ({
        ...a,
        location: a.location || `${formatCity(a.city)}, ${a.country}`,
        affected_crops: a.affected_crops || a.affectedCrops || [],
        expires: a.expires || a.expiresAt,
      }));
      setAlerts(mapped);
      setNotice(data?.notice || 'Scénarios indicatifs calculés localement, non alertes institutionnelles.');
    } catch {
      setAlerts([]);
      setNotice('Scénarios indisponibles. Consultez les autorités météo et de protection civile locales.');
    } finally {
      setLoading(false);
    }
  };

  const formatCity = (key) => {
    if (!key) return '';
    const special = { ndjamena: "N'Djamena", saint_louis: 'Saint-Louis', bobo_dioulasso: 'Bobo-Dioulasso' };
    if (special[key]) return special[key];
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
  };

  const loadSummary = async () => {
    try {
      const data = await fetchAlertsSummary();
      if (data) setSummary(data);
    } catch {
      setSummary(null);
    }
  };

  // Filter alerts (normalize country to lowercase slug for comparison)
  const filteredAlerts = alerts.filter(alert => {
    if (countryFilter !== 'all') {
      const normalizedCountry = (alert.country || '').toLowerCase().replace(/\s+/g, '_');
      if (normalizedCountry !== countryFilter) return false;
    }
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    return true;
  });

  // Compute stats from current alerts (normalize country keys to match COUNTRIES ids)
  const normalizeCountry = (c) => (c || '').toLowerCase().replace(/\s+/g, '_');
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    countries: [...new Set(alerts.map(a => normalizeCountry(a.country)))].length,
    byType: alerts.reduce((acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; }, {}),
    byCountry: alerts.reduce((acc, a) => { const key = normalizeCountry(a.country); acc[key] = (acc[key] || 0) + 1; return acc; }, {}),
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Banner image */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-36 sm:h-44">
        <img
          src="https://images.unsplash.com/photo-1651999739984-0dc2a15dcd66?w=1200&q=80"
          alt="Paysage agricole sahélien"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 via-amber-900/50 to-transparent"></div>
        <div className="absolute inset-0 flex items-center px-6 sm:px-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FiAlertTriangle className="text-amber-300" size={22} />
              Centre de scénarios climatiques
            </h2>
            <p className="text-amber-100 text-sm mt-1">Scénarios climatiques indicatifs &mdash; 10 pays du Sahel</p>
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="bg-slate-900 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FiAlertTriangle className="text-amber-400" size={20} />
              Scénarios de vigilance — Sahel
            </h1>
            <p className="text-slate-400 text-sm mt-1">{notice}</p>
          </div>
          <button
            onClick={loadAlerts}
            className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors self-start sm:self-auto"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-slate-400">scénarios calculés</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{stats.countries}</div>
            <p className="text-xs text-slate-400">pays concernés</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{stats.critical}</div>
            <p className="text-xs text-slate-400">scénarios critiques</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-600">
          <FiFilter size={14} />
          Filtres
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="flex-1 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-teal-400 cursor-pointer"
          >
            {COUNTRIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="flex gap-2 flex-wrap">
            {SEVERITY_LEVELS.map(s => (
              <button
                key={s.id}
                onClick={() => setSeverityFilter(s.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  severityFilter === s.id
                    ? 'border-teal-600 bg-teal-50 text-teal-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${s.color}`}></span>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content: alerts list + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Alerts list */}
        <div className="lg:col-span-3 space-y-4">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-6 h-6 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-slate-500">Chargement des scénarios...</p>
            </div>
          )}

          {!loading && filteredAlerts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <FiAlertTriangle size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Aucun scénario disponible pour ces filtres. Consultez les services officiels pour les alertes opérationnelles.</p>
            </div>
          )}

          {!loading && filteredAlerts.map((alert) => {
            const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.medium;
            const TypeIcon = TYPE_ICONS[alert.type] || FiAlertTriangle;

            return (
              <div key={alert.id} className={`bg-white rounded-xl border border-slate-200 overflow-hidden border-l-4 ${config.border} transition-shadow hover:shadow-md`}>
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}>
                        <TypeIcon size={16} className="text-slate-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{alert.title}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <FiMapPin size={10} className="text-slate-400" />
                          <span className="text-xs text-slate-500">{alert.location}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`${config.badge} text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                      {config.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{alert.description}</p>

                  {/* Recommendation */}
                  {alert.recommendation && (
                    <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-teal-800 mb-1">Recommandation :</p>
                      <p className="text-xs text-teal-700 leading-relaxed">{alert.recommendation}</p>
                    </div>
                  )}

                  {/* Crops + timestamps */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {alert.affected_crops && alert.affected_crops.map(crop => (
                        <span key={crop} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full">
                          {crop}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {alert.timestamp && <span>Émise : {formatDate(alert.timestamp)}</span>}
                      {alert.expires && <span className="ml-2">Expire : {formatDate(alert.expires)}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar - Stats */}
        <div className="lg:col-span-2 space-y-4">
          {/* Alert count by type */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">Par type de risque</h3>
            <div className="space-y-3">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{TYPE_LABELS[type] || type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-5 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert count by country */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">Par pays</h3>
            <div className="space-y-3">
              {Object.entries(stats.byCountry)
                .sort((a, b) => b[1] - a[1])
                .map(([country, count]) => {
                  const countryInfo = COUNTRIES.find(c => c.id === country);
                  return (
                    <div key={country} className="flex items-center justify-between">
                      <span className="text-xs">{countryInfo ? countryInfo.name : country}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 w-5 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Severity distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">Sévérité</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
                <div className="text-xl font-bold text-red-700">{alerts.filter(a => a.severity === 'critical').length}</div>
                <p className="text-[10px] text-red-600 font-medium">Critique</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-100">
                <div className="text-xl font-bold text-orange-700">{alerts.filter(a => a.severity === 'high').length}</div>
                <p className="text-[10px] text-orange-600 font-medium">Élevé</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100">
                <div className="text-xl font-bold text-amber-700">{alerts.filter(a => a.severity === 'medium').length}</div>
                <p className="text-[10px] text-amber-600 font-medium">Moyen</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                <div className="text-xl font-bold text-blue-700">{alerts.filter(a => a.severity === 'low').length}</div>
                <p className="text-[10px] text-blue-600 font-medium">Faible</p>
              </div>
            </div>
          </div>

          {/* Data source notice */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              <strong className="text-slate-600">Statut :</strong> scénarios locaux estimés depuis une climatologie codée. Ils ne sont alimentés ni par FEWS NET, ni par IPC/CH, ni par OCHA ou AGRHYMET et doivent être confirmés auprès des services officiels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alerts

import { useState, useEffect } from 'react'
import { FiUsers, FiHeart, FiMapPin, FiAlertCircle, FiCheck, FiTrendingUp, FiMessageCircle, FiSend } from 'react-icons/fi'

const API_BASE = import.meta.env.VITE_API_URL || '';

const TYPE_CONFIG = {
  crop_status: { label: 'Etat cultures', color: 'bg-green-100 text-green-800', icon: '🌾' },
  pest_alert: { label: 'Ravageurs', color: 'bg-red-100 text-red-800', icon: '🐛' },
  market_info: { label: 'Marche', color: 'bg-blue-100 text-blue-800', icon: '💰' },
  weather_local: { label: 'Meteo locale', color: 'bg-amber-100 text-amber-800', icon: '🌧️' },
  technique: { label: 'Technique', color: 'bg-purple-100 text-purple-800', icon: '🔧' },
};

const SEVERITY_BADGE = {
  critical: 'bg-red-600 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-amber-400 text-amber-900',
  info: 'bg-slate-200 text-slate-700',
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Il y a moins d\'1h';
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

function Community() {
  const [observations, setObservations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [obsRes, grpRes, statsRes] = await Promise.allSettled([
        fetch(`${API_BASE}/api/community`).then(r => r.json()),
        fetch(`${API_BASE}/api/community/groups`).then(r => r.json()),
        fetch(`${API_BASE}/api/community/stats`).then(r => r.json()),
      ]);

      if (obsRes.status === 'fulfilled') setObservations(obsRes.value.observations || []);
      if (grpRes.status === 'fulfilled') setGroups(grpRes.value.groups || []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
    } catch (e) {
      // fallback handled by initial state
    }
    setLoading(false);
  }

  async function handleLike(obsId) {
    try {
      await fetch(`${API_BASE}/api/community/like/${obsId}`, { method: 'POST' });
      setObservations(prev => prev.map(o =>
        o.id === obsId ? { ...o, likes: o.likes + 1 } : o
      ));
    } catch (e) {}
  }

  const filtered = filter === 'all'
    ? observations
    : observations.filter(o => o.type === filter);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
          Chargement du reseau communautaire...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FiUsers className="text-teal-600" /> Reseau Communautaire
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Intelligence collective des agricultrices du Sahel
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'feed' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Observations
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'groups' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Groupements
          </button>
        </div>
      </div>

      {/* Stats Banner */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-teal-700">{stats.totalMembers?.toLocaleString()}</div>
            <p className="text-xs text-teal-600 mt-1">Membres actifs</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">{stats.avgWomenPercent}%</div>
            <p className="text-xs text-purple-600 mt-1">Femmes</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-700">{stats.totalObservations}</div>
            <p className="text-xs text-amber-600 mt-1">Observations</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.countriesCovered}</div>
            <p className="text-xs text-green-600 mt-1">Pays couverts</p>
          </div>
        </div>
      )}

      {activeTab === 'feed' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { key: 'all', label: 'Tout' },
              { key: 'crop_status', label: '🌾 Cultures' },
              { key: 'pest_alert', label: '🐛 Ravageurs' },
              { key: 'weather_local', label: '🌧️ Meteo' },
              { key: 'technique', label: '🔧 Techniques' },
              { key: 'market_info', label: '💰 Marche' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f.key ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-300'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Feed */}
          <div className="space-y-4">
            {filtered.map(obs => {
              const typeConf = TYPE_CONFIG[obs.type] || TYPE_CONFIG.crop_status;
              return (
                <div key={obs.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-sm">
                        {obs.authorGender === 'F' ? '👩🏾' : '👨🏾'}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-900">{obs.author}</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <FiMapPin size={10} />
                          <span>{obs.city}, {obs.country}</span>
                          <span>·</span>
                          <span>{timeAgo(obs.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {obs.verified && (
                        <span className="flex items-center gap-0.5 text-xs text-green-600" title="Verifie">
                          <FiCheck size={12} />
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${SEVERITY_BADGE[obs.severity]}`}>
                        {obs.severity === 'critical' ? 'Critique' : obs.severity === 'high' ? 'Urgent' : obs.severity === 'medium' ? 'Moyen' : 'Info'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeConf.color}`}>
                      {typeConf.icon} {typeConf.label}
                    </span>
                    {obs.crop && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {obs.crop}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed mb-3">{obs.content}</p>

                  <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleLike(obs.id)}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <FiHeart size={13} />
                      <span>{obs.likes}</span>
                    </button>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <FiMessageCircle size={13} />
                      Utile
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => (
            <div key={group.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">{group.name}</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                  {group.womenPercent}% femmes
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{group.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {group.topics.map(t => (
                  <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <FiUsers size={12} />
                  <span>{group.members} membres</span>
                </div>
                <span className="text-xs text-slate-400">
                  {group.country === 'multi' ? '🌍 Multi-pays' : group.country}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Women Empowerment Section */}
      <section className="mt-10 bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-100 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
            <span className="text-lg">👩🏾‍🌾</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Femmes & Resilience Alimentaire</h3>
            <p className="text-xs text-slate-500">60% des agriculteurs du Sahel sont des femmes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white/70 rounded-xl p-4 border border-purple-100">
            <div className="text-lg font-bold text-purple-700 mb-1">Maraichage</div>
            <p className="text-xs text-slate-600">Cultures a haute valeur (oignon, tomate, gombo) gerees par les groupements feminins</p>
          </div>
          <div className="bg-white/70 rounded-xl p-4 border border-purple-100">
            <div className="text-lg font-bold text-purple-700 mb-1">Transformation</div>
            <p className="text-xs text-slate-600">Cereales transformees (couscous, farine) pour plus-value et conservation longue duree</p>
          </div>
          <div className="bg-white/70 rounded-xl p-4 border border-purple-100">
            <div className="text-lg font-bold text-purple-700 mb-1">Microcredit</div>
            <p className="text-xs text-slate-600">Tontines et epargne collective pour financer semences et equipements</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Teranga AI donne la priorite aux femmes agricultrices : alertes vocales pour les non-alphabetisees, informations marche pour negocier les prix, et reseau d'entraide pour partager les bonnes pratiques.
        </p>
      </section>
    </div>
  );
}

export default Community

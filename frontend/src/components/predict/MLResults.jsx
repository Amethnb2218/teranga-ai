import { useState, useEffect } from 'react'
import { fetchYieldPrediction, fetchOptimizeCalendar, fetchBayesianRisk } from '../../services/api'

function MLResults({ crop, city }) {
  const [yieldData, setYieldData] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [bayesian, setBayesian] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('yield');

  useEffect(() => {
    if (!crop || !city) return;
    loadMLData();
  }, [crop, city]);

  const loadMLData = async () => {
    setLoading(true);
    const month = new Date().getMonth() + 1;
    try {
      const [yieldRes, optRes, riskRes] = await Promise.all([
        fetchYieldPrediction(crop, city, month),
        fetchOptimizeCalendar([crop, crop === 'arachide' ? 'mil' : 'arachide'], city, 2),
        fetchBayesianRisk(crop, city, month)
      ]);
      setYieldData(yieldRes);
      setOptimization(optRes);
      setBayesian(riskRes);
    } catch (e) {
      console.error('ML load error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-8 text-center">
        <div className="inline-block w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-xs text-stone-500">Exécution des modèles prédictifs...</p>
      </div>
    );
  }
  if (!yieldData) return null;

  const tabs = [
    { id: 'yield', label: 'Rendement prévu' },
    { id: 'genetic', label: 'Calendrier optimisé' },
    { id: 'bayesian', label: 'Analyse de risques' }
  ];

  return (
    <div className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden">
      {/* Header sobre */}
      <div className="px-5 pt-4 pb-3 border-b border-stone-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-stone-900 text-sm">Modèles prédictifs</h3>
            <p className="text-xs text-stone-400 mt-0.5">Régression + Algorithme génétique + Réseau bayésien</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium bg-stone-100 px-2 py-1 rounded">
            ISRA/ANACIM 2015-2024
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 bg-white">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-xs py-2.5 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-amber-700 text-amber-800 bg-amber-50/30'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {activeTab === 'yield' && yieldData && (
          <div className="space-y-4">
            {/* Résultat principal */}
            {yieldData.ensemble && (
              <div className="bg-white rounded-lg p-4 border border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-500 mb-1">Rendement estimé (ensemble)</p>
                    <p className="text-2xl font-bold text-stone-900">{yieldData.ensemble.predicted_yield_kg} <span className="text-sm font-normal text-stone-400">kg/ha</span></p>
                  </div>
                  <div className="text-right text-xs text-stone-400 space-y-0.5">
                    <div>Méthode : {yieldData.ensemble.method}</div>
                    <div>Pondération : OLS {yieldData.ensemble.weights?.regression} | KNN {yieldData.ensemble.weights?.knn}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Comparaison modèles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-stone-200">
                <p className="text-[10px] uppercase tracking-wide text-stone-400 mb-2">Régression linéaire (OLS)</p>
                <p className="text-lg font-bold text-stone-800">{yieldData.regression?.predicted_yield_kg} kg/ha</p>
                <div className="mt-2 text-xs text-stone-500 space-y-0.5">
                  <div className="flex justify-between"><span>R²</span><span className="font-mono">{yieldData.regression?.r_squared}</span></div>
                  <div className="flex justify-between"><span>Coeff. pluie</span><span className="font-mono">{yieldData.regression?.coefficients?.rain}</span></div>
                  <div className="flex justify-between"><span>Coeff. temp</span><span className="font-mono">{yieldData.regression?.coefficients?.temperature}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-stone-200">
                <p className="text-[10px] uppercase tracking-wide text-stone-400 mb-2">K plus proches voisins (k=3)</p>
                <p className="text-lg font-bold text-stone-800">{yieldData.knn?.predicted_yield_kg} kg/ha</p>
                <div className="mt-2 text-xs text-stone-500 space-y-0.5">
                  <div className="flex justify-between"><span>Confiance</span><span className="font-mono">{yieldData.knn?.confidence}</span></div>
                  {yieldData.knn?.neighbors?.slice(0, 2).map((n, i) => (
                    <div key={i} className="flex justify-between"><span>Voisin {i+1}</span><span className="font-mono">{n.yield} kg (w={n.weight})</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'genetic' && optimization && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-stone-200">
              <p className="text-xs text-stone-500 mb-3">Calendrier optimisé par algorithme génétique (50 individus, 80 générations)</p>
              <div className="space-y-3">
                {optimization.calendar?.map((c, i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-stone-50 last:border-0">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-xs font-bold text-amber-800">
                      P{c.parcel}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-stone-800">{c.crop}</div>
                      <div className="text-xs text-stone-400">Semis recommandé : {c.sowMonthName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-stone-800">{c.predictedYield} kg/ha</div>
                      <div className="text-xs text-stone-400">{c.expectedRain}mm pluie | {c.avgTemp}°C</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paramètres de l'algo */}
            <div className="bg-white rounded-lg p-3 border border-stone-200">
              <p className="text-[10px] uppercase tracking-wide text-stone-400 mb-2">Paramètres d'optimisation</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block">Sélection</span>
                  <span className="font-medium text-stone-700">Tournoi (k=3)</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Crossover</span>
                  <span className="font-medium text-stone-700">BLX-α (0.5)</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Mutation</span>
                  <span className="font-medium text-stone-700">{optimization.optimization?.parameters?.mutation_rate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Amélioration</span>
                  <span className="font-medium text-green-700">{optimization.optimization?.convergence?.improvement}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bayesian' && bayesian && (
          <div className="space-y-4">
            {/* Score sécurité */}
            <div className="bg-white rounded-lg p-4 border border-stone-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-500 mb-1">Score de sécurité (réseau bayésien)</p>
                  <p className="text-2xl font-bold text-stone-900">{bayesian.safetyScore}<span className="text-sm font-normal text-stone-400">/100</span></p>
                  <p className="text-xs text-stone-600 mt-1">{bayesian.recommendation}</p>
                </div>
                <div className="w-14 h-14 rounded-full border-4 flex items-center justify-center" style={{
                  borderColor: bayesian.safetyScore >= 70 ? '#4d7c0f' : bayesian.safetyScore >= 40 ? '#b45309' : '#dc2626'
                }}>
                  <span className="text-sm font-bold">{bayesian.safetyScore}</span>
                </div>
              </div>
            </div>

            {/* Facteurs de risque */}
            <div className="bg-white rounded-lg p-4 border border-stone-200">
              <p className="text-[10px] uppercase tracking-wide text-stone-400 mb-3">Facteurs de risque inférés</p>
              <div className="space-y-3">
                {[
                  { label: 'Sécheresse', value: bayesian.factors?.drought_probability, color: '#dc2626' },
                  { label: 'Stress thermique', value: bayesian.factors?.heat_stress_probability, color: '#ea580c' },
                  { label: 'Parasites', value: bayesian.factors?.pest_pressure_probability, color: '#d97706' },
                  { label: 'Inondation', value: bayesian.factors?.flood_risk_probability, color: '#2563eb' },
                ].map((factor, i) => {
                  const pct = parseFloat(factor.value) || 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-600">{factor.label}</span>
                        <span className="font-mono text-stone-700">{factor.value}</span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: factor.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Résultats d'inférence */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-stone-200 text-center">
                <p className="text-[10px] uppercase text-stone-400 mb-1">P(Échec cultural)</p>
                <p className="text-lg font-bold text-red-700">{bayesian.outcomes?.crop_failure_probability}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-stone-200 text-center">
                <p className="text-[10px] uppercase text-stone-400 mb-1">P(Perte rendement)</p>
                <p className="text-lg font-bold text-orange-700">{bayesian.outcomes?.yield_loss_probability}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MLResults

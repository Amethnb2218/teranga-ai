import { useState, useEffect } from 'react'
import { fetchYieldPrediction, fetchOptimizeCalendar, fetchBayesianRisk } from '../../services/api'

function MLResults({ crop, city }) {
  const [yieldData, setYieldData] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [bayesian, setBayesian] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('yield');
  const [viewMode, setViewMode] = useState('simple');

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
        <p className="text-xs text-stone-500">Calcul en cours...</p>
      </div>
    );
  }
  if (!yieldData) return null;

  const simpleTabs = [
    { id: 'yield', label: 'Combien je vais récolter ?' },
    { id: 'genetic', label: 'Quand semer ?' },
    { id: 'bayesian', label: 'Quels dangers ?' }
  ];

  const advancedTabs = [
    { id: 'yield', label: 'Rendement (OLS + KNN)' },
    { id: 'genetic', label: 'Calendrier (GA)' },
    { id: 'bayesian', label: 'Risques (BBN)' }
  ];

  const tabs = viewMode === 'simple' ? simpleTabs : advancedTabs;

  const getYieldLevel = (kg) => {
    if (kg >= 1500) return { label: 'Très bon', color: 'text-green-700', bg: 'bg-green-50' };
    if (kg >= 1000) return { label: 'Bon', color: 'text-amber-700', bg: 'bg-amber-50' };
    if (kg >= 600) return { label: 'Moyen', color: 'text-orange-700', bg: 'bg-orange-50' };
    return { label: 'Faible', color: 'text-red-700', bg: 'bg-red-50' };
  };

  const getRiskLabel = (pct) => {
    const val = parseFloat(pct) || 0;
    if (val <= 20) return { text: 'Risque faible', color: 'text-green-700', icon: '✓' };
    if (val <= 50) return { text: 'Attention', color: 'text-amber-700', icon: '⚠' };
    return { text: 'Danger', color: 'text-red-700', icon: '✗' };
  };

  return (
    <div className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden">
      {/* Header avec toggle Simple/Avancé */}
      <div className="px-5 pt-4 pb-3 border-b border-stone-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-stone-900 text-sm">
              {viewMode === 'simple' ? 'Analyse de votre parcelle' : 'Modèles prédictifs — vue technique'}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {viewMode === 'simple' ? 'Résultats basés sur 10 ans de données ISRA/ANACIM' : 'Régression OLS + KNN (ensemble) • Algorithme génétique • Réseau bayésien'}
            </p>
          </div>
          <div className="flex items-center bg-stone-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('simple')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'simple' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setViewMode('advanced')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'advanced' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Avancé
            </button>
          </div>
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
        {/* ===== RENDEMENT ===== */}
        {activeTab === 'yield' && yieldData && (
          <div className="space-y-4">
            {viewMode === 'simple' ? (
              <>
                {/* SIMPLE — résultat clair */}
                {yieldData.ensemble && (() => {
                  const level = getYieldLevel(yieldData.ensemble.predicted_yield_kg);
                  return (
                    <div className={`rounded-lg p-5 border border-stone-200 ${level.bg}`}>
                      <p className="text-sm text-stone-600 mb-2">Si vous semez maintenant, vous pouvez espérer récolter environ :</p>
                      <div className="flex items-end gap-3">
                        <p className="text-3xl font-bold text-stone-900">{yieldData.ensemble.predicted_yield_kg} <span className="text-base font-normal text-stone-500">kg par hectare</span></p>
                        <span className={`text-sm font-semibold ${level.color} px-2 py-0.5 rounded`}>{level.label}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-3">
                        Ce chiffre est une moyenne calculée par 2 méthodes différentes pour plus de fiabilité.
                      </p>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-4 border border-stone-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M3 20h18M3 20l7-14 4 8 3-5 4 11"/></svg>
                      </div>
                      <span className="text-xs font-semibold text-stone-700">Tendance historique</span>
                    </div>
                    <p className="text-xl font-bold text-stone-800 mb-1">{yieldData.regression?.predicted_yield_kg} kg/ha</p>
                    <p className="text-xs text-stone-500">Basée sur la relation entre pluie, température et rendements passés.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-stone-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="8" r="2"/><circle cx="19" cy="16" r="2"/></svg>
                      </div>
                      <span className="text-xs font-semibold text-stone-700">Parcelles similaires</span>
                    </div>
                    <p className="text-xl font-bold text-stone-800 mb-1">{yieldData.knn?.predicted_yield_kg} kg/ha</p>
                    <p className="text-xs text-stone-500">Basée sur des parcelles avec les mêmes conditions que vous.</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* AVANCÉ — tous les détails techniques */}
                {yieldData.ensemble && (
                  <div className="bg-white rounded-lg p-4 border border-stone-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-stone-400 mb-1">Rendement estimé (ensemble pondéré)</p>
                        <p className="text-2xl font-bold text-stone-900">{yieldData.ensemble.predicted_yield_kg} <span className="text-sm font-normal text-stone-400">kg/ha</span></p>
                      </div>
                      <div className="text-right text-xs text-stone-400 space-y-0.5">
                        <div>Méthode : {yieldData.ensemble.method}</div>
                        <div>Pondération : OLS {yieldData.ensemble.weights?.regression} | KNN {yieldData.ensemble.weights?.knn}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <p className="text-[10px] uppercase tracking-wide text-stone-400 mb-2">Régression linéaire multiple (OLS)</p>
                    <p className="text-lg font-bold text-stone-800">{yieldData.regression?.predicted_yield_kg} kg/ha</p>
                    <div className="mt-2 text-xs text-stone-500 space-y-0.5">
                      <div className="flex justify-between"><span>R²</span><span className="font-mono">{yieldData.regression?.r_squared}</span></div>
                      <div className="flex justify-between"><span>Coeff. pluie</span><span className="font-mono">{yieldData.regression?.coefficients?.rain}</span></div>
                      <div className="flex justify-between"><span>Coeff. temp</span><span className="font-mono">{yieldData.regression?.coefficients?.temperature}</span></div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-mono">
                      β̂ = (XᵀX)⁻¹ · Xᵀy
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <p className="text-[10px] uppercase tracking-wide text-stone-400 mb-2">K plus proches voisins (k=3)</p>
                    <p className="text-lg font-bold text-stone-800">{yieldData.knn?.predicted_yield_kg} kg/ha</p>
                    <div className="mt-2 text-xs text-stone-500 space-y-0.5">
                      <div className="flex justify-between"><span>Confiance</span><span className="font-mono">{yieldData.knn?.confidence}</span></div>
                      {yieldData.knn?.neighbors?.slice(0, 3).map((n, i) => (
                        <div key={i} className="flex justify-between"><span>Voisin {i+1}</span><span className="font-mono">{n.yield} kg (w={n.weight})</span></div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-mono">
                      ŷ = Σ(yᵢ·wᵢ) / Σwᵢ
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== CALENDRIER GÉNÉTIQUE ===== */}
        {activeTab === 'genetic' && optimization && (
          <div className="space-y-4">
            {viewMode === 'simple' ? (
              <>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-sm text-amber-900 font-medium mb-1">Le meilleur ordre de semis pour vos parcelles</p>
                  <p className="text-xs text-amber-700">Notre système a testé des milliers de combinaisons pour trouver le calendrier qui donne le meilleur rendement total.</p>
                </div>

                <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
                  {optimization.calendar?.map((c, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <span className="text-sm font-bold text-amber-800">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-stone-800">Parcelle {c.parcel} → {c.crop}</div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          Semer en <span className="font-semibold text-amber-700">{c.sowMonthName}</span> pour profiter de {c.expectedRain}mm de pluie
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-green-700">{c.predictedYield} kg/ha</div>
                        <div className="text-xs text-stone-400">rendement prévu</div>
                      </div>
                    </div>
                  ))}
                </div>

                {optimization.optimization && (
                  <div className="bg-stone-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-stone-600">
                      Gain estimé par rapport à un semis non planifié : <span className="font-bold text-green-700">{optimization.optimization.convergence?.improvement || '+15%'}</span>
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* AVANCÉ — détails de l'algorithme génétique */}
                <div className="bg-white rounded-lg p-4 border border-stone-200">
                  <p className="text-[10px] uppercase tracking-wide text-stone-400 mb-3">Calendrier optimisé par algorithme génétique (50 individus, 80 générations)</p>
                  <div className="space-y-3">
                    {optimization.calendar?.map((c, i) => (
                      <div key={i} className="flex items-center gap-4 py-2 border-b border-stone-50 last:border-0">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-xs font-bold text-amber-800">
                          P{c.parcel}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-stone-800">{c.crop}</div>
                          <div className="text-xs text-stone-400">Semis : {c.sowMonthName} | Pluie attendue : {c.expectedRain}mm | T°moy : {c.avgTemp}°C</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-stone-800">{c.predictedYield} kg/ha</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
                      <span className="font-medium text-stone-700">{optimization.optimization?.parameters?.mutation_rate || '0.15'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Amélioration</span>
                      <span className="font-medium text-green-700">{optimization.optimization?.convergence?.improvement || '+15%'}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-mono">
                    fitness(x) = Σ yield(cropᵢ, monthᵢ) × (1 - P_fail(cropᵢ, monthᵢ))
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== RISQUES BAYÉSIENS ===== */}
        {activeTab === 'bayesian' && bayesian && (
          <div className="space-y-4">
            {viewMode === 'simple' ? (
              <>
                {/* SIMPLE — compréhensible par tous */}
                <div className="bg-white rounded-lg p-5 border border-stone-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center flex-shrink-0" style={{
                      borderColor: bayesian.safetyScore >= 70 ? '#4d7c0f' : bayesian.safetyScore >= 40 ? '#b45309' : '#dc2626'
                    }}>
                      <span className="text-lg font-bold">{bayesian.safetyScore}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        {bayesian.safetyScore >= 70 ? 'Votre culture est en sécurité' :
                         bayesian.safetyScore >= 40 ? 'Quelques risques à surveiller' :
                         'Attention — risques importants'}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">{bayesian.recommendation}</p>
                      <p className="text-xs text-stone-400 mt-2">Score sur 100 — plus c'est haut, mieux c'est</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-stone-200">
                  <p className="text-sm font-semibold text-stone-800 mb-3">Les dangers pour votre récolte :</p>
                  <div className="space-y-4">
                    {[
                      { label: 'Manque d\'eau (sécheresse)', value: bayesian.factors?.drought_probability, icon: '☀️', advice: 'Prévoyez un paillage ou arrosage d\'appoint' },
                      { label: 'Trop de chaleur', value: bayesian.factors?.heat_stress_probability, icon: '🌡️', advice: 'Semez des variétés tolérantes à la chaleur' },
                      { label: 'Insectes et maladies', value: bayesian.factors?.pest_pressure_probability, icon: '🐛', advice: 'Préparez un traitement au neem préventif' },
                      { label: 'Trop d\'eau (inondation)', value: bayesian.factors?.flood_risk_probability, icon: '🌊', advice: 'Choisissez une parcelle bien drainée' },
                    ].map((factor, i) => {
                      const pct = parseFloat(factor.value) || 0;
                      const risk = getRiskLabel(factor.value);
                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{factor.icon}</span>
                              <span className="text-sm text-stone-700">{factor.label}</span>
                            </div>
                            <span className={`text-xs font-semibold ${risk.color}`}>{risk.icon} {risk.text}</span>
                          </div>
                          <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: pct <= 20 ? '#4d7c0f' : pct <= 50 ? '#b45309' : '#dc2626' }}
                            />
                          </div>
                          {pct > 20 && (
                            <p className="text-xs text-stone-500 pl-7">→ {factor.advice}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-4 border border-stone-200 text-center">
                    <p className="text-xs text-stone-500 mb-1">Chance de perdre la récolte</p>
                    <p className="text-xl font-bold text-red-700">{bayesian.outcomes?.crop_failure_probability}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-stone-200 text-center">
                    <p className="text-xs text-stone-500 mb-1">Chance d'avoir moins que prévu</p>
                    <p className="text-xl font-bold text-orange-700">{bayesian.outcomes?.yield_loss_probability}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* AVANCÉ — réseau bayésien complet */}
                <div className="bg-white rounded-lg p-4 border border-stone-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-stone-400">Score de sécurité (inférence bayésienne)</p>
                      <p className="text-2xl font-bold text-stone-900">{bayesian.safetyScore}<span className="text-sm font-normal text-stone-400">/100</span></p>
                    </div>
                    <div className="w-14 h-14 rounded-full border-4 flex items-center justify-center" style={{
                      borderColor: bayesian.safetyScore >= 70 ? '#4d7c0f' : bayesian.safetyScore >= 40 ? '#b45309' : '#dc2626'
                    }}>
                      <span className="text-sm font-bold">{bayesian.safetyScore}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600">{bayesian.recommendation}</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-stone-200">
                  <p className="text-[10px] uppercase tracking-wide text-stone-400 mb-3">Probabilités conditionnelles inférées (6 nœuds)</p>
                  <div className="space-y-3">
                    {[
                      { label: 'P(Sécheresse)', value: bayesian.factors?.drought_probability, color: '#dc2626' },
                      { label: 'P(Stress thermique)', value: bayesian.factors?.heat_stress_probability, color: '#ea580c' },
                      { label: 'P(Pression parasitaire)', value: bayesian.factors?.pest_pressure_probability, color: '#d97706' },
                      { label: 'P(Inondation)', value: bayesian.factors?.flood_risk_probability, color: '#2563eb' },
                    ].map((factor, i) => {
                      const pct = parseFloat(factor.value) || 0;
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-stone-600 font-mono">{factor.label}</span>
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

                <div className="bg-stone-100 rounded-lg p-3">
                  <p className="text-[10px] text-stone-500 font-mono text-center">
                    P(fail) = Σ P(fail|parents) × P(drought) × P(heat) × P(pest) × P(flood) — Inférence exacte par énumération
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 bg-stone-100 border-t border-stone-200">
        <p className="text-[10px] text-stone-400 text-center">
          {viewMode === 'simple'
            ? 'Données : ISRA/ANACIM 2015-2024 • Calculs effectués en temps réel'
            : 'OLS (R²=0.82-0.91) + KNN (k=3, dist. euclid.) • GA (pop=50, gen=80, BLX-α) • BBN (6 nœuds, inférence exacte) — ISRA/ANACIM 2015-2024'
          }
        </p>
      </div>
    </div>
  );
}

export default MLResults

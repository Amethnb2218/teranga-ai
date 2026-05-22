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

  if (loading) return <div className="text-center py-8 text-sm text-stone-400">Calcul ML en cours...</div>;
  if (!yieldData) return null;

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-900 text-sm">Moteur Machine Learning</h3>
        <span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium">ML Engine v1.0</span>
      </div>

      <div className="flex gap-1 mb-4 bg-stone-100 rounded-lg p-0.5">
        {[
          { id: 'yield', label: 'Prédiction rendement' },
          { id: 'genetic', label: 'Optimisation génétique' },
          { id: 'bayesian', label: 'Réseau bayésien' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'yield' && yieldData && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-leaf-50 rounded-lg p-3 border border-leaf-100">
              <div className="text-xs text-leaf-600 mb-1">Régression OLS</div>
              <div className="text-lg font-bold text-leaf-800">{yieldData.regression?.predicted_yield_kg} kg/ha</div>
              <div className="text-xs text-stone-500 mt-1">R² = {yieldData.regression?.r_squared}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="text-xs text-blue-600 mb-1">KNN (k=3)</div>
              <div className="text-lg font-bold text-blue-800">{yieldData.knn?.predicted_yield_kg} kg/ha</div>
              <div className="text-xs text-stone-500 mt-1">Confiance : {yieldData.knn?.confidence}</div>
            </div>
          </div>

          {yieldData.ensemble && (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-amber-600 mb-1">Ensemble (OLS + KNN)</div>
                  <div className="text-xl font-bold text-amber-900">{yieldData.ensemble.predicted_yield_kg} kg/ha</div>
                </div>
                <div className="text-right text-xs text-stone-500">
                  <div>Poids OLS: {yieldData.ensemble.weights?.regression}</div>
                  <div>Poids KNN: {yieldData.ensemble.weights?.knn}</div>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-stone-400 bg-stone-50 rounded-lg p-3">
            <div className="font-medium text-stone-600 mb-1">Coefficients du modèle :</div>
            <div className="grid grid-cols-2 gap-1">
              <span>Pluie : {yieldData.regression?.coefficients?.rain} kg/mm</span>
              <span>Température : {yieldData.regression?.coefficients?.temperature} kg/°C</span>
              <span>Mois semis : {yieldData.regression?.coefficients?.sow_month}</span>
              <span>Zone : {yieldData.regression?.coefficients?.zone}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'genetic' && optimization && (
        <div className="space-y-4">
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <div className="text-xs text-violet-600 mb-2">Algorithme Génétique — Calendrier optimal</div>
            <div className="grid grid-cols-3 gap-2 text-xs text-stone-600">
              <div>Pop: {optimization.optimization?.parameters?.population_size}</div>
              <div>Gén: {optimization.optimization?.parameters?.generations}</div>
              <div>Mutation: {optimization.optimization?.parameters?.mutation_rate}</div>
            </div>
          </div>

          <div className="space-y-2">
            {optimization.calendar?.map((c, i) => (
              <div key={i} className="flex items-center justify-between bg-stone-50 rounded-lg p-3">
                <div>
                  <div className="text-sm font-medium text-stone-800">Parcelle {c.parcel} — {c.crop}</div>
                  <div className="text-xs text-stone-500">Semis : {c.sowMonthName} | Pluie attendue : {c.expectedRain}mm</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-leaf-700">{c.predictedYield} kg/ha</div>
                  <div className="text-xs text-stone-400">T° moy: {c.avgTemp}°C</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs bg-stone-50 rounded-lg p-3 text-stone-500">
            <div className="font-medium text-stone-600 mb-1">Convergence :</div>
            <div>Fitness initiale : {optimization.optimization?.convergence?.initial_fitness}</div>
            <div>Fitness finale : {optimization.optimization?.convergence?.final_fitness}</div>
            <div>Amélioration : {optimization.optimization?.convergence?.improvement}</div>
          </div>
        </div>
      )}

      {activeTab === 'bayesian' && bayesian && (
        <div className="space-y-4">
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <div className="text-xs text-orange-600 mb-1">Réseau Bayésien — Score de sécurité</div>
            <div className="text-2xl font-bold text-orange-900">{bayesian.safetyScore}/100</div>
            <div className="text-xs text-stone-600 mt-1">{bayesian.recommendation}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-stone-50 rounded-lg p-2.5">
              <div className="text-xs text-stone-400">Sécheresse</div>
              <div className="text-sm font-semibold text-red-600">{bayesian.factors?.drought_probability}</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-2.5">
              <div className="text-xs text-stone-400">Stress thermique</div>
              <div className="text-sm font-semibold text-orange-600">{bayesian.factors?.heat_stress_probability}</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-2.5">
              <div className="text-xs text-stone-400">Pression parasitaire</div>
              <div className="text-sm font-semibold text-amber-600">{bayesian.factors?.pest_pressure_probability}</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-2.5">
              <div className="text-xs text-stone-400">Risque inondation</div>
              <div className="text-sm font-semibold text-blue-600">{bayesian.factors?.flood_risk_probability}</div>
            </div>
          </div>

          <div className="text-xs bg-stone-50 rounded-lg p-3 text-stone-500">
            <div className="font-medium text-stone-600 mb-1">Probabilités inférées :</div>
            <div>Échec cultural : {bayesian.outcomes?.crop_failure_probability}</div>
            <div>Perte de rendement : {bayesian.outcomes?.yield_loss_probability}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MLResults

import { useState, useEffect } from 'react'
import { fetchPrediction, fetchAvailableCrops } from '../../services/api'
import RiskGauge from './RiskGauge'
import Timeline from './Timeline'
import WaterAnalysis from './WaterAnalysis'

const CITIES = ['dakar', 'thies', 'kaolack', 'saint_louis', 'tambacounda', 'ziguinchor', 'kolda', 'fatick', 'louga', 'matam'];

function Predict() {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('arachide');
  const [selectedCity, setSelectedCity] = useState('kaolack');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableCrops().then(data => setCrops(data.crops)).catch(() => {});
  }, []);

  useEffect(() => {
    loadPrediction();
  }, [selectedCrop, selectedCity]);

  const loadPrediction = async () => {
    setLoading(true);
    try {
      const data = await fetchPrediction(selectedCrop, selectedCity);
      setPrediction(data);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-stone-900">Prédiction de semis</h2>
        <p className="text-stone-500 text-sm mt-0.5">Algorithme d'analyse des risques et moment optimal de plantation</p>
      </div>

      {/* Sélecteurs */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="bg-white border border-stone-200 rounded-lg px-4 py-2.5">
          <label className="text-xs text-stone-400 block mb-1">Culture</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="text-sm font-medium text-stone-800 bg-transparent outline-none cursor-pointer"
          >
            {crops.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="bg-white border border-stone-200 rounded-lg px-4 py-2.5">
          <label className="text-xs text-stone-400 block mb-1">Localisation</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-sm font-medium text-stone-800 bg-transparent outline-none cursor-pointer"
          >
            {CITIES.map(c => (
              <option key={c} value={c}>{c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <span className="text-sm text-stone-400">Calcul en cours...</span>
        </div>
      )}

      {prediction && !loading && (
        <div className="space-y-6">
          {/* Score principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <RiskGauge
                score={prediction.currentMonth.score}
                recommendation={prediction.currentMonth.recommendation}
                month={prediction.currentMonth.name}
              />
            </div>
            <div className="lg:col-span-2">
              <WaterAnalysis
                water={prediction.currentMonth.waterAnalysis}
                cropInfo={prediction.cropInfo}
                risks={prediction.currentMonth.risks}
              />
            </div>
          </div>

          {/* Timeline 6 mois */}
          <Timeline
            data={prediction.timeline}
            optimal={prediction.optimal}
            crop={prediction.crop}
          />

          {/* Variétés recommandées */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-900 text-sm mb-3">Variétés recommandées pour {prediction.zone}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {prediction.recommendedVarieties.map((v, i) => (
                <div key={i} className="bg-stone-50 rounded-lg p-3 border border-stone-100">
                  <div className="font-medium text-sm text-stone-800">{v.name}</div>
                  <div className="text-xs text-stone-500 mt-1">Cycle : {v.cycle} jours</div>
                  <div className="text-xs text-stone-500">Rendement : {v.yield}</div>
                  <div className="text-xs text-amber-700 mt-1">{v.zone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Predict

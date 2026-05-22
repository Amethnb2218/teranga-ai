import { useState, useEffect } from 'react'
import { fetchPrediction, fetchAvailableCrops } from '../../services/api'
import RiskGauge from './RiskGauge'
import Timeline from './Timeline'
import WaterAnalysis from './WaterAnalysis'
import MLResults from './MLResults'

const CITIES = [
  { id: 'dakar', name: 'Dakar', zone: 'Niayes' },
  { id: 'thies', name: 'Thiès', zone: 'Bassin arachidier' },
  { id: 'kaolack', name: 'Kaolack', zone: 'Bassin arachidier' },
  { id: 'saint_louis', name: 'Saint-Louis', zone: 'Fleuve' },
  { id: 'tambacounda', name: 'Tambacounda', zone: 'Sénégal oriental' },
  { id: 'ziguinchor', name: 'Ziguinchor', zone: 'Casamance' },
  { id: 'kolda', name: 'Kolda', zone: 'Haute Casamance' },
  { id: 'fatick', name: 'Fatick', zone: 'Sine Saloum' },
  { id: 'louga', name: 'Louga', zone: 'Sylvo-pastoral' },
  { id: 'matam', name: 'Matam', zone: 'Fleuve' }
];

function Predict() {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('arachide');
  const [selectedCity, setSelectedCity] = useState('kaolack');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showML, setShowML] = useState(false);

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

  const currentCity = CITIES.find(c => c.id === selectedCity);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* En-tête avec contexte terrain */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="section-label mb-1">Aide à la décision</p>
          <h2 className="text-xl font-bold text-stone-900">Quand semer ? Où planter ?</h2>
          <p className="text-stone-500 text-sm mt-1">
            Analyse croisée climat × sol × culture pour votre zone — basée sur 10 ans de données ISRA/ANACIM
          </p>
        </div>
        {currentCity && (
          <div className="text-right text-xs text-stone-400">
            <span className="block font-medium text-stone-600">{currentCity.name}</span>
            <span>Zone : {currentCity.zone}</span>
          </div>
        )}
      </div>

      {/* Sélection culture + ville — style formulaire terrain */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-2">Quelle culture voulez-vous semer ?</label>
            <div className="flex flex-wrap gap-2">
              {crops.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    selectedCrop === c.id
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300 hover:text-amber-800'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-2">Où se trouve votre parcelle ?</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full text-sm font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400 cursor-pointer"
            >
              {CITIES.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.zone}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16">
          <div className="inline-block w-6 h-6 border-2 border-amber-700 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-stone-500">Analyse de votre zone en cours...</p>
        </div>
      )}

      {prediction && !loading && (
        <div className="space-y-5 fade-in">
          {/* Verdict principal — grand et clair */}
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

          {/* Timeline */}
          <Timeline
            data={prediction.timeline}
            optimal={prediction.optimal}
            crop={prediction.crop}
          />

          {/* Variétés ISRA */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-stone-900 text-sm">Variétés adaptées à votre zone</h3>
                <p className="text-xs text-stone-400 mt-0.5">Recommandations ISRA pour la zone {prediction.zone}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {prediction.recommendedVarieties.map((v, i) => (
                <div key={i} className="border border-stone-150 rounded-lg p-3 hover:border-amber-200 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    <span className="font-semibold text-sm text-stone-800">{v.name}</span>
                  </div>
                  <div className="space-y-1 text-xs text-stone-500">
                    <div className="flex justify-between">
                      <span>Cycle</span>
                      <span className="font-medium text-stone-700">{v.cycle} jours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rendement potentiel</span>
                      <span className="font-medium text-stone-700">{v.yield}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zone</span>
                      <span className="font-medium text-amber-700">{v.zone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton pour afficher l'analyse ML détaillée */}
          <div className="text-center">
            <button
              onClick={() => setShowML(!showML)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4m0 12v4m-7-7H1m22 0h-4m-2.3-5.7l2.8-2.8M4.5 19.5l2.8-2.8m0-9.4L4.5 4.5m15 15l-2.8-2.8"/>
              </svg>
              {showML ? 'Masquer l\'analyse avancée' : 'Voir l\'analyse algorithmique détaillée'}
            </button>
          </div>

          {showML && <MLResults crop={selectedCrop} city={selectedCity} />}
        </div>
      )}
    </div>
  );
}

export default Predict

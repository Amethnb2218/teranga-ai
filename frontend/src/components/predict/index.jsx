import { useState, useEffect } from 'react'
import { fetchPrediction, fetchAvailableCrops } from '../../services/api'
import RiskGauge from './RiskGauge'
import Timeline from './Timeline'
import WaterAnalysis from './WaterAnalysis'
import MLResults from './MLResults'

const CITIES_BY_COUNTRY = [
  {
    country: 'Senegal 🇸🇳',
    cities: [
      { id: 'dakar', name: 'Dakar', zone: 'Niayes' },
      { id: 'thies', name: 'Thies', zone: 'Bassin arachidier / Niayes' },
      { id: 'diourbel', name: 'Diourbel', zone: 'Bassin arachidier' },
      { id: 'kaolack', name: 'Kaolack', zone: 'Bassin arachidier' },
      { id: 'kaffrine', name: 'Kaffrine', zone: 'Bassin arachidier sud' },
      { id: 'fatick', name: 'Fatick', zone: 'Sine Saloum' },
      { id: 'saint_louis', name: 'Saint-Louis', zone: 'Fleuve (delta)' },
      { id: 'matam', name: 'Matam', zone: 'Fleuve (haute vallee)' },
      { id: 'louga', name: 'Louga', zone: 'Sylvo-pastorale' },
      { id: 'tambacounda', name: 'Tambacounda', zone: 'Senegal oriental' },
      { id: 'kedougou', name: 'Kedougou', zone: 'Senegal oriental sud' },
      { id: 'kolda', name: 'Kolda', zone: 'Haute Casamance' },
      { id: 'sedhiou', name: 'Sedhiou', zone: 'Moyenne Casamance' },
      { id: 'ziguinchor', name: 'Ziguinchor', zone: 'Basse Casamance' },
    ]
  },
  {
    country: 'Niger 🇳🇪',
    cities: [
      { id: 'niamey', name: 'Niamey', zone: 'Fleuve Niger' },
      { id: 'tillaberi', name: 'Tillaberi', zone: 'Zone sahelienne' },
      { id: 'dosso', name: 'Dosso', zone: 'Zone soudanienne' },
      { id: 'maradi', name: 'Maradi', zone: 'Bassin arachidier' },
      { id: 'zinder', name: 'Zinder', zone: 'Zone agro-pastorale' },
    ]
  },
  {
    country: 'Mali 🇲🇱',
    cities: [
      { id: 'bamako', name: 'Bamako', zone: 'Zone soudanienne' },
      { id: 'sikasso', name: 'Sikasso', zone: 'Zone soudano-guineenne' },
      { id: 'mopti', name: 'Mopti', zone: 'Delta interieur' },
      { id: 'kayes', name: 'Kayes', zone: 'Zone soudanienne ouest' },
    ]
  },
  {
    country: 'Burkina Faso 🇧🇫',
    cities: [
      { id: 'ouagadougou', name: 'Ouagadougou', zone: 'Plateau central' },
      { id: 'bobo_dioulasso', name: 'Bobo-Dioulasso', zone: 'Zone soudanienne' },
      { id: 'koudougou', name: 'Koudougou', zone: 'Centre-ouest' },
    ]
  },
  {
    country: 'Tchad 🇹🇩',
    cities: [
      { id: 'ndjamena', name: 'N\'Djamena', zone: 'Zone sahelienne' },
      { id: 'moundou', name: 'Moundou', zone: 'Zone soudanienne' },
    ]
  },
];

const ALL_CITIES = CITIES_BY_COUNTRY.flatMap(g => g.cities);

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
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const currentCity = ALL_CITIES.find(c => c.id === selectedCity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-40 sm:h-48">
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80"
          alt="Champ de mil au Sahel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent"></div>
        <div className="absolute inset-0 flex items-center px-6 sm:px-8">
          <div>
            <p className="section-label text-teal-300 mb-1">Aide &agrave; la d&eacute;cision</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Quand semer ? O&ugrave; planter ?</h2>
            <p className="text-slate-300 text-sm mt-1">
              Analyse crois&eacute;e climat &times; sol &times; culture &mdash; 10 pays du Sahel
            </p>
          </div>
        </div>
      </div>

      {/* Header info */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="hidden"></div>
        {currentCity && (
          <div className="text-right text-xs text-slate-400">
            <span className="block font-medium text-slate-600">{currentCity.name}</span>
            <span>Zone : {currentCity.zone}</span>
          </div>
        )}
      </div>

      {/* Selection panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-2">Quelle culture voulez-vous semer ?</label>
            <div className="flex flex-wrap gap-2">
              {crops.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    selectedCrop === c.id
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-800'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-2">Ou se trouve votre parcelle ?</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-teal-400 cursor-pointer"
            >
              {CITIES_BY_COUNTRY.map(group => (
                <optgroup key={group.country} label={group.country}>
                  {group.cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.zone}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16">
          <div className="inline-block w-6 h-6 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-slate-500">Analyse de votre zone en cours...</p>
          <p className="text-xs text-slate-300 mt-2">Premier chargement : ~30s (demarrage serveur)</p>
        </div>
      )}

      {!prediction && !loading && (
        <div className="text-center py-16">
          <p className="text-sm text-slate-500 mb-3">Le serveur n'a pas repondu a temps.</p>
          <button onClick={loadPrediction} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
            Reessayer
          </button>
        </div>
      )}

      {prediction && !loading && (
        <div className="space-y-5 fade-in">
          {/* Main results */}
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

          {/* Varieties */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Varietes adaptees a votre zone</h3>
                <p className="text-xs text-slate-400 mt-0.5">Recommandations ISRA pour la zone {prediction.zone}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {prediction.recommendedVarieties.map((v, i) => (
                <div key={i} className="border border-slate-150 rounded-lg p-3 hover:border-teal-200 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    <span className="font-semibold text-sm text-slate-800">{v.name}</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span>Cycle</span>
                      <span className="font-medium text-slate-700">{v.cycle} jours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rendement potentiel</span>
                      <span className="font-medium text-slate-700">{v.yield}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zone</span>
                      <span className="font-medium text-teal-700">{v.zone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ML toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowML(!showML)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4m0 12v4m-7-7H1m22 0h-4m-2.3-5.7l2.8-2.8M4.5 19.5l2.8-2.8m0-9.4L4.5 4.5m15 15l-2.8-2.8"/>
              </svg>
              {showML ? 'Masquer l\'analyse avancee' : 'Voir l\'analyse algorithmique detaillee'}
            </button>
          </div>

          {showML && <MLResults crop={selectedCrop} city={selectedCity} />}
        </div>
      )}
    </div>
  );
}

export default Predict

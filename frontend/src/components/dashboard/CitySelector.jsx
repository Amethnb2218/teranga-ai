import { FiMapPin } from 'react-icons/fi'

const CITIES_BY_COUNTRY = {
  'Senegal': ['dakar', 'thies', 'kaolack', 'saint_louis', 'tambacounda', 'ziguinchor', 'kolda', 'fatick', 'louga', 'matam'],
  'Niger': ['niamey', 'maradi', 'zinder', 'tillaberi', 'agadez'],
  'Mali': ['bamako', 'sikasso', 'mopti', 'gao', 'segou'],
  'Burkina Faso': ['ouagadougou', 'bobo_dioulasso', 'koudougou', 'dedougou'],
  'Tchad': ['ndjamena', 'moundou', 'abeche'],
  'Nigeria': ['kano', 'sokoto', 'maiduguri'],
  'Cameroun': ['maroua', 'garoua'],
  'Guinee': ['conakry', 'kankan'],
  'Gambie': ['banjul'],
  'Mauritanie': ['nouakchott', 'kiffa'],
};

function formatCityName(key) {
  const special = { ndjamena: "N'Djamena", saint_louis: 'Saint-Louis', bobo_dioulasso: 'Bobo-Dioulasso', nouakchott: 'Nouakchott' };
  if (special[key]) return special[key];
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function CitySelector({ city, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
      <FiMapPin size={14} className="text-teal-700" />
      <select
        value={city}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
      >
        {Object.entries(CITIES_BY_COUNTRY).map(([country, cities]) => (
          <optgroup key={country} label={country}>
            {cities.map(c => (
              <option key={c} value={c}>{formatCityName(c)}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export default CitySelector

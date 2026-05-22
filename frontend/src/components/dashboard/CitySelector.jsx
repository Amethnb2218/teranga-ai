import { FiMapPin } from 'react-icons/fi'

const CITIES = ['dakar', 'thies', 'kaolack', 'saint_louis', 'tambacounda', 'ziguinchor', 'kolda', 'fatick', 'louga', 'matam'];

function CitySelector({ city, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-2">
      <FiMapPin size={14} className="text-amber-700" />
      <select
        value={city}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-medium text-stone-700 bg-transparent outline-none cursor-pointer"
      >
        {CITIES.map(c => (
          <option key={c} value={c}>
            {c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CitySelector

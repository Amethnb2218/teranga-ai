const CITIES = ['dakar', 'thies', 'kaolack', 'saint_louis', 'tambacounda', 'ziguinchor', 'kolda', 'fatick', 'louga', 'matam'];

function CitySelector({ city, onChange }) {
  return (
    <select
      value={city}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      {CITIES.map(c => (
        <option key={c} value={c}>
          {c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </option>
      ))}
    </select>
  );
}

export default CitySelector

const SUGGESTIONS = [
  "Quand planter l'arachide à Kaolack ?",
  "Comment traiter les pucerons sur mes tomates ?",
  "Quel engrais utiliser pour le mil ?",
  "Conseils pour l'irrigation en saison sèche",
];

function Suggestions({ onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
      {SUGGESTIONS.map((suggestion, i) => (
        <button
          key={i}
          onClick={() => onSelect(suggestion)}
          className="text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-sm text-gray-700 transition-all"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

export default Suggestions

const SUGGESTIONS = [
  { text: "Quand semer l'arachide à Kaolack ?", tag: "Calendrier" },
  { text: "Comment traiter les pucerons sur la tomate ?", tag: "Maladie" },
  { text: "Quelle variété de mil pour ma zone ?", tag: "Variétés" },
  { text: "Conseils irrigation saison sèche", tag: "Eau" },
  { text: "Prix de l'oignon aujourd'hui", tag: "Marché" },
  { text: "Naka lañu waral gerte ?", tag: "Wolof" },
];

function Suggestions({ onSelect }) {
  return (
    <div className="mb-3">
      <p className="text-xs text-stone-400 mb-2">Questions fréquentes :</p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s.text)}
            className="text-left px-3 py-2 rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 text-xs text-stone-600 transition-colors"
          >
            <span className="text-amber-700 font-medium mr-1">{s.tag}</span>
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Suggestions

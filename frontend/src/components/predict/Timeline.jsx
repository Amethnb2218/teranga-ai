function Timeline({ data, optimal, crop }) {
  if (!data) return null;

  const getBarStyle = (score) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-amber-500';
    if (score >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-stone-900 text-sm">Calendrier de semis — {crop}</h3>
      </div>
      <p className="text-xs text-stone-400 mb-4">Meilleur mois pour semer selon les conditions de votre zone</p>

      <div className="space-y-2">
        {data.map((item, i) => {
          const isOptimal = item.month === optimal.month;
          return (
            <div key={i} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isOptimal ? 'bg-amber-50 border border-amber-200' : ''}`}>
              <span className={`text-xs font-medium w-14 ${isOptimal ? 'text-amber-800' : 'text-stone-500'}`}>
                {item.monthName.slice(0, 4)}
              </span>
              <div className="flex-1 h-6 bg-stone-100 rounded relative overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-700 ${getBarStyle(item.score)}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <span className={`text-xs font-mono w-10 text-right ${isOptimal ? 'font-bold text-amber-800' : 'text-stone-500'}`}>
                {item.score}%
              </span>
              {isOptimal && (
                <span className="text-xs bg-amber-700 text-white px-2 py-0.5 rounded font-medium">
                  Meilleur
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-4 gap-2 text-xs text-stone-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-green-600 rounded-sm"></span>Excellent</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-amber-500 rounded-sm"></span>Bon</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-orange-400 rounded-sm"></span>Risqué</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-red-400 rounded-sm"></span>Éviter</span>
      </div>
    </div>
  );
}

export default Timeline

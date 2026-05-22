function Timeline({ data, optimal, crop }) {
  if (!data) return null;

  const getBarColor = (score) => {
    if (score >= 80) return 'bg-leaf-500';
    if (score >= 60) return 'bg-amber-500';
    if (score >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-900 text-sm">Fenêtre optimale de semis — {crop}</h3>
        <span className="text-xs text-stone-400">Prochains 6 mois</span>
      </div>

      <div className="space-y-2.5">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={`text-xs font-medium w-16 ${item.month === optimal.month ? 'text-amber-700' : 'text-stone-500'}`}>
              {item.monthName.slice(0, 4)}
            </span>
            <div className="flex-1 h-7 bg-stone-100 rounded-md relative overflow-hidden">
              <div
                className={`h-full rounded-md transition-all ${getBarColor(item.score)} ${item.month === optimal.month ? 'ring-2 ring-amber-300' : ''}`}
                style={{ width: `${item.score}%` }}
              />
              <span className="absolute inset-y-0 right-2 flex items-center text-xs font-medium text-stone-600">
                {item.score}/100
              </span>
            </div>
            {item.month === optimal.month && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium whitespace-nowrap">
                Optimal
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-4 text-xs text-stone-400">
        <span className="flex items-center gap-1"><span className="w-3 h-2 bg-leaf-500 rounded-sm"></span> Excellent</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 bg-amber-500 rounded-sm"></span> Favorable</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 bg-orange-400 rounded-sm"></span> Risqué</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 bg-red-400 rounded-sm"></span> Défavorable</span>
      </div>
    </div>
  );
}

export default Timeline

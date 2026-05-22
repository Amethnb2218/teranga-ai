function RiskGauge({ score, recommendation, month }) {
  const getColor = (s) => {
    if (s >= 80) return { ring: 'text-leaf-500', bg: 'bg-leaf-50', border: 'border-leaf-200' };
    if (s >= 60) return { ring: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (s >= 40) return { ring: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { ring: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const colors = getColor(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`${colors.bg} rounded-xl border ${colors.border} p-5 text-center`}>
      <p className="text-xs text-stone-500 mb-3">Score de faisabilité — {month}</p>

      <div className="relative inline-flex items-center justify-center">
        <svg width="120" height="120" className="-rotate-90">
          <circle cx="60" cy="60" r="45" fill="none" stroke="#e7e5e4" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="45" fill="none"
            className={colors.ring}
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-stone-900">{score}</span>
        </div>
      </div>

      <div className="mt-3">
        <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
          score >= 80 ? 'bg-leaf-100 text-leaf-800' :
          score >= 60 ? 'bg-amber-100 text-amber-800' :
          score >= 40 ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {recommendation?.level === 'excellent' ? 'Excellent' :
           recommendation?.level === 'good' ? 'Favorable' :
           recommendation?.level === 'moderate' ? 'Risqué' : 'Défavorable'}
        </span>
      </div>
      <p className="text-xs text-stone-600 mt-2 leading-relaxed">{recommendation?.text}</p>
    </div>
  );
}

export default RiskGauge

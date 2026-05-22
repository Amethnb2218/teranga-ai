function RiskGauge({ score, recommendation, month }) {
  const getColor = (s) => {
    if (s >= 80) return { ring: '#4d7c0f', bg: 'bg-green-50', text: 'text-green-800', label: 'Excellent' };
    if (s >= 60) return { ring: '#b45309', bg: 'bg-amber-50', text: 'text-amber-800', label: 'Favorable' };
    if (s >= 40) return { ring: '#c2410c', bg: 'bg-orange-50', text: 'text-orange-800', label: 'Risqué' };
    return { ring: '#dc2626', bg: 'bg-red-50', text: 'text-red-800', label: 'Défavorable' };
  };

  const colors = getColor(score);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`${colors.bg} rounded-xl p-5 h-full flex flex-col items-center justify-center`}>
      <p className="text-xs font-medium text-stone-500 mb-4 text-center">
        Faisabilité du semis — <span className="font-semibold text-stone-700">{month}</span>
      </p>

      <div className="relative inline-flex items-center justify-center mb-4">
        <svg width="130" height="130" className="-rotate-90">
          <circle cx="65" cy="65" r="52" fill="none" stroke="#e7e5e4" strokeWidth="10" />
          <circle
            cx="65" cy="65" r="52" fill="none"
            stroke={colors.ring}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-stone-900">{score}</span>
          <span className="text-xs text-stone-400">/100</span>
        </div>
      </div>

      <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text} border border-current/10`}>
        {colors.label}
      </span>

      {recommendation?.text && (
        <p className="text-xs text-stone-600 mt-3 text-center leading-relaxed max-w-[200px]">
          {recommendation.text}
        </p>
      )}
    </div>
  );
}

export default RiskGauge

function WaterAnalysis({ water, cropInfo, risks }) {
  if (!water) return null;

  const waterRatio = Math.min(100, Math.round((water.expected / water.needed) * 100));

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 h-full">
      <h3 className="font-semibold text-stone-900 text-sm mb-1">Bilan hydrique & risques</h3>
      <p className="text-xs text-stone-400 mb-4">Besoins en eau vs pluviométrie attendue sur le cycle</p>

      {/* Jauge eau */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-stone-600 font-medium">Couverture hydrique</span>
          <span className="font-mono text-stone-700">{water.expected}mm sur {water.needed}mm requis</span>
        </div>
        <div className="h-4 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              waterRatio >= 80 ? 'bg-blue-500' :
              waterRatio >= 50 ? 'bg-amber-500' : 'bg-red-400'
            }`}
            style={{ width: `${waterRatio}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs">
          <span className={water.irrigationNeeded ? 'text-red-600 font-medium' : 'text-green-700 font-medium'}>
            {water.irrigationNeeded ? 'Irrigation recommandée' : 'Pluviométrie suffisante'}
          </span>
          <span className="font-mono text-stone-500">{waterRatio}%</span>
        </div>
      </div>

      {/* Données culture */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-stone-50 rounded-lg p-2.5 text-center border border-stone-100">
          <div className="text-[10px] uppercase tracking-wide text-stone-400 mb-0.5">Cycle</div>
          <div className="text-sm font-bold text-stone-800">{cropInfo.cycleDays}<span className="text-xs font-normal text-stone-400">j</span></div>
        </div>
        <div className="bg-stone-50 rounded-lg p-2.5 text-center border border-stone-100">
          <div className="text-[10px] uppercase tracking-wide text-stone-400 mb-0.5">Eau requise</div>
          <div className="text-sm font-bold text-stone-800">{cropInfo.waterNeeds}<span className="text-xs font-normal text-stone-400">mm</span></div>
        </div>
        <div className="bg-stone-50 rounded-lg p-2.5 text-center border border-stone-100">
          <div className="text-[10px] uppercase tracking-wide text-stone-400 mb-0.5">T° idéale</div>
          <div className="text-sm font-bold text-stone-800">{cropInfo.optimalTemp}<span className="text-xs font-normal text-stone-400">°C</span></div>
        </div>
      </div>

      {/* Risques */}
      {risks && risks.length > 0 && (
        <div>
          <p className="text-xs font-medium text-stone-600 mb-2">Risques identifiés pour cette période :</p>
          <div className="space-y-1.5">
            {risks.map((risk, i) => (
              <div key={i} className={`text-xs px-3 py-2 rounded-lg border-l-3 ${
                risk.severity === 'high'
                  ? 'bg-red-50 text-red-800 border-l-red-500'
                  : 'bg-amber-50 text-amber-800 border-l-amber-500'
              }`} style={{ borderLeftWidth: '3px' }}>
                {risk.detail}
              </div>
            ))}
          </div>
        </div>
      )}

      {risks && risks.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 border border-green-100">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          Aucun risque majeur identifié pour cette période
        </div>
      )}
    </div>
  );
}

export default WaterAnalysis

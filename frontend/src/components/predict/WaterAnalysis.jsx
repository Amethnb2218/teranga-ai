function WaterAnalysis({ water, cropInfo, risks }) {
  if (!water) return null;

  const waterRatio = Math.min(100, Math.round((water.expected / water.needed) * 100));

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 h-full">
      <h3 className="font-semibold text-stone-900 text-sm mb-4">Analyse hydrique & risques</h3>

      {/* Barre d'eau */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          <span>Apport hydrique attendu</span>
          <span>{water.expected}mm / {water.needed}mm nécessaires</span>
        </div>
        <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              waterRatio >= 80 ? 'bg-blue-500' :
              waterRatio >= 50 ? 'bg-amber-500' : 'bg-red-400'
            }`}
            style={{ width: `${waterRatio}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs">
          <span className={water.irrigationNeeded ? 'text-red-600 font-medium' : 'text-stone-400'}>
            {water.irrigationNeeded ? '⚠ Irrigation nécessaire' : 'Pluviométrie suffisante'}
          </span>
          <span className="text-stone-400">{waterRatio}%</span>
        </div>
      </div>

      {/* Infos culture */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-stone-50 rounded-lg p-2.5 text-center">
          <div className="text-xs text-stone-400">Cycle</div>
          <div className="text-sm font-semibold text-stone-800">{cropInfo.cycleDays}j</div>
        </div>
        <div className="bg-stone-50 rounded-lg p-2.5 text-center">
          <div className="text-xs text-stone-400">Besoin eau</div>
          <div className="text-sm font-semibold text-stone-800">{cropInfo.waterNeeds}mm</div>
        </div>
        <div className="bg-stone-50 rounded-lg p-2.5 text-center">
          <div className="text-xs text-stone-400">T° optimale</div>
          <div className="text-sm font-semibold text-stone-800">{cropInfo.optimalTemp}°C</div>
        </div>
      </div>

      {/* Risques identifiés */}
      {risks && risks.length > 0 && (
        <div>
          <p className="text-xs font-medium text-stone-600 mb-2">Risques identifiés :</p>
          <div className="space-y-1.5">
            {risks.map((risk, i) => (
              <div key={i} className={`text-xs px-2.5 py-1.5 rounded-md ${
                risk.severity === 'high' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {risk.detail}
              </div>
            ))}
          </div>
        </div>
      )}

      {risks && risks.length === 0 && (
        <p className="text-xs text-leaf-600 bg-leaf-50 rounded-md px-2.5 py-1.5">
          Aucun risque majeur identifié pour cette période
        </p>
      )}
    </div>
  );
}

export default WaterAnalysis

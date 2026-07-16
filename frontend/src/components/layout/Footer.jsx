function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-teal-700 rounded-md flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2L12 22M12 2C9 7 5 8 2 9C5 10 9 13 12 22M12 2C15 7 19 8 22 9C19 10 15 13 12 22"/>
                </svg>
              </div>
              <span className="font-bold text-white">Teranga AI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Teranga signifie &laquo; hospitalit&eacute; &raquo; en Wolof &mdash; l&rsquo;esprit du partage des connaissances avec ceux qui en ont le plus besoin.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-slate-200 mb-3 text-sm">Sources de donn&eacute;es</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.isra.sn" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors">ISRA &mdash; Vari&eacute;t&eacute;s certifi&eacute;es</a></li>
              <li><a href="https://www.fao.org/giews" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors">FAO/GIEWS &mdash; Prix et s&eacute;curit&eacute; alimentaire</a></li>
              <li><a href="https://www.anacim.sn" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors">ANACIM &mdash; Donn&eacute;es climatiques</a></li>
              <li><a href="https://fpma.fao.org/giews/fpmat4" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors">FAO FPMA &mdash; Suivi des prix</a></li>
              <li>
                <button onClick={() => onNavigate?.('sources')} className="text-teal-400 hover:text-teal-300 transition-colors underline underline-offset-2">
                  Voir toutes les sources &rarr;
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-200 mb-3 text-sm">Cultures couvertes</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Arachide, Mil, Sorgho</li>
              <li>Riz, Ma&iuml;s, Ni&eacute;b&eacute;</li>
              <li>Tomate, Oignon, Chou</li>
              <li>Mangue, Past&egrave;que, Anacarde</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>Teranga AI &mdash; Con&ccedil;u au S&eacute;n&eacute;gal pour le Sahel</p>
          <p className="mt-2 sm:mt-0">Youth Connekt Sahel 2026 &middot; Axe 3 & 5 &middot; R&eacute;silience Climatique</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer

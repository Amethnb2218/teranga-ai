import { FiMessageCircle, FiHome, FiMenu, FiX, FiTarget, FiBookOpen, FiAlertTriangle, FiBarChart2, FiUsers } from 'react-icons/fi'
import { useState } from 'react'

const tabs = [
  { id: 'home', label: 'Accueil', icon: FiHome },
  { id: 'alerts', label: 'Alertes', icon: FiAlertTriangle },
  { id: 'dashboard', label: 'Météo', icon: FiBarChart2 },
  { id: 'predict', label: 'Prédiction', icon: FiTarget },
  { id: 'community', label: 'Communauté', icon: FiUsers },
  { id: 'chat', label: 'Conseiller', icon: FiMessageCircle },
  { id: 'sources', label: 'Sources', icon: FiBookOpen },
];

function Header({ activeTab, setActiveTab }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')} role="button" aria-label="Retour à l'accueil" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && setActiveTab('home')}>
            <div className="w-8 h-8 bg-teal-700 rounded-md flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2L12 22M12 2C9 7 5 8 2 9C5 10 9 13 12 22M12 2C15 7 19 8 22 9C19 10 15 13 12 22"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white tracking-tight leading-none">Teranga AI</span>
              <span className="text-[10px] text-teal-400 font-medium leading-none mt-0.5">Sahel R&eacute;silience</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-0.5" aria-label="Navigation principale">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-teal-700/20 text-teal-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Country flags (decorative) */}
          <div className="hidden lg:flex items-center gap-1 text-xs">
            <span title="Burkina Faso">{'\u{1F1E7}\u{1F1EB}'}</span>
            <span title="Cameroun">{'\u{1F1E8}\u{1F1F2}'}</span>
            <span title="Gambie">{'\u{1F1EC}\u{1F1F2}'}</span>
            <span title="Guinée">{'\u{1F1EC}\u{1F1F3}'}</span>
            <span title="Mali">{'\u{1F1F2}\u{1F1F1}'}</span>
            <span title="Mauritanie">{'\u{1F1F2}\u{1F1F7}'}</span>
            <span title="Niger">{'\u{1F1F3}\u{1F1EA}'}</span>
            <span title="Nigéria">{'\u{1F1F3}\u{1F1EC}'}</span>
            <span title="Sénégal">{'\u{1F1F8}\u{1F1F3}'}</span>
            <span title="Tchad">{'\u{1F1F9}\u{1F1E9}'}</span>
          </div>

          {/* Mobile menu button */}
          <button className="sm:hidden text-slate-300" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <nav className="sm:hidden pb-3 border-t border-slate-800 pt-2 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab.id ? 'bg-teal-700/20 text-teal-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header

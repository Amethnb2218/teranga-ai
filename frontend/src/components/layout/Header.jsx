import { FiMessageCircle, FiBarChart2, FiHome, FiMenu, FiX, FiTarget } from 'react-icons/fi'
import { useState } from 'react'

const tabs = [
  { id: 'home', label: 'Accueil', icon: FiHome },
  { id: 'chat', label: 'Conseiller', icon: FiMessageCircle },
  { id: 'dashboard', label: 'Marchés & Météo', icon: FiBarChart2 },
  { id: 'predict', label: 'Prédiction', icon: FiTarget },
];

function Header({ activeTab, setActiveTab }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-8 h-8 bg-amber-700 rounded-md flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2L12 22M12 2C9 7 5 8 2 9C5 10 9 13 12 22M12 2C15 7 19 8 22 9C19 10 15 13 12 22"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-stone-900 tracking-tight">Teranga</span>
          </div>

          <nav className="hidden sm:flex items-center gap-0.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-stone-100 text-stone-900'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="hidden sm:flex items-center text-xs text-stone-400 gap-1.5">
            <span className="w-1.5 h-1.5 bg-leaf-500 rounded-full"></span>
            En ligne
          </div>

          <button className="sm:hidden text-stone-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="sm:hidden pb-3 border-t border-stone-100 pt-2 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab.id ? 'bg-stone-100 text-stone-900' : 'text-stone-500'
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

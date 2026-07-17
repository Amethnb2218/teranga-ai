import { FiHome, FiMessageCircle, FiBarChart2, FiTarget, FiAlertTriangle, FiUsers } from 'react-icons/fi'

const items = [
  { id: 'home', label: 'Accueil', icon: FiHome },
  { id: 'alerts', label: 'Alertes', icon: FiAlertTriangle },
  { id: 'dashboard', label: 'Météo', icon: FiBarChart2 },
  { id: 'community', label: 'Réseau', icon: FiUsers },
  { id: 'predict', label: 'Prédiction', icon: FiTarget },
];

function MobileNav({ activeTab, setActiveTab }) {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 safe-area-bottom" aria-label="Navigation mobile">
      <div className="flex items-center justify-around h-14">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
              activeTab === item.id ? 'text-teal-700' : 'text-slate-400'
            }`}
          >
            <item.icon size={18} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default MobileNav

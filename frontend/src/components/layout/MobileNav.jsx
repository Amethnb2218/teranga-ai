import { FiHome, FiMessageCircle, FiBarChart2, FiTarget } from 'react-icons/fi'

const items = [
  { id: 'home', label: 'Accueil', icon: FiHome },
  { id: 'chat', label: 'Conseiller', icon: FiMessageCircle },
  { id: 'dashboard', label: 'Marchés', icon: FiBarChart2 },
  { id: 'predict', label: 'Prédiction', icon: FiTarget },
];

function MobileNav({ activeTab, setActiveTab }) {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
              activeTab === item.id ? 'text-amber-700' : 'text-stone-400'
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

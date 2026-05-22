import { FiSun, FiMessageCircle, FiBarChart2, FiHome } from 'react-icons/fi'

function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Accueil', icon: FiHome },
    { id: 'chat', label: 'Assistant IA', icon: FiMessageCircle },
    { id: 'dashboard', label: 'Tableau de bord', icon: FiBarChart2 },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🌾</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Teranga<span className="text-primary-600">AI</span></span>
          </div>

          <nav className="flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiSun className="text-sun-500" />
            <span className="hidden md:inline">Sénégal</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

import { useState, useEffect, useCallback } from 'react'
import Header from './components/layout/Header'
import Hero from './components/layout/Hero'
import Chat from './components/chat/index'
import Dashboard from './components/dashboard/index'
import Predict from './components/predict/index'
import Sources from './components/layout/Sources'
import Footer from './components/layout/Footer'
import MobileNav from './components/layout/MobileNav'

const VALID_TABS = ['home', 'chat', 'dashboard', 'predict', 'sources'];

function getTabFromHash() {
  const hash = window.location.hash.replace('#', '');
  return VALID_TABS.includes(hash) ? hash : 'home';
}

function App() {
  const [activeTab, setActiveTab] = useState(getTabFromHash)

  const navigate = useCallback((tab) => {
    setActiveTab(tab);
    window.location.hash = tab === 'home' ? '' : tab;
  }, []);

  useEffect(() => {
    const onHashChange = () => setActiveTab(getTabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={navigate} />
      <main className="flex-1 pb-16 sm:pb-0">
        {activeTab === 'home' && <Hero onStart={() => navigate('chat')} onNavigate={navigate} />}
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'predict' && <Predict />}
        {activeTab === 'sources' && <Sources />}
      </main>
      <Footer onNavigate={navigate} />
      <MobileNav activeTab={activeTab} setActiveTab={navigate} />
    </div>
  )
}

export default App

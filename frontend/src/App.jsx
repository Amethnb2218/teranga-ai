import { useState } from 'react'
import Header from './components/layout/Header'
import Hero from './components/layout/Hero'
import Chat from './components/chat/index'
import Dashboard from './components/dashboard/index'
import Predict from './components/predict/index'
import Sources from './components/layout/Sources'
import Footer from './components/layout/Footer'
import MobileNav from './components/layout/MobileNav'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 pb-16 sm:pb-0">
        {activeTab === 'home' && <Hero onStart={() => setActiveTab('chat')} onNavigate={setActiveTab} />}
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'predict' && <Predict />}
        {activeTab === 'sources' && <Sources />}
      </main>
      <Footer onNavigate={setActiveTab} />
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default App

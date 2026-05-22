import { useState } from 'react'
import Header from './components/layout/Header'
import Hero from './components/layout/Hero'
import Chat from './components/chat/index'
import Dashboard from './components/dashboard/index'
import Predict from './components/predict/index'
import Footer from './components/layout/Footer'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {activeTab === 'home' && <Hero onStart={() => setActiveTab('chat')} />}
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'predict' && <Predict />}
      </main>
      <Footer />
    </div>
  )
}

export default App

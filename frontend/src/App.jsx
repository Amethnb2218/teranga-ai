import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Chat from './components/Chat'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {activeTab === 'home' && <Hero onStart={() => setActiveTab('chat')} />}
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>
      <Footer />
    </div>
  )
}

export default App

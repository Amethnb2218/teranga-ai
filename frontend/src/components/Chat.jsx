import { useState, useRef, useEffect } from 'react'
import { FiSend, FiGlobe } from 'react-icons/fi'

const SUGGESTIONS = [
  "Quand planter l'arachide à Kaolack ?",
  "Comment traiter les pucerons sur mes tomates ?",
  "Quel engrais utiliser pour le mil ?",
  "Conseils pour l'irrigation en saison sèche",
]

function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis **Teranga AI**, votre assistant agricole intelligent. 🌾\n\nJe peux vous aider avec :\n- 🌱 Conseils de plantation et calendrier cultural\n- 💧 Gestion de l'eau et irrigation\n- 🐛 Identification des maladies et ravageurs\n- 📊 Informations sur les prix du marché\n\nComment puis-je vous aider aujourd'hui ?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('fr')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const userMessage = text || input.trim()
    if (!userMessage) return

    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          language
        })
      })

      if (!response.ok) throw new Error('Network error')

      const data = await response.json()
      setMessages([...newMessages, { role: 'assistant', content: data.message }])
    } catch (error) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants."
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Assistant Agricole IA</h2>
        <button
          onClick={() => setLanguage(l => l === 'fr' ? 'wo' : 'fr')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
        >
          <FiGlobe size={14} />
          {language === 'fr' ? 'Français' : 'Wolof'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`fade-in ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.content.split('**').map((part, j) =>
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start fade-in">
            <div className="chat-bubble-ai">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
                <span className="text-sm text-gray-500">Teranga AI réfléchit...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {SUGGESTIONS.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => sendMessage(suggestion)}
              className="text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-sm text-gray-700 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-3 bg-white rounded-2xl border border-gray-200 p-3 shadow-sm">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={language === 'fr' ? "Posez votre question agricole..." : "Laaj sa laaj ci biir tëbb..."}
          rows={1}
          className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 py-2 max-h-32"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <FiSend size={16} />
        </button>
      </div>
    </div>
  )
}

export default Chat

import { useRef, useEffect } from 'react'
import { FiGlobe, FiVolume2, FiVolumeX } from 'react-icons/fi'
import { useChat } from '../../hooks/useChat'
import ChatBubble from './ChatBubble'
import ChatInput from './ChatInput'
import Suggestions from './Suggestions'
import LoadingDots from '../common/LoadingDots'

function Chat() {
  const {
    messages, loading, language, isSpeaking, autoSpeak,
    sendMessage, cycleLanguage, speak, stopSpeaking,
    setAutoSpeak, LANG_LABELS
  } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
        <div>
          <h2 className="text-base font-semibold text-stone-900">Conseiller agricole</h2>
          <p className="text-xs text-stone-400">Posez vos questions sur les cultures, maladies, irrigation...</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isSpeaking) { stopSpeaking(); }
              else { setAutoSpeak(a => !a); }
            }}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              autoSpeak || isSpeaking ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
            title={autoSpeak ? 'Désactiver la lecture vocale' : 'Activer la lecture vocale'}
          >
            {isSpeaking ? <FiVolumeX size={12} /> : <FiVolume2 size={12} />}
            {isSpeaking ? 'Stop' : autoSpeak ? 'Vocal ON' : 'Vocal'}
          </button>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => cycleLanguage(e.target.value)}
              className="appearance-none flex items-center gap-1.5 pl-7 pr-2 py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-600 transition-colors cursor-pointer outline-none"
            >
              {Object.entries(LANG_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <FiGlobe size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} language={language} onSpeak={speak} />
        ))}

        {loading && (
          <div className="flex justify-start fade-in">
            <div className="chat-bubble-ai">
              <LoadingDots />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <Suggestions onSelect={sendMessage} />
      )}

      <ChatInput onSend={sendMessage} loading={loading} language={language} />
    </div>
  );
}

export default Chat

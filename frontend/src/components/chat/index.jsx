import { useRef, useEffect } from 'react'
import { FiGlobe } from 'react-icons/fi'
import { useChat } from '../../hooks/useChat'
import ChatBubble from './ChatBubble'
import ChatInput from './ChatInput'
import Suggestions from './Suggestions'
import LoadingDots from '../common/LoadingDots'

function Chat() {
  const { messages, loading, language, sendMessage, toggleLanguage } = useChat();
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
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-600 transition-colors"
        >
          <FiGlobe size={12} />
          {language === 'fr' ? 'FR' : 'WO'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
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

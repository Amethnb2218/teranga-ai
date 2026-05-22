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
    <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Assistant Agricole IA</h2>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
        >
          <FiGlobe size={14} />
          {language === 'fr' ? 'Français' : 'Wolof'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
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

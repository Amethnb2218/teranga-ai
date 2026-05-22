import { useState, useRef } from 'react'
import { FiSend } from 'react-icons/fi'

function ChatInput({ onSend, loading, language }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
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
        onClick={handleSend}
        disabled={!input.trim() || loading}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <FiSend size={16} />
      </button>
    </div>
  );
}

export default ChatInput

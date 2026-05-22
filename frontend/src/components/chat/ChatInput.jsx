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
    <div className="flex items-end gap-2 bg-white rounded-xl border border-stone-200 p-2.5">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={language === 'fr' ? "Votre question agricole..." : "Laaj sa laaj ci biir tëbb..."}
        rows={1}
        className="flex-1 resize-none outline-none text-sm text-stone-800 placeholder-stone-400 py-1.5 px-1 max-h-32"
        disabled={loading}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || loading}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <FiSend size={14} />
      </button>
    </div>
  );
}

export default ChatInput

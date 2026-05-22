import { useState, useRef, useEffect } from 'react'
import { FiSend, FiMic, FiMicOff } from 'react-icons/fi'

const LANG_SPEECH_MAP = { fr: 'fr-FR', wo: 'fr-FR', pu: 'fr-FR', sr: 'fr-FR', di: 'fr-FR', mn: 'fr-FR', sn: 'fr-FR', en: 'en-US', ar: 'ar-SA' };

function ChatInput({ onSend, loading, language }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = LANG_SPEECH_MAP[language] || 'fr-FR';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      setInput(transcript);
      if (event.results[0].isFinal) {
        setIsListening(false);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = LANG_SPEECH_MAP[language] || 'fr-FR';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    if (isListening) recognitionRef.current?.stop();
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

  const placeholders = {
    fr: "Tapez ou parlez — votre question agricole...",
    wo: "Bind walla wax — sa laaj ci biir tëbb...",
    pu: "Winndu walla haalu — naamnal maa dow gese...",
    sr: "Binda walla fanaan — laaj ndaw no qoox...",
    di: "Kañen walla ekonkay — fulup di naay...",
    mn: "Sɛbɛ walima kuma — i sene kɛ ñininkali...",
    sn: "Safa walla xase — n tuwaare xoore...",
    en: "Type or speak — your farming question...",
    ar: "اكتب أو تحدث — سؤالك الزراعي..."
  };

  return (
    <div className="flex items-end gap-2 bg-white rounded-xl border border-stone-200 p-2.5">
      <button
        onClick={toggleListening}
        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors flex-shrink-0 ${
          isListening
            ? 'bg-red-100 text-red-600 animate-pulse'
            : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
        }`}
        title={isListening ? 'Arrêter' : 'Parler'}
      >
        {isListening ? <FiMicOff size={16} /> : <FiMic size={16} />}
      </button>
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholders[language] || placeholders.fr}
        rows={1}
        className="flex-1 resize-none outline-none text-sm text-stone-800 placeholder-stone-400 py-1.5 px-1 max-h-32"
        disabled={loading}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || loading}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
      >
        <FiSend size={15} />
      </button>
    </div>
  );
}

export default ChatInput

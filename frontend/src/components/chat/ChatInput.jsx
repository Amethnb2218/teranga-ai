import { useState, useRef, useCallback } from 'react'
import { FiSend, FiMic, FiMicOff } from 'react-icons/fi'
import { transcribeAudio } from '../../services/api'

function ChatInput({ onSend, loading, language }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '';
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
        setIsTranscribing(true);
        try {
          const buffer = await blob.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          let binary = '';
          const chunkSize = 8192;
          for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode.apply(null, bytes.slice(i, i + chunkSize));
          }
          const base64 = btoa(binary);
          const result = await transcribeAudio(base64, language);
          if (result.text) setInput(prev => prev + result.text);
        } catch (e) {
          console.log('Transcription error:', e);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setIsListening(true);
    } catch (e) {
      alert('Impossible d\'accéder au microphone. Vérifiez vos permissions.');
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
    } else {
      startRecording();
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    if (isListening) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop();
    }
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
    <div className="relative">
      {isListening && (
        <div className="absolute -top-10 left-0 right-0 flex justify-center">
          <span className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full animate-pulse shadow">
            Enregistrement... Appuyez sur le micro pour terminer
          </span>
        </div>
      )}
      {isTranscribing && (
        <div className="absolute -top-10 left-0 right-0 flex justify-center">
          <span className="bg-amber-600 text-white text-xs font-medium px-3 py-1 rounded-full animate-pulse shadow">
            Transcription en cours...
          </span>
        </div>
      )}
      <div className="flex items-end gap-2 bg-white rounded-xl border border-stone-200 p-2.5">
        <button
          onClick={toggleListening}
          disabled={isTranscribing}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors flex-shrink-0 ${
            isTranscribing
              ? 'bg-amber-100 text-amber-600 animate-pulse'
              : isListening
              ? 'bg-red-100 text-red-600 animate-pulse'
              : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
          }`}
          title={isTranscribing ? 'Transcription...' : isListening ? 'Appuyez pour terminer' : 'Parler'}
        >
          {isListening ? <FiMicOff size={16} /> : <FiMic size={16} />}
        </button>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isTranscribing ? 'Transcription en cours...' : isListening ? 'Parlez puis appuyez sur le micro...' : placeholders[language] || placeholders.fr}
          rows={1}
          className="flex-1 resize-none outline-none text-sm text-stone-800 placeholder-stone-400 py-1.5 px-1 max-h-32"
          disabled={loading || isTranscribing}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading || isTranscribing}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <FiSend size={15} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput

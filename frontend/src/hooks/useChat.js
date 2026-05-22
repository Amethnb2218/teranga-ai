import { useState, useCallback } from 'react';
import { sendChatMessage } from '../services/api';

const LANGUAGES = ['fr', 'wo', 'en', 'ar'];
const LANG_LABELS = { fr: 'Français', wo: 'Wolof', en: 'English', ar: 'العربية' };

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Bonjour ! Je suis **Teranga AI**, votre assistant agricole intelligent.\n\nJe peux vous aider avec :\n- Conseils de plantation et calendrier cultural\n- Gestion de l'eau et irrigation\n- Identification des maladies et ravageurs\n- Informations sur les prix du marché\n\nComment puis-je vous aider aujourd'hui ?"
};

const SPEECH_LANG_MAP = {
  fr: 'fr-FR',
  wo: 'fr-FR', // Wolof not natively supported, use French voice
  en: 'en-US',
  ar: 'ar-SA'
};

export function useChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const cleaned = text.replace(/[*#_`|>\-]/g, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = SPEECH_LANG_MAP[language] || 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    const langVoice = voices.find(v => v.lang.startsWith(SPEECH_LANG_MAP[language]?.split('-')[0]));
    if (langVoice) utterance.voice = langVoice;

    window.speechSynthesis.speak(utterance);
  }, [language]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const data = await sendChatMessage(
        newMessages.map(m => ({ role: m.role, content: m.content })),
        language
      );
      const reply = data.message;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
      if (autoSpeak) speak(reply);
    } catch (error) {
      const errMsg = "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.";
      setMessages([...newMessages, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const cycleLanguage = () => {
    setLanguage(l => {
      const idx = LANGUAGES.indexOf(l);
      return LANGUAGES[(idx + 1) % LANGUAGES.length];
    });
  };

  return {
    messages, loading, language, isSpeaking, autoSpeak,
    sendMessage, cycleLanguage, speak, stopSpeaking,
    setAutoSpeak, LANG_LABELS
  };
}

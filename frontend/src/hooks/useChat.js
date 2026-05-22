import { useState, useCallback } from 'react';
import { sendChatMessage } from '../services/api';

const LANGUAGES = ['fr', 'wo', 'pu', 'sr', 'di', 'mn', 'sn', 'en', 'ar'];
const LANG_LABELS = {
  fr: 'Français',
  wo: 'Wolof',
  pu: 'Pulaar',
  sr: 'Sérère',
  di: 'Diola',
  mn: 'Mandinka',
  sn: 'Soninké',
  en: 'English',
  ar: 'العربية'
};

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Bonjour, je suis votre conseiller agricole. Posez-moi vos questions sur les cultures, la météo ou les prix du marché — en français ou dans votre langue."
};

const SPEECH_LANG_MAP = {
  fr: 'fr-FR',
  wo: 'fr-FR',
  pu: 'fr-FR',
  sr: 'fr-FR',
  di: 'fr-FR',
  mn: 'fr-FR',
  sn: 'fr-FR',
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
    utterance.rate = 0.92;
    utterance.pitch = 0.85;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    const langCode = SPEECH_LANG_MAP[language]?.split('-')[0] || 'fr';
    // Prefer male voice for a professional assistant tone
    const maleVoice = voices.find(v =>
      v.lang.startsWith(langCode) && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('homme') || v.name.includes('Thomas') || v.name.includes('Daniel') || v.name.includes('Google') && !v.name.includes('Female'))
    );
    const fallbackVoice = voices.find(v => v.lang.startsWith(langCode));
    if (maleVoice) utterance.voice = maleVoice;
    else if (fallbackVoice) utterance.voice = fallbackVoice;

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

  const cycleLanguage = (val) => {
    if (val && LANGUAGES.includes(val)) {
      setLanguage(val);
    } else {
      setLanguage(l => {
        const idx = LANGUAGES.indexOf(l);
        return LANGUAGES[(idx + 1) % LANGUAGES.length];
      });
    }
  };

  return {
    messages, loading, language, isSpeaking, autoSpeak,
    sendMessage, cycleLanguage, speak, stopSpeaking,
    setAutoSpeak, LANG_LABELS
  };
}

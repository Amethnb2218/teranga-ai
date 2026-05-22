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

const WELCOME_MESSAGES = {
  fr: "Bonjour, je suis votre conseiller agricole. Posez-moi vos questions sur les cultures, la météo ou les prix du marché — en français ou dans votre langue.",
  wo: "Dalal jamm, maa ngi fi ngir lay dimbalé ci sa tool. Laaj ma lu la neexe ci mbey mi, nawet bi walla njëg yi.",
  pu: "Jam waali, miɗo ɗoo ngam wallude ma e gese. Naamndo am ko faati e remooɓe, lewru e coggu.",
  sr: "Ndank ndank, mi ngi fi ngir la amal ci sa tool. Laaj ma lu la neexe.",
  di: "Kasumay, ami ngi fi ngir lay dimbalé. Laaj ma sa yoonu tool bi.",
  mn: "I ni sogoma, ne bɛ yan waati la i ka dɛmɛ sɛnɛkɛla la. I ka n'a fɔ.",
  sn: "An maarandi, n ti ɲi da i deben. Soxe ma soxali ken ga baane.",
  en: "Hello, I'm your agricultural advisor. Ask me about crops, weather or market prices.",
  ar: "مرحبا، أنا مستشارك الزراعي. اسألني عن المحاصيل أو الطقس أو أسعار السوق."
};

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: WELCOME_MESSAGES.fr
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

const SPEECH_RATE_MAP = {
  fr: 0.92, en: 0.92, ar: 0.85,
  wo: 0.75, pu: 0.75, sr: 0.75, di: 0.75, mn: 0.75, sn: 0.75
};

export function useChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [voiceGender, setVoiceGender] = useState('male');

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const cleaned = text.replace(/[*#_`|>\-•]/g, '').replace(/\[.*?\]/g, '').replace(/\n+/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = SPEECH_LANG_MAP[language] || 'fr-FR';
    utterance.rate = SPEECH_RATE_MAP[language] || 0.92;
    utterance.pitch = voiceGender === 'male' ? 0.85 : 1.1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    const langCode = SPEECH_LANG_MAP[language]?.split('-')[0] || 'fr';

    let selectedVoice;
    if (voiceGender === 'male') {
      selectedVoice = voices.find(v =>
        v.lang.startsWith(langCode) && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('homme') || v.name.includes('Thomas') || v.name.includes('Daniel') || (v.name.includes('Google') && !v.name.toLowerCase().includes('female')))
      );
    } else {
      selectedVoice = voices.find(v =>
        v.lang.startsWith(langCode) && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('femme') || v.name.includes('Amelie') || v.name.includes('Marie'))
      );
    }
    const fallbackVoice = voices.find(v => v.lang.startsWith(langCode));
    if (selectedVoice) utterance.voice = selectedVoice;
    else if (fallbackVoice) utterance.voice = fallbackVoice;

    window.speechSynthesis.speak(utterance);
  }, [language, voiceGender]);

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
    const newLang = (val && LANGUAGES.includes(val)) ? val : LANGUAGES[(LANGUAGES.indexOf(language) + 1) % LANGUAGES.length];
    setLanguage(newLang);
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{ role: 'assistant', content: WELCOME_MESSAGES[newLang] || WELCOME_MESSAGES.fr }]);
    }
  };

  return {
    messages, loading, language, isSpeaking, autoSpeak, voiceGender,
    sendMessage, cycleLanguage, speak, stopSpeaking,
    setAutoSpeak, setVoiceGender, LANG_LABELS
  };
}

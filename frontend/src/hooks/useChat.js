import { useState, useCallback, useRef } from 'react';
import { sendChatMessage, synthesizeSpeech } from '../services/api';
import { LANG_CONFIG, LANGUAGE_ORDER, LANG_LABELS, SPEECH_RATE } from '../config/languages';

const LANGUAGES = LANGUAGE_ORDER;

const WELCOME_MESSAGES = {
  fr: "Bonjour, je suis votre conseiller agricole. Posez-moi vos questions sur les cultures, la météo ou les prix du marché — en français ou dans votre langue.",
  wo: "Dalal jamm, maa ngi fi ngir lay dimbalé ci sa tool. Laaj ma lu la neexe ci mbey mi, nawet bi walla njëg yi.",
  pu: "Jam waali, miɗo ɗoo ngam wallude ma e gese. Naamndo am ko faati e remooɓe, lewru e coggu.",
  ha: "Sannu! Ni ne mai ba da shawara kan noma. Ka tambaye ni game da shuke-shuke, yanayi ko farashin kasuwa.",
  bm: "I ni ce! Ne ye sɛnɛkɛla dɛmɛbaga ye. Segin ka ɲininkali kɛ sɛnɛ, waati walima sugu sɔngɔ kan.",
  mos: "Ne y windga! Je suis votre conseiller agricole. Posez vos questions sur les cultures, la météo ou les prix.",
  dyu: "I ni ce! Ne ye sɛnɛ dɛmɛbaga ye. I ka ɲininkali kɛ sɛnɛ, waati walima sugu sɔngɔ kan.",
  kr: "Wushe! Je suis votre conseiller agricole. Posez vos questions sur les cultures, la météo ou les prix.",
  tmh: "Oyiwan! Je suis votre conseiller agricole. Posez vos questions sur les cultures, la météo ou les prix.",
  en: "Hello, I'm your agricultural advisor. Ask me about crops, weather or market prices.",
  ar: "مرحبا، أنا مستشارك الزراعي. اسألني عن المحاصيل أو الطقس أو أسعار السوق.",
  sr: "Ndank ndank, mi ngi fi ngir la amal ci sa tool. Laaj ma lu la neexe.",
  di: "Kasumay, ami ngi fi ngir lay dimbalé. Laaj ma sa yoonu tool bi.",
  mn: "I ni sogoma, ne bɛ yan waati la i ka dɛmɛ sɛnɛkɛla la. I ka n'a fɔ.",
  sn: "An maarandi, n ti ɲi da i deben. Soxe ma soxali ken ga baane."
};

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: WELCOME_MESSAGES.fr
};

export function useChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [voiceGender, setVoiceGender] = useState('male');
  const audioRef = useRef(null);

  // Synthèse navigateur (Web Speech) — repli quand aucune voix locale MMS.
  const webSpeak = useCallback((text, cfg) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const cleaned = text.replace(/[*#_`|>\-•]/g, '').replace(/\[.*?\]/g, '').replace(/\n+/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = cfg.speechLang || 'fr-FR';
    utterance.rate = SPEECH_RATE[language] || 0.9;
    utterance.pitch = voiceGender === 'male' ? 0.85 : 1.1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    const langCode = (cfg.speechLang || 'fr-FR').split('-')[0];
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
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current.src?.startsWith('blob:')) URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text) => {
    stopSpeaking();
    const cfg = LANG_CONFIG[language] || LANG_CONFIG.fr;

    // 1) Voix locale réelle (Meta MMS-TTS) — indispensable pour les analphabètes
    //    en wolof, haoussa, bambara, etc. (le navigateur n'a pas ces voix).
    if (cfg.hasLocalVoice) {
      const url = await synthesizeSpeech(text, language);
      if (url) {
        const audio = new Audio(url);
        audioRef.current = audio;
        setIsSpeaking(true);
        audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); audioRef.current = null; };
        audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); audioRef.current = null; webSpeak(text, cfg); };
        try {
          await audio.play();
          return;
        } catch {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
          audioRef.current = null;
        }
      }
    }
    // 2) Repli : synthèse du navigateur
    webSpeak(text, cfg);
  }, [language, voiceGender, stopSpeaking, webSpeak]);

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
      const assistantMessage = {
        role: 'assistant',
        content: reply,
        notice: data.notice || null,
        source: data.source || null
      };
      setMessages([...newMessages, assistantMessage]);
      if (autoSpeak) speak(reply);
    } catch (error) {
      const errMsg = error.message || "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.";
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

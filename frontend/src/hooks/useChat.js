import { useState, useCallback, useRef } from 'react';
import { sendChatMessage, synthesizeSpeech } from '../services/api';
import { LANG_CONFIG, LANGUAGE_ORDER, LANG_LABELS, SPEECH_RATE, browserSpeechLang } from '../config/languages';

// Les voix du navigateur se chargent parfois de façon asynchrone (event
// 'voiceschanged'). On attend qu'elles soient prêtes pour ne pas rater la
// sélection de voix au 1er appel.
function getVoicesAsync(timeoutMs = 1500) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) return resolve([]);
    const existing = window.speechSynthesis.getVoices();
    if (existing && existing.length) return resolve(existing);
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve(window.speechSynthesis.getVoices() || []);
    };
    window.speechSynthesis.addEventListener?.('voiceschanged', finish, { once: true });
    setTimeout(finish, timeoutMs);
  });
}

// Choisit la meilleure voix disponible pour une locale (préfère les voix
// "neural/enhanced/Google/Microsoft", puis correspondance de langue, puis genre).
function pickVoice(voices, speechLang, gender) {
  const base = speechLang.split('-')[0];
  const byLang = voices.filter(v => v.lang?.toLowerCase().startsWith(base));
  const pool = byLang.length ? byLang : voices;
  const score = (v) => {
    const n = (v.name || '').toLowerCase();
    let s = 0;
    if (v.lang?.toLowerCase() === speechLang.toLowerCase()) s += 4;
    if (/(neural|enhanced|premium|natural)/.test(n)) s += 3;
    if (/(google|microsoft)/.test(n)) s += 2;
    const wantMale = gender === 'male';
    if (wantMale && /(male|homme|thomas|daniel|paul)/.test(n)) s += 1;
    if (!wantMale && /(female|femme|amelie|marie|julie|denise)/.test(n)) s += 1;
    return s;
  };
  return pool.slice().sort((a, b) => score(b) - score(a))[0] || null;
}

// Découpe un texte en morceaux courts (phrases) : les navigateurs mobiles
// coupent les longues énonciations. On enchaîne les morceaux proprement.
function splitForSpeech(text, max = 200) {
  const sentences = text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?…])\s+/);
  const chunks = [];
  let cur = '';
  for (const s of sentences) {
    if ((cur + ' ' + s).trim().length > max) {
      if (cur) chunks.push(cur.trim());
      cur = s.length > max ? s.slice(0, max) : s;
    } else {
      cur = (cur + ' ' + s).trim();
    }
  }
  if (cur) chunks.push(cur.trim());
  return chunks;
}

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

  // Synthèse navigateur (Web Speech) — voix intégrée du téléphone, hors-ligne,
  // gratuite. Lit le texte (déjà traduit) langue par langue, découpé en phrases
  // pour la fiabilité mobile, avec la meilleure voix disponible.
  const webSpeak = useCallback(async (text, cfg) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const speechLang = browserSpeechLang(language);
    const cleaned = text
      .replace(/[*#_`|>]/g, '')
      .replace(/\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/^[-•]\s*/gm, '')
      .replace(/\n+/g, '. ');
    const chunks = splitForSpeech(cleaned);
    if (!chunks.length) return;

    const voices = await getVoicesAsync();
    const voice = pickVoice(voices, speechLang, voiceGender);
    const rate = SPEECH_RATE[language] || 0.85;
    const pitch = voiceGender === 'male' ? 0.9 : 1.1;

    setIsSpeaking(true);
    chunks.forEach((chunk, i) => {
      const u = new SpeechSynthesisUtterance(chunk);
      u.lang = speechLang;
      u.rate = rate;
      u.pitch = pitch;
      if (voice) u.voice = voice;
      if (i === chunks.length - 1) {
        u.onend = () => setIsSpeaking(false);
        u.onerror = () => setIsSpeaking(false);
      }
      window.speechSynthesis.speak(u);
    });
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

    // 1) Vraie voix hébergée (petit audio, OK faible connectivité) quand elle
    //    existe — aujourd'hui le haoussa (Google TTS). Sinon on ne fait AUCUN
    //    appel réseau : on lit direct avec la voix du téléphone.
    if (cfg.serverVoice) {
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

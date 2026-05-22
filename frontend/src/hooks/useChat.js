import { useState } from 'react';
import { sendChatMessage } from '../services/api';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Bonjour ! Je suis **Teranga AI**, votre assistant agricole intelligent. 🌾\n\nJe peux vous aider avec :\n- 🌱 Conseils de plantation et calendrier cultural\n- 💧 Gestion de l'eau et irrigation\n- 🐛 Identification des maladies et ravageurs\n- 📊 Informations sur les prix du marché\n\nComment puis-je vous aider aujourd'hui ?"
};

export function useChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('fr');

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
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
    } catch (error) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(l => l === 'fr' ? 'wo' : 'fr');
  };

  return { messages, loading, language, sendMessage, toggleLanguage };
}

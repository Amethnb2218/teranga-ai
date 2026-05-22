const express = require('express');
const router = express.Router();

const LANG_MAP = {
  fr: 'fr', wo: 'wo', pu: 'ff', sr: 'fr', di: 'fr', mn: 'fr', sn: 'fr', en: 'en', ar: 'ar'
};

router.post('/transcribe', async (req, res) => {
  try {
    const { audio, language = 'fr' } = req.body;

    if (!audio) {
      return res.status(400).json({ error: 'Audio data required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({ error: 'Speech service unavailable', text: '' });
    }

    const audioBuffer = Buffer.from(audio, 'base64');
    const blob = new Blob([audioBuffer], { type: 'audio/webm' });

    const formData = new FormData();
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-large-v3');
    formData.append('language', LANG_MAP[language] || 'fr');
    formData.append('response_format', 'json');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq Whisper error:', response.status, errText);
      return res.status(500).json({ error: 'Transcription failed', text: '' });
    }

    const data = await response.json();
    res.json({ text: data.text || '' });
  } catch (error) {
    console.error('Speech transcribe error:', error.message);
    res.status(500).json({ error: 'Transcription failed', text: '' });
  }
});

module.exports = router;

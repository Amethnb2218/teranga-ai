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

    const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
    const langCode = LANG_MAP[language] || 'fr';

    const isMp4 = audioBuffer.length > 8 && audioBuffer.toString('ascii', 4, 8) === 'ftyp';
    const ext = isMp4 ? 'mp4' : 'webm';
    const mime = isMp4 ? 'audio/mp4' : 'audio/webm';

    const parts = [];
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="audio.${ext}"\r\nContent-Type: ${mime}\r\n\r\n`);
    parts.push(audioBuffer);
    parts.push(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\nwhisper-large-v3\r\n`);
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\n${langCode}\r\n`);
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="response_format"\r\n\r\njson\r\n`);
    parts.push(`--${boundary}--\r\n`);

    const body = Buffer.concat(parts.map(p => typeof p === 'string' ? Buffer.from(p) : p));

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body
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

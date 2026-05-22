const express = require('express');
const router = express.Router();

const WHISPER_LANGS = { fr: 'fr', en: 'en', ar: 'ar' };

const MMS_MODELS = {
  wo: 'facebook/mms-1b-fl102',
  pu: 'facebook/mms-1b-fl102',
  sr: 'facebook/mms-1b-fl102',
  di: 'facebook/mms-1b-fl102',
  mn: 'facebook/mms-1b-fl102',
  sn: 'facebook/mms-1b-fl102'
};

const MMS_LANG_CODES = {
  wo: 'wol',
  pu: 'ful',
  sr: 'srr',
  di: 'jol',
  mn: 'mnk',
  sn: 'snk'
};

async function transcribeWithWhisper(audioBuffer, language) {
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const langCode = WHISPER_LANGS[language] || 'fr';

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
    throw new Error(`Whisper error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.text || '';
}

async function transcribeWithMMS(audioBuffer, language) {
  const hfKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;
  if (!hfKey) throw new Error('No HF API key');

  const model = MMS_MODELS[language];
  const langCode = MMS_LANG_CODES[language];

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfKey}`,
        'Content-Type': 'audio/webm'
      },
      body: audioBuffer
    }
  );

  if (response.status === 503) {
    const info = await response.json();
    const wait = info.estimated_time || 20;
    throw new Error(`Model loading, retry in ${Math.ceil(wait)}s`);
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`MMS error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  if (Array.isArray(data) && data[0]?.text) return data[0].text;
  if (data.text) return data.text;
  return '';
}

router.post('/transcribe', async (req, res) => {
  try {
    const { audio, language = 'fr' } = req.body;

    if (!audio) {
      return res.status(400).json({ error: 'Audio data required' });
    }

    const audioBuffer = Buffer.from(audio, 'base64');
    let text = '';

    if (MMS_MODELS[language]) {
      try {
        text = await transcribeWithMMS(audioBuffer, language);
      } catch (mmsErr) {
        console.log('MMS fallback to Whisper:', mmsErr.message);
        if (process.env.GROQ_API_KEY) {
          text = await transcribeWithWhisper(audioBuffer, language);
        }
      }
    } else {
      if (!process.env.GROQ_API_KEY) {
        return res.status(503).json({ error: 'Speech service unavailable', text: '' });
      }
      text = await transcribeWithWhisper(audioBuffer, language);
    }

    res.json({ text });
  } catch (error) {
    console.error('Speech transcribe error:', error.message);
    res.status(500).json({ error: 'Transcription failed', text: '' });
  }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chat');
const weatherRoutes = require('./routes/weather');
const marketRoutes = require('./routes/market');
const newsRoutes = require('./routes/news');
const predictRoutes = require('./routes/predict');
const mlRoutes = require('./routes/ml');
const speechRoutes = require('./routes/speech');
const translateRoutes = require('./routes/translate');
const alertsRoutes = require('./routes/alerts');
const communityRoutes = require('./routes/community');
const provenanceRoutes = require('./routes/provenance');
const { REGISTRY_VERSION } = require('./data/provenance');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { getGroqStatus } = require('./services/groq-service');
const { getGeminiStatus } = require('./services/gemini-service');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST']
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/chat', chatRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/provenance', provenanceRoutes);

app.get('/api/health', (req, res) => {
  const groq = getGroqStatus();
  const gemini = getGeminiStatus();
  const aiMode = gemini.status === 'available' || gemini.status === 'degraded'
    ? 'gemini'
    : groq.status === 'available' || groq.status === 'degraded' ? 'groq'
      : groq.status === 'not_configured' && gemini.status === 'not_configured' ? 'offline'
        : 'configured_unverified';

  res.json({
    status: 'ok',
    service: 'Teranga AI Backend',
    version: '3.1.0',
    ai_mode: aiMode,
    ai_providers: { groq, gemini },
    ai_fallback_order: ['gemini', 'groq', 'offline'],
    translation: (process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY) ? 'nllb (active)' : 'unavailable',
    weather_source: process.env.OPENWEATHER_API_KEY ? 'openweathermap (live)' : 'climatologie locale (estimated)',
    ml_engine: 'v3.1 expérimental (13 features, 9 cultures, corpus partiellement traçable)',
    provenance_registry: REGISTRY_VERSION,
    timestamp: new Date().toISOString()
  });
});

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Teranga AI v3.1 running on port ${PORT}`);
    console.log(`AI providers: Groq=${getGroqStatus().status}, Gemini=${getGeminiStatus().status}`);
    console.log(`Weather: ${process.env.OPENWEATHER_API_KEY ? 'OpenWeatherMap (live)' : 'Local climatology (estimated)'}`);
  });
}

module.exports = app;

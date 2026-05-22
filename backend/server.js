const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chat');
const weatherRoutes = require('./routes/weather');
const marketRoutes = require('./routes/market');
const newsRoutes = require('./routes/news');
const predictRoutes = require('./routes/predict');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST']
}));
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/predict', predictRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Teranga AI Backend',
    version: '2.0.0',
    ai_mode: process.env.GROQ_API_KEY ? 'groq' : 'offline',
    weather_source: process.env.OPENWEATHER_API_KEY ? 'openweathermap (live)' : 'model (simulated)',
    timestamp: new Date().toISOString()
  });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Teranga AI Backend v2.0 running on port ${PORT}`);
  console.log(`AI: ${process.env.GROQ_API_KEY ? 'Groq' : 'Offline'}`);
  console.log(`Weather: ${process.env.OPENWEATHER_API_KEY ? 'OpenWeatherMap' : 'Simulated'}`);
});

module.exports = app;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chat');
const weatherRoutes = require('./routes/weather');
const marketRoutes = require('./routes/market');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Teranga AI Backend',
    ai_mode: process.env.GROQ_API_KEY ? 'groq' : 'offline',
    timestamp: new Date().toISOString()
  });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Teranga AI Backend running on port ${PORT}`);
  console.log(`AI Mode: ${process.env.GROQ_API_KEY ? 'Groq (LLama 3.1)' : 'Offline (smart responses)'}`);
});

module.exports = app;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chat');
const weatherRoutes = require('./routes/weather');
const marketRoutes = require('./routes/market');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Teranga AI Backend' });
});

app.listen(PORT, () => {
  console.log(`Teranga AI Backend running on port ${PORT}`);
});

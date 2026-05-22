# 🌾 Teranga AI — Intelligent Agricultural Assistant for West Africa

> **Teranga** means "hospitality" in Wolof — the spirit of sharing knowledge with those who need it most.

## The Problem

In Senegal and across West Africa, **70% of the population depends on agriculture**, yet small-scale farmers lack access to:
- Personalized agronomic advice
- Localized weather forecasts with agricultural context
- Real-time market price information
- Knowledge available in local languages (Wolof)

This information asymmetry leads to poor planting decisions, crop losses, and economic vulnerability.

## Our Solution

**Teranga AI** is an AI-powered agricultural assistant that provides:

### 🤖 AI Chat Assistant
- Personalized farming advice powered by LLama 3.1 70B (via Groq, free)
- Context-aware responses based on Senegal's climate zones (Sahelian, Sudanian, Casamance)
- Support for French and Wolof languages
- Smart offline mode with expert pre-built responses

### 🌦️ Weather Dashboard
- 7-day forecasts for 10 Senegalese cities
- Agricultural alerts linked to weather conditions
- Seasonal advice (rainy season vs dry season)

### 📊 Market Prices
- Price tracking for 20+ local crops (updated 2025-2026 data)
- Price comparison across 10 cities
- Trend alerts with buy/sell recommendations
- Data sourced from FAO/GIEWS and CSA Senegal

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express |
| AI | Groq API (LLama 3.1 70B) — Free |
| Fallback | Smart offline responses (no API needed) |
| Languages | French, Wolof |
| Deployment | Vercel (frontend) + Railway (backend) |

## Architecture

```
teranga-ai/
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── config/
│   │   ├── constants.js          # Cities, climate zones, month data
│   │   └── prompts.js            # AI system prompts
│   ├── data/
│   │   ├── market-prices.js      # Market prices database (2025-2026)
│   │   └── offline-responses.js  # Smart offline AI responses
│   ├── middleware/
│   │   └── errorHandler.js       # Error & 404 handling
│   ├── routes/
│   │   ├── chat.js               # POST /api/chat
│   │   ├── weather.js            # GET /api/weather/:city
│   │   └── market.js             # GET /api/market, /api/market/trends
│   └── services/
│       ├── ai-service.js         # Groq API + offline fallback logic
│       ├── weather-service.js    # Weather forecast generation
│       └── market-service.js     # Market data filtering & trends
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Root component with tab navigation
│   │   ├── main.jsx              # React entry point
│   │   ├── index.css             # Tailwind + custom styles
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx    # Navigation bar
│   │   │   │   ├── Hero.jsx      # Landing page
│   │   │   │   └── Footer.jsx    # Site footer
│   │   │   ├── chat/
│   │   │   │   ├── index.jsx     # Chat page container
│   │   │   │   ├── ChatBubble.jsx
│   │   │   │   ├── ChatInput.jsx
│   │   │   │   └── Suggestions.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── index.jsx     # Dashboard container
│   │   │   │   ├── CitySelector.jsx
│   │   │   │   ├── WeatherCard.jsx
│   │   │   │   ├── WeatherSection.jsx
│   │   │   │   ├── MarketSection.jsx
│   │   │   │   └── TrendsSection.jsx
│   │   │   └── common/
│   │   │       └── LoadingDots.jsx
│   │   ├── hooks/
│   │   │   ├── useChat.js        # Chat state management
│   │   │   └── useDashboard.js   # Dashboard data fetching
│   │   └── services/
│   │       └── api.js            # API client functions
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- (Optional) Groq API key for full AI chat

### Installation

```bash
git clone https://github.com/Amethnb2218/teranga-ai.git
cd teranga-ai

# Backend setup
cd backend
npm install
cp .env.example .env

# Frontend setup
cd ../frontend
npm install
```

### Running Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open http://localhost:3000

### AI Configuration (Optional)

The app works **without any API key** using smart offline responses. For full AI chat:

1. Go to https://console.groq.com (free, no credit card)
2. Create an API key
3. Add to `backend/.env`: `GROQ_API_KEY=gsk_your_key_here`

## Data Sources

| Data | Source | Update |
|------|--------|--------|
| Market prices | FAO/GIEWS, CSA Senegal, ARM | 2025-2026 |
| Climate zones | ANACIM Senegal | Permanent |
| Crop varieties | ISRA (Institut Sénégalais de Recherches Agricoles) | 2024 |
| Agricultural calendar | DAPSA, Ministry of Agriculture | 2025 |

## Impact & Scalability

- **Immediate**: Helps Senegalese farmers make better decisions TODAY
- **Short-term**: Expandable to all 14 West African countries (ECOWAS)
- **Long-term**: Integration with satellite imagery, IoT sensors, and mobile money

## Team

Built with passion from Senegal 🇸🇳 for the AlgoFest Hackathon 2026.

## License

MIT License

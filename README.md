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
- Personalized farming advice powered by GPT-4
- Context-aware responses based on Senegal's climate zones (Sahelian, Sudanian, Casamance)
- Support for French and Wolof languages
- Covers: planting calendars, irrigation, pest management, local crop varieties

### 🌦️ Weather Dashboard
- 7-day forecasts for 10 Senegalese cities
- Agricultural alerts linked to weather conditions
- Seasonal advice (rainy season vs dry season)

### 📊 Market Prices
- Real-time price tracking for 15+ local crops
- Price comparison across cities
- Trend alerts (buy/sell recommendations)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express |
| AI | OpenAI GPT-4o-mini API |
| Languages | French, Wolof |
| Deployment | Vercel (frontend) + Railway (backend) |

## Architecture

```
┌─────────────────────────────────────┐
│         React Frontend (Vite)        │
│  ┌─────────┐ ┌──────┐ ┌──────────┐ │
│  │  Chat   │ │ Hero │ │Dashboard │ │
│  │Component│ │      │ │ Weather  │ │
│  │         │ │      │ │ + Market │ │
│  └────┬────┘ └──────┘ └────┬─────┘ │
└───────┼─────────────────────┼───────┘
        │ /api/chat           │ /api/weather, /api/market
┌───────┼─────────────────────┼───────┐
│       ▼     Express API     ▼       │
│  ┌─────────┐ ┌──────────┐ ┌─────┐  │
│  │ Chat    │ │ Weather  │ │Market│  │
│  │ Route   │ │ Route    │ │Route │  │
│  └────┬────┘ └──────────┘ └─────┘  │
└───────┼─────────────────────────────┘
        │
        ▼
   OpenAI API (GPT-4o-mini)
```

## Quick Start

### Prerequisites
- Node.js 18+
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/teranga-ai.git
cd teranga-ai

# Backend setup
cd backend
npm install
cp .env.example .env
# Add your OPENAI_API_KEY to .env

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

## Features in Detail

### Intelligent Prompting
Our AI is specifically trained with context about:
- Senegal's 3 climate zones and their characteristics
- Local crop varieties (ISRA-recommended seeds)
- Traditional farming calendars
- Seasonal patterns (hivernage: June-October)

### Accessibility
- Mobile-responsive design
- Wolof language support
- Simple, intuitive interface designed for low-literacy users
- Works on low-bandwidth connections

## Impact & Scalability

- **Immediate**: Helps Senegalese farmers make better decisions TODAY
- **Short-term**: Expandable to all 14 West African countries (ECOWAS)
- **Long-term**: Integration with satellite imagery, IoT sensors, and mobile money for a complete AgriTech platform

## Team

Built with passion from Senegal 🇸🇳 for the AlgoFest Hackathon 2026.

## License

MIT License

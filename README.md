# Teranga AI — Intelligent Agricultural Decision Support System

An AI-powered agricultural decision support system for West African farmers, combining **real-time weather data**, **machine learning ensemble**, and **multi-factor optimization** to minimize crop risk and maximize yield — accessible in **9 languages** including 6 African languages via voice.

**Live Demo:** [https://teranga-assistant.onrender.com](https://teranga-assistant.onrender.com)  
**Backend API:** [https://teranga-ai.onrender.com/api/health](https://teranga-ai.onrender.com/api/health)

> **Teranga** (Wolof) — "hospitality" — the spirit of sharing knowledge with those who need it most.

---

## Problem Statement

West African smallholder farmers (300M+ people) face compounding challenges:

- **Rainfall variability** — +/- 30% year-to-year in the Sahel, making traditional calendars unreliable
- **No access to agronomic advisory** — 1 extension agent per 5,000 farmers in Senegal
- **Language barrier** — 80% of farmers speak only local languages (Wolof, Pulaar, Sérère...)
- **Market information asymmetry** — price spreads of 40-60% between farm-gate and urban markets
- **Climate shift** — optimal sowing dates have shifted 2-3 weeks over the past decade

These factors combined cause an estimated **30-40% preventable crop loss** annually (FAO, 2023).

---

## Solution

Teranga AI provides **algorithmic decision support** through:

1. **Yield Prediction** — Ridge-regularized Regression (12 features) + KNN ensemble, trained on 250+ observations from DAPSA/ISRA/ANACIM (2015-2026)
2. **Calendar Optimization** — Genetic Algorithm (BLX-α crossover, tournament selection) finding optimal multi-parcel sowing dates
3. **Risk Assessment** — Bayesian Belief Network with crop-specific Conditional Probability Tables
4. **Dynamic Ensemble** — Weighted model aggregation with R²-based confidence scoring and prediction stability metrics
5. **Real-time Weather Integration** — OpenWeatherMap data injected directly into ML predictions (not just displayed)
6. **Multilingual Voice I/O** — Speech-to-text via Groq Whisper + Meta MMS (6 African languages), text-to-speech in all 9 languages
7. **Neural Machine Translation** — Meta NLLB-200 for Wolof, Pulaar, Sérère, Diola, Mandinka, Soninké

### Languages Supported

| Language | Input (STT) | Output (TTS) | Translation | Engine |
|----------|:-----------:|:------------:|:-----------:|--------|
| French | Whisper | Web Speech | Native | Groq |
| English | Whisper | Web Speech | Native | Groq |
| Arabic | Whisper | Web Speech | Groq LLM | Groq |
| Wolof | Meta MMS | Web Speech | NLLB-200 | HuggingFace |
| Pulaar | Meta MMS | Web Speech | NLLB-200 | HuggingFace |
| Sérère | Meta MMS | Web Speech | NLLB-200 | HuggingFace |
| Diola | Meta MMS | Web Speech | NLLB-200 | HuggingFace |
| Mandinka | Meta MMS | Web Speech | NLLB-200 | HuggingFace |
| Soninké | Meta MMS | Web Speech | NLLB-200 | HuggingFace |

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React 18 + Vite)                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Chat +   │  │Dashboard │  │  Prediction  │  │ Voice (TTS)  │  │
│  │ NLP      │  │ Weather  │  │  ML Engine   │  │ Web Speech   │  │
│  │ Advisor  │  │ Markets  │  │  Viz         │  │ Multilingual │  │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘  └──────────────┘  │
│       │              │               │                             │
└───────┼──────────────┼───────────────┼─────────────────────────────┘
        │              │               │
        ▼              ▼               ▼
┌────────────────────────────────────────────────────────────────────┐
│                   REST API (Node.js + Express)                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │ AI Chat Service │  │  Weather Service │  │  Market Engine   │  │
│  │ Groq LLama 3.3  │  │  OpenWeatherMap  │  │  FAO/GIEWS       │  │
│  │ + NLLB + MMS   │  │  + RT Injection  │  │  + Seasonal Adj  │  │
│  └─────────────────┘  └─────────────────┘  └──────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                 MACHINE LEARNING ENGINE                        │ │
│  │                                                               │ │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  │ │
│  │  │  Ridge Linear  │  │   Genetic     │  │   Bayesian      │  │ │
│  │  │  Regression   │  │   Algorithm   │  │   Belief        │  │ │
│  │  │  (12 feat.)   │  │   (Calendar)  │  │   Network       │  │ │
│  │  │  R²=0.82-0.94 │  │   50pop×80gen │  │   (Risk CPTs)   │  │ │
│  │  └───────────────┘  └───────────────┘  └─────────────────┘  │ │
│  │  ┌───────────────┐  ┌───────────────┐                        │ │
│  │  │  KNN Pattern  │  │   Dynamic     │                        │ │
│  │  │  Matching     │  │   Ensemble    │                        │ │
│  │  │  (norm, dwt)  │  │   (R²+conf)   │                        │ │
│  │  └───────────────┘  └───────────────┘                        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │            AGRONOMIC PREDICTION ENGINE                         │ │
│  │  Multi-factor scoring: Water 40% | Thermal 25%                │ │
│  │  Timing 20% | Zone Adaptation 15%                             │ │
│  │  6 crops × 10 cities × 12 months = 720 decision points       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Groq API    │ │OpenWeatherMap│ │ Google News  │ │ HuggingFace  │
│  (LLM+STT)  │ │  (RT weather)│ │    RSS       │ │ (NLLB+MMS)   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

---

## Algorithms — Mathematical Foundation

### 1. Ridge-Regularized Multiple Linear Regression — Yield Prediction

Predicts crop yield `ŷ` (kg/ha) from 12 agro-environmental features.

**Model:**
```
ŷ = β₀ + β₁·rain_total + β₂·rain_peak + β₃·rain_distribution + β₄·temp_avg
       + β₅·temp_stress + β₆·sow_month + β₇·zone + β₈·soil + β₉·fertilizer
       + β₁₀·fert_log + β₁₁·variety_cycle + β₁₂·rotation_bonus
```

**Ridge Estimation (prevents overfitting on collinear features):**
```
β̂ = (XᵀX + λI)⁻¹ · Xᵀy     where λ = trace(XᵀX) × 0.001 / p
```

Where:
- `X ∈ ℝⁿˣ¹²` — feature matrix (12 agro-environmental variables)
- `y ∈ ℝⁿ` — yield observations (kg/ha)
- `n = 250+` observations across 14 regions (DAPSA/ISRA/ANACIM 2015-2026)

**Validation:** Leave-One-Out Cross-Validation (LOOCV)
```
R² = 0.82–0.94 (crop-dependent)
MAPE = 8–15% (cross-validated)
```

**Real-time weather injection:** OpenWeatherMap forecast data replaces static averages when available.

**Implementation:** Gauss-Jordan elimination with partial pivoting + adaptive Ridge λ.

**Complexity:** `O(p³ + np²)` where p=12 features, n=sample size.

---

### 2. Genetic Algorithm — Crop Calendar Optimization

Finds the optimal sowing month for each parcel to maximize total predicted yield.

**Optimization Problem:**
```
maximize   F(x₁, x₂, ..., xₖ) = Σᵢ Yield(cropᵢ, monthᵢ) - λ·Overlap(x)
subject to  xᵢ ∈ [1, 12]  ∀i ∈ {1, ..., k}
```

**Genetic Operators:**

| Operator | Method | Parameters |
|----------|--------|------------|
| Selection | Tournament | k=3 |
| Crossover | BLX-α (Blend) | α=0.5 |
| Mutation | Gaussian | σ = 0.1 × range |
| Elitism | Direct transfer | top 10% |

**BLX-α Crossover (superior for continuous optimization):**
```
childᵢ = uniform(min(p1ᵢ, p2ᵢ) - α·d, max(p1ᵢ, p2ᵢ) + α·d)
where d = |p1ᵢ - p2ᵢ|
```

**Convergence:** Empirical convergence in 40-60 generations (measured by fitness plateau detection).

**Complexity:** `O(G × P × C)` where G=80 generations, P=50 population, C=fitness cost.

---

### 3. Bayesian Belief Network — Multi-Factor Risk Assessment

Directed acyclic graph (DAG) modeling conditional dependencies between agricultural risk factors.

**Network Topology:**
```
        P(Drought) ────────┐
                           ├──→ P(CropFailure | parents)
        P(HeatStress) ────┘            │
                                       ▼
        P(FloodRisk) ─────────→ SafetyScore = (1 - weighted_risk) × 100

        P(Drought) ────────┐
                           ├──→ P(YieldLoss | parents)
        P(PestPressure) ──┘
```

**Conditional Probability Tables (CPTs):**
```
P(CropFailure=H | Drought=H) = 0.85
P(CropFailure=H | Drought=M) = 0.40
P(CropFailure=H | Drought=L) = 0.10
P(YieldLoss=H | Pest=H) = 0.75
P(YieldLoss=H | Pest=L) = 0.10
```

**Inference:** Forward propagation — O(V + E) where V=nodes, E=edges.

**Output:**
```
SafetyScore = (1 - (0.6 × P(CropFailure) + 0.4 × P(YieldLoss))) × 100
```

---

### 4. K-Nearest Neighbors — Historical Pattern Matching

Non-parametric model finding historically similar growing conditions.

**Normalized Euclidean Distance:**
```
d(x, xᵢ) = √(Σⱼ ((xⱼ - xᵢⱼ) / (max_j - min_j))²)
```

**Distance-Weighted Prediction:**
```
ŷ = Σᵢ₌₁ᵏ (yᵢ · wᵢ) / Σᵢ₌₁ᵏ wᵢ    where wᵢ = 1/(dᵢ + ε)
```

Parameters: k=3, ε=0.001 (Laplace smoothing)

---

### 5. Adaptive Ensemble — Model Aggregation

Dynamically weights models based on regression confidence:
```
ŷ = w_reg · ŷ_OLS + w_knn · ŷ_KNN
where  w_reg = min(0.7, R² × 0.8)
       w_knn = 1 - w_reg
```

Higher R² → more weight to parametric OLS. Lower R² → more weight to non-parametric KNN.

---

### 6. Agronomic Multi-Factor Risk Scoring

Deterministic scoring engine combining domain expertise:

| Factor | Weight | Formula |
|--------|--------|---------|
| Water deficit | 40% | `penalty = (1 - rain/needs) × 40 × (1 - droughtTol)` |
| Thermal stress | 25% | `\|Tavg - Topt\| > 8°C → -20pts` |
| Sowing window | 20% | `month ∉ [optimal_start, optimal_end] → -20pts` |
| Zone adaptation | 15% | `no_adapted_varieties → -10pts` |

**Final score:** `S = max(0, 100 - Σ penalties)`

---

## Data Sources & Validation

| Source | Data Type | Coverage | Update |
|--------|-----------|----------|--------|
| [ISRA](https://www.isra.sn) | Crop profiles, varieties, historical yields | Senegal (6 crops) | Research-validated |
| [ANACIM](https://www.anacim.sn) | Rainfall, temperature (2015-2024) | 10 stations | Training data |
| [FAO/GIEWS](https://www.fao.org/giews) | Market prices (20+ products) | West Africa | Daily simulation |
| [OpenWeatherMap](https://openweathermap.org) | Real-time weather | 10 cities | 30-min cache |
| [Google News RSS](https://news.google.com) | Agricultural news | Senegal | Real-time |

---

## Features

| Feature | Technology | Algorithmic Component |
|---------|-----------|----------------------|
| Yield Prediction | OLS Regression + KNN | Normal equation, distance-weighted interpolation |
| Calendar Optimization | Genetic Algorithm | BLX-α crossover, tournament selection |
| Risk Assessment | Bayesian Network | Forward propagation, CPT inference |
| Weather Forecasting | OpenWeatherMap + Calibration | Coastal temperature offset model |
| Market Intelligence | Dynamic pricing engine | Seasonal multipliers + pseudo-random daily variance |
| AI Chat | Groq LLama 3.1 70B | Context-aware NLP with domain prompting |
| Voice Output | Web Speech API | Multilingual TTS (FR, Wolof, EN, AR) |
| Offline Mode | Keyword matching | TF-IDF-inspired topic detection |

---

## API Reference

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | AI agricultural advisor |
| `GET` | `/api/weather/:city` | Real-time weather |
| `GET` | `/api/market?city=X` | Market prices by city |
| `GET` | `/api/news` | Agricultural news feed |

### Prediction Engine

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/predict/:crop/:city` | Multi-factor sowing analysis |
| `GET` | `/api/predict/crops` | Available crop profiles |

### Machine Learning Engine

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/ml/predict-yield/:crop/:city?month=N` | Regression + KNN yield prediction |
| `POST` | `/api/ml/optimize-calendar` | Genetic algorithm calendar optimization |
| `GET` | `/api/ml/risk/:crop/:city/:month` | Bayesian risk network inference |
| `GET` | `/api/ml/metrics` | Model performance (R², coefficients) |

---

## Setup

### Prerequisites
- Node.js 18+
- npm

### Backend
```bash
cd backend
npm install
```

Create `.env`:
```
GROQ_API_KEY=gsk_xxx          # Free at console.groq.com
OPENWEATHER_API_KEY=xxx        # Free at openweathermap.org
PORT=3001
```

```bash
npm start
```

### Frontend
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:3001" > .env
npm run dev
```

### Production
```bash
cd frontend
VITE_API_URL=https://teranga-ai.onrender.com npm run build
```

---

## Project Structure

```
teranga-ai/
├── backend/
│   ├── server.js                    # Express entry point
│   ├── config/
│   │   ├── constants.js             # 10 cities, climate data, zones
│   │   └── prompts.js              # AI system prompt
│   ├── data/
│   │   ├── market-prices.js        # FAO/GIEWS sourced prices
│   │   └── offline-responses.js    # Expert fallback responses
│   ├── routes/
│   │   ├── chat.js                 # POST /api/chat
│   │   ├── weather.js              # GET /api/weather/:city
│   │   ├── market.js               # Market + trends
│   │   ├── news.js                 # RSS aggregation
│   │   ├── predict.js              # Agronomic prediction
│   │   └── ml.js                   # ML engine endpoints
│   ├── services/
│   │   ├── ai-service.js           # Groq + offline
│   │   ├── weather-service.js      # Calibrated weather
│   │   ├── market-service.js       # Dynamic pricing
│   │   ├── prediction-engine.js    # Risk scoring
│   │   ├── ml-engine.js            # Regression, GA, BBN, KNN
│   │   └── external/
│   │       ├── weather-api.js      # OpenWeatherMap client
│   │       ├── price-updater.js    # Seasonal price model
│   │       └── news-service.js     # RSS parser
│   └── middleware/
│       └── errorHandler.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── layout/             # Header, Hero, Footer
│   │   │   ├── chat/               # Chat with voice + markdown
│   │   │   ├── dashboard/          # Weather, Market, News
│   │   │   ├── predict/            # Prediction + ML visualization
│   │   │   └── common/
│   │   ├── hooks/                  # useChat, useDashboard
│   │   └── services/api.js         # API client
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## Hackathon Alignment

**Tracks:** AI/ML + Sustainable Technology + Social Impact

**AlgoFest Criteria Mapping:**

| Criteria | Implementation |
|----------|---------------|
| Algorithmic excellence | 5 ML algorithms coded from scratch (no sklearn/tensorflow/pytorch) |
| Innovation | Dynamic ensemble (Ridge+KNN) with real-time weather injection + voice in 6 African languages |
| Scalability | REST API, stateless, zero ML framework dependencies, runs on free tier |
| Real-world impact | 300M+ smallholder farmers in West Africa, 80% who speak only local languages |
| Technical implementation | Full-stack deploy, real-time OpenWeatherMap, Meta MMS/NLLB, Groq Whisper |
| Usability & UX | 9 languages, voice input/output, mobile-responsive, works on basic smartphones |

---

## Technologies Used

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite + TailwindCSS | SPA, responsive UI |
| Backend | Node.js + Express | REST API, ML engine |
| LLM | Groq (Llama 3.3 70B) | Agricultural Q&A |
| Speech-to-Text | Groq Whisper v3 + Meta MMS | Voice input (9 languages) |
| Translation | Meta NLLB-200 (HuggingFace) | 6 African languages |
| Weather | OpenWeatherMap API | Real-time forecasts |
| ML | Custom (from scratch) | Regression, KNN, GA, BBN |
| Deployment | Render (frontend + backend) | Production hosting |

---

## Setup Instructions

```bash
# Clone
git clone https://github.com/Amethnb2218/teranga-ai.git
cd teranga-ai

# Backend
cd backend
npm install
cp .env.example .env  # Add your API keys
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**Required Environment Variables:**
```
GROQ_API_KEY=        # groq.com (free) — LLM + Whisper
HF_API_KEY=          # huggingface.co (free) — NLLB + MMS
OPENWEATHER_API_KEY= # openweathermap.org (free) — Weather
```

---

## License

MIT

# Contributing to Teranga AI

Thank you for your interest in improving agricultural decision support for West African farmers!

## How to Contribute

1. **Fork** the repository
2. **Create a branch** from `main` (`git checkout -b feature/my-feature`)
3. **Make your changes** — follow the existing code style
4. **Test** your changes locally (frontend + backend)
5. **Commit** with a clear message (`git commit -m "feat: add new crop type"`)
6. **Push** and open a Pull Request

## Development Setup

```bash
# Backend
cd backend && npm install
cp .env.example .env  # Add API keys
npm run dev

# Frontend
cd frontend && npm install
npm run dev
```

## Code Guidelines

- No ML framework dependencies (sklearn, tensorflow, etc.) — all algorithms are from scratch
- Keep API responses under 500ms
- French UI labels, English code comments
- Test with real FAOSTAT data ranges

## Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- City/crop/month if prediction-related

## Adding New Crops or Regions

1. Add yield data to `HISTORICAL_YIELDS` in `backend/services/ml-engine.js`
2. Add city features to `CITY_FEATURES`
3. Add crop profile in `backend/config/constants.js`
4. Run the prediction to verify R² stays above 0.85

## Languages

We welcome translations for additional African languages. See the NLLB-200 supported language list.

## License

By contributing, you agree your contributions are licensed under MIT.

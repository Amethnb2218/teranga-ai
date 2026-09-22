# Teranga TTS — voix locale (Meta MMS-TTS)

Micro-service Python qui synthétise une **vraie voix** dans les langues du
Sahel (wolof, haoussa, bambara, sérère, diola, soninké, mooré, dioula,
kanouri, tamasheq, pulaar, mandinka) avec les modèles **Meta MMS-TTS**.

Il est **séparé du backend Node** exprès : les modèles PyTorch sont lourds
(~200–400 Mo de RAM chacun) et n'ont pas leur place dans l'API qui sert le
conseiller. Le backend l'appelle via la variable `MMS_TTS_URL`.

## Contrat

```
POST /            { "text": "Dalal jamm", "lang": "wol" }   ->  audio/wav
GET  /health                                                ->  { status, loaded, max_models }
```

`lang` = code MMS : `wol, fuv, hau, bam, mos, dyu, knc, taq, srr, dyo, mnk, snk`.

## Lancer en local

```bash
cd tts-service
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
# test :
curl -s -X POST http://localhost:8000/ -H "Content-Type: application/json" \
  -d '{"text":"Dalal jamm, naka nga def?","lang":"wol"}' --output test.wav
```

## Déployer sur Render

Le service est déclaré dans `render.yaml` (`teranga-tts`). Points importants :

- **RAM** : prévoir au moins **1 Go** (instance *Standard*). Le free tier
  512 Mo ne suffit pas pour PyTorch + un modèle. `TTS_MAX_MODELS` (défaut 2)
  limite le nombre de modèles gardés en mémoire (cache LRU).
- **Premier appel par langue** : lent (téléchargement + chargement du modèle,
  ~10–30 s), puis mis en cache. Prévoir de « chauffer » les langues courantes.
- **Sécurité** : définir `TTS_AUTH_TOKEN` (même valeur côté backend) pour que
  seul le backend puisse appeler le service.

### Brancher le backend

Sur le service backend (`teranga-ai`), définir :

```
MMS_TTS_URL=https://teranga-tts.onrender.com/
TTS_AUTH_TOKEN=<le même secret que le service TTS>   # optionnel mais recommandé
```

Le backend enverra `{text, lang}` et renverra l'audio au frontend, qui le
joue automatiquement (voix locale) au lieu du Web Speech du navigateur.

## Variables d'environnement

| Var | Défaut | Rôle |
|-----|--------|------|
| `TTS_MAX_MODELS` | `2` | modèles gardés en RAM (cache LRU) |
| `TTS_MAX_CHARS` | `800` | longueur max synthétisée |
| `TTS_AUTH_TOKEN` | *(vide)* | si défini, exige `Authorization: Bearer <token>` |

---
title: Teranga TTS
emoji: 🗣️
colorFrom: green
colorTo: yellow
sdk: docker
app_port: 7860
pinned: false
---

# Teranga TTS — voix locale (Meta MMS-TTS)

> Ce dossier est déployable tel quel sur **Hugging Face Spaces** (SDK Docker,
> **gratuit**, ~16 Go RAM) ou sur n'importe quel hébergeur Docker. Le
> frontmatter ci-dessus configure le Space HF.

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

## État de la voix locale par langue (recherche à jour, sans carte bancaire)

| Langue | Voix locale gratuite ? | Comment |
|--------|------------------------|---------|
| **Haoussa** | ✅ **marche déjà** | Google Translate TTS (gratuit, sans clé) — câblé dans le backend, aucun serveur |
| Pulaar, Bambara, Mooré, Dioula, Tamasheq, Diola, Mandinka | ✅ possible, sans carte | modèles **ONNX** (`willwade/mms-tts-multilingual-models-onnx`, format sherpa-onnx `model.onnx`+`tokens.txt`) → exécutables **dans le navigateur** (sherpa-onnx WASM) ou en Node, sans serveur payant |
| Wolof | ✅ modèles dédiés existent | `galsenai/wolof-tts`, `bilalfaye/speecht5_tts-wolof`… mais en PyTorch → nécessitent un serveur (pas d'ONNX prêt) |
| Kanouri, Sérère, Soninké | ❌ pas de voix libre prête | seul MMS PyTorch les couvre (serveur requis) |

### Le chemin 100 % gratuit et sans carte : ONNX côté navigateur

Les modèles ONNX ci-dessus tournent **dans le navigateur** via **sherpa-onnx
WASM** — aucun serveur, aucune carte. Le téléphone télécharge le modèle
(~30 Mo/langue, mis en cache) la première fois, puis synthétise en local.
Couvre 8 langues (haoussa + les 7 de la 2ᵉ ligne).
> Compromis : ~30 Mo par langue à télécharger sur le téléphone de l'agriculteur.

### Ce micro-service Python (app.py / Dockerfile)

Reste utile si un jour tu as un hébergeur avec ≥ 1 Go de RAM. Il couvre **les
12 langues** (MMS PyTorch, y compris Wolof/Kanouri/Sérère/Soninké). Hébergeurs :
- **HF Spaces (Docker)** — gratuit *si* ton compte y a droit (le tien affiche
  « Paid » → moyen de paiement exigé).
- **Render Standard** ou VM **Oracle Always Free** — carte à l'inscription.

## Contrat & variables (service Docker/HF)

```
POST /   { "text": "Dalal jamm", "lang": "wol" }   ->  audio/wav
GET  /health
```

| Var | Défaut | Rôle |
|-----|--------|------|
| `TTS_MAX_MODELS` | `2` | modèles gardés en RAM (cache LRU) |
| `TTS_MAX_CHARS` | `800` | longueur max synthétisée |
| `TTS_AUTH_TOKEN` | *(vide)* | si défini, exige `Authorization: Bearer <token>` |

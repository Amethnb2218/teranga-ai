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

## Déployer GRATUITEMENT sur Hugging Face Spaces (recommandé, coût 0)

HF Spaces offre un CPU gratuit avec ~16 Go de RAM — largement suffisant pour
MMS-TTS, et **sans carte bancaire**.

1. Va sur https://huggingface.co/new-space
2. **Space SDK : Docker** (template *Blank*), visibilité **Public**, hardware
   **CPU basic (gratuit)**.
3. Téléverse les 3 fichiers de ce dossier dans le Space (bouton *Files* →
   *Add file* → *Upload files*) : `app.py`, `requirements.txt`, `Dockerfile`,
   et ce `README.md` (son frontmatter configure le Space).
4. Attends la fin du *build* (onglet *Logs*). L'URL publique sera du type
   `https://<ton-user>-teranga-tts.hf.space`.
5. (Recommandé) *Settings → Variables and secrets* : ajoute un secret
   `TTS_AUTH_TOKEN` (une chaîne aléatoire), puis mets la **même valeur** côté
   backend Render.

> Le Space gratuit se met en veille après ~48 h d'inactivité et se réveille au
> premier appel (chargement du modèle ~10-30 s), comme le backend Render.

### Brancher le backend (Render)

Sur le service `teranga-ai`, définis :

```
MMS_TTS_URL=https://<ton-user>-teranga-tts.hf.space/
TTS_AUTH_TOKEN=<le même secret que le Space>   # optionnel mais recommandé
```

Le backend enverra `{text, lang}` et renverra l'audio au frontend, qui le
joue automatiquement (voix locale) au lieu du Web Speech du navigateur.

### Alternative payante (Render)

Si tu préfères tout garder sur Render : plan **Standard** (≥ 1 Go RAM ;
le free tier 512 Mo ne suffit pas pour PyTorch). Non nécessaire si tu utilises
HF Spaces.

## Variables d'environnement

| Var | Défaut | Rôle |
|-----|--------|------|
| `TTS_MAX_MODELS` | `2` | modèles gardés en RAM (cache LRU) |
| `TTS_MAX_CHARS` | `800` | longueur max synthétisée |
| `TTS_AUTH_TOKEN` | *(vide)* | si défini, exige `Authorization: Bearer <token>` |

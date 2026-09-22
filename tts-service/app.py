"""
Teranga AI — Micro-service de synthèse vocale locale (Meta MMS-TTS)
-------------------------------------------------------------------
Donne une VRAIE voix dans les langues du Sahel (wolof, haoussa, bambara,
sérère, diola, soninké...) — indispensable pour les agriculteurs analphabètes.

Pourquoi un service séparé :
- les modèles VITS/MMS (~145 Mo chacun, PyTorch) sont trop lourds pour le
  backend Node (Render free 512 Mo) ; on les isole ici pour ne pas ralentir
  ni faire tomber le conseiller.
- MMS couvre 1100+ langues, dont toutes les nôtres, contrairement aux API
  gratuites d'inférence qui ne les servent plus.

Contrat HTTP (appelé par le backend via MMS_TTS_URL) :
    POST /  { "text": "...", "lang": "wol" }   -> audio/wav
    GET  /health                               -> { status, loaded }

Sécurité optionnelle : si TTS_AUTH_TOKEN est défini, exiger
    Authorization: Bearer <token>
"""

import io
import os
import threading
from collections import OrderedDict

import numpy as np
import torch
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from scipy.io.wavfile import write as write_wav
from transformers import VitsModel, AutoTokenizer

# Nombre max de modèles gardés en mémoire simultanément (LRU). Chaque modèle
# MMS pèse ~200-400 Mo en RAM CPU -> ajuster selon l'instance.
MAX_MODELS = int(os.environ.get("TTS_MAX_MODELS", "2"))
AUTH_TOKEN = os.environ.get("TTS_AUTH_TOKEN", "")
MAX_CHARS = int(os.environ.get("TTS_MAX_CHARS", "800"))

# Codes MMS acceptés (miroir de backend/config/languages.js -> mmsTts).
SUPPORTED = {"wol", "fuv", "hau", "bam", "mos", "dyu", "knc", "taq", "srr", "dyo", "mnk", "snk"}

app = FastAPI(title="Teranga TTS (MMS)")

_models = OrderedDict()  # lang -> (model, tokenizer)
_lock = threading.Lock()


def _get_model(lang: str):
    """Charge (et met en cache LRU) le modèle MMS-TTS d'une langue."""
    with _lock:
        if lang in _models:
            _models.move_to_end(lang)
            return _models[lang]

    # Chargement hors verrou (long) puis insertion.
    repo = f"facebook/mms-tts-{lang}"
    model = VitsModel.from_pretrained(repo)
    tokenizer = AutoTokenizer.from_pretrained(repo)
    model.eval()

    with _lock:
        _models[lang] = (model, tokenizer)
        _models.move_to_end(lang)
        while len(_models) > MAX_MODELS:
            _models.popitem(last=False)  # évince le moins récemment utilisé
    return model, tokenizer


def _synthesize(text: str, lang: str) -> bytes:
    model, tokenizer = _get_model(lang)
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        waveform = model(**inputs).waveform  # [1, n]
    audio = waveform.squeeze().cpu().numpy()
    # float32 [-1,1] -> PCM 16 bits
    audio_int16 = np.clip(audio, -1.0, 1.0)
    audio_int16 = (audio_int16 * 32767).astype(np.int16)
    buf = io.BytesIO()
    write_wav(buf, model.config.sampling_rate, audio_int16)
    return buf.getvalue()


class TTSRequest(BaseModel):
    text: str
    lang: str


def _check_auth(authorization: str | None):
    if AUTH_TOKEN and authorization != f"Bearer {AUTH_TOKEN}":
        raise HTTPException(status_code=401, detail="unauthorized")


@app.get("/health")
def health():
    return {"status": "ok", "loaded": list(_models.keys()), "max_models": MAX_MODELS}


@app.post("/")
def tts(req: TTSRequest, authorization: str | None = Header(default=None)):
    _check_auth(authorization)
    text = (req.text or "").strip()[:MAX_CHARS]
    lang = (req.lang or "").strip().lower()
    if not text:
        raise HTTPException(status_code=400, detail="text requis")
    if lang not in SUPPORTED:
        raise HTTPException(status_code=400, detail=f"langue non supportee: {lang}")
    try:
        audio = _synthesize(text, lang)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"synthese echouee: {exc}") from exc
    return Response(content=audio, media_type="audio/wav",
                    headers={"Cache-Control": "public, max-age=3600", "X-TTS-Engine": f"mms-tts-{lang}"})

# Image pour Hugging Face Spaces (SDK Docker) — CPU gratuit, ~16 Go RAM.
FROM python:3.11-slim

# Utilisateur non-root (requis par HF Spaces) + cache modeles inscriptible.
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    HF_HOME=/home/user/.cache/huggingface \
    PATH=/home/user/.local/bin:$PATH

WORKDIR /home/user/app

# Dependances d'abord (cache Docker).
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=user app.py .

USER user

# HF Spaces expose le port 7860.
EXPOSE 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]

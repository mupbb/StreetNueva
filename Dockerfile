FROM python:3.12-slim

# Dependencias del sistema
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Primero las librerías (Copia limpia)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# El código completo
COPY . .

# Comando de arranque profesional
ENV PORT=10000
CMD ["python", "-m", "uvicorn", "backend.server:app", "--host", "0.0.0.0", "--port", "10000"]

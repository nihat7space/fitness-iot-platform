FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ /app/backend/
COPY ml/activity_model.joblib /app/ml/activity_model.joblib

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import joblib
import numpy as np

from backend.database import get_db
from backend.schemas import SensorDataCreate
from backend.models import SensorData

router = APIRouter()

MODEL_PATH = "/app/ml/activity_model.joblib"

model_package = joblib.load(MODEL_PATH)

model = model_package["model"]
feature_columns = model_package["feature_columns"]
sensor_columns = model_package["sensor_columns"]
window_size = model_package["window_size"]

@router.post("/sensors")
def create_sensor_data(sensor: SensorDataCreate, db: Session = Depends(get_db)):
    new_sensor_data = SensorData(
        accel_x=sensor.accel_x,
        accel_y=sensor.accel_y,
        accel_z=sensor.accel_z,
        gyro_x=sensor.gyro_x,
        gyro_y=sensor.gyro_y,
        gyro_z=sensor.gyro_z,
        label=sensor.label
    )



    db.add(new_sensor_data)
    db.commit()
    db.refresh(new_sensor_data)

    return {
        "message": "Sensor data saved",
        "sensor_data": new_sensor_data
    }

@router.get("/sensors")
def get_sensor_data(
    limit: int = 100,
    db: Session = Depends(get_db)
):
    sensor_data = (
        db.query(SensorData)
        .order_by(SensorData.id.desc())
        .limit(limit)
        .all()
    )

    return {
        "count": len(sensor_data),
        "sensor_data": sensor_data
    }

def extract_features(window):
    features = {}

    for column in sensor_columns:
        values = np.array([
            getattr(sensor, column)
            for sensor in window
        ])

        features[f"{column}_mean"] = np.mean(values)
        features[f"{column}_std"] = np.std(values)
        features[f"{column}_min"] = np.min(values)
        features[f"{column}_max"] = np.max(values)
        features[f"{column}_range"] = np.max(values) - np.min(values)

    return features


@router.get("/predict")
def predict_activity(db: Session = Depends(get_db)):
    recent_data = (
        db.query(SensorData)
        .order_by(SensorData.id.desc())
        .limit(window_size)
        .all()
    )

    if len(recent_data) < window_size:
        return {
            "error": "Not enough sensor data",
            "required": window_size,
            "available": len(recent_data)
        }

    latest_sample = recent_data[0]

    recent_data.reverse()

    features = extract_features(recent_data)

    X = np.array([
        [features[column] for column in feature_columns]
    ])

    prediction = model.predict(X)[0]
    probabilities = model.predict_proba(X)[0]

    confidence = float(np.max(probabilities))

    return {
        "prediction": prediction,
        "confidence": round(confidence, 4),
        "window_size": window_size,
        "latest_sensor_id": latest_sample.id,
        "latest_sensor_at": latest_sample.created_at
    }

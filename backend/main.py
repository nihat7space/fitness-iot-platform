import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.workouts import router as workouts_router
from backend.routers.auth import router as auth_router
from backend.routers.sensors import router as sensors_router


app = FastAPI(title="Fitness IoT Platform API")

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workouts_router)
app.include_router(auth_router)
app.include_router(sensors_router)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "API is running"
    }

@app.get("/hello")
def hello():
    return { "message": "Hello, Nihat!"}









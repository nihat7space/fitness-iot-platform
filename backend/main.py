from fastapi import FastAPI
from backend.routers.workouts import router as workouts_router


app = FastAPI(title="Fitness IoT Platform API")
app.include_router(workouts_router)



@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "API is running"
    }

@app.get("/hello")
def hello():
    return { "message": "Hello, Nihat!"}









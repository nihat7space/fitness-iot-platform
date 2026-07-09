from fastapi import FastAPI
from pydantic import BaseModel

class Workout(BaseModel):
    exercise: str
    sets: int 
    reps: int
    weight: float

app = FastAPI(title="Fitness IoT Platform API")


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "API is running"
    }

@app.get("/hello")
def hello():
    return { "message": "Hello, Nihat!"}




@app.post("/workouts")
def create_workout(workout: Workout):
    total_volume = workout.sets * workout.reps * workout.weight
    return {
        "message": "Workout received",
        "data" : workout.model_dump(),
        "total_volume": total_volume
    }

from fastapi import FastAPI
from pydantic import BaseModel

class Workout(BaseModel):
    exercise: str
    sets: int 
    reps: int
    weight: float

app = FastAPI(title="Fitness IoT Platform API")
workouts = []

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
    new_workout = {
        "exercise" : workout.exercise,
        "sets" : workout.sets,
        "reps" : workout.reps,
        "weight" : workout.weight,
        "total_volume" : total_volume
    }
    workouts.append(new_workout)
    return {
        "message": "Workout saved",
        "workout": new_workout
    }

@app.get("/workouts")
def get_workouts():
    return {
        "count": len(workouts),
        "workouts": workouts
    }


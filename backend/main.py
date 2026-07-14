from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

class Workout(BaseModel):
    exercise: str
    sets: int 
    reps: int
    weight: float

app = FastAPI(title="Fitness IoT Platform API")

workouts = []

next_workout_id = 1


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
    global next_workout_id
    total_volume = workout.sets * workout.reps * workout.weight
    new_workout = {
        "id": next_workout_id,
        "exercise" : workout.exercise,
        "sets" : workout.sets,
        "reps" : workout.reps,
        "weight" : workout.weight,
        "total_volume" : total_volume
    }
    workouts.append(new_workout)
    next_workout_id += 1
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

@app.get("/workouts/{workout_id}")
def get_workout(workout_id: int):
    for workout in workouts:
        if workout["id"] == workout_id:
            return workout
    raise HTTPException(status_code=404, detail="Workout not found")


@app.delete("/workouts/{workout_id}")
def delete_workout(workout_id: int):
    for workout in workouts:
        if workout["id"] == workout_id:
            workouts.remove(workout)
            return{
                "message": "Workout deleted",
                "workout": workout
            
            }
    raise HTTPException(status_code=404, detail="Workout not found")

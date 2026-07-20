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
def get_workouts(exercise: str | None = None,
     min_volume: float | None = None,
     sort_by: str | None = None,
     descending: bool = False,
     offset: int = 0,
     limit: int | None = None):
    
    filtered_workouts = workouts


    if exercise is not None:
        filtered_workouts = [
            workout
            for workout in filtered_workouts
            if workout["exercise"].lower() == exercise.lower()
        ]

    if min_volume is not None:
        filtered_workouts = [
                workout
                for workout in filtered_workouts
                if workout["total_volume"] >= min_volume
        ]

    if sort_by is not None:
        allowed_sort_fields = [
            "exercise",
            "sets",
            "reps",
            "weight",
            "total_volume"
        ]

        if sort_by not in allowed_sort_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid sort field. Allowed fields: {', '.join(allowed_sort_fields)}"
            )
 
        filtered_workouts = sorted(
            filtered_workouts,
            key = lambda workout: workout[sort_by],
            reverse = descending
            
        )
    
    if offset < 0:
        raise HTTPException(
            status_code=400,
            detail="Offset must be a non-negative integer"
        )
    if limit is not None and limit < 1:
        raise HTTPException(
            status_code=400,
            detail="Limit must be a positive integer"
        )

    total_count = len(filtered_workouts)

    if limit is None:
        paginated_workouts = filtered_workouts[offset:]
    else:
        paginated_workouts = filtered_workouts[offset:offset + limit]  


 
    return {
    "total_count": total_count,
    "returned_count": len(paginated_workouts),
    "offset": offset,
    "limit": limit,
    "workouts": paginated_workouts
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


@app.put("/workouts/{workout_id}")
def update_workout(workout_id: int, updated_workout: Workout):
    for workout in workouts:
        if workout["id"] == workout_id:
            workout["exercise"] = updated_workout.exercise
            workout["sets"] = updated_workout.sets
            workout["reps"] = updated_workout.reps
            workout["weight"] = updated_workout.weight
            workout["total_volume"] = (
                updated_workout.sets
                * updated_workout.reps
                * updated_workout.weight
            )

            return {
                "message": "Workout updated",
                "workout": workout
            }

    raise HTTPException(status_code=404, detail="Workout not found")

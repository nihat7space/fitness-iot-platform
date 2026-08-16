from fastapi import APIRouter, HTTPException, Query, Depends
from backend.schemas import Workout 
from backend.database import get_db
from sqlalchemy.orm import Session
from backend.models import Workout as WorkoutModel

router = APIRouter()




@router.post("/workouts")
def create_workout(workout: Workout, db: Session = Depends(get_db)):
    
    total_volume = workout.sets * workout.reps * workout.weight

    new_workout = WorkoutModel(
        exercise=workout.exercise,
        sets=workout.sets,
        reps=workout.reps,
        weight=workout.weight,
        total_volume=total_volume
    )

    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)

    return {
        "message": "Workout saved",
        "workout": new_workout
    }

@router.get("/workouts/{workout_id}")
def get_workout(workout_id: int, db: Session = Depends(get_db)):
    workout = db.query(WorkoutModel).filter(WorkoutModel.id==workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout


@router.delete("/workouts/{workout_id}")
def delete_workout(workout_id: int, db: Session = Depends(get_db)):
    workout = db.query(WorkoutModel).filter(WorkoutModel.id==workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(workout)
    db.commit()
    return {
    "message": "Workout deleted",
    "workout_id": workout_id
}

@router.put("/workouts/{workout_id}")
def update_workout(workout_id: int, updated_workout: Workout, db: Session = Depends(get_db)):
    workout = db.query(WorkoutModel).filter(WorkoutModel.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    workout.exercise = updated_workout.exercise
    workout.sets = updated_workout.sets
    workout.reps = updated_workout.reps
    workout.weight = updated_workout.weight
    workout.total_volume = updated_workout.sets * updated_workout.reps * updated_workout.weight
    db.commit()
    db.refresh(workout)
    return {
        "message": "Workout updated",
        "workout": workout
    }


@router.get("/workouts")
def get_workouts(exercise: str | None = None,
     min_volume: float | None = None,
     sort_by: str | None = None,
     descending: bool = False,
     offset: int = Query(default=0, ge=0),
     limit: int | None = Query(default=None, ge=1,le=100),
     db: Session = Depends(get_db)
    ):
    
    workouts = db.query(WorkoutModel).all()
    filtered_workouts = workouts


    if exercise is not None:
        filtered_workouts = [
            workout
            for workout in filtered_workouts
            if workout.exercise.lower() == exercise.lower()
        ]

    if min_volume is not None:
        filtered_workouts = [
                workout
                for workout in filtered_workouts
                if workout.total_volume >= min_volume
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
            key = lambda workout: getattr(workout, sort_by),
            reverse = descending
            
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
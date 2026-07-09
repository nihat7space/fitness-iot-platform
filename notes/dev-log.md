# Development Log

## Day 1 - 6 July

### Goal
- Set up the project repository
- Create the backend folder
- Create a Python virtual environment
- Install FastAPI and Uvicorn
- Run the first `/health` endpoint locally

### What I learned
-

### Problems I faced
- Docker daemon was not running at first, then Docker worked after opening Docker Desktop.

### Next step
- Add simple fitness-related endpoints.

## Day 2 - FastAPI POST and Validation

- Added POST /workouts endpoint.
- Created a Workout Pydantic model with exercise, sets, reps, and weight.
- Tested request body using Swagger UI.
- Tested validation error by sending a string value to sets.
- Added total_volume calculation: sets * reps * weight.

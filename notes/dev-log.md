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

## Day 3 - In-Memory Workout Storage

Today I added temporary workout storage using a Python list.

### What I built
- Created an in-memory `workouts` list.
- Updated `POST /workouts` to save incoming workout data.
- Calculated `total_volume` using sets, reps, and weight.
- Added `GET /workouts` endpoint to list saved workouts.
- Added `count` to show how many workouts are currently stored.

### What I tested
- Sent multiple workout entries using Swagger UI.
- Verified that `GET /workouts` returns saved workouts.
- Tested invalid request body and saw FastAPI/Pydantic validation error.
- Restarted the server and confirmed that in-memory data resets.

### What I learned
- `POST` is used to create/save new data.
- `GET` is used to read/list existing data.
- `workouts = []` is only temporary storage.
- Data stored in a Python list disappears when the server restarts.
- Later, this temporary list will be replaced with a real database like PostgreSQL.


## Day 4 - Workout ID and Single Workout Endpoint

Today I added an auto-incrementing workout id using a global counter.

What I learned:
- How to create temporary ids before using a real database
- How FastAPI path parameters work
- How to get one workout by id
- How to return 404 error with HTTPException

Tested:
- POST /workouts gives each workout an id
- GET /workouts returns all workouts
- GET /workouts/{workout_id} returns one workout
- GET /workouts/999 returns 404 Workout not found

## Day 5

- DELETE /workouts/{workout_id} endpoint'i eklendi.
- Workout'lar id değerine göre arandı.
- Bulunan workout, remove() kullanılarak listeden silindi.
- Workout bulunamazsa 404 HTTPException döndürüldü.
- Swagger üzerinden başarılı silme ve bulunamayan id senaryoları test edildi.

Day 6
- PUT /workouts/{workout_id} endpointi eklendi
- Workout alanları güncellendi
- total_volume yeniden hesaplandı
- Bulunamayan workout için 404 döndürüldü
- Swagger ile POST → PUT → GET testi yapıldı


## Day 7 - Query Parameters

### What I learned
- Query parameter mantığını öğrendim.
- Path parameter ile query parameter arasındaki farkı öğrendim.
- `exercise` query parameter ile egzersize göre filtreleme ekledim.
- `min_volume` query parameter ile minimum hacme göre filtreleme ekledim.
- Birden fazla query parameter'ı aynı endpoint içinde kullandım.
- `.lower()` ile büyük/küçük harf duyarsız arama yaptım.
- List comprehension kullanarak filtreleme yaptım.

### Tested
- GET /workouts
- GET /workouts?exercise=Bench Press
- GET /workouts?exercise=bench press
- GET /workouts?exercise=Deadlift
- GET /workouts?min_volume=1500
- GET /workouts?exercise=Bench Press&min_volume=1500

## Day 8

Today I learned how to sort workouts with query parameters.

- Added `sort_by` query parameter.
- Added `descending` query parameter.
- Used Python `sorted()` function.
- Learned how `lambda` works for sorting.
- Added validation for allowed sort fields.
- Returned `400 Bad Request` for invalid sort fields.
- Tested sorting in Swagger.

Today I understood how `sorted()` uses `key` and `lambda` to sort a list.
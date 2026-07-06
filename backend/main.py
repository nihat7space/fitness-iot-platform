from fastapi import FastAPI

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

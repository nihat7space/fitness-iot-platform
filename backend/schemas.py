from pydantic import BaseModel, Field


class Workout(BaseModel):
    exercise: str = Field(min_length=1)
    sets: int = Field(ge=1)
    reps: int = Field(ge=1)
    weight: float = Field(ge=0.0)
    
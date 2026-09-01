from pydantic import BaseModel, Field


class Workout(BaseModel):
    exercise: str = Field(min_length=1)
    sets: int = Field(ge=1)
    reps: int = Field(ge=1)
    weight: float = Field(ge=0.0)



class UserCreate(BaseModel):
    username: str = Field(min_length=1)
    email: str = Field(min_length=1)
    password: str = Field(min_length=8)



class UserResponse(BaseModel):
    id: int
    username: str
    email: str



class UserLogin(BaseModel):
    identifier: str = Field(min_length=1)
    password: str = Field(min_length=8)
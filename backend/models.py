from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column,Integer,String,Float


class Base(DeclarativeBase):
    pass


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True)
    exercise = Column(String(100))
    sets = Column(Integer)
    reps = Column(Integer)
    weight = Column(Float)
    total_volume = Column(Float)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50),nullable=False, unique=True)
    email = Column(String(100),nullable=False, unique=True)
    hashed_password = Column(String(255),nullable=False)

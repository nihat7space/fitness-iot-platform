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

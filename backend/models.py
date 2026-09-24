from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, String, Float, DateTime, func


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
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(100), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)


class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True)
    accel_x = Column(Float, nullable=False)
    accel_y = Column(Float, nullable=False)
    accel_z = Column(Float, nullable=False)
    gyro_x = Column(Float, nullable=False)
    gyro_y = Column(Float, nullable=False)
    gyro_z = Column(Float, nullable=False)
    label = Column(String(30), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

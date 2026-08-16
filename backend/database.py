from sqlalchemy import create_engine
from backend.models import Base
from sqlalchemy.orm import sessionmaker

engine = create_engine(
    "postgresql+psycopg2://nihatoksuz@localhost:5432/fitness_db"
)

Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

        
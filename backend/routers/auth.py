from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.schemas import UserCreate,UserResponse,UserLogin
from backend.database import get_db
from backend.models import User
from backend.security import hash_password, verify_password, create_access_token,decode_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


router = APIRouter(prefix="/auth", tags=["auth"])
bearer_scheme = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    user_id = decode_access_token(credentials.credentials)

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    current_user = db.query(User).filter(User.id == int(user_id)).first()

    if not current_user:
        raise HTTPException(status_code=401, detail="User not found")

    return current_user


@router.post("/register",response_model=UserResponse)
def register_user(user: UserCreate,db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
    if existing_email:
            raise HTTPException(status_code=400, detail="Email already exists")
       
    hashed_password = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter((User.username == user.identifier) | (User.email == user.identifier)).first()
    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid username/email or password")
    
    if not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username/email or password")
    
    access_token = create_access_token(user_id=existing_user.id)
    return {"message": "Login successful", "access_token": access_token}



@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


from pydantic import BaseModel, Field
from fastapi import Depends, Path, Query, HTTPException, APIRouter
from models import User
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from passlib.context import CryptContext
from database import SessionLocal

router = APIRouter()

class UserRequest(BaseModel):
    user_name: str = Field(min_length=3, max_length=20)
    first_name: str
    last_name:  str
    email: str = Field(min_length=5)
    hashed_password: str
    is_active: bool

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.get('/user', status_code=status.HTTP_200_OK)
async def get_all_users(db: db_dependency):
    return db.query(User).all()

@router.post('/user', status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserRequest):
    user_model = User(
    user_name=create_user_request.user_name,
    first_name=create_user_request.first_name,
    last_name=create_user_request.last_name,
    email=create_user_request.email,
    hashed_password=bcrypt_context.hash(create_user_request.hashed_password),
    is_active=create_user_request.is_active
    )
    db.add(user_model)
    db.commit()



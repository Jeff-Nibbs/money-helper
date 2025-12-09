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





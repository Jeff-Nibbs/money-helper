from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, Path, Query, HTTPException
from database import engine, SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from models import Account

router = APIRouter()

class AccountRequest(BaseModel):
    official_name: str
    type: str
    balance: int
    subtype: str
    owner_id: int

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.get('/account', status_code=status.HTTP_200_OK)
async def all_accounts(db: db_dependency):
    return db.query(Account).all()

@router.post('/account', status_code=status.HTTP_201_CREATED)
async def create_account(db: db_dependency, create_account_request: AccountRequest):
    account_model = Account(
    official_name=create_account_request.official_name,
    type=create_account_request.type,
    balance=create_account_request.balance,
    subtype=create_account_request.subtype,
    owner_id=create_account_request.owner_id
    )
    db.add(account_model)
    db.commit()
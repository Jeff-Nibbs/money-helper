from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, Path, Query, HTTPException
from database import engine, SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from models import Account
from .auth import get_current_user

router = APIRouter(
    prefix='/account',
    tags=['account']
)

class AccountRequest(BaseModel):
    official_name: str
    type: str
    balance: float
    subtype: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get('/', status_code=status.HTTP_200_OK)
async def get_all_accounts(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication failed')
    return db.query(Account).filter(Account.owner_id == user.get('id')).all()


@router.get('/{account_id}', status_code=status.HTTP_200_OK)
async def get_account(user: user_dependency, db: db_dependency, account_id: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication failed')
    account_model = db.query(Account).filter(Account.id == account_id).first()
    if account_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Account not found')
    return account_model


@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_account(user: user_dependency, db: db_dependency, create_account_request: AccountRequest):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication failed')
    account_model = Account(
    official_name=create_account_request.official_name,
    type=create_account_request.type,
    balance=create_account_request.balance,
    subtype=create_account_request.subtype,
    owner_id=user.get('id')
    )
    db.add(account_model)
    db.commit()
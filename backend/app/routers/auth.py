from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from .. import schemas, models, auth
from ..database import get_db
from ..config import oauth
import os

router = APIRouter(prefix="/auth", tags=["auth"])

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# --- Register ---
@router.post("/register", response_model=schemas.TokenResponse)
def register_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = auth.hash_password(payload.password)
    user = models.User(name=payload.name, email=payload.email, password_hash=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)
    token = auth.create_access_token({"user_id": user.id, "email": user.email})
    return {"access_token": token, "token_type": "bearer"}

# --- Login ---
@router.post("/login", response_model=schemas.TokenResponse)
def login_user(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = auth.authenticate_user(payload.email, payload.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = auth.create_access_token({"user_id": user.id, "email": user.email})
    return {"access_token": token, "token_type": "bearer"}

# --- Google OAuth ---
@router.get("/google")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")
    if not user_info:
        raise HTTPException(status_code=400, detail="Google authentication failed")

    email = user_info["email"]
    google_id = user_info["sub"]
    name = user_info.get("name", "Google User")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(name=name, email=email, google_id=google_id)
        db.add(user)
        db.commit()
        db.refresh(user)

    jwt_token = auth.create_access_token({"user_id": user.id, "email": user.email})
    redirect_url = f"{FRONTEND_URL}/auth/callback?token={jwt_token}"
    return RedirectResponse(url=redirect_url)

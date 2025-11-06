from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .database import Base, engine
from . import models
from .routers import auth, goals, plaid, insights
from .config import JWT_SECRET_KEY

app = FastAPI()

# Session middleware (must be added before CORS for OAuth to work)
app.add_middleware(
    SessionMiddleware,
    secret_key=JWT_SECRET_KEY,
)

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth.router)
app.include_router(goals.router)
app.include_router(plaid.router)
app.include_router(insights.router)

@app.get("/")
def root():
    return {"message": "Money Helper API is running 🚀"}

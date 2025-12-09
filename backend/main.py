from fastapi import FastAPI
from database import engine
import models
from routes import user, account, auth

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(account.router)
app.include_router(auth.router)
from fastapi import FastAPI
from database import engine
import models
from routes import user, account

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(account.router)

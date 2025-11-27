# app/main.py
from app.api.routes import user
from fastapi import FastAPI
from app.models import user as models
from app.database.session import engine

app = FastAPI()

@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=engine)
    print("Database tables created (if not already).")

@app.get("/")
def read_root():
    return {"message": "Hello World"}

from app.api.routes import user
app.include_router(user.router, prefix="/iteratives", tags=["iteratives"])








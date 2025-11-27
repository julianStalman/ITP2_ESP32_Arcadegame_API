from sqlalchemy import select
from sqlalchemy.orm import Session
from .config import settings
from app.database.session import engine
from app.database.session import Base, engine


def init_db(session: Session) -> None:
    
    Base.metadata.create_all(bind=engine) 

from sqlalchemy.orm import Session
from app.models.user import Iterative
from app.schemas.user import UserCreate, UserUpdate

def get_user_by_id(db: Session, user_id: int):
    return db.query(Iterative).filter(Iterative.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(Iterative).filter(Iterative.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Iterative).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    # Check if the username already exists
    existing_user = db.query(Iterative).filter(Iterative.username == user.username).first()
    new_username = user.username

    # If the username exists, append a '*' to the new username
    while existing_user:
        new_username += "*"
        existing_user = db.query(Iterative).filter(Iterative.username == new_username).first()

    db_user = Iterative(
        username=new_username,
        snake_high_score=0,
        pong_high_score=0,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_snake_high_score(db: Session, user_id: int, new_snake_score: int):
    """Update only the snake high score for a user."""
    db_user = db.query(Iterative).filter(Iterative.id == user_id).first()
    if db_user:
        db_user.snake_high_score = new_snake_score
        db.commit()
        db.refresh(db_user)
    return db_user

def update_pong_high_score(db: Session, user_id: int, new_pong_score: int):
    """Update only the pong high score for a user."""
    db_user = db.query(Iterative).filter(Iterative.id == user_id).first()
    if db_user:
        db_user.pong_high_score = new_pong_score
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(Iterative).filter(Iterative.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user
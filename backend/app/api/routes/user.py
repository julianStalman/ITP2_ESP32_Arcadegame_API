from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud.user import (
    get_user_by_id,
    get_users,
    create_user,
    update_snake_high_score,
    update_pong_high_score,
    delete_user,
    get_snake_leaderboard,
    get_pong_leaderboard,
)
from app.schemas.user import UserCreate, User, UserBasic
from app.api.deps import get_db

router = APIRouter()

@router.get("/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """Retrieve a user by their ID."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/", response_model=list[UserBasic])
def read_users(db: Session = Depends(get_db)):
    """Retrieve all users with only their ID and username."""
    return get_users(db)

@router.post("/", response_model=User)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user. If the username already exists, append '*' to the new username."""
    return create_user(db, user)

@router.put("/{user_id}/snake_high_score", response_model=User)
def update_snake_score(user_id: int, new_snake_score: int, db: Session = Depends(get_db)):
    """Update the snake high score for a user if the new score is higher."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if new_snake_score <= db_user.snake_high_score:
        raise HTTPException(status_code=400, detail="New snake high score must be greater than the current high score")
    return update_snake_high_score(db, user_id, new_snake_score)

@router.put("/{user_id}/pong_high_score", response_model=User)
def update_pong_score(user_id: int, new_pong_score: int, db: Session = Depends(get_db)):
    """Update the pong high score for a user if the new score is higher."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if new_pong_score <= db_user.pong_high_score:
        raise HTTPException(status_code=400, detail="New pong high score must be greater than the current high score")
    return update_pong_high_score(db, user_id, new_pong_score)

@router.delete("/{user_id}", response_model=User)
def delete_existing_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user by their ID."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return delete_user(db, user_id)


@router.get("/leaderboard/snake", response_model=list[User])
def read_snake_leaderboard(db: Session = Depends(get_db)):
    """Retrieve the leaderboard for snake high scores, sorted in descending order."""
    return get_snake_leaderboard(db)

@router.get("/leaderboard/pong", response_model=list[User])
def read_pong_leaderboard(db: Session = Depends(get_db)):
    """Retrieve the leaderboard for pong high scores, sorted in descending order."""
    return get_pong_leaderboard(db)
import pytest
from app.schemas.user import UserCreate
from app.crud.user import (
    create_user,
    get_user_by_id,
    get_users,
    update_snake_high_score,
    update_pong_high_score,
    get_snake_leaderboard,
    get_pong_leaderboard,
    delete_user,
)
from app.models.user import User


def test_create_user(db):
    """Test creating a new user."""
    user_data = UserCreate(username="TestUser")
    result = create_user(db=db, user=user_data)

    assert result.id is not None
    assert result.username == "TestUser"
    assert result.snake_high_score == 0
    assert result.pong_high_score == 0


def test_get_user_by_id(db):
    """Test retrieving a user by ID."""
    user_data = UserCreate(username="TestUser")
    created_user = create_user(db=db, user=user_data)

    fetched_user = get_user_by_id(db=db, user_id=created_user.id)
    assert fetched_user is not None
    assert fetched_user.id == created_user.id
    assert fetched_user.username == "TestUser"


def test_get_users(db):
    """Test retrieving multiple users."""
    create_user(db=db, user=UserCreate(username="User1"))
    create_user(db=db, user=UserCreate(username="User2"))

    users = get_users(db=db)
    assert len(users) >= 2
    assert users[0].username == "User1"
    assert users[1].username == "User2"


def test_update_snake_high_score(db):
    """Test updating the snake high score."""
    user_data = UserCreate(username="SnakePlayer")
    created_user = create_user(db=db, user=user_data)

    updated_user = update_snake_high_score(db=db, user_id=created_user.id, new_snake_score=100)
    assert updated_user.snake_high_score == 100


def test_update_pong_high_score(db):
    """Test updating the pong high score."""
    user_data = UserCreate(username="PongPlayer")
    created_user = create_user(db=db, user=user_data)

    updated_user = update_pong_high_score(db=db, user_id=created_user.id, new_pong_score=200)
    assert updated_user.pong_high_score == 200


def test_get_snake_leaderboard(db):
    """Test retrieving the snake leaderboard."""
    create_user(db=db, user=UserCreate(username="Player1"))
    create_user(db=db, user=UserCreate(username="Player2"))

    update_snake_high_score(db=db, user_id=1, new_snake_score=150)
    update_snake_high_score(db=db, user_id=2, new_snake_score=200)

    leaderboard = get_snake_leaderboard(db=db, limit=2)
    assert len(leaderboard) == 2
    assert leaderboard[0].snake_high_score == 200
    assert leaderboard[1].snake_high_score == 150


def test_get_pong_leaderboard(db):
    """Test retrieving the pong leaderboard."""
    create_user(db=db, user=UserCreate(username="Player1"))
    create_user(db=db, user=UserCreate(username="Player2"))

    update_pong_high_score(db=db, user_id=1, new_pong_score=300)
    update_pong_high_score(db=db, user_id=2, new_pong_score=250)

    leaderboard = get_pong_leaderboard(db=db, limit=2)
    assert len(leaderboard) == 2
    assert leaderboard[0].pong_high_score == 300
    assert leaderboard[1].pong_high_score == 250


def test_delete_user(db):
    """Test deleting a user."""
    user_data = UserCreate(username="ToDelete")
    created_user = create_user(db=db, user=user_data)

    deleted_user = delete_user(db=db, user_id=created_user.id)
    assert deleted_user is not None
    assert deleted_user.id == created_user.id

    fetched_user = get_user_by_id(db=db, user_id=created_user.id)
    assert fetched_user is None


def test_get_user_by_id(db):
    """Test retrieving a user by ID."""
    user_data = UserCreate(username="TestUser")
    created_user = create_user(db=db, user=user_data)

    fetched_user = get_user_by_id(db=db, user_id=created_user.id)
    assert fetched_user is not None
    assert fetched_user.id == created_user.id
    assert fetched_user.username == "TestUser"


def test_get_users(db):
    """Test retrieving multiple users."""
    create_user(db=db, user=UserCreate(username="User1"))
    create_user(db=db, user=UserCreate(username="User2"))

    users = get_users(db=db)
    assert len(users) >= 2
    assert users[0].username == "User1"
    assert users[1].username == "User2"


def test_update_snake_high_score(db):
    """Test updating the snake high score."""
    user_data = UserCreate(username="SnakePlayer")
    created_user = create_user(db=db, user=user_data)

    updated_user = update_snake_high_score(db=db, user_id=created_user.id, new_snake_score=100)
    assert updated_user.snake_high_score == 100



def test_update_pong_high_score(db):
    """Test updating the pong high score."""
    user_data = UserCreate(username="PongPlayer")
    created_user = create_user(db=db, user=user_data)

    updated_user = update_pong_high_score(db=db, user_id=created_user.id, new_pong_score=200)
    assert updated_user.pong_high_score == 200

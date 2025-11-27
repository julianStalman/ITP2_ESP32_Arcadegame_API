from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    snake_high_score: Optional[int] = None
    pong_high_score: Optional[int] = None

class UserInDBBase(UserBase):
    id: int
    snake_high_score: int
    pong_high_score: int
    created_at: datetime

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass
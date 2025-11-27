from collections.abc import Generator
from typing import Annotated

from sqlalchemy.orm import Session

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError

from app.database.session import engine
from app.core import security
from app.core.config import settings


from datetime import datetime, timedelta



inactivity_threshold = datetime.utcnow() - timedelta(days=180)

# Database Dependency
def get_db() -> Generator[Session, None, None]:
    """
    Provides a SQLAlchemy session to interact with the database.
    
    Yields:
        Session: SQLAlchemy session object.
    """
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_db)]


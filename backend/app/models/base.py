from datetime import datetime
from typing import Any

from sqlmodel import Field, SQLModel


class Timestamped(SQLModel):
    created_at: datetime = Field(
        default_factory=datetime.utcnow, nullable=False, index=True
    )
    updated_at: datetime | None = Field(default=None, nullable=True, index=True)

    def touch(self) -> None:  # helper for manual update timestamping
        self.updated_at = datetime.utcnow()


class Message(SQLModel):
    message: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: str | None = None


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


class Pagination(SQLModel):
    limit: int = Field(default=100, le=1000)
    offset: int = Field(default=0, ge=0)


class APIError(SQLModel):
    detail: Any

import uuid
from datetime import datetime

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel

from .base import Timestamped
from .user import User


class APIKeyBase(SQLModel):
    description: str | None = Field(default=None, max_length=255)
    scopes: list[str] = Field(default_factory=list, sa_column=Column(JSONB))
    expires_at: datetime | None = None


class APIKeyCreate(APIKeyBase):
    user_id: uuid.UUID


class APIKey(APIKeyBase, Timestamped, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    key_hash: str = Field(max_length=128, unique=True, index=True)
    user_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, index=True, ondelete="CASCADE"
    )
    last_used_at: datetime | None = None

    user: User = Relationship(back_populates="api_keys")


class APIKeyPublic(APIKeyBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    last_used_at: datetime | None

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel

from .base import Timestamped

if TYPE_CHECKING:  # pragma: no cover
    from .embedding import Embedding
    from .event import Event


class AIModelBase(SQLModel):
    name: str = Field(max_length=255, index=True)
    provider: str = Field(max_length=100, index=True)
    version: str | None = Field(default=None, max_length=100, index=True)
    parameters: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    meta_data: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))

class AIModel(AIModelBase, Timestamped, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    embeddings: list["Embedding"] = Relationship(back_populates="ai_model", cascade_delete=True)
    events: list["Event"] = Relationship(back_populates="ai_model", cascade_delete=True)

class AIModelPublic(AIModelBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime | None

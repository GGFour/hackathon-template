import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel

from .ai_model import AIModel
from .base import Timestamped
from .content import Content
from .item import Item


class EmbeddingBase(SQLModel):
    dim: int = Field(gt=0)
    meta_data: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))


class EmbeddingCreate(EmbeddingBase):
    content_id: uuid.UUID | None = None
    item_id: uuid.UUID | None = None
    vector: list[float]


class Embedding(EmbeddingBase, Timestamped, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    model_id: uuid.UUID = Field(
        foreign_key="aimodel.id",
        nullable=False,
        ondelete="CASCADE",
    )
    content_id: uuid.UUID | None = Field(
        foreign_key="content.id",
        nullable=True,
        unique=True,
        index=True,
        ondelete="CASCADE",
    )
    item_id: uuid.UUID | None = Field(
        foreign_key="item.id", nullable=True, index=True, ondelete="CASCADE"
    )
    vector: list[float] = Field(default_factory=list, sa_column=Column(JSONB))

    content: Content | None = Relationship(back_populates="embedding")
    item: Item | None = Relationship(back_populates="embeddings")
    ai_model: AIModel = Relationship(back_populates="embeddings")


class EmbeddingPublic(EmbeddingBase):
    id: uuid.UUID
    content_id: uuid.UUID | None
    item_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime | None

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel

from .base import Timestamped
from .item import Item

if TYPE_CHECKING:  # pragma: no cover
    from .embedding import Embedding


class ContentBase(SQLModel):
    role: str = Field(max_length=50, index=True)
    text: str
    meta_data: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))


class ContentCreate(ContentBase):
    item_id: uuid.UUID


class ContentUpdate(SQLModel):
    role: str | None = Field(default=None, max_length=50)
    text: str | None = None
    meta_data: dict[str, Any] | None = None


class Content(ContentBase, Timestamped, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    item_id: uuid.UUID = Field(
        foreign_key="item.id", nullable=False, index=True, ondelete="CASCADE"
    )

    item: Item = Relationship(back_populates="contents")
    embedding: "Embedding" = Relationship(back_populates="content")


class ContentPublic(ContentBase):
    id: uuid.UUID
    item_id: uuid.UUID
    created_at: datetime
    updated_at: datetime | None

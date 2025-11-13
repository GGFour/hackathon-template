import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel

from .base import Timestamped
from .link_tables import ItemTagLink
from .organization import Organization
from .user import User

if TYPE_CHECKING:  # pragma: no cover
    from .content import Content
    from .embedding import Embedding
    from .event import Event
    from .file_asset import FileAsset
    from .tag import Tag


class ItemBase(SQLModel):
    type: str = Field(max_length=100, index=True)
    title: str = Field(min_length=1, max_length=255, index=True)
    description: str | None = Field(default=None)
    meta_data: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))


class ItemCreate(ItemBase):
    owner_id: uuid.UUID | None = None
    organization_id: uuid.UUID | None = None


class ItemUpdate(SQLModel):
    type: str | None = Field(default=None, max_length=100)
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    meta_data: dict[str, Any] | None = None


class Item(ItemBase, Timestamped, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, index=True, ondelete="CASCADE"
    )
    organization_id: uuid.UUID | None = Field(
        foreign_key="organization.id", nullable=True, index=True, ondelete="SET NULL"
    )

    owner: User = Relationship(back_populates="items")
    organization: Organization | None = Relationship(back_populates="items")
    contents: list["Content"] = Relationship(back_populates="item", cascade_delete=True)
    embeddings: list["Embedding"] = Relationship(
        back_populates="item", cascade_delete=True
    )
    files: list["FileAsset"] = Relationship(back_populates="item", cascade_delete=True)
    events: list["Event"] = Relationship(back_populates="item", cascade_delete=True)
    tags: list["Tag"] = Relationship(back_populates="items", link_model=ItemTagLink)


class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    organization_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime | None


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int

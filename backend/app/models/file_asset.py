import uuid
from datetime import datetime
from typing import Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel

from .base import Timestamped
from .item import Item
from .user import User


class FileAssetBase(SQLModel):
    filename: str = Field(max_length=255)
    path: str = Field(max_length=500, unique=True)
    mime_type: str = Field(max_length=100)
    size_bytes: int = Field(ge=0)
    checksum: str | None = Field(default=None, max_length=128)
    meta_data: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))


class FileAssetCreate(FileAssetBase):
    owner_id: uuid.UUID
    item_id: uuid.UUID | None = None


class FileAsset(FileAssetBase, Timestamped, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, index=True, ondelete="CASCADE"
    )
    item_id: uuid.UUID | None = Field(
        foreign_key="item.id", nullable=True, index=True, ondelete="SET NULL"
    )

    owner: User = Relationship(back_populates="files")
    item: Item | None = Relationship(back_populates="files")


class FileAssetPublic(FileAssetBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    item_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime | None

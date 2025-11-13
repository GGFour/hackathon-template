import uuid
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from .base import Timestamped
from .link_tables import ItemTagLink

if TYPE_CHECKING:  # pragma: no cover
    from .item import Item


class TagBase(SQLModel):
    name: str = Field(max_length=100, index=True)
    color: str | None = Field(default=None, max_length=16)


class TagCreate(TagBase):
    pass


class TagUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=100)
    color: str | None = Field(default=None, max_length=16)


class Tag(TagBase, Timestamped, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    items: list["Item"] = Relationship(back_populates="tags", link_model=ItemTagLink)


class TagPublic(TagBase):
    id: uuid.UUID

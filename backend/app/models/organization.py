import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel

from .base import Timestamped

if TYPE_CHECKING:  # pragma: no cover
    from .event import Event
    from .item import Item
    from .membership import OrganizationMembership
    from .setting import Setting


class OrganizationBase(SQLModel):
    name: str = Field(max_length=255, index=True)
    slug: str = Field(max_length=255, unique=True, index=True)
    plan_type: str = Field(default="free", max_length=50, index=True)
    meta_data: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=255)
    slug: str | None = Field(default=None, max_length=255)
    plan_type: str | None = Field(default=None, max_length=50)
    meta_data: dict[str, Any] | None = None


class Organization(OrganizationBase, Timestamped, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    items: list["Item"] = Relationship(back_populates="organization", cascade_delete=True)
    events: list["Event"] = Relationship(back_populates="organization", cascade_delete=True)
    settings: list["Setting"] = Relationship(back_populates="organization", cascade_delete=True)
    memberships: list["OrganizationMembership"] = Relationship(
        back_populates="organization", cascade_delete=True
    )


class OrganizationPublic(OrganizationBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime | None


class OrganizationsPublic(SQLModel):
    data: list[OrganizationPublic]
    count: int

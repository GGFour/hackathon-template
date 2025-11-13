import uuid
from enum import Enum
from typing import Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel

from .base import Timestamped
from .organization import Organization
from .user import User


class SettingScope(str, Enum):
    global_ = "global"
    user = "user"
    organization = "organization"


class SettingBase(SQLModel):
    scope: SettingScope = Field(index=True)
    key: str = Field(max_length=255, index=True)
    value: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))


class SettingCreate(SettingBase):
    user_id: uuid.UUID | None = None
    organization_id: uuid.UUID | None = None


class SettingUpdate(SQLModel):
    value: dict[str, Any] | None = None


class Setting(SettingBase, Timestamped, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID | None = Field(
        foreign_key="user.id", nullable=True, index=True, ondelete="CASCADE"
    )
    organization_id: uuid.UUID | None = Field(
        foreign_key="organization.id", nullable=True, index=True, ondelete="CASCADE"
    )

    user: User | None = Relationship(back_populates="settings")
    organization: Organization | None = Relationship(back_populates="settings")


class SettingPublic(SettingBase):
    id: uuid.UUID

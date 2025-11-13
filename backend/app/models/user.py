import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from pydantic import EmailStr
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel

from .base import Timestamped

if TYPE_CHECKING:  # pragma: no cover
    from .api_key import APIKey
    from .event import Event
    from .file_asset import FileAsset
    from .item import Item
    from .membership import OrganizationMembership
    from .setting import Setting


# ------------------ User ------------------
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    is_active: bool = Field(default=True, index=True)
    is_superuser: bool = Field(default=False, index=True)
    auth_provider: str = Field(default="local", max_length=50, index=True)
    extras: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


class UserUpdate(SQLModel):
    email: EmailStr | None = Field(default=None, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    is_active: bool | None = None
    is_superuser: bool | None = None
    auth_provider: str | None = Field(default=None, max_length=50)
    extras: dict[str, Any] | None = None
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
    extras: dict[str, Any] | None = None


class User(UserBase, Timestamped, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    # relationships defined after other models exist
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    events: list["Event"] = Relationship(back_populates="actor", cascade_delete=True)
    files: list["FileAsset"] = Relationship(back_populates="owner", cascade_delete=True)
    api_keys: list["APIKey"] = Relationship(back_populates="user", cascade_delete=True)
    memberships: list["OrganizationMembership"] = Relationship(
        back_populates="user", cascade_delete=True
    )
    settings: list["Setting"] = Relationship(back_populates="user", cascade_delete=True)


class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime | None


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int

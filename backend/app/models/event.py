import uuid
from datetime import datetime
from typing import Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel

from .ai_model import AIModel
from .base import Timestamped
from .item import Item
from .organization import Organization
from .user import User


class EventBase(SQLModel):
    event_type: str = Field(max_length=100, index=True)
    payload: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))


class EventCreate(EventBase):
    actor_id: uuid.UUID | None = None
    organization_id: uuid.UUID | None = None
    item_id: uuid.UUID | None = None


class Event(EventBase, Timestamped, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    actor_id: uuid.UUID | None = Field(
        foreign_key="user.id", nullable=True, index=True, ondelete="SET NULL"
    )
    organization_id: uuid.UUID | None = Field(
        foreign_key="organization.id", nullable=True, index=True, ondelete="SET NULL"
    )
    item_id: uuid.UUID | None = Field(
        foreign_key="item.id", nullable=True, index=True, ondelete="SET NULL"
    )
    model_id: uuid.UUID | None = Field(
        foreign_key="aimodel.id", nullable=True, ondelete="SET NULL"
    )

    actor: User | None = Relationship(back_populates="events")
    organization: Organization | None = Relationship(back_populates="events")
    item: Item | None = Relationship(back_populates="events")
    ai_model: AIModel = Relationship(back_populates="events")


class EventPublic(EventBase):
    id: uuid.UUID
    actor_id: uuid.UUID | None
    organization_id: uuid.UUID | None
    item_id: uuid.UUID | None
    created_at: datetime

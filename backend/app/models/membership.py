import uuid
from datetime import datetime
from enum import Enum

from sqlmodel import Field, Relationship, SQLModel

from .base import Timestamped
from .organization import Organization
from .user import User


class MembershipRole(str, Enum):
    admin = "admin"
    member = "member"
    viewer = "viewer"


class OrganizationMembershipBase(SQLModel):
    role: MembershipRole = Field(default=MembershipRole.member, index=True)


class OrganizationMembership(OrganizationMembershipBase, Timestamped, table=True):
    __table_args__ = {
        "sqlite_autoincrement": True,
    }
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, index=True, ondelete="CASCADE"
    )
    organization_id: uuid.UUID = Field(
        foreign_key="organization.id", nullable=False, index=True, ondelete="CASCADE"
    )
    joined_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="memberships")
    organization: Organization = Relationship(back_populates="memberships")


class OrganizationMembershipPublic(OrganizationMembershipBase):
    id: uuid.UUID
    user_id: uuid.UUID
    organization_id: uuid.UUID
    joined_at: datetime

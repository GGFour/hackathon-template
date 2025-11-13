import uuid

from sqlmodel import Field, SQLModel

# Association / link tables implemented as SQLModel classes.


class ItemTagLink(SQLModel, table=True):
    item_id: "uuid.UUID" = Field(
        foreign_key="item.id", primary_key=True, ondelete="CASCADE"
    )
    tag_id: "uuid.UUID" = Field(
        foreign_key="tag.id", primary_key=True, ondelete="CASCADE"
    )

    # composite uniqueness guaranteed by PK pair

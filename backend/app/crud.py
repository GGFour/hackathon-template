import uuid

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> User:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data and user_data["password"] is not None:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not db_user.is_active:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_item(
    *, session: Session, item_in: ItemCreate, owner_id: uuid.UUID | None = None
) -> Item:
    update_data: dict[str, uuid.UUID] = {}
    if owner_id is not None:
        update_data["owner_id"] = owner_id
    db_item = Item.model_validate(item_in, update=update_data)
    # Ensure required foreign keys are present per extended model
    if db_item.owner_id is None:
        raise ValueError("owner_id is required to create Item")
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item

"""Define the Users model."""

from sqlalchemy import Boolean, Enum, String,Table, Column, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.db import Base
from utils.enums import RoleType

user_product_association = Table(
    "user_product_association",
    Base.metadata,
    Column("user_id", ForeignKey("users.id",ondelete="CASCADE"), primary_key=True),
    Column("product_code_id", ForeignKey("product_codes.id",ondelete="CASCADE"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    password: Mapped[str] = mapped_column(String(255))
    first_name: Mapped[str] = mapped_column(String(30))
    last_name: Mapped[str] = mapped_column(String(50))

    role: Mapped[RoleType] = mapped_column(
        Enum(RoleType),
        nullable=False,
        server_default=RoleType.user.name,
        index=True,
    )

    banned: Mapped[bool] = mapped_column(Boolean, default=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=True) # real loyhalarda False qilinadi

    product_codes: Mapped[list["ProductCode"]] = relationship(
        secondary=user_product_association,
        back_populates="users",
        lazy="selectin"
    )

    def __repr__(self) -> str:
        """Define the model representation."""
        return f'User({self.id}, "{self.first_name} {self.last_name}")'
    


class ProductCode(Base):
    __tablename__ = "product_codes"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(Text, unique=True, index=True)
    price: Mapped[float] = mapped_column()
    product_name: Mapped[str] = mapped_column(String(255))

    users: Mapped[list[User]] = relationship(
        secondary=user_product_association,
        back_populates="product_codes",
        lazy="selectin"
    )
    def __repr__(self) -> str:
        """Define the model representation."""
        return f'ProductCode({self.id}, "{self.product_name}")'

from models import User, ProductCode
from typing import Any
from sqlalchemy import select
from collections.abc import Sequence
from sqlalchemy.ext.asyncio import AsyncSession


class UserDB:

    @staticmethod
    async def all(session: AsyncSession) -> Sequence[User]:
        """Return all Users in the database."""
        result = await session.execute(select(User))
        return result.scalars().all()

    @staticmethod
    async def get(session: AsyncSession, user_id: int | None = None, email: str | None = None) -> User | None:
        if user_id:
            """Return a specific user by their email address."""
            result = await session.execute(select(User).where(User.id == user_id))
            return result.scalars().first()

        elif email:
            """Return a specific user by their email address."""
            result = await session.execute(select(User).where(User.email == email))
            return result.scalars().first()

        else:
            raise ValueError("Provide user_id or email to get related user.")

    @staticmethod
    async def create(session: AsyncSession, user_data: dict[str, Any]) -> User:
        """Add a new user to the database."""
        new_user = User(**user_data)
        session.add(new_user)
        return new_user
    
class ProductDB:

    @staticmethod
    async def all(session: AsyncSession) -> Sequence[ProductCode]:
        result = await session.execute(select(ProductCode))
        return result.scalars().all()

    @staticmethod
    async def get(session: AsyncSession, code: str | None = None, p_id: int | None = None) -> ProductCode | None:
        if code:
            result = await session.execute(select(ProductCode).where(ProductCode.code == code))
            return result.scalars().first()
        
        elif p_id:
            result = await session.execute(select(ProductCode).where(ProductCode.id == p_id))
            return result.scalars().first()

        else:
            raise ValueError(f"There in not like this product with this {code} name in DataBase")

    @staticmethod
    async def create(session: AsyncSession, product_data: dict[str, Any]) -> ProductCode:
        new_product = ProductCode(**product_data)
        session.add(new_product)
        return new_product
    




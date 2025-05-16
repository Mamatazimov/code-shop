from typing import Any, Optional, Type
from email_validator import EmailNotValidError, validate_email
from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlalchemy import delete, update
from sqlalchemy.exc import IntegrityError
from database.helpers import UserDB,ProductDB
from managers.auth import AuthManager
from models import User,ProductCode
from collections.abc import Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from utils.enums import RoleType
from schemas.user import UserChangePasswordRequest, UserEditRequest




class ProductManager:

    @staticmethod
    async def create_product(product_data: dict[str,Any],session: AsyncSession) -> ProductCode:
        
        if not all(product_data.values()):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Product datalari to'liq emas")

        new_product = product_data.copy()

        try:
            _ = await ProductDB.create(session, product_data=new_product)
            await session.flush()
        except Exception as e:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Product yaratishda xatolik: {e}")
        
        product_do = await ProductDB.get(session,code=new_product["code"])
        assert product_do

        return product_do
    
    @staticmethod
    async def delete_product(product_id: int, session: AsyncSession) -> None:
        """Delete the product with specified ID."""
        check_product = await ProductDB.get(session, p_id=product_id)
        if not check_product:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Productni ochirishda xatolik!")

        await session.execute(delete(ProductCode).where(ProductCode.id == product_id))

    @staticmethod
    async def get_all_product(session: AsyncSession) -> Sequence[ProductCode]:
        return await ProductDB.all(session)
    
    @staticmethod
    async def get_product_by_id(user_id:int,session: AsyncSession) -> Type[ProductCode]:

        from sqlalchemy.orm import selectinload
        from sqlalchemy import select
        result = await session.execute(
            select(User).options(selectinload(User.product_codes)).where(User.id == user_id)
        )
        user = result.scalars().first()
        if user:
            return user.product_codes
        else:
            return []


    




















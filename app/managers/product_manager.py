from typing import Any, Optional, Type
from email_validator import EmailNotValidError, validate_email
from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlalchemy import delete, update
from sqlalchemy.exc import IntegrityError
from database.helpers import UserDB,ProductDB
from managers.auth import AuthManager
from models import User,ProductCode,user_product_association
from collections.abc import Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from utils.enums import RoleType
from schemas.user import UserChangePasswordRequest, UserEditRequest
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from sqlalchemy.future import select as sel



class ProductManager:

    @staticmethod
    async def create_product(product_data: dict[str,Any],session: AsyncSession) -> ProductCode:
        

        new_product = product_data.copy()
        try:
            _ = await ProductDB.create(session, product_data=new_product.dict())
            await session.flush()
        except Exception as e:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Product yaratishda xatolik: {e}")
        
        product_do = await ProductDB.get(session,code=new_product.code)
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

        result = await session.execute(
            select(User).options(selectinload(User.product_codes)).where(User.id == user_id)
        )
        user = result.scalars().first()
        if user:
            return user.product_codes
        else:
            return []
        
    @staticmethod
    async def get_my_products(user_id:int,session: AsyncSession):
        check_user= await UserDB.get(session,user_id=user_id)
        if not user_id:
            raise HTTPException(status.HTTP_404_NOT_FOUND,"Xatolik. User topilmadi!")
        stmt = select(User).options(selectinload(User.product_codes)).where(User.id == user_id)
        result = await session.execute(stmt)
        data = result.scalar_one_or_none()
        return data.product_codes

    @staticmethod
    async def add_product_to_user(user_id:int,p_id:int,db:AsyncSession):

        user_result = await db.execute(sel(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        print(user)

        products_result = await db.execute(sel(ProductCode).where(ProductCode.id==p_id))
        product = products_result.scalars().first()
        print(product)

        if not user or not product:
            raise Exception("User yoki Product topilmadi")

        user.product_codes.append(product)
        await db.commit()
        return user


    




















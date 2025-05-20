
from collections.abc import Sequence
from typing import Optional, Union

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.db import get_database
from managers.auth import can_edit_user, is_admin, oauth2_schema
from managers.user import UserManager
from managers.product_manager import ProductManager
from utils.enums import RoleType
from models import User,ProductCode
from schemas.user import UserChangePasswordRequest, UserEditRequest, MyUserResponse, UserResponse
from schemas.product import ProductResponse, ProductBase

router = APIRouter(tags=["Products"], prefix="/products")



@router.get("/",
            response_model=Union[ProductResponse, list[ProductResponse]],
            )
async def get_all_projects(product_id: Optional[int] = None, db: AsyncSession = Depends(get_database)) -> Union[Sequence[ProductCode], ProductCode]:

    a= await ProductManager.get_product_by_id(product_id,db)
    print(a)
    if product_id:
        return await ProductManager.get_product_by_id(product_id, db)
    return await ProductManager.get_all_product(db)


@router.post(
    "/new",
    dependencies=[Depends(oauth2_schema), Depends(is_admin)],
    status_code=status.HTTP_201_CREATED,
    response_model=ProductResponse
)
async def create_product(product_data: ProductBase,session: AsyncSession = Depends(get_database)) -> ProductCode:

    result = await ProductManager.create_product(product_data,session)
    return result


@router.delete("/{p_id}",dependencies=[Depends(oauth2_schema),Depends(is_admin)])
async def delete_product(p_id:int,db: AsyncSession=Depends(get_database)) -> None:
    await ProductManager.delete_product(p_id,db)


@router.get("/my",dependencies=[Depends(oauth2_schema)])
async def my_products(request: Request,db:AsyncSession = Depends(get_database)):
    my_user: int = request.state.user.id
    data = await ProductManager.get_my_products(user_id=my_user,session=db)
    return data


@router.get("/add/{p_id}",dependencies=[Depends(oauth2_schema)])
async def add_product(p_id:int,request:Request,db:AsyncSession=Depends(get_database)):
    my_user: int = request.state.user.id
    result = await ProductManager.add_product_to_user(user_id=my_user,p_id=p_id,db=db)




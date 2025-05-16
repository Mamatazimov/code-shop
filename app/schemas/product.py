from utils.enums import RoleType
from pydantic import BaseModel, ConfigDict, Field
from schemas.examples import  ExampleProduct


class ProductBase(BaseModel):

    code: str = Field(examples=[ExampleProduct.code])
    price : float = Field(example = [ExampleProduct.price])
    product_name : str = Field(example = [ExampleProduct.product_name])


class ProductResponse(ProductBase):

    id: int = Field(exaples=[ExampleProduct.id])

    model_config = ConfigDict(from_attributes=True)




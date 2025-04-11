from pydantic import BaseModel, Field
from typing import Optional

class ContractCreate(BaseModel):
    farmerName: str
    buyerName: str
    cropName: str
    quantity: int
    pricePerUnit: int

class Contract(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    farmerName: str
    buyerName: str
    cropName: str
    quantity: int
    pricePerUnit: int
    totalAmount: int
    date: str

    class Config:
        populate_by_name = True  # new name in Pydantic v2
        arbitrary_types_allowed = True

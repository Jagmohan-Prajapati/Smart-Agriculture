from pydantic import BaseModel
from typing import Optional

class Profile(BaseModel):
    name: str
    email: str
    phone: str
    role: str
    profile_image: Optional[str] = None
    password: str

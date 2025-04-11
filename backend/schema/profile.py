from pydantic import BaseModel
from fastapi import Form
from typing import Optional

class ProfileUpdateRequest(BaseModel):
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    role: Optional[str]
    notifications: Optional[bool]
    display: Optional[str]

    @classmethod
    def as_form(
        cls,
        name: Optional[str] = Form(None),
        email: Optional[str] = Form(None),
        phone: Optional[str] = Form(None),
        role: Optional[str] = Form(None),
        notifications: Optional[bool] = Form(None),
        display: Optional[str] = Form(None),
    ):
        return cls(
            name=name,
            email=email,
            phone=phone,
            role=role,
            notifications=notifications,
            display=display,
        )

class ProfileResponse(BaseModel):
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    role: Optional[str]
    notifications: Optional[bool]
    display: Optional[str]
    image_path: Optional[str]  # Include this if you're returning profile picture

    model_config = {
        "from_attributes": True
    }
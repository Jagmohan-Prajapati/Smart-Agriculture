from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Depends
from typing import Optional
from model.profile import Profile
from schema.profile import ProfileResponse, ProfileUpdateRequest
from utils.upload_helper import save_profile_image
from utils.hash_helper import hash_password, verify_password
from bson import ObjectId
from db.mongo import db
import os

router = APIRouter()
profile_collection = db["profiles"]

@router.get("/profile/{email}", response_model=ProfileResponse)
async def get_profile(email: str):
    profile = profile_collection.find_one({"email": email})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile["id"] = str(profile["_id"])
    return profile

def update_profile_data(email: str, data: dict):
    existing = profile_collection.find_one({"email": email})
    if not existing:
        raise HTTPException(status_code=404, detail="User profile not found")
    profile_collection.update_one({"email": email}, {"$set": data})

@router.put("/profile/update")
async def update_profile(
    data: ProfileUpdateRequest = Depends(ProfileUpdateRequest.as_form),
    profile_image: Optional[UploadFile] = File(None)
):
    update_data = data.dict()

    if profile_image:
        image_path = save_profile_image(profile_image, data.email)
        update_data["profile_image"] = image_path

    update_profile_data(data.email, update_data)
    return {"message": "Profile updated successfully"}

@router.patch("/profile")
async def patch_profile(
    data: ProfileUpdateRequest = Depends(ProfileUpdateRequest.as_form),
    profile_image: Optional[UploadFile] = File(None)
):
    update_data = data.dict()

    if profile_image:
        image_path = save_profile_image(profile_image, data.email)
        update_data["profile_image"] = image_path

    update_profile_data(data.email, update_data)
    return {
        "message": "Profile updated via PATCH successfully",
        "profile_image": update_data.get("profile_image")
    }

@router.put("/profile/password")
async def change_password(
    email: str = Form(...),
    current_password: str = Form(...),
    new_password: str = Form(...)
):
    profile = profile_collection.find_one({"email": email})
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(current_password, profile.get("password", "")):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    profile_collection.update_one(
        {"email": email},
        {"$set": {"password": hash_password(new_password)}}
    )
    return {"message": "Password changed successfully"}

@router.delete("/profile/image/{email}")
async def delete_profile_image(email: str):
    profile = profile_collection.find_one({"email": email})
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")

    image_path = profile.get("profile_image")
    if image_path:
        abs_path = os.path.join("uploads", image_path.replace("uploads/", ""))
        if os.path.exists(abs_path):
            os.remove(abs_path)

    profile_collection.update_one(
        {"email": email},
        {"$set": {"profile_image": None}}
    )
    return {"message": "Profile image removed successfully"}

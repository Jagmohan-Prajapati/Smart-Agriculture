import os
from fastapi import UploadFile
from uuid import uuid4

UPLOAD_DIR = "uploads/profile_pics"

def save_profile_image(file: UploadFile, email: str) -> str:
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    file_ext = file.filename.split('.')[-1]
    filename = f"{email.replace('@', '_').replace('.', '_')}_{uuid4().hex}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return file_path.replace("\\", "/")



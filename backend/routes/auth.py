import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from data.store import DEMO_USERS
import os

load_dotenv()

router = APIRouter()   # ✅ ONLY ONCE

JWT_SECRET = os.getenv("JWT_SECRET", "nexachat_super_secret_key_2026")

class LoginRequest(BaseModel):
    email: str
    password: str

@router.get("/")
def test():
    return {"message": "Auth route working"}

@router.post("/login")
def login(body: LoginRequest):
    user = next(
        (u for u in DEMO_USERS if u["email"] == body.email.strip().lower() and u["password"] == body.password),
        None
    )

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    payload = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "dept": user["dept"],
        "exp": datetime.utcnow() + timedelta(hours=8),
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    safe_user = {k: v for k, v in user.items() if k != "password"}

    return {"token": token, "user": safe_user}

@router.post("/logout")
def logout():
    return {"success": True, "message": "Logged out successfully."}
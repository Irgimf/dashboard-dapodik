from pydantic import BaseModel
from typing import Optional
from enum import Enum

class RoleEnum(str, Enum):
    Admin = "Admin"
    Operator = "Operator"
    Viewer = "Viewer"

class UserLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str

class UserCreate(BaseModel):
    username: str
    password: str
    role: RoleEnum

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[RoleEnum] = None
    status: Optional[str] = None

class UserResponse(BaseModel):
    user_id: int
    username: str
    role: str
    status: str

    class Config:
        from_attributes = True
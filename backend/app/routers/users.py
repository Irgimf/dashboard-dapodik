from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.config import get_db
from app.models.user import User, RoleEnum, StatusEnum
from app.schemas.user_schema import UserCreate, UserUpdate, UserResponse
from app.routers.auth import verify_token, pwd_context
from typing import List, Optional

router = APIRouter()

def require_admin(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token diperlukan")
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if payload.get("role") != "Admin":
        raise HTTPException(status_code=403, detail="Hanya Admin yang dapat mengakses fitur ini")
    return payload

@router.get("/", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(User).all()

@router.post("/", response_model=UserResponse)
def create_user(data: UserCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username sudah terdaftar")
    user = User(
        username=data.username,
        password=pwd_context.hash(data.password),
        role=data.role,
        status=StatusEnum.Aktif
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")
    if data.username:
        user.username = data.username
    if data.password:
        user.password = pwd_context.hash(data.password)
    if data.role:
        user.role = data.role
    if data.status:
        user.status = data.status
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")
    db.delete(user)
    db.commit()
    return {"message": "Pengguna berhasil dihapus"}
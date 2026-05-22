from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.sql import func
from app.config import Base
import enum

class RoleEnum(str, enum.Enum):
    Admin = "Admin"
    Operator = "Operator"
    Viewer = "Viewer"

class StatusEnum(str, enum.Enum):
    Aktif = "Aktif"
    Nonaktif = "Nonaktif"

class User(Base):
    __tablename__ = "pengguna"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    status = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.Aktif)
    created_at = Column(DateTime, server_default=func.now())
    last_login = Column(DateTime, nullable=True)
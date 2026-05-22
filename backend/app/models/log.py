from sqlalchemy import Column, Integer, String, Enum, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.config import Base
import enum

class StatusLogEnum(str, enum.Enum):
    Berhasil = "Berhasil"
    Gagal = "Gagal"
    Sebagian = "Sebagian"

class LogSinkronisasi(Base):
    __tablename__ = "log_sinkronisasi"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    waktu_sinkronisasi = Column(DateTime, server_default=func.now())
    status = Column(Enum(StatusLogEnum), nullable=False)
    pesan = Column(Text, nullable=True)
    jumlah_record = Column(Integer, nullable=True)
    operator_id = Column(Integer, ForeignKey("pengguna.user_id"), nullable=True)
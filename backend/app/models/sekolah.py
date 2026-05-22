from sqlalchemy import Column, String, Enum, Text, Integer, DECIMAL, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config import Base
import enum

class JenjangEnum(str, enum.Enum):
    PAUD = "PAUD"
    SD = "SD"
    SMP = "SMP"
    SMA = "SMA"
    SMK = "SMK"

class StatusSekolahEnum(str, enum.Enum):
    Negeri = "Negeri"
    Swasta = "Swasta"

class SatuanPendidikan(Base):
    __tablename__ = "satuan_pendidikan"

    npsn = Column(String(8), primary_key=True)
    nama_sekolah = Column(String(200), nullable=False)
    alamat_lengkap = Column(Text, nullable=True)
    jenjang_pendidikan = Column(Enum(JenjangEnum), nullable=False)
    status_sekolah = Column(Enum(StatusSekolahEnum), nullable=False)
    latitude = Column(DECIMAL(10, 7), nullable=True)
    longitude = Column(DECIMAL(10, 7), nullable=True)
    akreditasi = Column(String(5), nullable=True)
    wilayah_id = Column(Integer, ForeignKey("wilayah.wilayah_id"), nullable=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    wilayah = relationship("Wilayah")
    statistik = relationship("StatistikPendidikan", back_populates="sekolah")
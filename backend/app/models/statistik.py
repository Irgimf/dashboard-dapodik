from sqlalchemy import Column, Integer, String, Enum, DECIMAL, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config import Base
import enum

class SemesterEnum(str, enum.Enum):
    Ganjil = "Ganjil"
    Genap = "Genap"

class StatistikPendidikan(Base):
    __tablename__ = "statistik_pendidikan"

    stat_id = Column(Integer, primary_key=True, autoincrement=True)
    npsn = Column(String(8), ForeignKey("satuan_pendidikan.npsn"), nullable=False)
    tahun_ajaran = Column(String(9), nullable=False)
    semester = Column(Enum(SemesterEnum), nullable=False)
    jumlah_siswa = Column(Integer, nullable=False, default=0)
    jumlah_guru = Column(Integer, nullable=False, default=0)
    jumlah_rombel = Column(Integer, nullable=False, default=0)
    rasio_siswa_guru = Column(DECIMAL(5, 2), nullable=True)
    rasio_siswa_rombel = Column(DECIMAL(5, 2), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    sekolah = relationship("SatuanPendidikan", back_populates="statistik")
from sqlalchemy import Column, Integer, String, Enum
from app.config import Base
import enum

class TingkatEnum(str, enum.Enum):
    Kecamatan = "Kecamatan"
    Kelurahan = "Kelurahan"

class Wilayah(Base):
    __tablename__ = "wilayah"

    wilayah_id = Column(Integer, primary_key=True, autoincrement=True)
    nama_wilayah = Column(String(100), nullable=False)
    tingkat = Column(Enum(TingkatEnum), nullable=False)
    kota = Column(String(50), nullable=False, default="Kota Bandung")
    provinsi = Column(String(50), nullable=False, default="Jawa Barat")
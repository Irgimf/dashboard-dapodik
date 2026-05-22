from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class JenjangEnum(str, Enum):
    PAUD = "PAUD"
    SD = "SD"
    SMP = "SMP"
    SMA = "SMA"
    SMK = "SMK"

class StatusSekolahEnum(str, Enum):
    Negeri = "Negeri"
    Swasta = "Swasta"

class SekolahResponse(BaseModel):
    npsn: str
    nama_sekolah: str
    alamat_lengkap: Optional[str]
    jenjang_pendidikan: str
    status_sekolah: str
    latitude: Optional[float]
    longitude: Optional[float]
    akreditasi: Optional[str]

    class Config:
        from_attributes = True

class KPIResponse(BaseModel):
    total_sekolah: int
    total_siswa: int
    total_guru: int
    rasio_siswa_guru: float
    tahun_ajaran: Optional[str]
    semester: Optional[str]

class FilterParams(BaseModel):
    tahun_ajaran: Optional[str] = None
    semester: Optional[str] = None
    jenjang: Optional[str] = None
    status_sekolah: Optional[str] = None
    wilayah_id: Optional[int] = None
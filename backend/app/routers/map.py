from fastapi import APIRouter, Depends, Query, Header, HTTPException
from sqlalchemy.orm import Session
from app.config import get_db
from app.models.sekolah import SatuanPendidikan
from app.models.statistik import StatistikPendidikan
from app.routers.auth import verify_token
from typing import Optional

router = APIRouter()

def require_auth(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token diperlukan")
    token = authorization.split(" ")[1]
    return verify_token(token)

@router.get("/coordinates")
def get_coordinates(
    jenjang: Optional[str] = Query(None),
    status_sekolah: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(require_auth)
):
    query = db.query(SatuanPendidikan).filter(
        SatuanPendidikan.latitude.isnot(None),
        SatuanPendidikan.longitude.isnot(None)
    )
    if jenjang:
        query = query.filter(SatuanPendidikan.jenjang_pendidikan == jenjang)
    if status_sekolah:
        query = query.filter(SatuanPendidikan.status_sekolah == status_sekolah)

    sekolah_list = query.all()
    features = []
    for s in sekolah_list:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [float(s.longitude), float(s.latitude)]
            },
            "properties": {
                "npsn": s.npsn,
                "nama_sekolah": s.nama_sekolah,
                "jenjang": s.jenjang_pendidikan,
                "status": s.status_sekolah,
                "alamat": s.alamat_lengkap
            }
        })
    return {"type": "FeatureCollection", "features": features}

@router.get("/detail/{npsn}")
def get_school_detail(npsn: str, db: Session = Depends(get_db), _=Depends(require_auth)):
    sekolah = db.query(SatuanPendidikan).filter(SatuanPendidikan.npsn == npsn).first()
    if not sekolah:
        raise HTTPException(status_code=404, detail="Sekolah tidak ditemukan")
    stat = db.query(StatistikPendidikan).filter(
        StatistikPendidikan.npsn == npsn
    ).order_by(StatistikPendidikan.tahun_ajaran.desc()).first()

    return {
        "npsn": sekolah.npsn,
        "nama_sekolah": sekolah.nama_sekolah,
        "alamat_lengkap": sekolah.alamat_lengkap,
        "jenjang_pendidikan": sekolah.jenjang_pendidikan,
        "status_sekolah": sekolah.status_sekolah,
        "akreditasi": sekolah.akreditasi,
        "latitude": float(sekolah.latitude) if sekolah.latitude else None,
        "longitude": float(sekolah.longitude) if sekolah.longitude else None,
        "statistik": {
            "tahun_ajaran": stat.tahun_ajaran if stat else None,
            "semester": stat.semester if stat else None,
            "jumlah_siswa": stat.jumlah_siswa if stat else 0,
            "jumlah_guru": stat.jumlah_guru if stat else 0,
            "jumlah_rombel": stat.jumlah_rombel if stat else 0,
        } if stat else None
    }

@router.get("/search")
def search_school(
    keyword: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    _=Depends(require_auth)
):
    hasil = db.query(SatuanPendidikan).filter(
        SatuanPendidikan.nama_sekolah.ilike(f"%{keyword}%")
    ).limit(10).all()
    return [
        {
            "npsn": s.npsn,
            "nama_sekolah": s.nama_sekolah,
            "jenjang": s.jenjang_pendidikan,
            "latitude": float(s.latitude) if s.latitude else None,
            "longitude": float(s.longitude) if s.longitude else None
        }
        for s in hasil
    ]
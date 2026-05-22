from fastapi import APIRouter, Depends, Query, Header, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
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

@router.get("/kpi")
def get_kpi(
    tahun_ajaran: Optional[str] = Query(None),
    semester: Optional[str] = Query(None),
    jenjang: Optional[str] = Query(None),
    status_sekolah: Optional[str] = Query(None),
    wilayah_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(require_auth)
):
    query_sekolah = db.query(SatuanPendidikan)
    if jenjang:
        query_sekolah = query_sekolah.filter(SatuanPendidikan.jenjang_pendidikan == jenjang)
    if status_sekolah:
        query_sekolah = query_sekolah.filter(SatuanPendidikan.status_sekolah == status_sekolah)
    if wilayah_id:
        query_sekolah = query_sekolah.filter(SatuanPendidikan.wilayah_id == wilayah_id)

    total_sekolah = query_sekolah.count()
    npsn_list = [s.npsn for s in query_sekolah.all()]

    query_stat = db.query(StatistikPendidikan).filter(StatistikPendidikan.npsn.in_(npsn_list))
    if tahun_ajaran:
        query_stat = query_stat.filter(StatistikPendidikan.tahun_ajaran == tahun_ajaran)
    if semester:
        query_stat = query_stat.filter(StatistikPendidikan.semester == semester)

    total_siswa = db.query(func.sum(StatistikPendidikan.jumlah_siswa)).filter(
        StatistikPendidikan.npsn.in_(npsn_list)
    ).scalar() or 0
    total_guru = db.query(func.sum(StatistikPendidikan.jumlah_guru)).filter(
        StatistikPendidikan.npsn.in_(npsn_list)
    ).scalar() or 0

    rasio = round(total_siswa / total_guru, 2) if total_guru > 0 else 0

    return {
        "total_sekolah": total_sekolah,
        "total_siswa": int(total_siswa),
        "total_guru": int(total_guru),
        "rasio_siswa_guru": rasio,
        "tahun_ajaran": tahun_ajaran,
        "semester": semester
    }

@router.get("/grafik/jenjang")
def get_grafik_jenjang(db: Session = Depends(get_db), _=Depends(require_auth)):
    hasil = db.query(
        SatuanPendidikan.jenjang_pendidikan,
        func.count(SatuanPendidikan.npsn)
    ).group_by(SatuanPendidikan.jenjang_pendidikan).all()
    return [{"jenjang": h[0], "jumlah": h[1]} for h in hasil]

@router.get("/grafik/status")
def get_grafik_status(db: Session = Depends(get_db), _=Depends(require_auth)):
    hasil = db.query(
        SatuanPendidikan.status_sekolah,
        func.count(SatuanPendidikan.npsn)
    ).group_by(SatuanPendidikan.status_sekolah).all()
    return [{"status": h[0], "jumlah": h[1]} for h in hasil]

@router.get("/grafik/tren")
def get_grafik_tren(db: Session = Depends(get_db), _=Depends(require_auth)):
    hasil = db.query(
        StatistikPendidikan.tahun_ajaran,
        func.sum(StatistikPendidikan.jumlah_siswa),
        func.sum(StatistikPendidikan.jumlah_guru)
    ).group_by(StatistikPendidikan.tahun_ajaran).order_by(StatistikPendidikan.tahun_ajaran).all()
    return [{"tahun_ajaran": h[0], "total_siswa": int(h[1] or 0), "total_guru": int(h[2] or 0)} for h in hasil]
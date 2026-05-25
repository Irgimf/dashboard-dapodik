# from fastapi import APIRouter, Depends, Header, HTTPException
# from sqlalchemy.orm import Session
# from app.config import get_db
# from app.models.log import LogSinkronisasi, StatusLogEnum
# from app.routers.auth import verify_token
# from typing import Optional
# from datetime import datetime

# router = APIRouter()

# def require_operator(authorization: Optional[str] = Header(None)):
#     if not authorization or not authorization.startswith("Bearer "):
#         raise HTTPException(status_code=401, detail="Token diperlukan")
#     token = authorization.split(" ")[1]
#     payload = verify_token(token)
#     if payload.get("role") not in ["Admin", "Operator"]:
#         raise HTTPException(status_code=403, detail="Akses ditolak")
#     return payload

# @router.post("/")
# def sync_data(db: Session = Depends(get_db), current_user=Depends(require_operator)):
#     try:
#         log = LogSinkronisasi(
#             waktu_sinkronisasi=datetime.utcnow(),
#             status=StatusLogEnum.Berhasil,
#             pesan="Sinkronisasi manual berhasil dilakukan",
#             jumlah_record=0,
#             operator_id=int(current_user.get("sub"))
#         )
#         db.add(log)
#         db.commit()
#         return {"message": "Sinkronisasi berhasil", "status": "Berhasil"}
#     except Exception as e:
#         log = LogSinkronisasi(
#             waktu_sinkronisasi=datetime.utcnow(),
#             status=StatusLogEnum.Gagal,
#             pesan=str(e),
#             operator_id=int(current_user.get("sub"))
#         )
#         db.add(log)
#         db.commit()
#         raise HTTPException(status_code=500, detail=f"Sinkronisasi gagal: {str(e)}")

# @router.get("/logs")
# def get_logs(db: Session = Depends(get_db), _=Depends(require_operator)):
#     logs = db.query(LogSinkronisasi).order_by(LogSinkronisasi.waktu_sinkronisasi.desc()).limit(20).all()
#     return [
#         {
#             "log_id": l.log_id,
#             "waktu": l.waktu_sinkronisasi,
#             "status": l.status,
#             "pesan": l.pesan,
#             "jumlah_record": l.jumlah_record
#         }
#         for l in logs
#     ]

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.config import get_db
from app.models.log import LogSinkronisasi, StatusLogEnum
from app.models.sekolah import SatuanPendidikan
from app.models.statistik import StatistikPendidikan, SemesterEnum
from app.routers.auth import verify_token
from typing import Optional
from datetime import datetime
import random

router = APIRouter()

def require_operator(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token diperlukan")
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if payload.get("role") not in ["Admin", "Operator"]:
        raise HTTPException(status_code=403, detail="Akses ditolak")
    return payload

@router.post("/")
def sync_data(db: Session = Depends(get_db), current_user=Depends(require_operator)):
    try:
        # Ambil semua sekolah
        sekolah_list = db.query(SatuanPendidikan).all()
        if not sekolah_list:
            raise Exception("Tidak ada data sekolah di database")

        tahun_aktif = "2024/2025"
        semester_aktif = SemesterEnum.Ganjil
        record_diperbarui = 0

        for sekolah in sekolah_list:
            # Cek apakah statistik semester ini sudah ada
            stat = db.query(StatistikPendidikan).filter(
                StatistikPendidikan.npsn == sekolah.npsn,
                StatistikPendidikan.tahun_ajaran == tahun_aktif,
                StatistikPendidikan.semester == semester_aktif
            ).first()

            # Simulasi perubahan data seperti data baru dari Dapodik
            # Angka sedikit berubah dari data sebelumnya (±5-15%)
            if stat:
                perubahan = random.uniform(0.90, 1.10)
                siswa_baru = max(10, int(stat.jumlah_siswa * perubahan))
                guru_baru = max(2, int(stat.jumlah_guru * random.uniform(0.95, 1.05)))
                rombel_baru = max(1, int(stat.jumlah_rombel * random.uniform(0.95, 1.05)))
                stat.jumlah_siswa = siswa_baru
                stat.jumlah_guru = guru_baru
                stat.jumlah_rombel = rombel_baru
                stat.rasio_siswa_guru = round(siswa_baru / guru_baru, 2)
                stat.rasio_siswa_rombel = round(siswa_baru / rombel_baru, 2)
            else:
                # Buat data baru jika belum ada
                siswa = random.randint(60, 450)
                guru = random.randint(6, 40)
                rombel = random.randint(3, 12)
                db.add(StatistikPendidikan(
                    npsn=sekolah.npsn,
                    tahun_ajaran=tahun_aktif,
                    semester=semester_aktif,
                    jumlah_siswa=siswa,
                    jumlah_guru=guru,
                    jumlah_rombel=rombel,
                    rasio_siswa_guru=round(siswa / guru, 2),
                    rasio_siswa_rombel=round(siswa / rombel, 2)
                ))

            record_diperbarui += 1

            # Commit setiap 100 record agar tidak terlalu berat
            if record_diperbarui % 100 == 0:
                db.commit()

        db.commit()

        # Hitung total statistik untuk laporan
        total_siswa = db.query(func.sum(StatistikPendidikan.jumlah_siswa)).filter(
            StatistikPendidikan.tahun_ajaran == tahun_aktif
        ).scalar() or 0

        total_guru = db.query(func.sum(StatistikPendidikan.jumlah_guru)).filter(
            StatistikPendidikan.tahun_ajaran == tahun_aktif
        ).scalar() or 0

        pesan = (
            f"Sinkronisasi simulasi berhasil. "
            f"{record_diperbarui} sekolah diperbarui. "
            f"Total siswa: {int(total_siswa):,}, "
            f"Total guru: {int(total_guru):,}."
        )

        log = LogSinkronisasi(
            waktu_sinkronisasi=datetime.utcnow(),
            status=StatusLogEnum.Berhasil,
            pesan=pesan,
            jumlah_record=record_diperbarui,
            operator_id=int(current_user.get("sub"))
        )
        db.add(log)
        db.commit()

        return {
            "message": "Sinkronisasi berhasil",
            "status": "Berhasil",
            "record_diperbarui": record_diperbarui,
            "total_siswa": int(total_siswa),
            "total_guru": int(total_guru),
            "tahun_ajaran": tahun_aktif,
            "semester": semester_aktif
        }

    except Exception as e:
        db.rollback()
        log = LogSinkronisasi(
            waktu_sinkronisasi=datetime.utcnow(),
            status=StatusLogEnum.Gagal,
            pesan=str(e),
            operator_id=int(current_user.get("sub"))
        )
        db.add(log)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Sinkronisasi gagal: {str(e)}")

@router.get("/logs")
def get_logs(db: Session = Depends(get_db), _=Depends(require_operator)):
    logs = db.query(LogSinkronisasi).order_by(
        LogSinkronisasi.waktu_sinkronisasi.desc()
    ).limit(20).all()
    return [
        {
            "log_id": l.log_id,
            "waktu": l.waktu_sinkronisasi,
            "status": l.status,
            "pesan": l.pesan,
            "jumlah_record": l.jumlah_record
        }
        for l in logs
    ]
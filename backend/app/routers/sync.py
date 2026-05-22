from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.config import get_db
from app.models.log import LogSinkronisasi, StatusLogEnum
from app.routers.auth import verify_token
from typing import Optional
from datetime import datetime

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
        log = LogSinkronisasi(
            waktu_sinkronisasi=datetime.utcnow(),
            status=StatusLogEnum.Berhasil,
            pesan="Sinkronisasi manual berhasil dilakukan",
            jumlah_record=0,
            operator_id=int(current_user.get("sub"))
        )
        db.add(log)
        db.commit()
        return {"message": "Sinkronisasi berhasil", "status": "Berhasil"}
    except Exception as e:
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
    logs = db.query(LogSinkronisasi).order_by(LogSinkronisasi.waktu_sinkronisasi.desc()).limit(20).all()
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
from app.config import SessionLocal
from app.models.user import User, RoleEnum, StatusEnum
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed():
    db = SessionLocal()
    existing = db.query(User).filter(User.username == "admin").first()
    if not existing:
        admin = User(
            username="admin",
            password=pwd_context.hash("admin123"),
            role=RoleEnum.Admin,
            status=StatusEnum.Aktif
        )
        db.add(admin)
        db.commit()
        print("Admin berhasil dibuat: username=admin, password=admin123")
    else:
        print("Admin sudah ada")
    db.close()

if __name__ == "__main__":
    seed()
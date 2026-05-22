from app.config import SessionLocal
from app.models.wilayah import Wilayah, TingkatEnum
from app.models.sekolah import SatuanPendidikan, JenjangEnum, StatusSekolahEnum
from app.models.statistik import StatistikPendidikan, SemesterEnum
from datetime import datetime

def seed_wilayah(db):
    wilayah_data = [
        {"nama_wilayah": "Coblong", "tingkat": TingkatEnum.Kecamatan},
        {"nama_wilayah": "Bandung Wetan", "tingkat": TingkatEnum.Kecamatan},
        {"nama_wilayah": "Sukasari", "tingkat": TingkatEnum.Kecamatan},
        {"nama_wilayah": "Cidadap", "tingkat": TingkatEnum.Kecamatan},
        {"nama_wilayah": "Cicendo", "tingkat": TingkatEnum.Kecamatan},
        {"nama_wilayah": "Andir", "tingkat": TingkatEnum.Kecamatan},
        {"nama_wilayah": "Bojongloa Kaler", "tingkat": TingkatEnum.Kecamatan},
        {"nama_wilayah": "Astanaanyar", "tingkat": TingkatEnum.Kecamatan},
        {"nama_wilayah": "Regol", "tingkat": TingkatEnum.Kecamatan},
        {"nama_wilayah": "Lengkong", "tingkat": TingkatEnum.Kecamatan},
    ]
    wilayah_list = []
    for w in wilayah_data:
        existing = db.query(Wilayah).filter(Wilayah.nama_wilayah == w["nama_wilayah"]).first()
        if not existing:
            obj = Wilayah(
                nama_wilayah=w["nama_wilayah"],
                tingkat=w["tingkat"],
                kota="Kota Bandung",
                provinsi="Jawa Barat"
            )
            db.add(obj)
            db.flush()
            wilayah_list.append(obj)
        else:
            wilayah_list.append(existing)
    db.commit()
    print(f"✓ {len(wilayah_list)} wilayah berhasil di-seed")
    return wilayah_list

def seed_sekolah(db, wilayah_list):
    sekolah_data = [
        # Coblong (wilayah_id index 0)
        {"npsn": "20217001", "nama": "SDN Coblong 1", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.8942, "lng": 107.6105, "alamat": "Jl. Coblong No.1, Bandung", "wilayah_idx": 0},
        {"npsn": "20217002", "nama": "SDN Coblong 2", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.8958, "lng": 107.6118, "alamat": "Jl. Coblong No.2, Bandung", "wilayah_idx": 0},
        {"npsn": "20217003", "nama": "SMPN 1 Coblong", "jenjang": JenjangEnum.SMP, "status": StatusSekolahEnum.Negeri, "lat": -6.8971, "lng": 107.6132, "alamat": "Jl. Coblong No.3, Bandung", "wilayah_idx": 0},
        {"npsn": "20217004", "nama": "SMAN 1 Coblong", "jenjang": JenjangEnum.SMA, "status": StatusSekolahEnum.Negeri, "lat": -6.8985, "lng": 107.6145, "alamat": "Jl. Coblong No.4, Bandung", "wilayah_idx": 0},
        {"npsn": "20217005", "nama": "PAUD Bintang Coblong", "jenjang": JenjangEnum.PAUD, "status": StatusSekolahEnum.Swasta, "lat": -6.8930, "lng": 107.6092, "alamat": "Jl. Coblong No.5, Bandung", "wilayah_idx": 0},
        # Bandung Wetan (index 1)
        {"npsn": "20217011", "nama": "SDN Bandung Wetan 1", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.9021, "lng": 107.6187, "alamat": "Jl. Wastukancana No.1, Bandung", "wilayah_idx": 1},
        {"npsn": "20217012", "nama": "SMPN 2 Bandung Wetan", "jenjang": JenjangEnum.SMP, "status": StatusSekolahEnum.Negeri, "lat": -6.9035, "lng": 107.6201, "alamat": "Jl. Wastukancana No.2, Bandung", "wilayah_idx": 1},
        {"npsn": "20217013", "nama": "SMA Swasta Harapan", "jenjang": JenjangEnum.SMA, "status": StatusSekolahEnum.Swasta, "lat": -6.9048, "lng": 107.6215, "alamat": "Jl. Wastukancana No.3, Bandung", "wilayah_idx": 1},
        {"npsn": "20217014", "nama": "SMK Teknik Bandung", "jenjang": JenjangEnum.SMK, "status": StatusSekolahEnum.Swasta, "lat": -6.9062, "lng": 107.6228, "alamat": "Jl. Wastukancana No.4, Bandung", "wilayah_idx": 1},
        {"npsn": "20217015", "nama": "PAUD Ceria Wetan", "jenjang": JenjangEnum.PAUD, "status": StatusSekolahEnum.Swasta, "lat": -6.9010, "lng": 107.6175, "alamat": "Jl. Wastukancana No.5, Bandung", "wilayah_idx": 1},
        # Sukasari (index 2)
        {"npsn": "20217021", "nama": "SDN Sukasari 1", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.8875, "lng": 107.5998, "alamat": "Jl. Sukasari No.1, Bandung", "wilayah_idx": 2},
        {"npsn": "20217022", "nama": "SDN Sukasari 2", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.8888, "lng": 107.6011, "alamat": "Jl. Sukasari No.2, Bandung", "wilayah_idx": 2},
        {"npsn": "20217023", "nama": "SMPN 3 Sukasari", "jenjang": JenjangEnum.SMP, "status": StatusSekolahEnum.Negeri, "lat": -6.8902, "lng": 107.6025, "alamat": "Jl. Sukasari No.3, Bandung", "wilayah_idx": 2},
        {"npsn": "20217024", "nama": "SMK Sukasari Mandiri", "jenjang": JenjangEnum.SMK, "status": StatusSekolahEnum.Swasta, "lat": -6.8915, "lng": 107.6038, "alamat": "Jl. Sukasari No.4, Bandung", "wilayah_idx": 2},
        {"npsn": "20217025", "nama": "PAUD Tunas Bangsa", "jenjang": JenjangEnum.PAUD, "status": StatusSekolahEnum.Swasta, "lat": -6.8862, "lng": 107.5985, "alamat": "Jl. Sukasari No.5, Bandung", "wilayah_idx": 2},
        # Cidadap (index 3)
        {"npsn": "20217031", "nama": "SDN Cidadap 1", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.8821, "lng": 107.5932, "alamat": "Jl. Cidadap No.1, Bandung", "wilayah_idx": 3},
        {"npsn": "20217032", "nama": "SMPN 4 Cidadap", "jenjang": JenjangEnum.SMP, "status": StatusSekolahEnum.Negeri, "lat": -6.8835, "lng": 107.5945, "alamat": "Jl. Cidadap No.2, Bandung", "wilayah_idx": 3},
        {"npsn": "20217033", "nama": "SMAN 2 Cidadap", "jenjang": JenjangEnum.SMA, "status": StatusSekolahEnum.Negeri, "lat": -6.8848, "lng": 107.5958, "alamat": "Jl. Cidadap No.3, Bandung", "wilayah_idx": 3},
        {"npsn": "20217034", "nama": "SD Swasta Budi Luhur", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Swasta, "lat": -6.8808, "lng": 107.5920, "alamat": "Jl. Cidadap No.4, Bandung", "wilayah_idx": 3},
        {"npsn": "20217035", "nama": "PAUD Ananda Cidadap", "jenjang": JenjangEnum.PAUD, "status": StatusSekolahEnum.Swasta, "lat": -6.8795, "lng": 107.5908, "alamat": "Jl. Cidadap No.5, Bandung", "wilayah_idx": 3},
        # Cicendo (index 4)
        {"npsn": "20217041", "nama": "SDN Cicendo 1", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.9118, "lng": 107.5995, "alamat": "Jl. Cicendo No.1, Bandung", "wilayah_idx": 4},
        {"npsn": "20217042", "nama": "SMPN 5 Cicendo", "jenjang": JenjangEnum.SMP, "status": StatusSekolahEnum.Negeri, "lat": -6.9132, "lng": 107.6008, "alamat": "Jl. Cicendo No.2, Bandung", "wilayah_idx": 4},
        {"npsn": "20217043", "nama": "SMK Industri Cicendo", "jenjang": JenjangEnum.SMK, "status": StatusSekolahEnum.Swasta, "lat": -6.9145, "lng": 107.6022, "alamat": "Jl. Cicendo No.3, Bandung", "wilayah_idx": 4},
        {"npsn": "20217044", "nama": "SMAN 3 Cicendo", "jenjang": JenjangEnum.SMA, "status": StatusSekolahEnum.Negeri, "lat": -6.9105, "lng": 107.5982, "alamat": "Jl. Cicendo No.4, Bandung", "wilayah_idx": 4},
        {"npsn": "20217045", "nama": "PAUD Matahari Cicendo", "jenjang": JenjangEnum.PAUD, "status": StatusSekolahEnum.Swasta, "lat": -6.9092, "lng": 107.5970, "alamat": "Jl. Cicendo No.5, Bandung", "wilayah_idx": 4},
        # Andir (index 5)
        {"npsn": "20217051", "nama": "SDN Andir 1", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.9175, "lng": 107.5912, "alamat": "Jl. Andir No.1, Bandung", "wilayah_idx": 5},
        {"npsn": "20217052", "nama": "SDN Andir 2", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.9188, "lng": 107.5925, "alamat": "Jl. Andir No.2, Bandung", "wilayah_idx": 5},
        {"npsn": "20217053", "nama": "SMPN 6 Andir", "jenjang": JenjangEnum.SMP, "status": StatusSekolahEnum.Negeri, "lat": -6.9202, "lng": 107.5938, "alamat": "Jl. Andir No.3, Bandung", "wilayah_idx": 5},
        {"npsn": "20217054", "nama": "SMK Bisnis Andir", "jenjang": JenjangEnum.SMK, "status": StatusSekolahEnum.Swasta, "lat": -6.9162, "lng": 107.5900, "alamat": "Jl. Andir No.4, Bandung", "wilayah_idx": 5},
        {"npsn": "20217055", "nama": "PAUD Bunga Andir", "jenjang": JenjangEnum.PAUD, "status": StatusSekolahEnum.Swasta, "lat": -6.9148, "lng": 107.5888, "alamat": "Jl. Andir No.5, Bandung", "wilayah_idx": 5},
        # Bojongloa Kaler (index 6)
        {"npsn": "20217061", "nama": "SDN Bojongloa 1", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.9235, "lng": 107.5855, "alamat": "Jl. Bojongloa No.1, Bandung", "wilayah_idx": 6},
        {"npsn": "20217062", "nama": "SMPN 7 Bojongloa", "jenjang": JenjangEnum.SMP, "status": StatusSekolahEnum.Negeri, "lat": -6.9248, "lng": 107.5868, "alamat": "Jl. Bojongloa No.2, Bandung", "wilayah_idx": 6},
        {"npsn": "20217063", "nama": "SMAN 4 Bojongloa", "jenjang": JenjangEnum.SMA, "status": StatusSekolahEnum.Negeri, "lat": -6.9262, "lng": 107.5882, "alamat": "Jl. Bojongloa No.3, Bandung", "wilayah_idx": 6},
        {"npsn": "20217064", "nama": "SD Swasta Melati", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Swasta, "lat": -6.9222, "lng": 107.5842, "alamat": "Jl. Bojongloa No.4, Bandung", "wilayah_idx": 6},
        {"npsn": "20217065", "nama": "PAUD Pelangi Bojongloa", "jenjang": JenjangEnum.PAUD, "status": StatusSekolahEnum.Swasta, "lat": -6.9208, "lng": 107.5828, "alamat": "Jl. Bojongloa No.5, Bandung", "wilayah_idx": 6},
        # Astanaanyar (index 7)
        {"npsn": "20217071", "nama": "SDN Astanaanyar 1", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.9288, "lng": 107.5985, "alamat": "Jl. Astanaanyar No.1, Bandung", "wilayah_idx": 7},
        {"npsn": "20217072", "nama": "SMPN 8 Astanaanyar", "jenjang": JenjangEnum.SMP, "status": StatusSekolahEnum.Negeri, "lat": -6.9302, "lng": 107.5998, "alamat": "Jl. Astanaanyar No.2, Bandung", "wilayah_idx": 7},
        {"npsn": "20217073", "nama": "SMK Astanaanyar Mandiri", "jenjang": JenjangEnum.SMK, "status": StatusSekolahEnum.Swasta, "lat": -6.9315, "lng": 107.6012, "alamat": "Jl. Astanaanyar No.3, Bandung", "wilayah_idx": 7},
        {"npsn": "20217074", "nama": "SMAN 5 Astanaanyar", "jenjang": JenjangEnum.SMA, "status": StatusSekolahEnum.Negeri, "lat": -6.9275, "lng": 107.5972, "alamat": "Jl. Astanaanyar No.4, Bandung", "wilayah_idx": 7},
        {"npsn": "20217075", "nama": "PAUD Kasih Ibu", "jenjang": JenjangEnum.PAUD, "status": StatusSekolahEnum.Swasta, "lat": -6.9262, "lng": 107.5958, "alamat": "Jl. Astanaanyar No.5, Bandung", "wilayah_idx": 7},
        # Regol (index 8)
        {"npsn": "20217081", "nama": "SDN Regol 1", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.9342, "lng": 107.6078, "alamat": "Jl. Regol No.1, Bandung", "wilayah_idx": 8},
        {"npsn": "20217082", "nama": "SMPN 9 Regol", "jenjang": JenjangEnum.SMP, "status": StatusSekolahEnum.Negeri, "lat": -6.9355, "lng": 107.6092, "alamat": "Jl. Regol No.2, Bandung", "wilayah_idx": 8},
        {"npsn": "20217083", "nama": "SMA Swasta Bina Bangsa", "jenjang": JenjangEnum.SMA, "status": StatusSekolahEnum.Swasta, "lat": -6.9368, "lng": 107.6105, "alamat": "Jl. Regol No.3, Bandung", "wilayah_idx": 8},
        {"npsn": "20217084", "nama": "SMK Regol Kreatif", "jenjang": JenjangEnum.SMK, "status": StatusSekolahEnum.Swasta, "lat": -6.9328, "lng": 107.6065, "alamat": "Jl. Regol No.4, Bandung", "wilayah_idx": 8},
        {"npsn": "20217085", "nama": "PAUD Bunda Regol", "jenjang": JenjangEnum.PAUD, "status": StatusSekolahEnum.Swasta, "lat": -6.9315, "lng": 107.6052, "alamat": "Jl. Regol No.5, Bandung", "wilayah_idx": 8},
        # Lengkong (index 9)
        {"npsn": "20217091", "nama": "SDN Lengkong 1", "jenjang": JenjangEnum.SD, "status": StatusSekolahEnum.Negeri, "lat": -6.9275, "lng": 107.6245, "alamat": "Jl. Lengkong No.1, Bandung", "wilayah_idx": 9},
        {"npsn": "20217092", "nama": "SMPN 10 Lengkong", "jenjang": JenjangEnum.SMP, "status": StatusSekolahEnum.Negeri, "lat": -6.9288, "lng": 107.6258, "alamat": "Jl. Lengkong No.2, Bandung", "wilayah_idx": 9},
        {"npsn": "20217093", "nama": "SMAN 6 Lengkong", "jenjang": JenjangEnum.SMA, "status": StatusSekolahEnum.Negeri, "lat": -6.9302, "lng": 107.6272, "alamat": "Jl. Lengkong No.3, Bandung", "wilayah_idx": 9},
        {"npsn": "20217094", "nama": "SMK Lengkong Jaya", "jenjang": JenjangEnum.SMK, "status": StatusSekolahEnum.Swasta, "lat": -6.9262, "lng": 107.6232, "alamat": "Jl. Lengkong No.4, Bandung", "wilayah_idx": 9},
        {"npsn": "20217095", "nama": "PAUD Cendekia Lengkong", "jenjang": JenjangEnum.PAUD, "status": StatusSekolahEnum.Swasta, "lat": -6.9248, "lng": 107.6218, "alamat": "Jl. Lengkong No.5, Bandung", "wilayah_idx": 9},
    ]

    count = 0
    for s in sekolah_data:
        existing = db.query(SatuanPendidikan).filter(SatuanPendidikan.npsn == s["npsn"]).first()
        if not existing:
            obj = SatuanPendidikan(
                npsn=s["npsn"],
                nama_sekolah=s["nama"],
                jenjang_pendidikan=s["jenjang"],
                status_sekolah=s["status"],
                latitude=s["lat"],
                longitude=s["lng"],
                alamat_lengkap=s["alamat"],
                akreditasi="A" if s["status"] == StatusSekolahEnum.Negeri else "B",
                wilayah_id=wilayah_list[s["wilayah_idx"]].wilayah_id,
                updated_at=datetime.utcnow()
            )
            db.add(obj)
            count += 1
    db.commit()
    print(f"✓ {count} sekolah berhasil di-seed")
    return [s["npsn"] for s in sekolah_data]

def seed_statistik(db, npsn_list):
    tahun_data = [
        {"tahun": "2022/2023", "semester": SemesterEnum.Ganjil},
        {"tahun": "2022/2023", "semester": SemesterEnum.Genap},
        {"tahun": "2023/2024", "semester": SemesterEnum.Ganjil},
        {"tahun": "2023/2024", "semester": SemesterEnum.Genap},
        {"tahun": "2024/2025", "semester": SemesterEnum.Ganjil},
    ]

    import random
    count = 0
    for npsn in npsn_list:
        for t in tahun_data:
            existing = db.query(StatistikPendidikan).filter(
                StatistikPendidikan.npsn == npsn,
                StatistikPendidikan.tahun_ajaran == t["tahun"],
                StatistikPendidikan.semester == t["semester"]
            ).first()
            if not existing:
                siswa = random.randint(80, 450)
                guru = random.randint(8, 35)
                rombel = random.randint(3, 12)
                obj = StatistikPendidikan(
                    npsn=npsn,
                    tahun_ajaran=t["tahun"],
                    semester=t["semester"],
                    jumlah_siswa=siswa,
                    jumlah_guru=guru,
                    jumlah_rombel=rombel,
                    rasio_siswa_guru=round(siswa / guru, 2),
                    rasio_siswa_rombel=round(siswa / rombel, 2)
                )
                db.add(obj)
                count += 1
    db.commit()
    print(f"✓ {count} data statistik berhasil di-seed")

def seed_all():
    db = SessionLocal()
    try:
        print("\n🌱 Memulai seeding data...")
        print("─" * 40)
        wilayah_list = seed_wilayah(db)
        npsn_list = seed_sekolah(db, wilayah_list)
        seed_statistik(db, npsn_list)
        print("─" * 40)
        print("✅ Seeding selesai!")
        print(f"   • {len(wilayah_list)} wilayah")
        print(f"   • {len(npsn_list)} sekolah")
        print(f"   • {len(npsn_list) * 5} data statistik")
    except Exception as e:
        db.rollback()
        print(f"❌ Seeding gagal: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_all()
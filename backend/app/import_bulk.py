from app.config import SessionLocal
from app.models.wilayah import Wilayah, TingkatEnum
from app.models.sekolah import SatuanPendidikan, JenjangEnum, StatusSekolahEnum
from app.models.statistik import StatistikPendidikan, SemesterEnum
from datetime import datetime, timezone
import random

KECAMATAN_DATA = [
    {"nama": "Coblong",           "total": 119, "negeri": 22,  "swasta": 97,  "lat": -6.8942, "lng": 107.6105},
    {"nama": "Andir",             "total": 108, "negeri": 13,  "swasta": 95,  "lat": -6.9175, "lng": 107.5912},
    {"nama": "Cicendo",           "total": 107, "negeri": 24,  "swasta": 83,  "lat": -6.9118, "lng": 107.5995},
    {"nama": "Lengkong",          "total": 107, "negeri": 20,  "swasta": 87,  "lat": -6.9275, "lng": 107.6245},
    {"nama": "Cibeunying Kidul",  "total": 106, "negeri": 16,  "swasta": 90,  "lat": -6.9002, "lng": 107.6385},
    {"nama": "Bandung Kulon",     "total": 103, "negeri": 19,  "swasta": 84,  "lat": -6.9302, "lng": 107.5778},
    {"nama": "Arcamanik",         "total": 102, "negeri": 11,  "swasta": 91,  "lat": -6.9148, "lng": 107.6678},
    {"nama": "Ujungberung",       "total": 101, "negeri": 10,  "swasta": 91,  "lat": -6.9035, "lng": 107.6912},
    {"nama": "Sukasari",          "total": 96,  "negeri": 20,  "swasta": 76,  "lat": -6.8875, "lng": 107.5998},
    {"nama": "Cibiru",            "total": 96,  "negeri": 15,  "swasta": 81,  "lat": -6.9062, "lng": 107.7105},
    {"nama": "Regol",             "total": 94,  "negeri": 18,  "swasta": 76,  "lat": -6.9342, "lng": 107.6078},
    {"nama": "Buahbatu",          "total": 89,  "negeri": 17,  "swasta": 72,  "lat": -6.9478, "lng": 107.6452},
    {"nama": "Kiaracondong",      "total": 88,  "negeri": 18,  "swasta": 70,  "lat": -6.9215, "lng": 107.6478},
    {"nama": "Antapani",          "total": 81,  "negeri": 13,  "swasta": 68,  "lat": -6.9178, "lng": 107.6612},
    {"nama": "Babakan Ciparay",   "total": 80,  "negeri": 20,  "swasta": 60,  "lat": -6.9388, "lng": 107.5778},
    {"nama": "Batununggal",       "total": 80,  "negeri": 19,  "swasta": 61,  "lat": -6.9302, "lng": 107.6178},
    {"nama": "Sukajadi",          "total": 79,  "negeri": 15,  "swasta": 64,  "lat": -6.8975, "lng": 107.5958},
    {"nama": "Bojongloa Kaler",   "total": 74,  "negeri": 9,   "swasta": 65,  "lat": -6.9235, "lng": 107.5855},
    {"nama": "Rancasari",         "total": 73,  "negeri": 9,   "swasta": 64,  "lat": -6.9548, "lng": 107.6578},
    {"nama": "Mandalajati",       "total": 70,  "negeri": 12,  "swasta": 58,  "lat": -6.8948, "lng": 107.6712},
    {"nama": "Cibeunying Kaler",  "total": 68,  "negeri": 7,   "swasta": 61,  "lat": -6.8875, "lng": 107.6385},
    {"nama": "Bandung Wetan",     "total": 68,  "negeri": 8,   "swasta": 60,  "lat": -6.9021, "lng": 107.6187},
    {"nama": "Bojongloa Kidul",   "total": 62,  "negeri": 8,   "swasta": 54,  "lat": -6.9415, "lng": 107.5912},
    {"nama": "Sumur Bandung",     "total": 58,  "negeri": 11,  "swasta": 47,  "lat": -6.9175, "lng": 107.6085},
    {"nama": "Panyileukan",       "total": 56,  "negeri": 7,   "swasta": 49,  "lat": -6.9548, "lng": 107.7012},
    {"nama": "Gedebage",          "total": 56,  "negeri": 9,   "swasta": 47,  "lat": -6.9648, "lng": 107.6912},
    {"nama": "Astanaanyar",       "total": 56,  "negeri": 12,  "swasta": 44,  "lat": -6.9288, "lng": 107.5985},
    {"nama": "Cidadap",           "total": 54,  "negeri": 8,   "swasta": 46,  "lat": -6.8821, "lng": 107.5932},
    {"nama": "Bandung Kidul",     "total": 45,  "negeri": 8,   "swasta": 37,  "lat": -6.9448, "lng": 107.6178},
    {"nama": "Cinambo",           "total": 33,  "negeri": 4,   "swasta": 29,  "lat": -6.9248, "lng": 107.7112},
]

TAHUN_LIST = [
    ("2022/2023", SemesterEnum.Ganjil),
    ("2022/2023", SemesterEnum.Genap),
    ("2023/2024", SemesterEnum.Ganjil),
    ("2023/2024", SemesterEnum.Genap),
    ("2024/2025", SemesterEnum.Ganjil),
]

JENJANG_DISTRIBUSI = [
    (JenjangEnum.PAUD, 0.30),
    (JenjangEnum.SD,   0.28),
    (JenjangEnum.SMP,  0.18),
    (JenjangEnum.SMA,  0.12),
    (JenjangEnum.SMK,  0.12),
]

def import_bulk():
    db = SessionLocal()
    try:
        print("\n🌱 Import bulk data Kota Bandung...")
        print("─" * 50)

        # ── 1. Hapus data lama ──────────────────────────
        print("🗑  Membersihkan data lama...")
        db.query(StatistikPendidikan).delete()
        db.query(SatuanPendidikan).delete()
        db.query(Wilayah).delete()
        db.commit()
        print("✓ Data lama dihapus")

        # ── 2. Insert wilayah ───────────────────────────
        print("📍 Memasukkan data wilayah...")
        wilayah_objs = []
        for kec in KECAMATAN_DATA:
            w = Wilayah(
                nama_wilayah=kec["nama"],
                tingkat=TingkatEnum.Kecamatan,
                kota="Kota Bandung",
                provinsi="Jawa Barat"
            )
            db.add(w)
            wilayah_objs.append((w, kec))
        db.commit()
        # Refresh agar dapat wilayah_id
        for w, _ in wilayah_objs:
            db.refresh(w)
        print(f"✓ {len(wilayah_objs)} wilayah dimasukkan")

        # ── 3. Siapkan semua data sekolah sekaligus ─────
        print("🏫 Menyiapkan data sekolah...")
        sekolah_bulk = []
        npsn_counter = 30000000

        for wilayah_obj, kec in wilayah_objs:
            total = kec["total"]
            negeri = kec["negeri"]
            lat_c = kec["lat"]
            lng_c = kec["lng"]

            for jenjang, rasio in JENJANG_DISTRIBUSI:
                jumlah = max(1, int(total * rasio))
                jml_negeri = max(0, int(jumlah * (negeri / total)))

                for i in range(jumlah):
                    npsn_counter += 1
                    status = (StatusSekolahEnum.Negeri
                              if i < jml_negeri
                              else StatusSekolahEnum.Swasta)
                    lat = round(lat_c + random.uniform(-0.015, 0.015), 7)
                    lng = round(lng_c + random.uniform(-0.015, 0.015), 7)
                    nama = (f"{jenjang.value} "
                            f"{'Negeri' if status == StatusSekolahEnum.Negeri else 'Swasta'} "
                            f"{kec['nama']} {i+1}")
                    sekolah_bulk.append({
                        "npsn": str(npsn_counter).zfill(8),
                        "nama_sekolah": nama,
                        "jenjang_pendidikan": jenjang,
                        "status_sekolah": status,
                        "latitude": lat,
                        "longitude": lng,
                        "alamat_lengkap": f"Kec. {kec['nama']}, Kota Bandung",
                        "akreditasi": random.choice(["A", "A", "B", "B", "C"]),
                        "wilayah_id": wilayah_obj.wilayah_id,
                        "updated_at": datetime.now(timezone.utc),
                    })

        # ── 4. Bulk insert sekolah (500 per batch) ──────
        print(f"💾 Menyimpan {len(sekolah_bulk)} sekolah ke database...")
        BATCH = 500
        for i in range(0, len(sekolah_bulk), BATCH):
            batch = sekolah_bulk[i:i+BATCH]
            db.bulk_insert_mappings(SatuanPendidikan, batch)
            db.commit()
            print(f"   {min(i+BATCH, len(sekolah_bulk))}/{len(sekolah_bulk)} sekolah...")
        print(f"✓ {len(sekolah_bulk)} sekolah berhasil disimpan")

        # ── 5. Siapkan semua statistik sekaligus ────────
        print("📊 Menyiapkan data statistik...")
        semua_npsn = [s["npsn"] for s in sekolah_bulk]
        statistik_bulk = []

        for npsn in semua_npsn:
            for tahun, semester in TAHUN_LIST:
                siswa  = random.randint(60, 450)
                guru   = random.randint(6, 40)
                rombel = random.randint(3, 12)
                statistik_bulk.append({
                    "npsn": npsn,
                    "tahun_ajaran": tahun,
                    "semester": semester,
                    "jumlah_siswa": siswa,
                    "jumlah_guru": guru,
                    "jumlah_rombel": rombel,
                    "rasio_siswa_guru": round(siswa / guru, 2),
                    "rasio_siswa_rombel": round(siswa / rombel, 2),
                    "created_at": datetime.now(timezone.utc),
                })

        # ── 6. Bulk insert statistik (1000 per batch) ───
        print(f"💾 Menyimpan {len(statistik_bulk)} data statistik...")
        BATCH_STAT = 1000
        for i in range(0, len(statistik_bulk), BATCH_STAT):
            batch = statistik_bulk[i:i+BATCH_STAT]
            db.bulk_insert_mappings(StatistikPendidikan, batch)
            db.commit()
            print(f"   {min(i+BATCH_STAT, len(statistik_bulk))}/{len(statistik_bulk)} statistik...")
        print(f"✓ {len(statistik_bulk)} statistik berhasil disimpan")

        print("─" * 50)
        print("✅ Import selesai!")
        print(f"   • {len(wilayah_objs)} kecamatan")
        print(f"   • {len(sekolah_bulk)} sekolah")
        print(f"   • {len(statistik_bulk)} data statistik")

    except Exception as e:
        db.rollback()
        print(f"❌ Import gagal: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    import_bulk()
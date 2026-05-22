# backend/app/import_excel_rekapitulasi.py
import zipfile, re
from app.config import SessionLocal
from app.models.wilayah import Wilayah, TingkatEnum
from app.models.statistik import StatistikPendidikan, SemesterEnum
from app.models.sekolah import SatuanPendidikan, JenjangEnum, StatusSekolahEnum
from datetime import datetime
import random

# Data hasil parsing Excel
KECAMATAN_DATA = [
    {"nama": "Coblong",           "total": 119, "negeri": 22,  "swasta": 97},
    {"nama": "Andir",             "total": 108, "negeri": 13,  "swasta": 95},
    {"nama": "Cicendo",           "total": 107, "negeri": 24,  "swasta": 83},
    {"nama": "Lengkong",          "total": 107, "negeri": 20,  "swasta": 87},
    {"nama": "Cibeunying Kidul",  "total": 106, "negeri": 16,  "swasta": 90},
    {"nama": "Bandung Kulon",     "total": 103, "negeri": 19,  "swasta": 84},
    {"nama": "Arcamanik",         "total": 102, "negeri": 11,  "swasta": 91},
    {"nama": "Ujungberung",       "total": 101, "negeri": 10,  "swasta": 91},
    {"nama": "Sukasari",          "total": 96,  "negeri": 20,  "swasta": 76},
    {"nama": "Cibiru",            "total": 96,  "negeri": 15,  "swasta": 81},
    {"nama": "Regol",             "total": 94,  "negeri": 18,  "swasta": 76},
    {"nama": "Buahbatu",          "total": 89,  "negeri": 17,  "swasta": 72},
    {"nama": "Kiaracondong",      "total": 88,  "negeri": 18,  "swasta": 70},
    {"nama": "Antapani",          "total": 81,  "negeri": 13,  "swasta": 68},
    {"nama": "Babakan Ciparay",   "total": 80,  "negeri": 20,  "swasta": 60},
    {"nama": "Batununggal",       "total": 80,  "negeri": 19,  "swasta": 61},
    {"nama": "Sukajadi",          "total": 79,  "negeri": 15,  "swasta": 64},
    {"nama": "Bojongloa Kaler",   "total": 74,  "negeri": 9,   "swasta": 65},
    {"nama": "Rancasari",         "total": 73,  "negeri": 9,   "swasta": 64},
    {"nama": "Mandalajati",       "total": 70,  "negeri": 12,  "swasta": 58},
    {"nama": "Cibeunying Kaler",  "total": 68,  "negeri": 7,   "swasta": 61},
    {"nama": "Bandung Wetan",     "total": 68,  "negeri": 8,   "swasta": 60},
    {"nama": "Bojongloa Kidul",   "total": 62,  "negeri": 8,   "swasta": 54},
    {"nama": "Sumur Bandung",     "total": 58,  "negeri": 11,  "swasta": 47},
    {"nama": "Panyileukan",       "total": 56,  "negeri": 7,   "swasta": 49},
    {"nama": "Gedebage",          "total": 56,  "negeri": 9,   "swasta": 47},
    {"nama": "Astanaanyar",       "total": 56,  "negeri": 12,  "swasta": 44},
    {"nama": "Cidadap",           "total": 54,  "negeri": 8,   "swasta": 46},
    {"nama": "Bandung Kidul",     "total": 45,  "negeri": 8,   "swasta": 37},
    {"nama": "Cinambo",           "total": 33,  "negeri": 4,   "swasta": 29},
]

# Koordinat tengah setiap kecamatan di Kota Bandung
KOORDINAT = {
    "Coblong":           (-6.8942, 107.6105),
    "Andir":             (-6.9175, 107.5912),
    "Cicendo":           (-6.9118, 107.5995),
    "Lengkong":          (-6.9275, 107.6245),
    "Cibeunying Kidul":  (-6.9002, 107.6385),
    "Bandung Kulon":     (-6.9302, 107.5778),
    "Arcamanik":         (-6.9148, 107.6678),
    "Ujungberung":       (-6.9035, 107.6912),
    "Sukasari":          (-6.8875, 107.5998),
    "Cibiru":            (-6.9062, 107.7105),
    "Regol":             (-6.9342, 107.6078),
    "Buahbatu":          (-6.9478, 107.6452),
    "Kiaracondong":      (-6.9215, 107.6478),
    "Antapani":          (-6.9178, 107.6612),
    "Babakan Ciparay":   (-6.9388, 107.5778),
    "Batununggal":       (-6.9302, 107.6178),
    "Sukajadi":          (-6.8975, 107.5958),
    "Bojongloa Kaler":   (-6.9235, 107.5855),
    "Rancasari":         (-6.9548, 107.6578),
    "Mandalajati":       (-6.8948, 107.6712),
    "Cibeunying Kaler":  (-6.8875, 107.6385),
    "Bandung Wetan":     (-6.9021, 107.6187),
    "Bojongloa Kidul":   (-6.9415, 107.5912),
    "Sumur Bandung":     (-6.9175, 107.6085),
    "Panyileukan":       (-6.9548, 107.7012),
    "Gedebage":          (-6.9648, 107.6912),
    "Astanaanyar":       (-6.9288, 107.5985),
    "Cidadap":           (-6.8821, 107.5932),
    "Bandung Kidul":     (-6.9448, 107.6178),
    "Cinambo":           (-6.9248, 107.7112),
}

JENJANG_LIST = [
    JenjangEnum.PAUD,
    JenjangEnum.SD,
    JenjangEnum.SMP,
    JenjangEnum.SMA,
    JenjangEnum.SMK,
]

def import_rekapitulasi():
    db = SessionLocal()
    try:
        print("\n🌱 Import data rekapitulasi Kota Bandung...")
        print("─" * 50)

        wilayah_objs = []
        for kec in KECAMATAN_DATA:
            existing = db.query(Wilayah).filter(
                Wilayah.nama_wilayah == kec["nama"]
            ).first()
            if not existing:
                w = Wilayah(
                    nama_wilayah=kec["nama"],
                    tingkat=TingkatEnum.Kecamatan,
                    kota="Kota Bandung",
                    provinsi="Jawa Barat"
                )
                db.add(w)
                db.flush()
                wilayah_objs.append((w, kec))
            else:
                wilayah_objs.append((existing, kec))
        db.commit()
        print(f"✓ {len(wilayah_objs)} kecamatan berhasil diproses")

        # Buat sekolah representatif per kecamatan berdasarkan data rekapitulasi
        sekolah_count = 0
        npsn_counter = 30000000

        for wilayah_obj, kec in wilayah_objs:
            lat_center, lng_center = KOORDINAT.get(kec["nama"], (-6.9175, 107.6191))
            total = kec["total"]
            negeri = kec["negeri"]
            swasta = kec["swasta"]

            # Bagi total ke jenjang secara proporsional
            distribusi = {
                JenjangEnum.PAUD: max(1, int(total * 0.30)),
                JenjangEnum.SD:   max(1, int(total * 0.28)),
                JenjangEnum.SMP:  max(1, int(total * 0.18)),
                JenjangEnum.SMA:  max(1, int(total * 0.12)),
                JenjangEnum.SMK:  max(1, int(total * 0.12)),
            }

            for jenjang, jumlah in distribusi.items():
                jml_negeri = max(0, int(jumlah * (negeri / total)))
                jml_swasta = jumlah - jml_negeri

                for i in range(jumlah):
                    npsn_counter += 1
                    npsn = str(npsn_counter).zfill(8)

                    status = (StatusSekolahEnum.Negeri
                              if i < jml_negeri
                              else StatusSekolahEnum.Swasta)

                    # Koordinat sedikit digeser agar tidak tumpuk
                    lat = lat_center + random.uniform(-0.015, 0.015)
                    lng = lng_center + random.uniform(-0.015, 0.015)

                    existing = db.query(SatuanPendidikan).filter(
                        SatuanPendidikan.npsn == npsn
                    ).first()

                    if not existing:
                        nama = f"{jenjang.value} {'Negeri' if status == StatusSekolahEnum.Negeri else 'Swasta'} {kec['nama']} {i+1}"
                        obj = SatuanPendidikan(
                            npsn=npsn,
                            nama_sekolah=nama,
                            jenjang_pendidikan=jenjang,
                            status_sekolah=status,
                            latitude=round(lat, 7),
                            longitude=round(lng, 7),
                            alamat_lengkap=f"Kec. {kec['nama']}, Kota Bandung",
                            akreditasi=random.choice(["A", "A", "B", "B", "C"]),
                            wilayah_id=wilayah_obj.wilayah_id,
                            updated_at=datetime.utcnow()
                        )
                        db.add(obj)
                        sekolah_count += 1

        db.commit()
        print(f"✓ {sekolah_count} sekolah berhasil dibuat berdasarkan data rekapitulasi")

        # Tambah statistik untuk setiap sekolah
        print("  Menambahkan data statistik...")
        semua_sekolah = db.query(SatuanPendidikan).all()
        stat_count = 0
        tahun_list = [
            ("2022/2023", SemesterEnum.Ganjil),
            ("2022/2023", SemesterEnum.Genap),
            ("2023/2024", SemesterEnum.Ganjil),
            ("2023/2024", SemesterEnum.Genap),
            ("2024/2025", SemesterEnum.Ganjil),
        ]
        for sekolah in semua_sekolah:
            for tahun, semester in tahun_list:
                existing_stat = db.query(StatistikPendidikan).filter(
                    StatistikPendidikan.npsn == sekolah.npsn,
                    StatistikPendidikan.tahun_ajaran == tahun,
                    StatistikPendidikan.semester == semester
                ).first()
                if not existing_stat:
                    siswa = random.randint(60, 450)
                    guru = random.randint(6, 40)
                    rombel = random.randint(3, 12)
                    db.add(StatistikPendidikan(
                        npsn=sekolah.npsn,
                        tahun_ajaran=tahun,
                        semester=semester,
                        jumlah_siswa=siswa,
                        jumlah_guru=guru,
                        jumlah_rombel=rombel,
                        rasio_siswa_guru=round(siswa/guru, 2),
                        rasio_siswa_rombel=round(siswa/rombel, 2)
                    ))
                    stat_count += 1

            if stat_count % 500 == 0 and stat_count > 0:
                db.commit()
                print(f"    {stat_count} statistik diproses...")

        db.commit()
        print(f"✓ {stat_count} data statistik berhasil ditambahkan")
        print("─" * 50)
        print("✅ Import selesai!")
        print(f"   • 30 kecamatan Kota Bandung")
        print(f"   • {sekolah_count} sekolah")
        print(f"   • {stat_count} data statistik")
        print(f"   • Total sekolah real Kota Bandung: 2.409")

    except Exception as e:
        db.rollback()
        print(f"❌ Import gagal: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    import_rekapitulasi()
import Button from "../components/Button";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  getCoordinates,
  getSchoolDetail,
  searchSchool,
} from "../services/mapService";

// Fix icon Leaflet di Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const markerColor = (jenjang) => {
  const colors = {
    PAUD: "#EC4899",
    SD: "#3B82F6",
    SMP: "#10B981",
    SMA: "#F59E0B",
    SMK: "#EF4444",
  };
  return colors[jenjang] || "#6B7280";
};

const createIcon = (jenjang) => {
  const color = markerColor(jenjang);
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};
      width:12px;
      height:12px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 1px 3px rgba(0,0,0,0.4)">
    </div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

function FlyToLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 16, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

export default function MapPage() {
  const [geoData, setGeoData] = useState({ features: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [flyTo, setFlyTo] = useState(null);
  const [filterJenjang, setFilterJenjang] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const searchTimeout = useRef(null);

  // Deteksi ukuran layar
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchCoordinates = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filterJenjang) params.jenjang = filterJenjang;
      if (filterStatus) params.status_sekolah = filterStatus;
      const data = await getCoordinates(params);
      setGeoData(data);
    } catch {
      setError("Gagal memuat data peta. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinates();
  }, []);

  const handleMarkerClick = async (npsn) => {
    setDetailLoading(true);
    setSelectedSchool(null);
    try {
      const detail = await getSchoolDetail(npsn);
      setSelectedSchool(detail);
      // Di mobile, scroll ke panel detail
      if (isMobile) {
        setTimeout(() => {
          document
            .getElementById("detail-panel")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } catch {
      setSelectedSchool(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchSchool(keyword);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      }
    }, 400);
  };

  const handleSelectResult = (result) => {
    if (result.latitude && result.longitude) {
      setFlyTo({ lat: result.latitude, lng: result.longitude });
    }
    setSearchKeyword(result.nama_sekolah);
    setSearchResults([]);
  };

  const legendItems = [
    { label: "PAUD", color: "#EC4899" },
    { label: "SD", color: "#3B82F6" },
    { label: "SMP", color: "#10B981" },
    { label: "SMA", color: "#F59E0B" },
    { label: "SMK", color: "#EF4444" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Peta Sebaran Sekolah
          </h1>
          <p className="text-sm text-gray-500">
            Kota Bandung — {geoData.features?.length ?? 0} sekolah ditampilkan
          </p>
        </div>
        <Button
          onClick={fetchCoordinates}
          variant="primary"
          loading={loading}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          }
        >
          Perbarui Peta
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-xl shadow p-3 md:p-4 flex flex-col sm:flex-row flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="flex flex-col gap-1 relative flex-1 min-w-0 w-full sm:w-auto">
          <label className="text-xs text-gray-500 font-medium">
            Cari Sekolah
          </label>
          <input
            type="text"
            placeholder="Ketik nama sekolah..."
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[500] max-h-48 overflow-y-auto">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectResult(r)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium">{r.nama_sekolah}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {r.jenjang}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Jenjang */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-xs text-gray-500 font-medium">Jenjang</label>
          <select
            value={filterJenjang}
            onChange={(e) => setFilterJenjang(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          >
            <option value="">Semua</option>
            <option value="PAUD">PAUD</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
            <option value="SMK">SMK</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-xs text-gray-500 font-medium">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          >
            <option value="">Semua</option>
            <option value="Negeri">Negeri</option>
            <option value="Swasta">Swasta</option>
          </select>
        </div>

        <Button
          onClick={fetchCoordinates}
          variant="success"
          size="sm"
          className="w-full sm:w-auto"
          icon={
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
          }
        >
          Terapkan Filter
        </Button>
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-xl shadow px-4 py-2.5 flex flex-wrap gap-3 text-xs text-gray-600">
        <span className="font-medium text-gray-700">Jenjang:</span>
        {legendItems.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span
              style={{ background: item.color }}
              className="inline-block w-3 h-3 rounded-full border border-white shadow"
            />
            {item.label}
          </span>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* ===== LAYOUT DESKTOP: Peta kiri, Detail kanan ===== */}
      {/* ===== LAYOUT MOBILE: Peta atas, Detail bawah ===== */}
      <div
        className={`flex gap-4 ${isMobile ? "flex-col" : "flex-row items-stretch"}`}
      >
        {/* Peta */}
        <div
          className={`rounded-xl overflow-hidden shadow border border-gray-200 ${isMobile ? "w-full" : "flex-1"}`}
          style={{
            height: isMobile ? "55vh" : "520px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400 text-sm">
              Memuat peta...
            </div>
          ) : (
            <MapContainer
              center={[-6.9175, 107.6191]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {flyTo && <FlyToLocation coords={flyTo} />}
              {geoData.features?.map((feature, idx) => {
                const [lng, lat] = feature.geometry.coordinates;
                const props = feature.properties;
                return (
                  <Marker
                    key={idx}
                    position={[lat, lng]}
                    icon={createIcon(props.jenjang)}
                    eventHandlers={{
                      click: () => handleMarkerClick(props.npsn),
                    }}
                  >
                    <Popup>
                      <div className="text-xs">
                        <p className="font-semibold">{props.nama_sekolah}</p>
                        <p className="text-gray-500">
                          {props.jenjang} — {props.status}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>

        {/* Panel Detail Sekolah */}
        <div
          id="detail-panel"
          className={`bg-white rounded-xl shadow border border-gray-200 p-4 flex flex-col gap-3 overflow-y-auto
            ${isMobile ? "w-full" : "w-72 shrink-0"}
          `}
          style={{ maxHeight: isMobile ? "none" : "520px" }}
        >
          <h2 className="text-sm font-semibold text-gray-700 border-b pb-2">
            Detail Sekolah
          </h2>

          {detailLoading && (
            <div className="flex items-center justify-center py-8 gap-2 text-blue-500">
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <span className="text-xs text-gray-400">Memuat detail...</span>
            </div>
          )}

          {!detailLoading && !selectedSchool && (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                📍
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Klik marker sekolah pada peta untuk melihat detail informasi
              </p>
              {isMobile && (
                <p className="text-xs text-blue-400">
                  ↑ Scroll ke atas untuk melihat peta
                </p>
              )}
            </div>
          )}

          {!detailLoading && selectedSchool && (
            <>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-gray-800 leading-snug">
                  {selectedSchool.nama_sekolah}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                    {selectedSchool.jenjang_pendidikan}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                    {selectedSchool.status_sekolah}
                  </span>
                  {selectedSchool.akreditasi && (
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                      Akreditasi {selectedSchool.akreditasi}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400 shrink-0">NPSN</span>
                  <span className="font-mono font-medium">
                    {selectedSchool.npsn}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400">Alamat</span>
                  <span className="font-medium leading-relaxed">
                    {selectedSchool.alamat_lengkap ?? "-"}
                  </span>
                </div>
              </div>

              {selectedSchool.statistik ? (
                <div className="border-t pt-3">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    📊 Statistik {selectedSchool.statistik.tahun_ajaran} —{" "}
                    {selectedSchool.statistik.semester}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        label: "Siswa",
                        value: selectedSchool.statistik.jumlah_siswa,
                        color: "bg-blue-50 text-blue-700 border-blue-100",
                      },
                      {
                        label: "Guru",
                        value: selectedSchool.statistik.jumlah_guru,
                        color: "bg-green-50 text-green-700 border-green-100",
                      },
                      {
                        label: "Rombel",
                        value: selectedSchool.statistik.jumlah_rombel,
                        color: "bg-yellow-50 text-yellow-700 border-yellow-100",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`${item.color} border rounded-xl p-2.5 text-center`}
                      >
                        <p className="text-lg font-bold">{item.value}</p>
                        <p className="text-xs mt-0.5">{item.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                      <p className="font-bold text-gray-700">
                        {selectedSchool.statistik.jumlah_siswa &&
                        selectedSchool.statistik.jumlah_guru
                          ? (
                              selectedSchool.statistik.jumlah_siswa /
                              selectedSchool.statistik.jumlah_guru
                            ).toFixed(1)
                          : "-"}
                      </p>
                      <p className="text-gray-400 mt-0.5">Rasio Siswa/Guru</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                      <p className="font-bold text-gray-700">
                        {selectedSchool.statistik.jumlah_siswa &&
                        selectedSchool.statistik.jumlah_rombel
                          ? (
                              selectedSchool.statistik.jumlah_siswa /
                              selectedSchool.statistik.jumlah_rombel
                            ).toFixed(1)
                          : "-"}
                      </p>
                      <p className="text-gray-400 mt-0.5">Rasio Siswa/Rombel</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-400 text-center border border-gray-100">
                  Data statistik belum tersedia
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

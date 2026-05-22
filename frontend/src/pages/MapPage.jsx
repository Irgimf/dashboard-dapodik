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

// Warna marker berdasarkan jenjang
const markerColor = (jenjang) => {
  const colors = {
    PAUD: "pink",
    SD: "blue",
    SMP: "green",
    SMA: "orange",
    SMK: "red",
  };
  return colors[jenjang] || "blue";
};

const createIcon = (jenjang) => {
  const color = markerColor(jenjang);
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color === "pink" ? "#EC4899" : color === "blue" ? "#3B82F6" : color === "green" ? "#10B981" : color === "orange" ? "#F59E0B" : "#EF4444"};
      width:12px; height:12px; border-radius:50%;
      border:2px solid white; box-shadow:0 1px 3px rgba(0,0,0,0.4)">
    </div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

// Komponen untuk fly to lokasi
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
  const searchTimeout = useRef(null);

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

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Peta Sebaran Sekolah
          </h1>
          <p className="text-sm text-gray-500">
            Kota Bandung — {geoData.features?.length ?? 0} sekolah ditampilkan
          </p>
        </div>
        <button
          onClick={fetchCoordinates}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          🔄 Perbarui Peta
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="flex flex-col gap-1 relative flex-1 min-w-48">
          <label className="text-xs text-gray-500 font-medium">
            Cari Sekolah
          </label>
          <input
            type="text"
            placeholder="Ketik nama sekolah..."
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
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
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Jenjang</label>
          <select
            value={filterJenjang}
            onChange={(e) => setFilterJenjang(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Semua</option>
            <option value="Negeri">Negeri</option>
            <option value="Swasta">Swasta</option>
          </select>
        </div>

        <button
          onClick={fetchCoordinates}
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          Terapkan Filter
        </button>
      </div>

      {/* Legenda Warna */}
      <div className="bg-white rounded-xl shadow px-4 py-3 flex flex-wrap gap-4 text-xs text-gray-600">
        <span className="font-medium text-gray-700">Legenda:</span>
        {[
          { label: "PAUD", color: "#EC4899" },
          { label: "SD", color: "#3B82F6" },
          { label: "SMP", color: "#10B981" },
          { label: "SMA", color: "#F59E0B" },
          { label: "SMK", color: "#EF4444" },
        ].map((item) => (
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

      {/* Konten Utama: Peta + Detail */}
      <div className="flex gap-4 flex-1">
        {/* Peta */}
        <div className="flex-1 rounded-xl overflow-hidden shadow border border-gray-200 min-h-96">
          {loading ? (
            <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400 text-sm">
              Memuat peta...
            </div>
          ) : (
            <MapContainer
              center={[-6.9175, 107.6191]}
              zoom={13}
              style={{ height: "100%", width: "100%", minHeight: "480px" }}
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
        <div className="w-72 bg-white rounded-xl shadow border border-gray-200 p-4 flex flex-col gap-3 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-700 border-b pb-2">
            Detail Sekolah
          </h2>

          {detailLoading && (
            <p className="text-xs text-gray-400 text-center py-4">
              Memuat detail...
            </p>
          )}

          {!detailLoading && !selectedSchool && (
            <p className="text-xs text-gray-400 text-center py-8">
              Klik marker sekolah pada peta untuk melihat detail informasi
            </p>
          )}

          {!detailLoading && selectedSchool && (
            <>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-gray-800">
                  {selectedSchool.nama_sekolah}
                </p>
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                    {selectedSchool.jenjang_pendidikan}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                    {selectedSchool.status_sekolah}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-400">NPSN</span>
                  <span className="font-medium">{selectedSchool.npsn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Akreditasi</span>
                  <span className="font-medium">
                    {selectedSchool.akreditasi ?? "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400">Alamat</span>
                  <span className="font-medium leading-relaxed">
                    {selectedSchool.alamat_lengkap ?? "-"}
                  </span>
                </div>
              </div>

              {selectedSchool.statistik && (
                <>
                  <div className="border-t pt-2">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Statistik {selectedSchool.statistik.tahun_ajaran} —{" "}
                      {selectedSchool.statistik.semester}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          label: "Siswa",
                          value: selectedSchool.statistik.jumlah_siswa,
                          color: "bg-blue-50 text-blue-700",
                        },
                        {
                          label: "Guru",
                          value: selectedSchool.statistik.jumlah_guru,
                          color: "bg-green-50 text-green-700",
                        },
                        {
                          label: "Rombel",
                          value: selectedSchool.statistik.jumlah_rombel,
                          color: "bg-yellow-50 text-yellow-700",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`${item.color} rounded-lg p-2 text-center`}
                        >
                          <p className="text-lg font-bold">{item.value}</p>
                          <p className="text-xs">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!selectedSchool.statistik && (
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-400 text-center">
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

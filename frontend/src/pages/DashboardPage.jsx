import Button from "../components/Button";
import { useState, useEffect } from "react";
import {
  getKPI,
  getGrafikJenjang,
  getGrafikStatus,
  getGrafikTren,
} from "../services/dashboardService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

function KPICard({ label, value, color }) {
  return (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">
        {value?.toLocaleString("id-ID") ?? "-"}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [kpi, setKpi] = useState(null);
  const [grafikJenjang, setGrafikJenjang] = useState([]);
  const [grafikStatus, setGrafikStatus] = useState([]);
  const [grafikTren, setGrafikTren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [filterTahun, setFilterTahun] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterJenjang, setFilterJenjang] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filterTahun) params.tahun_ajaran = filterTahun;
      if (filterSemester) params.semester = filterSemester;
      if (filterJenjang) params.jenjang = filterJenjang;
      if (filterStatus) params.status_sekolah = filterStatus;

      const [kpiData, jenjangData, statusData, trenData] = await Promise.all([
        getKPI(params),
        getGrafikJenjang(),
        getGrafikStatus(),
        getGrafikTren(),
      ]);
      setKpi(kpiData);
      setGrafikJenjang(jenjangData);
      setGrafikStatus(statusData);
      setGrafikTren(trenData);
    } catch (err) {
      setError("Gagal memuat data. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Pendidikan
          </h1>
          <p className="text-sm text-gray-500">Kota Bandung — Data Dapodik</p>
        </div>
        <Button
          onClick={fetchData}
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          }
        >
          Perbarui Data
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">
            Tahun Ajaran
          </label>
          <select
            value={filterTahun}
            onChange={(e) => setFilterTahun(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Semua</option>
            <option value="2022/2023">2022/2023</option>
            <option value="2023/2024">2023/2024</option>
            <option value="2024/2025">2024/2025</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Semester</label>
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Semua</option>
            <option value="Ganjil">Ganjil</option>
            <option value="Genap">Genap</option>
          </select>
        </div>
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
        <Button
          onClick={fetchData}
          variant="success"
          size="sm"
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

        <Button
          onClick={() => {
            setFilterTahun("");
            setFilterSemester("");
            setFilterJenjang("");
            setFilterStatus("");
          }}
          variant="ghost"
          size="sm"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          }
        >
          Reset
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          Memuat data...
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              label="Total Sekolah"
              value={kpi?.total_sekolah}
              color="border-blue-500"
            />
            <KPICard
              label="Total Siswa"
              value={kpi?.total_siswa}
              color="border-green-500"
            />
            <KPICard
              label="Total Guru"
              value={kpi?.total_guru}
              color="border-yellow-500"
            />
            <KPICard
              label="Rasio Siswa/Guru"
              value={kpi?.rasio_siswa_guru}
              color="border-purple-500"
            />
          </div>

          {/* Grafik Baris 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bar Chart - Jenjang */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Jumlah Sekolah per Jenjang
              </h2>
              {grafikJenjang.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">
                  Tidak ada data
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={grafikJenjang}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="jenjang" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="jumlah"
                      name="Jumlah Sekolah"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie Chart - Status */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Distribusi Status Sekolah
              </h2>
              {grafikStatus.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">
                  Tidak ada data
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={grafikStatus}
                      dataKey="jumlah"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ status, percent }) =>
                        `${status} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {grafikStatus.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Line Chart - Tren */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Tren Siswa dan Guru per Tahun Ajaran
            </h2>
            {grafikTren.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">
                Tidak ada data tren — silakan tambahkan data statistik terlebih
                dahulu
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={grafikTren}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tahun_ajaran" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total_siswa"
                    name="Total Siswa"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total_guru"
                    name="Total Guru"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}

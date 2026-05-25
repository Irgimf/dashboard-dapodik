import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../services/authService";
import ConfirmModal from "../components/ConfirmModal";
import Button from "../components/Button";

const API = "/api/sync";
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export default function SyncPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSyncModal, setShowSyncModal] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/logs`, { headers: headers() });
      setLogs(res.data);
    } catch {
      setError("Gagal memuat log sinkronisasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleSync = async () => {
    setSyncLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/`, {}, { headers: headers() });
      const d = res.data;
      showSuccess(
        `Sinkronisasi berhasil — ${d.record_diperbarui?.toLocaleString("id-ID")} sekolah diperbarui. ` +
          `Total siswa: ${d.total_siswa?.toLocaleString("id-ID")}, ` +
          `Total guru: ${d.total_guru?.toLocaleString("id-ID")}.`,
      );
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.detail || "Sinkronisasi gagal");
    } finally {
      setSyncLoading(false);
    }
  };

  // const handleSync = async () => {
  //   setSyncLoading(true);
  //   setError("");
  //   try {
  //     const res = await axios.post(`${API}/`, {}, { headers: headers() });
  //     showSuccess(res.data.message || "Sinkronisasi berhasil");
  //     fetchLogs();
  //   } catch (err) {
  //     setError(err.response?.data?.detail || "Sinkronisasi gagal");
  //   } finally {
  //     setSyncLoading(false);
  //   }
  // };

  const statusStyle = (status) => {
    const styles = {
      Berhasil: "bg-green-100 text-green-700",
      Gagal: "bg-red-100 text-red-700",
      Sebagian: "bg-yellow-100 text-yellow-700",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const statusIcon = (status) => {
    const icons = { Berhasil: "✓", Gagal: "✗", Sebagian: "⚠" };
    return icons[status] || "?";
  };

  const lastSync = logs[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Sinkronisasi Data
          </h1>
          <p className="text-sm text-gray-500">
            Kelola sinkronisasi data dari sumber Dapodik
          </p>
          <ConfirmModal
            isOpen={showSyncModal}
            onClose={() => setShowSyncModal(false)}
            onConfirm={handleSync}
            title="Mulai Sinkronisasi"
            message="Proses sinkronisasi akan mengambil dan memperbarui data dari sumber Dapodik. Proses ini mungkin membutuhkan beberapa menit."
            confirmText="Ya, Mulai"
            cancelText="Batal"
            type="info"
          />
        </div>
        <Button
          onClick={() => setShowSyncModal(true)}
          variant="info"
          loading={syncLoading}
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
          Mulai Sinkronisasi
        </Button>
      </div>

      {/* Notifikasi */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
          ✗ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg border border-green-200">
          ✓ {success}
        </div>
      )}

      {/* Status Sinkronisasi Terakhir */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
          <p className="text-xs text-gray-400 mb-1">Sinkronisasi Terakhir</p>
          <p className="text-sm font-semibold text-gray-800">
            {lastSync
              ? new Date(lastSync.waktu).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Belum pernah"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
          <p className="text-xs text-gray-400 mb-1">Status Terakhir</p>
          <p className="text-sm font-semibold text-gray-800">
            {lastSync ? (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${statusStyle(lastSync.status)}`}
              >
                {statusIcon(lastSync.status)} {lastSync.status}
              </span>
            ) : (
              "-"
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500">
          <p className="text-xs text-gray-400 mb-1">Total Log Tersimpan</p>
          <p className="text-2xl font-bold text-gray-800">{logs.length}</p>
        </div>
      </div>

      {/* Informasi Proses ETL */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-blue-800 mb-3">
          ℹ️ Tentang Proses Sinkronisasi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-blue-700">
          <div className="flex flex-col gap-1">
            <span className="font-semibold">① Extract</span>
            <span className="text-blue-600">
              Sistem mengambil data mentah dari sumber Dapodik melalui API
              secara periodik
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">② Transform</span>
            <span className="text-blue-600">
              Data dibersihkan, divalidasi, dan dikonversi sesuai skema database
              lokal
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">③ Load</span>
            <span className="text-blue-600">
              Data yang sudah bersih dimuat ke database lokal sistem secara
              insert atau update
            </span>
          </div>
        </div>
      </div>

      {/* Tabel Riwayat Sinkronisasi */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-700">
            Riwayat Sinkronisasi
          </h2>
          <button
            onClick={fetchLogs}
            className="text-xs text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Muat Ulang
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Memuat riwayat...
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              📋
            </div>
            <p className="text-sm text-gray-400">
              Belum ada riwayat sinkronisasi
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log, index) => (
              <div key={log.log_id} className="hover:bg-gray-50 transition">
                {/* ===== DESKTOP ===== */}
                <div className="hidden md:flex items-start gap-4 px-5 py-4">
                  {/* Nomor */}
                  <div className="shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium mt-0.5">
                    {index + 1}
                  </div>

                  {/* Status badge */}
                  <div className="shrink-0 pt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle(log.status)}`}
                    >
                      {statusIcon(log.status)} {log.status}
                    </span>
                  </div>

                  {/* Waktu */}
                  <div className="shrink-0 w-36">
                    <p className="text-xs font-medium text-gray-700">
                      {new Date(log.waktu).toLocaleDateString("id-ID", {
                        dateStyle: "medium",
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(log.waktu).toLocaleTimeString("id-ID", {
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  {/* Record */}
                  <div className="shrink-0 w-24">
                    <p className="text-xs text-gray-400">Record</p>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">
                      {log.jumlah_record?.toLocaleString("id-ID") ?? "-"}
                    </p>
                  </div>

                  {/* Pesan — wrap */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">Pesan</p>
                    <p className="text-xs text-gray-600 leading-relaxed break-words">
                      {log.pesan ?? "-"}
                    </p>
                  </div>
                </div>

                {/* ===== MOBILE — card layout ===== */}
                <div className="md:hidden px-4 py-4 flex flex-col gap-3">
                  {/* Baris atas: nomor + status + waktu */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium shrink-0">
                        {index + 1}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle(log.status)}`}
                      >
                        {statusIcon(log.status)} {log.status}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-gray-700">
                        {new Date(log.waktu).toLocaleDateString("id-ID", {
                          dateStyle: "short",
                        })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(log.waktu).toLocaleTimeString("id-ID", {
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Record */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <svg
                      className="w-3.5 h-3.5 text-gray-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-xs text-gray-500">
                      Record diperbarui:
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      {log.jumlah_record?.toLocaleString("id-ID") ?? "-"}
                    </span>
                  </div>

                  {/* Pesan */}
                  {log.pesan && (
                    <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                      <p className="text-xs text-gray-400 mb-1">Pesan</p>
                      <p className="text-xs text-gray-600 leading-relaxed break-words">
                        {log.pesan}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

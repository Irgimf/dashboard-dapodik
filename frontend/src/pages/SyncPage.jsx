import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../services/authService";
import ConfirmModal from "../components/ConfirmModal";

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
      showSuccess(res.data.message || "Sinkronisasi berhasil");
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.detail || "Sinkronisasi gagal");
    } finally {
      setSyncLoading(false);
    }
  };

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
        <button
          onClick={() => setShowSyncModal(true)}
          disabled={syncLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm px-5 py-2.5 rounded-lg transition flex items-center gap-2"
        >
          {syncLoading ? (
            <>
              <span className="animate-spin">⟳</span> Menyinkronkan...
            </>
          ) : (
            <>🔄 Mulai Sinkronisasi</>
          )}
        </button>
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

      {/* Tabel Log */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-700">
            Riwayat Sinkronisasi
          </h2>
          <button
            onClick={fetchLogs}
            className="text-xs text-blue-600 hover:text-blue-700 transition"
          >
            Muat Ulang
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                No
              </th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                Waktu
              </th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                Status
              </th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                Record
              </th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                Pesan
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  Memuat riwayat...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  Belum ada riwayat sinkronisasi
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr
                  key={log.log_id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-5 py-3 text-gray-700">
                    {new Date(log.waktu).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle(log.status)}`}
                    >
                      {statusIcon(log.status)} {log.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {log.jumlah_record ?? "-"}
                  </td>
                  <td className="px-5 py-3 text-gray-500 max-w-xs truncate">
                    {log.pesan ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

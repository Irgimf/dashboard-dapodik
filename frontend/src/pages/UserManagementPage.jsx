import Button from "../components/Button";
import { useState, useEffect } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

const ROLES = ["Admin", "Operator", "Viewer"];

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function UserForm({ initial, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    username: initial?.username ?? "",
    password: "",
    role: initial?.role ?? "Viewer",
    status: initial?.status ?? "Aktif",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username) {
      setError("Username wajib diisi");
      return;
    }
    if (!initial && !form.password) {
      setError("Password wajib diisi");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Masukkan username"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Password{" "}
          {initial && (
            <span className="text-gray-400 font-normal">
              (kosongkan jika tidak diubah)
            </span>
          )}
        </label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={
            initial ? "Kosongkan jika tidak diubah" : "Masukkan password"
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      {initial && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      )}
      <div className="flex gap-3 justify-end mt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleCreate = async (form) => {
    setFormLoading(true);
    try {
      await createUser({
        username: form.username,
        password: form.password,
        role: form.role,
      });
      showSuccess("Pengguna berhasil ditambahkan");
      setShowAdd(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal menambahkan pengguna");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (form) => {
    setFormLoading(true);
    try {
      const payload = { role: form.role, status: form.status };
      if (form.username) payload.username = form.username;
      if (form.password) payload.password = form.password;
      await updateUser(editUser.user_id, payload);
      showSuccess("Pengguna berhasil diperbarui");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal memperbarui pengguna");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteConfirm.user_id);
      showSuccess("Pengguna berhasil dihapus");
      setDeleteConfirm(null);
      fetchUsers();
    } catch {
      setError("Gagal menghapus pengguna");
    }
  };

  const roleBadge = (role) => {
    const styles = {
      Admin: "bg-red-100 text-red-700",
      Operator: "bg-blue-100 text-blue-700",
      Viewer: "bg-green-100 text-green-700",
    };
    return styles[role] || "bg-gray-100 text-gray-700";
  };

  const statusBadge = (status) => {
    return status === "Aktif"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-500";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-gray-500">
            {users.length} pengguna terdaftar
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          variant="primary"
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          }
        >
          Tambah Pengguna
        </Button>
      </div>

      {/* Notifikasi */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg border border-green-200">
          ✓ {success}
        </div>
      )}

      {/* Tabel Pengguna */}
      {/* Ganti seluruh bagian tabel dengan ini */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Header tabel — hanya desktop */}
        <div className="hidden md:grid grid-cols-6 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <div>No</div>
          <div className="col-span-2">Username</div>
          <div>Role</div>
          <div>Status</div>
          <div>Aksi</div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Memuat data...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Belum ada pengguna terdaftar
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {users.map((user, index) => (
              <div key={user.user_id} className="hover:bg-gray-50 transition">
                {/* Layout Desktop */}
                <div className="hidden md:grid grid-cols-6 gap-3 px-5 py-3.5 items-center text-sm">
                  <div className="text-gray-400">{index + 1}</div>
                  <div className="col-span-2 font-medium text-gray-800">
                    {user.username}
                  </div>
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditUser(user)}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Ubah
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </div>

                {/* Layout Mobile — card per user */}
                <div className="md:hidden px-4 py-4 flex flex-col gap-3">
                  {/* Baris atas: nomor + nama + badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm uppercase shrink-0">
                        {user.username?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-400">#{index + 1}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge(user.role)}`}
                      >
                        {user.role}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>

                  {/* Baris bawah: tombol aksi */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditUser(user)}
                      className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 font-medium"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Ubah
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 font-medium"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah */}
      {showAdd && (
        <Modal title="Tambah Pengguna Baru" onClose={() => setShowAdd(false)}>
          <UserForm
            onSubmit={handleCreate}
            onClose={() => setShowAdd(false)}
            loading={formLoading}
          />
        </Modal>
      )}

      {/* Modal Ubah */}
      {editUser && (
        <Modal title="Ubah Data Pengguna" onClose={() => setEditUser(null)}>
          <UserForm
            initial={editUser}
            onSubmit={handleUpdate}
            onClose={() => setEditUser(null)}
            loading={formLoading}
          />
        </Modal>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirm && (
        <Modal title="Konfirmasi Hapus" onClose={() => setDeleteConfirm(null)}>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus pengguna
              <span className="font-semibold text-gray-800">
                {" "}
                {deleteConfirm.username}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

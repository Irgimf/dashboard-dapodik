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
      setUsers(data);
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
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          + Tambah Pengguna
        </button>
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
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                No
              </th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                Username
              </th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                Role
              </th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                Status
              </th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                Login Terakhir
              </th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  Memuat data...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  Belum ada pengguna terdaftar
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.user_id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {user.username}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-5 py-3 flex gap-2">
                    <button
                      onClick={() => setEditUser(user)}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      ✏️ Ubah
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

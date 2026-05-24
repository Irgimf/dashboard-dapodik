import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginContext } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await login(username, password);
      loginContext(data.access_token, data.role, data.username);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ===== KIRI: Foto Kota Bandung ===== */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden">
        {/* Foto Background Kota Bandung */}
        <img
          src="../assets/bandung.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradasi overlay biru-indigo sesuai tema */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 32, 119, 0.85) 0%, rgba(12, 3, 119, 0.75) 50%, rgba(17,24,39,0.65) 100%)",
          }}
        />

        {/* Konten di atas foto */}
        <div className="relative z-10 flex flex-col justify-between p-10 lg:p-14 w-full">
          {/* Logo atas */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <span className="text-xl">🎓</span>
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">
                Dashboard Backbone
              </p>
              <p className="text-blue-200 text-xs">Dapodik Kota Bandung</p>
            </div>
          </div>

          {/* Teks tengah */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 w-fit">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white text-xs font-medium">
                  Sistem Aktif
                </span>
              </div>
              <h1 className="text-white text-3xl lg:text-4xl font-bold leading-tight">
                Koordinasi &<br />
                Evaluasi Pendidikan
                <br />
                <span className="text-blue-300">Kota Bandung</span>
              </h1>
              <p className="text-blue-100 text-sm lg:text-base leading-relaxed max-w-sm">
                Platform terpusat untuk pemantauan, perencanaan, supervisi, dan
                evaluasi layanan pendidikan dasar berbasis data Dapodik.
              </p>
            </div>

            {/* Statistik kecil */}
            <div className="flex gap-4">
              {[
                { angka: "30", label: "Kecamatan" },
                { angka: "2.409", label: "Sekolah" },
                { angka: "5", label: "Jenjang" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-0.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5"
                >
                  <span className="text-white text-xl font-bold">
                    {item.angka}
                  </span>
                  <span className="text-blue-200 text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer bawah */}
          <div className="flex items-center justify-between">
            <p className="text-blue-300 text-xs">
              © 2026 Dinas Pendidikan Kota Bandung
            </p>
            <p className="text-blue-300 text-xs">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* ===== KANAN: Form Login ===== */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center bg-white p-6 md:p-10">
        <div className="w-full max-w-sm flex flex-col gap-7">
          {/* Header form — hanya tampil di mobile */}
          <div className="flex flex-col items-center gap-3 md:hidden">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="text-center">
              <h1 className="text-gray-800 font-bold text-xl">
                Dashboard Backbone
              </h1>
              <p className="text-gray-400 text-sm">Dapodik Kota Bandung</p>
            </div>
          </div>

          {/* Judul form */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-gray-800 text-2xl font-bold">Selamat Datang</h2>
            <p className="text-gray-400 text-sm">
              Masuk ke akun Anda untuk mengakses dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Input Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: loading
                  ? "#93C5FD"
                  : "linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)",
                boxShadow: loading ? "none" : "0 4px 15px rgba(29,78,216,0.35)",
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Info role */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400 text-center">
              Hak akses tersedia:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  role: "Admin",
                  color: "bg-red-50 text-red-600 border-red-100",
                  icon: "⚙️",
                },
                {
                  role: "Operator",
                  color: "bg-blue-50 text-blue-600 border-blue-100",
                  icon: "📊",
                },
                {
                  role: "Viewer",
                  color: "bg-green-50 text-green-600 border-green-100",
                  icon: "👁️",
                },
              ].map((item) => (
                <div
                  key={item.role}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium ${item.color}`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.role}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-300">
            © 2026 Dinas Pendidikan Kota Bandung
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { username, role, logoutContext } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogoutConfirm = () => {
    logoutContext();
    navigate("/login");
  };

  // Tutup dropdown saat klik luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roleColor = {
    Admin: { bg: "bg-red-500", light: "bg-red-100 text-red-700" },
    Operator: { bg: "bg-blue-500", light: "bg-blue-100 text-blue-700" },
    Viewer: { bg: "bg-green-500", light: "bg-green-100 text-green-700" },
  };

  const roleDesc = {
    Admin: "Akses penuh ke seluruh fitur sistem",
    Operator: "Kelola data dan sinkronisasi",
    Viewer: "Lihat dashboard dan peta",
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-4 py-0 flex items-center shadow-lg h-14 relative z-50">
        {/* Kiri: Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200 active:scale-95"
          >
            <div className="flex flex-col gap-1 w-5">
              <span
                className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${sidebarOpen ? "rotate-45 translate-y-1.5" : ""}`}
              />
              <span
                className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${sidebarOpen ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${sidebarOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              />
            </div>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/30">
              <span className="text-base">🎓</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight tracking-wide">
                Dashboard Backbone
              </p>
              <p className="text-xs text-blue-200 leading-tight">
                Dapodik Kota Bandung
              </p>
            </div>
          </div>
        </div>

        {/* Tengah */}
        <div className="flex-1 mx-4 hidden lg:flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
          <span className="text-xs text-blue-200 whitespace-nowrap">
            Dinas Pendidikan Kota Bandung
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
        </div>

        {/* Kanan */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Indikator online */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-blue-100">Online</span>
          </div>

          {/* Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg border border-white/20 transition-all duration-200 active:scale-95"
            >
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold uppercase shrink-0">
                {username?.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-tight">
                  {username}
                </p>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full text-white font-medium ${roleColor[role]?.bg || "bg-gray-500"}`}
                >
                  {role}
                </span>
              </div>
              {/* Chevron */}
              <svg
                className={`w-3 h-3 text-blue-200 transition-transform duration-200 hidden sm:block ${showDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Profil */}
            {showDropdown && (
              <div
                className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[999]"
                style={{ animation: "dropdownIn 0.15s ease-out" }}
              >
                {/* Header profil */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold text-white uppercase border-2 border-white/40">
                    {username?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {username}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${roleColor[role]?.bg || "bg-gray-500"}`}
                    >
                      {role}
                    </span>
                  </div>
                </div>

                {/* Info role */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${roleColor[role]?.light || "bg-gray-100 text-gray-600"}`}
                  >
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {roleDesc[role] || "Pengguna sistem"}
                  </div>
                </div>

                {/* Info akun */}
                <div className="px-4 py-3 border-b border-gray-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg
                      className="w-3.5 h-3.5 shrink-0 text-gray-400"
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
                    <span>
                      Masuk sebagai{" "}
                      <span className="font-medium text-gray-700">
                        {username}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg
                      className="w-3.5 h-3.5 shrink-0 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>
                      Status:{" "}
                      <span className="font-medium text-green-600">Aktif</span>
                    </span>
                  </div>
                </div>

                {/* Tombol Logout */}
                <div className="p-3">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all duration-200 font-medium group"
                  >
                    <svg
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modal Logout */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar? Sesi Anda akan diakhiri dan Anda perlu login kembali."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        type="danger"
      />

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}

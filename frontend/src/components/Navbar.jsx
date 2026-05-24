import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { username, role, logoutContext } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    logoutContext();
    navigate("/login");
  };

  const roleColor = {
    Admin: "bg-red-500",
    Operator: "bg-blue-500",
    Viewer: "bg-green-500",
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-4 py-0 flex items-center shadow-lg h-14 relative z-50">
        {/* Kiri: Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200 active:scale-95"
            title={sidebarOpen ? "Sembunyikan sidebar" : "Tampilkan sidebar"}
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
          <div className="hidden md:flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-blue-100">Online</span>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/20">
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold uppercase shrink-0">
              {username?.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold leading-tight">{username}</p>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full text-white font-medium ${roleColor[role] || "bg-gray-500"}`}
              >
                {role}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1.5 bg-red-500/80 hover:bg-red-500 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border border-red-400/50 active:scale-95"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Modal Logout */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Keluar dari Sistem"
        message="Apakah Anda yakin ingin keluar? Sesi Anda akan diakhiri dan Anda perlu login kembali."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        type="danger"
      />
    </>
  );
}

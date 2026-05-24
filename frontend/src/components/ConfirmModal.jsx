import { useEffect } from "react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya, Konfirmasi",
  cancelText = "Batal",
  type = "danger",
}) {
  // Tutup modal dengan ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock scroll saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const confirmStyle = {
    danger: "bg-red-600 hover:bg-red-700 shadow-red-200",
    warning: "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200",
    info: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
  };

  const iconStyle = {
    danger: {
      bg: "bg-red-100",
      color: "text-red-600",
      icon: (
        <svg
          className="w-7 h-7"
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
      ),
    },
    warning: {
      bg: "bg-yellow-100",
      color: "text-yellow-600",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    info: {
      bg: "bg-blue-100",
      color: "text-blue-600",
      icon: (
        <svg
          className="w-7 h-7"
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
      ),
    },
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ animation: "fadeIn 0.15s ease-out" }}
    >
      {/* Backdrop blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fadeIn 0.15s ease-out" }}
      />

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden"
        style={{ animation: "slideUp 0.2s ease-out" }}
      >
        {/* Top accent bar */}
        <div
          className={`h-1.5 w-full ${type === "danger" ? "bg-gradient-to-r from-red-500 to-rose-500" : type === "warning" ? "bg-gradient-to-r from-yellow-400 to-amber-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
        />

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={`w-16 h-16 rounded-full ${iconStyle[type].bg} flex items-center justify-center ${iconStyle[type].color}`}
            >
              {iconStyle[type].icon}
            </div>
          </div>

          {/* Teks */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
          </div>

          {/* Tombol */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-all duration-200 active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-200 active:scale-95 shadow-lg ${confirmStyle[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animasi */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

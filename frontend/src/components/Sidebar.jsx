import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menu = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
    roles: ["Admin", "Operator", "Viewer"],
    desc: "KPI & Grafik",
  },
  {
    path: "/map",
    label: "Peta Sebaran",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
    roles: ["Admin", "Operator", "Viewer"],
    desc: "Lokasi Sekolah",
  },
  {
    path: "/users",
    label: "Pengguna",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    roles: ["Admin"],
    desc: "Kelola Akun",
  },
  {
    path: "/sync",
    label: "Sinkronisasi",
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
    roles: ["Admin", "Operator"],
    desc: "Data Dapodik",
  },
];

export default function Sidebar({ open }) {
  const { role } = useAuth();
  const filteredMenu = menu.filter((m) => m.roles.includes(role));

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          flex flex-col bg-gray-900 text-white
          transition-all duration-300 ease-in-out
          overflow-hidden shrink-0
          ${open ? "w-56" : "w-16"}
        `}
        style={{ height: "100%" }}
      >
        {/* Menu Items */}
        <nav className="flex flex-col gap-1 p-2 flex-1 mt-2">
          {filteredMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={!open ? item.label : ""}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Indikator aktif */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full" />
                  )}

                  {/* Icon */}
                  <div
                    className={`shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
                  >
                    {item.icon}
                  </div>

                  {/* Label & Desc */}
                  <div
                    className={`flex flex-col overflow-hidden transition-all duration-300 ${open ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
                  >
                    <span className="text-sm font-medium whitespace-nowrap leading-tight">
                      {item.label}
                    </span>
                    <span
                      className={`text-xs whitespace-nowrap leading-tight ${isActive ? "text-blue-200" : "text-gray-500"}`}
                    >
                      {item.desc}
                    </span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div
          className={`p-3 border-t border-gray-800 transition-all duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        >
          <div className="bg-gray-800 rounded-xl p-3">
            <p className="text-xs text-gray-400 leading-relaxed">
              Dashboard Backbone Dapodik
            </p>
            <p className="text-xs text-gray-600 mt-0.5">v1.0.0 — 2025</p>
          </div>
        </div>
      </aside>
    </>
  );
}

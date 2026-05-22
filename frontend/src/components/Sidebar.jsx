import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { role } = useAuth();

  const menu = [
    {
      path: "/dashboard",
      label: "📊 Dashboard",
      roles: ["Admin", "Operator", "Viewer"],
    },
    {
      path: "/map",
      label: "🗺️ Peta Sebaran",
      roles: ["Admin", "Operator", "Viewer"],
    },
    { path: "/users", label: "👤 Kelola Pengguna", roles: ["Admin"] },
    { path: "/sync", label: "🔄 Sinkronisasi", roles: ["Admin", "Operator"] },
  ];

  return (
    <aside className="w-56 min-h-screen bg-gray-800 text-white flex flex-col py-6 px-3 gap-1">
      {menu
        .filter((m) => m.roles.includes(role))
        .map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded text-sm transition ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
            }
          >
            {m.label}
          </NavLink>
        ))}
    </aside>
  );
}

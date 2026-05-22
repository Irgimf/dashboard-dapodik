import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { username, role, logoutContext } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      logoutContext();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="font-bold text-lg">Dashboard Backbone Dapodik</div>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {username}{" "}
          <span className="bg-blue-500 px-2 py-0.5 rounded text-xs ml-1">
            {role}
          </span>
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

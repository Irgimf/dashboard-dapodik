import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Navbar fixed di atas */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Area bawah navbar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="absolute inset-0 bg-black/50 z-40 backdrop-blur-sm"
            style={{ animation: "fadeIn 0.2s ease-out" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Desktop — selalu di DOM, animasi lebar */}
        {!isMobile && (
          <div
            className="h-full shrink-0 overflow-hidden transition-all duration-300"
            style={{ width: sidebarOpen ? "224px" : "64px" }}
          >
            <Sidebar open={sidebarOpen} />
          </div>
        )}

        {/* Sidebar Mobile — drawer dari kiri */}
        {isMobile && (
          <div
            className={`absolute left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <Sidebar open={true} />
          </div>
        )}

        {/* Konten utama */}
        <main className="flex-1 overflow-auto p-4 md:p-5">
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

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
      setSidebarOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="absolute inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Desktop */}
        {!isMobile && (
          <div
            className="h-full shrink-0 overflow-hidden"
            style={{
              width: sidebarOpen ? "224px" : "64px",
              transition: "width 200ms ease",
              willChange: "width",
            }}
          >
            <Sidebar open={sidebarOpen} />
          </div>
        )}

        {/* Sidebar Mobile */}
        {isMobile && (
          <div
            className="absolute left-0 top-0 h-full z-50"
            style={{
              transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 200ms ease",
              willChange: "transform",
            }}
          >
            <Sidebar open={true} />
          </div>
        )}

        {/* Konten — tidak ikut animasi sidebar */}
        <main className="flex-1 overflow-auto p-4 md:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MapPage from "./pages/MapPage";
import UserManagementPage from "./pages/UserManagementPage";
import SyncPage from "./pages/SyncPage";
import Layout from "./components/Layout";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/dashboard" />;
  return children;
};

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="map" element={<MapPage />} />
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="sync"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Operator"]}>
              <SyncPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

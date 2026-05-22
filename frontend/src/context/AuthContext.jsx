import { createContext, useContext, useState, useEffect } from "react";
import {
  getToken,
  getRole,
  getUsername,
  isLoggedIn,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [role, setRole] = useState(getRole());
  const [username, setUsername] = useState(getUsername());

  const loginContext = (tokenData, roleData, usernameData) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("role", roleData);
    localStorage.setItem("username", usernameData);
    setToken(tokenData);
    setRole(roleData);
    setUsername(usernameData);
  };

  const logoutContext = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        username,
        loginContext,
        logoutContext,
        isLoggedIn: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

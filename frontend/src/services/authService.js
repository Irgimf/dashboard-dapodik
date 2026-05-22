import axios from "axios";

const API = "/api";

export const login = async (username, password) => {
  const res = await axios.post(`${API}/auth/login`, { username, password });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
};

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const getUsername = () => localStorage.getItem("username");
export const isLoggedIn = () => !!localStorage.getItem("token");

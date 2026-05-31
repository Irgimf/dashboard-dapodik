import axios from "axios";
import BASE_URL from "./api";

const API = `${BASE_URL}/api`;

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

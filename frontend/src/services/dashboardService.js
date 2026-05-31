import axios from "axios";
import { getToken } from "./authService";

const BASE = "https://dashboard-dapodik-production.up.railway.app";
const API = `${BASE}/api/dashboard`;
const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getKPI = async (params = {}) => {
  const res = await axios.get(`${API}/kpi`, { headers: headers(), params });
  return res.data;
};

export const getGrafikJenjang = async () => {
  const res = await axios.get(`${API}/grafik/jenjang`, { headers: headers() });
  return res.data;
};

export const getGrafikStatus = async () => {
  const res = await axios.get(`${API}/grafik/status`, { headers: headers() });
  return res.data;
};

export const getGrafikTren = async () => {
  const res = await axios.get(`${API}/grafik/tren`, { headers: headers() });
  return res.data;
};

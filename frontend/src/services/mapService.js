import axios from "axios";
import { getToken } from "./authService";

const API = "/api/map";

const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export const getCoordinates = async (params = {}) => {
  const res = await axios.get(`${API}/coordinates`, {
    headers: headers(),
    params,
  });
  return res.data;
};

export const getSchoolDetail = async (npsn) => {
  const res = await axios.get(`${API}/detail/${npsn}`, { headers: headers() });
  return res.data;
};

export const searchSchool = async (keyword) => {
  const res = await axios.get(`${API}/search`, {
    headers: headers(),
    params: { keyword },
  });
  return res.data;
};

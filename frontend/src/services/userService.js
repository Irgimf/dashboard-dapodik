import axios from "axios";
import { getToken } from "./authService";

const API = "/api/users";

const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export const getAllUsers = async () => {
  const res = await axios.get(`${API}/`, { headers: headers() });
  return res.data;
};

export const createUser = async (data) => {
  const res = await axios.post(`${API}/`, data, { headers: headers() });
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, { headers: headers() });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API}/${id}`, { headers: headers() });
  return res.data;
};

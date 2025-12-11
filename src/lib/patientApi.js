import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; // e.g., http://localhost:5000
const API = `${BASE_URL}/api/patients`;

// ---------------- CREATE ----------------
export const createPatient = async (data) => {
  try {
    const res = await axios.post(`${API}/create`, data, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Create patient error:", error.response || error);
    throw error;
  }
};

// ---------------- READ ALL ----------------
export const getAllPatients = async () => {
  try {
    const res = await axios.get(`${API}/all`, { withCredentials: true });
    return res.data.patients || []; // ensure an array
  } catch (error) {
    console.error("Get all patients error:", error.response || error);
    throw error;
  }
};

// ---------------- READ ONE ----------------
export const getPatientById = async (id) => {
  try {
    const res = await axios.get(`${API}/id/${id}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error(`Get patient ${id} error:`, error.response || error);
    throw error;
  }
};

// ---------------- UPDATE ----------------
export const updatePatient = async (id, data) => {
  try {
    const res = await axios.put(`${API}/id/${id}`, data, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error(`Update patient ${id} error:`, error.response || error);
    throw error;
  }
};

// ---------------- DELETE ----------------
export const deletePatient = async (id) => {
  try {
    const res = await axios.delete(`${API}/id/${id}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error(`Delete patient ${id} error:`, error.response || error);
    throw error;
  }
};

import axios from "axios";

// ------------------------------
// Axios instance with cookies
// ------------------------------
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/patientsClinic2`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send JWT cookie
});

// ---------------- CREATE ----------------
export const createPatient = async (data) => {
  try {
    const res = await api.post("/", data);
    return res.data;
  } catch (error) {
    console.error("Create patient error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- READ ALL ----------------
export const getAllPatients = async () => {
  try {
    const res = await api.get("/");
    return res.data;
  } catch (error) {
    console.error("Get all patients error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- READ ONE ----------------
export const getPatientById = async (id) => {
  try {
    const res = await api.get(`/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get patient by ID error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- READ BY PHONE ----------------
export const getPatientByPhone = async (phone) => {
  try {
    const res = await api.get(`/search/by-phone?phone=${encodeURIComponent(phone)}`);
    return res.data;
  } catch (error) {
    console.error("Get patient by phone error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- UPDATE ----------------
export const updatePatient = async (id, data) => {
  try {
    const res = await api.put(`/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Update patient error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- DELETE ----------------
export const deletePatient = async (id) => {
  try {
    const res = await api.delete(`/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete patient error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- TREATMENTS ----------------
export const addTreatment = async (patientId, treatment) => {
  try {
    const res = await api.post(`/${patientId}/treatment`, treatment);
    return res.data;
  } catch (error) {
    console.error("Add treatment error:", error.response?.data ?? error.message);
    throw error;
  }
};

export const deleteTreatment = async (patientId, index) => {
  try {
    const res = await api.delete(`/${patientId}/treatment/${index}`);
    return res.data;
  } catch (error) {
    console.error("Delete treatment error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- VACCINATIONS ----------------
export const addVaccination = async (patientId, vaccination) => {
  try {
    const res = await api.post(`/${patientId}/vaccination`, vaccination);
    return res.data;
  } catch (error) {
    console.error("Add vaccination error:", error.response?.data ?? error.message);
    throw error;
  }
};

export const deleteVaccination = async (patientId, index) => {
  try {
    const res = await api.delete(`/${patientId}/vaccination/${index}`);
    return res.data;
  } catch (error) {
    console.error("Delete vaccination error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- FILTER ----------------
export const getPatientsByProviderType = async (type) => {
  try {
    const res = await api.get(`/filter?type=${encodeURIComponent(type)}`);
    return res.data;
  } catch (error) {
    console.error("Get patients by provider type error:", error.response?.data ?? error.message);
    throw error;
  }
};

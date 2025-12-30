import axios from "axios";

// Base URL must match your server mount point
const api = axios.create({
 baseURL: "/api/patientsClinic2",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ---------------- CREATE ----------------
export const createPatient = async (data) => {
  try {
    const res = await api.post("/", data); // POST /api/patientsClinic2/
    return res.data;
  } catch (error) {
    console.error("Create patient error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- READ ALL ----------------
export const getAllPatients = async () => {
  try {
    const res = await api.get("/"); // GET /api/patientsClinic2/
    return res.data;
  } catch (error) {
    console.error("Get all patients error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- READ ONE ----------------
export const getPatientById = async (id) => {
  try {
    const res = await api.get(`/${id}`); // GET /api/patientsClinic2/:id
    return res.data;
  } catch (error) {
    console.error("Get patient by ID error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- READ BY PHONE ----------------
export const getPatientByPhone = async (phone) => {
  try {
    const res = await api.get(`/search/by-phone?phone=${encodeURIComponent(phone)}`); // GET /api/patientsClinic2/search/by-phone
    return res.data;
  } catch (error) {
    console.error("Get patient by phone error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- UPDATE ----------------
export const updatePatient = async (id, data) => {
  try {
    const res = await api.put(`/${id}`, data); // PUT /api/patientsClinic2/:id
    return res.data;
  } catch (error) {
    console.error("Update patient error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- DELETE ----------------
export const deletePatient = async (id) => {
  try {
    const res = await api.delete(`/${id}`); // DELETE /api/patientsClinic2/:id
    return res.data;
  } catch (error) {
    console.error("Delete patient error:", error.response?.data ?? error.message);
    throw error;
  }
};

// ---------------- TREATMENTS ----------------

// Add treatment to patient's treatmentPlan
export const addTreatment = async (patientId, treatment) => {
  try {
    const res = await api.post(`/${patientId}/treatment`, treatment); // POST /api/patientsClinic2/:id/treatment
    return res.data;
  } catch (error) {
    console.error("Add treatment error:", error.response?.data ?? error.message);
    throw error;
  }
};

// Remove treatment by index from patient's treatmentPlan
export const deleteTreatment = async (patientId, index) => {
  try {
    const res = await api.delete(`/${patientId}/treatment/${index}`); // DELETE /api/patientsClinic2/:id/treatment/:index
    return res.data;
  } catch (error) {
    console.error("Delete treatment error:", error.response?.data ?? error.message);
    throw error;
  }
};

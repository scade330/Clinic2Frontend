import axios from "axios";

// Make sure you use full backend URL in production
const API_URL = import.meta.env.VITE_BASE_URL + "/api/patients";

// CREATE
export const createPatient = (patientData) =>
  axios.post(`${API_URL}/create`, patientData, { withCredentials: true });

// READ ALL
export async function getAllPatients() {
  const res = await axios.get(`${API_URL}/all`, { withCredentials: true });
  return res.data;
}

// READ ONE
export async function getPatientById(id) {
  const res = await axios.get(`${API_URL}/id/${id}`, { withCredentials: true });
  return res.data;
}

// UPDATE
export async function updatePatient(id, data) {
  const res = await axios.put(`${API_URL}/id/${id}`, data, { withCredentials: true });
  return res.data;
}

// DELETE
export async function deletePatient(id) {
  const res = await axios.delete(`${API_URL}/id/${id}`, { withCredentials: true });
  return res.data;
}

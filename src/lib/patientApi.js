import axios from "axios";

const API_URL = "/api/patients"; // Vite proxy forwards to backend

// CREATE
export const createPatient = (patientData) =>
  axios.post(`${API_URL}/create`, patientData);

// READ ALL
export async function getAllPatients() {
  const res = await axios.get(`${API_URL}/all`);
  return res.data;
}

// READ ONE
export async function getPatientById(id) {
  const res = await axios.get(`${API_URL}/id/${id}`);
  return res.data;
}

// UPDATE
export async function updatePatient(id, data) {
  const res = await axios.put(`${API_URL}/id/${id}`, data);
  return res.data;
}

// DELETE
export async function deletePatient(id) {
  const res = await axios.delete(`${API_URL}/id/${id}`);
  return res.data;
}

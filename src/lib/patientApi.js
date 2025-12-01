import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL + "/api/patients";

// CREATE
export const createPatient = (data) => axios.post(`${API_URL}/create`, data, { withCredentials: true });

// READ ALL
export const getAllPatients = async () => {
  const res = await axios.get(`${API_URL}/all`, { withCredentials: true });
  return res.data; // array of patients
};

// READ ONE
export const getPatientById = async (id) => {
  const res = await axios.get(`${API_URL}/id/${id}`, { withCredentials: true });
  return res.data;
};

// UPDATE
export const updatePatient = async (id, data) => {
  const res = await axios.put(`${API_URL}/id/${id}`, data, { withCredentials: true });
  return res.data;
};

// DELETE
export const deletePatient = async (id) => {
  const res = await axios.delete(`${API_URL}/id/${id}`, { withCredentials: true });
  return res.data;
};

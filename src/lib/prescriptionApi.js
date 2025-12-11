import axios from "axios";

const BASE_URL = "http://localhost:8000/api/prescriptions";

// Get all prescriptions
export const getAllPrescriptions = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};

// Get prescription by ID
export const getPrescriptionById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data.data;
};

// Get prescriptions by patient ID
export const getPrescriptionsByPatient = async (patientId) => {
  const res = await axios.get(`${BASE_URL}/patient/${patientId}`);
  return res.data.data;
};

// Create a new prescription
export const createPrescription = async (prescriptionData) => {
  const res = await axios.post(BASE_URL, prescriptionData);
  return res.data.data;
};

// Update a prescription
export const updatePrescription = async (id, updateData) => {
  const res = await axios.put(`${BASE_URL}/${id}`, updateData);
  return res.data.data;
};

// Delete a prescription
export const deletePrescription = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data.data;
};

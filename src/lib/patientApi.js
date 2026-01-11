import axios from "axios";

/* -------------------------------------------------
   Base configuration
------------------------------------------------- */

// Ensure no trailing slash in env URL
const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");
const API_BASE = `${BASE_URL}/api/patientsClinic2`;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // IMPORTANT: auth cookies
});

/* -------------------------------------------------
   CREATE PATIENT
------------------------------------------------- */
export const createPatient = async (data) => {
  try {
    const res = await api.post("/", data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create patient"
    );
  }
};

/* -------------------------------------------------
   GET ALL PATIENTS
------------------------------------------------- */
export const getAllPatients = async () => {
  try {
    const res = await api.get("/");
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch patients"
    );
  }
};

/* -------------------------------------------------
   GET PATIENT BY ID
------------------------------------------------- */
export const getPatientById = async (id) => {
  try {
    const res = await api.get(`/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Patient not found"
    );
  }
};

/* -------------------------------------------------
   GET PATIENT BY PHONE
------------------------------------------------- */
export const getPatientByPhone = async (phone) => {
  try {
    const res = await api.get(`/search/by-phone`, {
      params: { phone },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Patient not found"
    );
  }
};

/* -------------------------------------------------
   UPDATE PATIENT
------------------------------------------------- */
export const updatePatient = async (id, data) => {
  try {
    const res = await api.put(`/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update patient"
    );
  }
};

/* -------------------------------------------------
   DELETE PATIENT
------------------------------------------------- */
export const deletePatient = async (id) => {
  try {
    const res = await api.delete(`/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete patient"
    );
  }
};

/* -------------------------------------------------
   LAB RESULT IMAGE UPLOAD (Cloudinary)
------------------------------------------------- */
export const uploadLabResultImage = async (patientId, file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await api.post(
      `/${patientId}/lab-results`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lab image upload failed"
    );
  }
};

/* -------------------------------------------------
   DELETE LAB RESULT IMAGE
------------------------------------------------- */
export const deleteLabResultImage = async (patientId, imageId) => {
  try {
    const res = await api.delete(
      `/${patientId}/lab-results/${imageId}`
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete lab image"
    );
  }
};

/* -------------------------------------------------
   TREATMENTS
------------------------------------------------- */
export const addTreatment = async (patientId, treatment) => {
  try {
    const res = await api.post(
      `/${patientId}/treatment`,
      treatment,
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add treatment"
    );
  }
};

export const deleteTreatment = async (patientId, index) => {
  try {
    const res = await api.delete(
      `/${patientId}/treatment/${index}`
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete treatment"
    );
  }
};

/* -------------------------------------------------
   VACCINATIONS
------------------------------------------------- */
export const addVaccination = async (patientId, vaccination) => {
  try {
    const res = await api.post(
      `/${patientId}/vaccination`,
      vaccination,
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add vaccination"
    );
  }
};

export const deleteVaccination = async (patientId, index) => {
  try {
    const res = await api.delete(
      `/${patientId}/vaccination/${index}`
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete vaccination"
    );
  }
};

/* -------------------------------------------------
   FILTER BY PROVIDER TYPE
------------------------------------------------- */
export const getPatientsByProviderType = async (type) => {
  try {
    const res = await api.get(`/filter`, {
      params: { type },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to filter patients"
    );
  }
};

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  createPatient,
  uploadLabResultImage,
} from "../../lib/patientApi";

/* -----------------------------
   Constants
----------------------------- */
const REGIONS = ["Awdal", "Maroodi Jeex", "Sanaag", "Sool", "Togdheer", "Saaxil"];
const PROVIDERS = ["Public Hospital", "Private Hospital", "MCH", "Clinic", "Health Center"];
const GENDERS = ["Male", "Female", "Other"];

const INITIAL_STATE = {
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  phone: "",
  address: "",
  region: "",
  district: "",
  healthProviderType: "",
  medicalHistory: "",
  currentMedications: "",
  allergies: "",
  diagnosis: "",
  physicalExam: "",
  treatmentPlan: [],
  vaccinations: [],
  nextAppointment: "",
  reason: "",
  labImages: [],
};

export default function PatientForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  /* -----------------------------
     Handlers
  ----------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      labImages: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* 1️⃣ Create patient (JSON only) */
      const payload = {
        ...formData,
        age: Number(formData.age),
        labImages: undefined, // NEVER send files in JSON
        nextAppointment: formData.nextAppointment || null,
      };

      const res = await createPatient(payload);
      const patientId = res.patient._id;

      /* 2️⃣ Upload lab result images */
      for (const file of formData.labImages) {
        await uploadLabResultImage(patientId, file);
      }

      toast.success("Patient and lab results saved successfully");
      setFormData(INITIAL_STATE);
    } catch (err) {
      toast.error(err.message || "Failed to save patient");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     UI
  ----------------------------- */
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow space-y-8"
      >
        <h1 className="text-3xl font-bold text-slate-800">
          Patient Registration
        </h1>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="First Name *" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <Input label="Last Name *" name="lastName" value={formData.lastName} onChange={handleChange} required />
          <Input label="Age *" name="age" type="number" value={formData.age} onChange={handleChange} required />
          <Select label="Gender *" name="gender" options={GENDERS} value={formData.gender} onChange={handleChange} required />
          <Input label="Phone *" name="phone" value={formData.phone} onChange={handleChange} required />
          <Select label="Provider Type *" name="healthProviderType" options={PROVIDERS} value={formData.healthProviderType} onChange={handleChange} required />
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Address *" name="address" value={formData.address} onChange={handleChange} required />
          <Select label="Region *" name="region" options={REGIONS} value={formData.region} onChange={handleChange} required />
          <Input label="District *" name="district" value={formData.district} onChange={handleChange} required />
        </div>

        {/* Medical */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextArea label="Medical History" name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} />
          <TextArea label="Physical Examination" name="physicalExam" value={formData.physicalExam} onChange={handleChange} />
        </div>

        {/* Lab Result Images */}
        <div>
          <label className="text-sm font-bold text-slate-600 uppercase">
            Lab Result Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="mt-2 block"
          />

          {/* Preview */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {formData.labImages.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt="Lab preview"
                className="w-24 h-24 object-cover rounded-xl shadow"
              />
            ))}
          </div>
        </div>

        {/* Follow up */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Next Appointment"
            type="datetime-local"
            name="nextAppointment"
            value={formData.nextAppointment}
            onChange={handleChange}
          />
          <TextArea
            label="Follow-up Reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={2}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-black"
          }`}
        >
          {loading ? "Saving..." : "Save Patient"}
        </button>
      </form>
    </div>
  );
}

/* -----------------------------
   Reusable Components
----------------------------- */
const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-slate-500 mb-1 uppercase">
      {label}
    </label>
    <input
      {...props}
      className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-slate-500 mb-1 uppercase">
      {label}
    </label>
    <select
      {...props}
      className="p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option value="">Select...</option>
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-slate-500 mb-1 uppercase">
      {label}
    </label>
    <textarea
      {...props}
      className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

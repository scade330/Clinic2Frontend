import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createPatient } from "../../lib/patientApi";

// Options strictly following the Mongoose Schema Enums
const REGIONS = ["Awdal", "Maroodi Jeex", "Sanaag", "Sool", "Togdheer", "Saaxil"];
const PROVIDERS = ["Public Hospital", "Private Hospital", "MCH", "Clinic", "Health Center"];
const GENDERS = ["Male", "Female", "Other"];
const DIAGNOSES = [
  "Acute Respiratory Infection (ARI)", "Pneumonia", "Diarrheal Disease", "Malaria",
  "Tuberculosis (TB)", "Typhoid Fever", "Intestinal Worms", "Skin Infections",
  "Measles", "Hypertension", "Diabetes Mellitus", "Asthma", "Maternal", "Neonatal", "Other",
];

const INITIAL_STATE = {
  firstName: "", lastName: "", age: "", gender: "", phone: "",
  address: "", region: "", district: "", healthProviderType: "",
  medicalHistory: "", currentMedications: "", allergies: "",
  diagnosis: "", diagnosisOther: "", physicalExam: "", labResults: "",
  treatmentPlan: [{ medication: "", dosage: "", instructions: "" }],
  vaccinations: [{ vaccineName: "", doseNumber: 1, dateGiven: "", administeredBy: "", notes: "" }],
  nextAppointment: "", reason: "",
};

export default function PatientForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateArrayField = (index, field, e) => {
    const { name, value } = e.target;
    const newArr = [...formData[field]];
    newArr[index] = { ...newArr[index], [name]: value };
    setFormData(prev => ({ ...prev, [field]: newArr }));
  };

  const addRow = (field, schema) => setFormData(prev => ({ ...prev, [field]: [...prev[field], schema] }));
  const removeRow = (index, field) => setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        diagnosis: formData.diagnosis === "Other" ? formData.diagnosisOther : formData.diagnosis,
        // Clean dynamic arrays of empty entries
        treatmentPlan: formData.treatmentPlan.filter(t => t.medication.trim()),
        vaccinations: formData.vaccinations.filter(v => v.vaccineName.trim()).map(v => ({
          ...v, doseNumber: Number(v.doseNumber), dateGiven: v.dateGiven || null
        })),
        nextAppointment: formData.nextAppointment || null
      };

      await createPatient(payload);
      toast.success("Patient Record Saved!");
      setFormData(INITIAL_STATE);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving patient data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-10 bg-gray-50 min-h-screen font-sans">
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-3xl p-6 lg:p-12 space-y-10 border border-gray-200">
        
        <header className="border-l-8 border-blue-600 pl-6">
          <h1 className="text-4xl font-black text-slate-800">Patient Intake</h1>
          <p className="text-slate-500">Ensure all required (*) fields are completed.</p>
        </header>

        {/* Section: Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="First Name *" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <Input label="Last Name *" name="lastName" value={formData.lastName} onChange={handleChange} required />
          <Input label="Age *" name="age" type="number" value={formData.age} onChange={handleChange} required />
          <Select label="Gender *" name="gender" options={GENDERS} value={formData.gender} onChange={handleChange} required />
          <Input label="Phone (Digits only) *" name="phone" value={formData.phone} onChange={handleChange} required />
          <Select label="Provider Type *" name="healthProviderType" options={PROVIDERS} value={formData.healthProviderType} onChange={handleChange} required />
        </div>

        {/* Section: Geography */}
        <div className="bg-slate-50 p-8 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 border border-slate-200">
          <Input label="Address *" name="address" value={formData.address} onChange={handleChange} required />
          <Select label="Region *" name="region" options={REGIONS} value={formData.region} onChange={handleChange} required />
          <Input label="District *" name="district" value={formData.district} onChange={handleChange} required />
        </div>

        {/* Section: Clinical Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Assessment</h3>
            <TextArea label="Physical Examination" name="physicalExam" value={formData.physicalExam} onChange={handleChange} />
            <TextArea label="Laboratory Results" name="labResults" value={formData.labResults} onChange={handleChange} />
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Medical History</h3>
            <Select label="Diagnosis" name="diagnosis" options={DIAGNOSES} value={formData.diagnosis} onChange={handleChange} />
            {formData.diagnosis === "Other" && <Input label="Specify Diagnosis" name="diagnosisOther" value={formData.diagnosisOther} onChange={handleChange} />}
            <TextArea label="Health History / Allergies" name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} />
          </div>
        </div>

        {/* Dynamic Treatment & Vaccinations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ArrayField title="Medications" color="purple" onAdd={() => addRow("treatmentPlan", { medication: "", dosage: "", instructions: "" })}>
            {formData.treatmentPlan.map((t, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border mb-3 relative shadow-sm">
                <input name="medication" placeholder="Medicine" value={t.medication} onChange={(e) => updateArrayField(i, "treatmentPlan", e)} className="w-full mb-2 border-b outline-none text-sm" />
                <div className="flex gap-2">
                  <input name="dosage" placeholder="Dose" value={t.dosage} onChange={(e) => updateArrayField(i, "treatmentPlan", e)} className="w-1/2 p-2 bg-slate-50 rounded text-xs" />
                  <input name="instructions" placeholder="Instr." value={t.instructions} onChange={(e) => updateArrayField(i, "treatmentPlan", e)} className="w-1/2 p-2 bg-slate-50 rounded text-xs" />
                </div>
                {formData.treatmentPlan.length > 1 && <RemoveBtn onClick={() => removeRow(i, "treatmentPlan")} />}
              </div>
            ))}
          </ArrayField>

          <ArrayField title="Vaccinations" color="emerald" onAdd={() => addRow("vaccinations", { vaccineName: "", doseNumber: 1, dateGiven: "", administeredBy: "", notes: "" })}>
            {formData.vaccinations.map((v, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border mb-3 relative shadow-sm">
                <input name="vaccineName" placeholder="Vaccine Name" value={v.vaccineName} onChange={(e) => updateArrayField(i, "vaccinations", e)} className="w-full mb-2 border-b outline-none text-sm" />
                <div className="flex gap-2 items-center">
                  <input type="number" name="doseNumber" value={v.doseNumber} onChange={(e) => updateArrayField(i, "vaccinations", e)} className="w-1/4 p-2 bg-slate-50 rounded text-xs" />
                  <input type="date" name="dateGiven" value={v.dateGiven} onChange={(e) => updateArrayField(i, "vaccinations", e)} className="w-3/4 p-2 bg-slate-50 rounded text-xs" />
                </div>
                {formData.vaccinations.length > 1 && <RemoveBtn onClick={() => removeRow(i, "vaccinations")} />}
              </div>
            ))}
          </ArrayField>
        </div>

        {/* Follow-up */}
        <div className="p-8 bg-amber-50 rounded-3xl border border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Next Appointment" name="nextAppointment" type="datetime-local" value={formData.nextAppointment} onChange={handleChange} />
          <TextArea label="Follow-up Reason" name="reason" value={formData.reason} onChange={handleChange} rows={2} />
        </div>

        <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl text-white text-xl font-bold transition-all shadow-lg active:scale-95 ${loading ? "bg-slate-400" : "bg-blue-600 hover:bg-black"}`}>
          {loading ? "SYNCING..." : "SAVE PATIENT RECORD"}
        </button>
      </form>
    </div>
  );
}

/* --- Helpers --- */
const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">{label}</label>
    <input {...props} className="p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">{label}</label>
    <select {...props} className="p-4 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none">
      <option value="">Choose...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">{label}</label>
    <textarea {...props} className="p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" rows={props.rows || 3} />
  </div>
);

const ArrayField = ({ title, children, onAdd, color }) => (
  <div className={`p-6 rounded-3xl border ${color === 'purple' ? 'bg-purple-50 border-purple-100' : 'bg-emerald-50 border-emerald-100'}`}>
    <div className="flex justify-between items-center mb-4">
      <h4 className="font-bold text-slate-700">{title}</h4>
      <button type="button" onClick={onAdd} className="text-[10px] font-bold bg-white px-3 py-1 border rounded-lg hover:bg-slate-50 uppercase">Add Entry</button>
    </div>
    {children}
  </div>
);

const RemoveBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md">✕</button>
);
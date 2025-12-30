import { useState, useEffect } from "react";
import { createPatient, updatePatient } from "@/lib/patientApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

// ------------------- Options -------------------
const DIAGNOSIS_OPTIONS = [
  "Acute Respiratory Infection (ARI)",
  "Pneumonia",
  "Diarrheal Disease",
  "Malaria",
  "Tuberculosis (TB)",
  "Typhoid Fever",
  "Intestinal Worms / Parasites",
  "Skin Infections",
  "Measles",
  "Hypertension (High Blood Pressure)",
  "Diabetes Mellitus",
  "Asthma & Chronic Respiratory Disease",
  "Maternal Conditions",
  "Neonatal Conditions",
  "Other",
];

const REGION_OPTIONS = ["Awdal", "Maroodi Jeex", "Sanaag", "Sool", "Togdheer", "Saaxil"];
const PROVIDER_OPTIONS = ["Public Hospital", "Private Hospital", "MCH", "Clinic", "Health Center"];

// ------------------- Prescription Component -------------------
function PrescriptionFields({ treatmentPlan, setTreatmentPlan, errors }) {
  const handleChange = (index, e) => {
    const newPlan = treatmentPlan.map((p, i) =>
      i === index ? { ...p, [e.target.name]: e.target.value } : p
    );
    setTreatmentPlan(newPlan);
  };

  const addPrescription = () => {
    setTreatmentPlan([...treatmentPlan, { medication: "", dosage: "", instructions: "" }]);
  };

  const removePrescription = (index) => {
    setTreatmentPlan(treatmentPlan.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4 p-4 border border-purple-200 rounded-lg bg-purple-50">
      <h3 className="text-lg font-bold text-purple-800 mb-2">Treatment Plan</h3>
      {treatmentPlan.map((p, i) => (
        <div key={i} className="mb-4 p-2 border rounded-md bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Medication #{i + 1}</span>
            {treatmentPlan.length > 1 && (
              <button
                type="button"
                onClick={() => removePrescription(i)}
                className="text-red-600 font-bold"
              >
                Remove
              </button>
            )}
          </div>
          {["medication", "dosage", "instructions"].map((field) => (
            <div key={field} className="mb-2">
              <Label className="capitalize" htmlFor={`${field}-${i}`}>
                {field}
              </Label>
              <textarea
                id={`${field}-${i}`}
                name={field}
                value={p[field]}
                onChange={(e) => handleChange(i, e)}
                className="w-full px-3 py-2 border rounded-md"
                rows={field === "instructions" ? 3 : 1}
              />
              {errors?.[`${field}-${i}`] && (
                <p className="text-red-500">{errors[`${field}-${i}`]}</p>
              )}
            </div>
          ))}
        </div>
      ))}
      <Button type="button" onClick={addPrescription}>
        + Add Medication
      </Button>
    </div>
  );
}

// ------------------- Vaccination Component -------------------
function VaccinationFields({ vaccinations, setVaccinations, errors }) {
  const handleChange = (index, e) => {
    const newVacc = vaccinations.map((v, i) =>
      i === index ? { ...v, [e.target.name]: e.target.value } : v
    );
    setVaccinations(newVacc);
  };

  const addVaccination = () => {
    setVaccinations([
      ...vaccinations,
      { vaccineName: "", doseNumber: 1, dateGiven: "", administeredBy: "", notes: "" },
    ]);
  };

  const removeVaccination = (index) => {
    setVaccinations(vaccinations.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4 p-4 border border-green-200 rounded-lg bg-green-50">
      <h3 className="text-lg font-bold text-green-800 mb-2">Vaccinations</h3>
      {vaccinations.map((v, i) => (
        <div key={i} className="mb-4 p-2 border rounded-md bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Vaccine #{i + 1}</span>
            {vaccinations.length > 1 && (
              <button
                type="button"
                onClick={() => removeVaccination(i)}
                className="text-red-600 font-bold"
              >
                Remove
              </button>
            )}
          </div>
          {[
            { label: "Vaccine Name", field: "vaccineName" },
            { label: "Dose Number", field: "doseNumber", type: "number" },
            { label: "Date Given", field: "dateGiven", type: "date" },
            { label: "Administered By", field: "administeredBy" },
            { label: "Notes", field: "notes", type: "textarea" },
          ].map(({ label, field, type }) => (
            <div key={field} className="mb-2">
              <Label htmlFor={`${field}-${i}`}>{label}</Label>
              {type === "textarea" ? (
                <textarea
                  id={`${field}-${i}`}
                  name={field}
                  value={v[field]}
                  onChange={(e) => handleChange(i, e)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                />
              ) : (
                <Input
                  id={`${field}-${i}`}
                  name={field}
                  type={type || "text"}
                  value={v[field]}
                  onChange={(e) => handleChange(i, e)}
                  className="w-full"
                />
              )}
              {errors?.[`${field}-${i}`] && (
                <p className="text-red-500">{errors[`${field}-${i}`]}</p>
              )}
            </div>
          ))}
        </div>
      ))}
      <Button type="button" onClick={addVaccination}>
        + Add Vaccine
      </Button>
    </div>
  );
}

// ------------------- Main Dialog Form -------------------
export default function PatientDialogForm({ buttonTitle, patientToEdit, onSuccess }) {
  const initialFormData = {
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
    diagnosisOther: "",
    physicalExam: "",
    labResults: "",
    nextAppointment: "",
    reason: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [treatmentPlan, setTreatmentPlan] = useState([{ medication: "", dosage: "", instructions: "" }]);
  const [vaccinations, setVaccinations] = useState([{ vaccineName: "", doseNumber: 1, dateGiven: "", administeredBy: "", notes: "" }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const isEditing = !!patientToEdit;

  // Load existing patient
  useEffect(() => {
    if (isEditing && patientToEdit) {
      setFormData({
        ...initialFormData,
        ...patientToEdit,
        nextAppointment: patientToEdit.nextAppointment
          ? new Date(patientToEdit.nextAppointment).toISOString().slice(0, 16)
          : "",
      });
      setTreatmentPlan(patientToEdit.treatmentPlan?.length ? patientToEdit.treatmentPlan : [{ medication: "", dosage: "", instructions: "" }]);
      setVaccinations(patientToEdit.vaccinations?.length ? patientToEdit.vaccinations : [{ vaccineName: "", doseNumber: 1, dateGiven: "", administeredBy: "", notes: "" }]);
    }
  }, [isEditing, patientToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------------- Validation ----------------
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.age || formData.age < 0 || formData.age > 120) newErrors.age = "Enter a valid age";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.region) newErrors.region = "Region is required";
    if (!formData.district.trim()) newErrors.district = "District is required";
    if (!formData.healthProviderType) newErrors.healthProviderType = "Health provider required";

    treatmentPlan.forEach((t, i) => { if (!t.medication.trim()) newErrors[`medication-${i}`] = "Medication required"; });
    vaccinations.forEach((v, i) => {
      if (!v.vaccineName.trim()) newErrors[`vaccineName-${i}`] = "Vaccine required";
      if (!v.dateGiven) newErrors[`dateGiven-${i}`] = "Date required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        treatmentPlan: treatmentPlan.map(p => ({
          medication: p.medication.trim(),
          dosage: p.dosage.trim(),
          instructions: p.instructions.trim(),
        })),
        vaccinations: vaccinations.map(v => ({
          vaccineName: v.vaccineName.trim(),
          doseNumber: Number(v.doseNumber),
          dateGiven: new Date(v.dateGiven).toISOString(),
          administeredBy: v.administeredBy.trim(),
          notes: v.notes.trim(),
        })),
        diagnosis: formData.diagnosis === "Other" ? formData.diagnosisOther.trim() || "Other" : formData.diagnosis,
        nextAppointment: formData.nextAppointment ? new Date(formData.nextAppointment).toISOString() : null,
      };

      if (isEditing) {
        await updatePatient(patientToEdit._id, payload);
        toast.success("Patient updated successfully!");
      } else {
        await createPatient(payload);
        toast.success("Patient created successfully!");
      }

      setFormData(initialFormData);
      setTreatmentPlan([{ medication: "", dosage: "", instructions: "" }]);
      setVaccinations([{ vaccineName: "", doseNumber: 1, dateGiven: "", administeredBy: "", notes: "" }]);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{buttonTitle}</Button>
      </DialogTrigger>
      <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Update Patient" : "Add New Patient"}</DialogTitle>
          <DialogDescription>
            Fill out the form to {isEditing ? "update" : "add"} a patient.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["firstName", "lastName", "age", "phone", "address", "district"].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                <Input id={field} name={field} value={formData[field]} onChange={handleChange} required />
                {errors[field] && <p className="text-red-500">{errors[field]}</p>}
              </div>
            ))}

            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <select id="region" name="region" value={formData.region} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required>
                <option value="">Select Region</option>
                {REGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.region && <p className="text-red-500">{errors.region}</p>}
            </div>

            <div>
              <Label htmlFor="healthProviderType">Health Provider</Label>
              <select id="healthProviderType" name="healthProviderType" value={formData.healthProviderType} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required>
                <option value="">Select Provider</option>
                {PROVIDER_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.healthProviderType && <p className="text-red-500">{errors.healthProviderType}</p>}
            </div>
          </div>

          {/* Medical Info */}
          {["medicalHistory", "currentMedications", "allergies", "physicalExam", "labResults"].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field.replace(/([A-Z])/g, " $1").toUpperCase()}</Label>
              <textarea id={field} name={field} value={formData[field]} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" rows={3} />
            </div>
          ))}

          {/* Diagnosis */}
          <div>
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <select id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
              <option value="">Select Diagnosis</option>
              {DIAGNOSIS_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {formData.diagnosis === "Other" && (
              <textarea id="diagnosisOther" name="diagnosisOther" value={formData.diagnosisOther} onChange={handleChange} className="w-full px-3 py-2 border rounded-md mt-2" rows={2} placeholder="Specify Other Diagnosis" />
            )}
          </div>

          {/* Treatment Plan */}
          <PrescriptionFields treatmentPlan={treatmentPlan} setTreatmentPlan={setTreatmentPlan} errors={errors} />

          {/* Vaccinations */}
          <VaccinationFields vaccinations={vaccinations} setVaccinations={setVaccinations} errors={errors} />

          {/* Next Appointment & Reason */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nextAppointment">Next Appointment</Label>
              <Input id="nextAppointment" name="nextAppointment" type="datetime-local" value={formData.nextAppointment} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" name="reason" value={formData.reason} onChange={handleChange} />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (isEditing ? "Updating..." : "Creating...") : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
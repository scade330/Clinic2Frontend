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

function PrescriptionFields({ prescriptionData, setPrescriptionData }) {
  const handleChange = (e) =>
    setPrescriptionData({
      ...prescriptionData,
      [e.target.name]: e.target.value,
    });

  return (
    <div className="mb-4 p-4 border border-purple-200 rounded-lg bg-purple-50">
      <h3 className="text-lg font-bold text-purple-800 mb-2">Prescription</h3>

      {["medication", "dosage", "instructions"].map((field) => (
        <div key={field} className="mb-2">
          <Label className="capitalize" htmlFor={field}>
            {field}
          </Label>
          <textarea
            name={field}
            id={field}
            value={prescriptionData[field]}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={2}
          />
        </div>
      ))}
    </div>
  );
}

export default function PatientDialogForm({
  buttonTitle,
  patientToEdit,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    diagnosis: "",
    physicalExam: "",
    labResults: "",
    nextAppointment: "",
    reason: "",
  });

  const [prescriptionData, setPrescriptionData] = useState({
    medication: "",
    dosage: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const isEditing = !!patientToEdit;

  useEffect(() => {
    if (isEditing && patientToEdit) {
      setFormData({
        firstName: patientToEdit.firstName || "",
        lastName: patientToEdit.lastName || "",
        age: patientToEdit.age || "",
        gender: patientToEdit.gender || "",
        phone: patientToEdit.phone || "",
        address: patientToEdit.address || "",
        medicalHistory: patientToEdit.medicalHistory || "",
        currentMedications: patientToEdit.currentMedications || "",
        allergies: patientToEdit.allergies || "",
        diagnosis: patientToEdit.diagnosis || "",
        physicalExam: patientToEdit.physicalExam || "",
        labResults: patientToEdit.labResults || "",
        nextAppointment: patientToEdit.nextAppointment
          ? new Date(patientToEdit.nextAppointment).toISOString().slice(0, 16)
          : "",
        reason: patientToEdit.reason || "",
      });

      setPrescriptionData({
        medication: patientToEdit.medication || "",
        dosage: patientToEdit.dosage || "",
        instructions: patientToEdit.instructions || "",
      });
    }
  }, [isEditing, patientToEdit]);

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        ...prescriptionData,
        nextAppointment: formData.nextAppointment
          ? new Date(formData.nextAppointment)
          : null,
      };

      if (isEditing) {
        await updatePatient(patientToEdit._id, payload);
        toast.success("Patient updated successfully!");
      } else {
        await createPatient(payload);
        toast.success("Patient created successfully!");
      }

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        phone: "",
        address: "",
        medicalHistory: "",
        currentMedications: "",
        allergies: "",
        diagnosis: "",
        physicalExam: "",
        labResults: "",
        nextAppointment: "",
        reason: "",
      });

      setPrescriptionData({
        medication: "",
        dosage: "",
        instructions: "",
      });

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

      <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update Patient" : "Add New Patient"}
          </DialogTitle>
          <DialogDescription>
            Fill out the form to {isEditing ? "update" : "add"} a patient.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PERSONAL INFO */}
          {["firstName", "lastName", "age", "gender", "phone", "address"].map(
            (field) => (
              <div key={field}>
                <Label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>

                {field === "gender" ? (
                  <select
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <Input
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
            )
          )}

          {/* MEDICAL INFO */}
          {[
            "medicalHistory",
            "currentMedications",
            "allergies",
            "diagnosis",
            "physicalExam",
            "labResults",
          ].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>
                {field.replace(/([A-Z])/g, " $1").toUpperCase()}
              </Label>
              <textarea
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>
          ))}

          {/* PRESCRIPTION */}
          <PrescriptionFields
            prescriptionData={prescriptionData}
            setPrescriptionData={setPrescriptionData}
          />

          {/* NEXT APPOINTMENT */}
          <div>
            <Label htmlFor="nextAppointment">Next Appointment</Label>
            <Input
              id="nextAppointment"
              name="nextAppointment"
              type="datetime-local"
              value={formData.nextAppointment}
              onChange={handleChange}
            />
          </div>

          {/* REASON */}
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

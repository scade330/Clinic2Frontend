import { useState } from "react";
import { createPatient } from "../../lib/patientApi";
import Header from "../Header";

export default function PatientForm() {
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
    // Changed: Replace single string fields with an array structure
    // This array of objects is used ONLY for managing dynamic inputs on the frontend
    prescriptions: [
      { medication: "", dosage: "", instructions: "" } // Start with one empty prescription
    ], 
    nextAppointment: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  // Handles changes for all non-array fields (Personal, Medical, Appointment)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // NEW: Handles changes for medication fields (items in the prescriptions array)
  const handlePrescriptionChange = (index, e) => {
    const newPrescriptions = formData.prescriptions.map((item, i) => {
      if (index === i) {
        // Update the specific property (medication, dosage, or instructions)
        return { ...item, [e.target.name]: e.target.value };
      }
      return item;
    });
    setFormData({ ...formData, prescriptions: newPrescriptions });
  };

  // NEW: Adds a new empty medication object to the prescriptions array
  const addPrescription = () => {
    setFormData({
      ...formData,
      prescriptions: [
        ...formData.prescriptions,
        { medication: "", dosage: "", instructions: "" },
      ],
    });
  };

  // NEW: Removes a medication object from the prescriptions array
  const removePrescription = (index) => {
    const newPrescriptions = formData.prescriptions.filter((_, i) => i !== index);
    setFormData({ ...formData, prescriptions: newPrescriptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Clean and filter the prescriptions array of objects
      const cleanedPrescriptions = formData.prescriptions
        .map(p => ({
            medication: p.medication.trim(),
            dosage: p.dosage.trim(),
            instructions: p.instructions.trim(),
        }))
        // Filter out prescriptions where the medication name is completely empty
        .filter(p => p.medication); 
        
      // 2. CRITICAL: Separate the array of objects into three parallel arrays of strings
      const medicationArray = cleanedPrescriptions.map(p => p.medication || "None"); // Ensure 'None' for non-medication fields
      const dosageArray = cleanedPrescriptions.map(p => p.dosage || "None");
      const instructionsArray = cleanedPrescriptions.map(p => p.instructions || "None");

      // Prepare payload according to schema
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        gender: formData.gender,
        phone: formData.phone.replace(/\D/g, ""), 
        address: formData.address.trim(),
        medicalHistory: formData.medicalHistory.trim() || "None",
        currentMedications: formData.currentMedications.trim() || "None",
        allergies: formData.allergies.trim() || "None",
        diagnosis: formData.diagnosis.trim() || "None",
        physicalExam: formData.physicalExam.trim() || "None",
        labResults: formData.labResults.trim() || "None",
        
        // Use the three parallel arrays for the final payload
        medication: medicationArray, 
        dosage: dosageArray, 
        instructions: instructionsArray, 
        
        nextAppointment: formData.nextAppointment
          ? new Date(formData.nextAppointment)
          : null,
        reason: formData.reason.trim() || "None",
      };

      console.log("Payload sending to API:", payload);

      await createPatient(payload);
      alert("Patient created successfully!");

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
        // Reset prescriptions array
        prescriptions: [{ medication: "", dosage: "", instructions: "" }],
        nextAppointment: "",
        reason: "",
      });
    } catch (error) {
      console.error(
        "Error creating patient:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.error || "Error creating patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
        <form
          className="w-full bg-white shadow-2xl rounded-xl p-8 md:p-12"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-900">
            Create Patient Record
          </h2>

          {/* Personal Info */}
          <div className="mb-10 p-6 border border-blue-100 rounded-xl bg-blue-50">
            <h3 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-blue-300 text-blue-800">
              Personal Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="p-4 border-2 border-gray-400 rounded-lg text-lg font-semibold" />
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="p-4 border-2 border-gray-400 rounded-lg text-lg font-semibold" />
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} min="0" max="120" required className="p-4 border-2 border-gray-400 rounded-lg text-lg font-semibold" />
              <select name="gender" value={formData.gender} onChange={handleChange} required className="p-4 border-2 border-gray-400 rounded-lg text-lg font-semibold bg-white">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input type="text" name="phone" placeholder="Phone Number (7–15 digits)" value={formData.phone} onChange={handleChange} required className="p-4 border-2 border-gray-400 rounded-lg text-lg font-semibold" />
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="p-4 border-2 border-gray-400 rounded-lg text-lg font-semibold" />
            </div>
          </div>

          {/* Medical Info */}
          <div className="mb-10 p-6 border border-green-100 rounded-xl bg-green-50">
            <h3 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-green-300 text-green-800">
              Medical Info
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[{ name: "medicalHistory", placeholder: "Medical History" }, { name: "currentMedications", placeholder: "Current Medications" }, { name: "allergies", placeholder: "Allergies" }, { name: "diagnosis", placeholder: "Diagnosis" }].map((field) => (<textarea key={field.name} name={field.name} placeholder={field.placeholder} value={formData[field.name]} onChange={handleChange} className="p-4 border-2 border-gray-400 rounded-lg h-40 text-lg font-medium" />))}
              <textarea name="physicalExam" placeholder="Physical Examination" value={formData.physicalExam} onChange={handleChange} className="p-4 border-2 border-gray-400 rounded-lg h-40 text-lg font-medium md:col-span-2" />
              <textarea name="labResults" placeholder="Laboratory Results" value={formData.labResults} onChange={handleChange} className="p-4 border-2 border-gray-400 rounded-lg h-40 text-lg font-medium md:col-span-2" />
            </div>
          </div>

          {/* Treatment Plan - DYNAMIC FIELDS */}
          <div className="mb-10 p-6 border border-purple-100 rounded-xl bg-purple-50">
            <h3 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-purple-300 text-purple-800">
              Treatment Plan (Medications)
            </h3>
            
            {/* Map over the prescriptions array to render the fields for each medication */}
            {formData.prescriptions.map((prescription, index) => (
              <div 
                key={index} 
                className="mb-8 p-4 border border-purple-200 rounded-lg shadow-inner bg-white"
              >
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-purple-700">
                        Medication #{index + 1}
                    </h4>
                    {/* Allow removal if there is more than one prescription */}
                    {formData.prescriptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrescription(index)}
                        className="text-red-600 hover:text-red-800 font-bold p-1 transition duration-200"
                        title="Remove Medication"
                      >
                        &#10005; Remove
                      </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input
                    type="text"
                    name="medication"
                    placeholder="Medication Name"
                    value={prescription.medication}
                    onChange={(e) => handlePrescriptionChange(index, e)}
                    className="p-4 border-2 border-gray-400 rounded-lg text-lg font-medium md:col-span-1"
                  />
                  <input
                    type="text"
                    name="dosage"
                    placeholder="Dosage (e.g., 5mg, 1 tablet)"
                    value={prescription.dosage}
                    onChange={(e) => handlePrescriptionChange(index, e)}
                    className="p-4 border-2 border-gray-400 rounded-lg text-lg font-medium md:col-span-1"
                  />
                  <textarea
                    name="instructions"
                    placeholder="Instructions (e.g., Take twice daily with food)"
                    value={prescription.instructions}
                    onChange={(e) => handlePrescriptionChange(index, e)}
                    className="p-4 border-2 border-gray-400 rounded-lg text-lg font-medium h-24 md:col-span-3"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addPrescription}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl transition duration-200"
            >
              + Add Another Medication
            </button>
          </div>
          
          {/* Next Appointment */}
          <div className="mb-10 p-6 border border-yellow-100 rounded-xl bg-yellow-50">
            <h3 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-yellow-300 text-yellow-800">
              Next Appointment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="datetime-local" name="nextAppointment" value={formData.nextAppointment} onChange={handleChange} className="p-4 border-2 border-gray-400 rounded-lg text-lg font-medium" />
              <input type="text" name="reason" placeholder="Reason for Appointment" value={formData.reason} onChange={handleChange} className="p-4 border-2 border-gray-400 rounded-lg text-lg font-medium" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xl py-4 px-4 rounded-xl mt-6 transition duration-300"
          >
            {loading ? "Creating..." : "CREATE PATIENT RECORD"}
          </button>
        </form>
      </div>
    </div>
  );
}
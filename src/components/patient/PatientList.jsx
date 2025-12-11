import React, { useEffect, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PatientDialogForm from "../../components/patient/PatientDialogForm";
import { getAllPatients, deletePatient } from "../../lib/patientApi";

const EditIcon = () => <span role="img" aria-label="edit">✏️</span>;
const DeleteIcon = () => <span role="img" aria-label="delete">🗑️</span>;

const formatDate = (dateString) => {
  if (!dateString) return "None";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "None";
  }
};

const PatientDetailsRow = ({ patient }) => (
  <tr className="bg-gray-50 border-t border-b border-gray-200">
    <td colSpan="7" className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {[
          ["Address", patient.address],
          ["Medical History", patient.medicalHistory],
          ["Current Medications", patient.currentMedications],
          ["Allergies", patient.allergies],
          ["Diagnosis", patient.diagnosis],
          ["Physical Exam", patient.physicalExam],
          ["Lab Results", patient.labResults],
          ["Medication", patient.medication],
          ["Dosage", patient.dosage],
          ["Instructions", patient.instructions],
          ["Next Appointment", patient.nextAppointment ? formatDate(patient.nextAppointment) : "None"],
          ["Reason", patient.reason],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <span className="font-semibold text-gray-700">{label}:</span>
            <span className="text-gray-600 truncate">{value !== undefined && value !== null && value !== "" ? value : "None"}</span>
          </div>
        ))}
      </div>
    </td>
  </tr>
);

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllPatients();
      const data = Array.isArray(response) ? response : response?.patients || [];
      setPatients(data);
    } catch (err) {
      console.error("Failed to load patients:", err);
      toast.error("Failed to load patient data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await deletePatient(id);
      toast.success("Patient deleted successfully!");
      loadPatients();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Deletion failed.");
    }
  };

  const toggleRow = (id) => setExpandedRow(expandedRow === id ? null : id);

  const filteredPatients = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      return (
        fullName.includes(s) ||
        (p.diagnosis || "").toLowerCase().includes(s) ||
        (p.phone || "").toLowerCase().includes(s) ||
        (p.gender || "").toLowerCase().includes(s) ||
        String(p.age || "").toLowerCase().includes(s)
      );
    });
  }, [patients, searchTerm]);

  const downloadCSV = () => {
    if (!filteredPatients || filteredPatients.length === 0) {
      toast.error("No patient data to download.");
      return;
    }

    const headers = [
      "First Name",
      "Last Name",
      "Age",
      "Gender",
      "Phone",
      "Address",
      "Medical History",
      "Current Medications",
      "Allergies",
      "Diagnosis",
      "Physical Exam",
      "Lab Results",
      "Medication",
      "Dosage",
      "Instructions",
      "Next Appointment",
      "Reason",
    ];

    const rows = filteredPatients.map((p) => [
      p.firstName || "None",
      p.lastName || "None",
      p.age || "None",
      p.gender || "None",
      p.phone || "None",
      p.address || "None",
      p.medicalHistory || "None",
      p.currentMedications || "None",
      p.allergies || "None",
      p.diagnosis || "None",
      p.physicalExam || "None",
      p.labResults || "None",
      p.medication || "None",
      p.dosage || "None",
      p.instructions || "None",
      p.nextAppointment ? formatDate(p.nextAppointment) : "None",
      p.reason || "None",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "patients_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border overflow-hidden p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">🏥 Patient Directory</h1>

        <div className="flex gap-3">
          <button
            onClick={downloadCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            ⬇ Download CSV
          </button>

          <button
            onClick={() => navigate("/create")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            + Add Patient
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name, diagnosis, phone, gender, age..."
        className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="max-h-[70vh] overflow-y-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-blue-50 text-gray-600 uppercase text-sm sticky top-0 z-10 shadow-md">
            <tr>
              <th className="p-3 border-b border-gray-200">#</th>
              <th className="p-3 border-b border-gray-200">Name</th>
              <th className="p-3 border-b border-gray-200">Age</th>
              <th className="p-3 border-b border-gray-200">Gender</th>
              <th className="p-3 border-b border-gray-200">Phone</th>
              <th className="p-3 border-b border-gray-200 text-center">Details</th>
              <th className="p-3 border-b border-gray-200 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-5 text-center text-blue-500 font-medium">
                  Loading patients...
                </td>
              </tr>
            )}

            {!loading && filteredPatients.length === 0 && (
              <tr>
                <td colSpan={7} className="p-5 text-center text-gray-500">
                  No patients found.
                </td>
              </tr>
            )}

            {!loading &&
              filteredPatients.map((p, index) => (
                <React.Fragment key={p._id}>
                  <tr
                    className="hover:bg-gray-50 transition border-b border-gray-100 cursor-pointer"
                    onClick={() => toggleRow(p._id)}
                  >
                    <td className="p-3 text-sm font-medium text-gray-500">{index + 1}</td>
                    <td className="p-3 font-medium">{p.firstName} {p.lastName}</td>
                    <td className="p-3 text-sm">{p.age}</td>
                    <td className="p-3 text-sm">{p.gender}</td>
                    <td className="p-3">{p.phone}</td>
                    <td className="p-3 text-center">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                        {expandedRow === p._id ? "▲ Hide" : "▼ Show"}
                      </button>
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <PatientDialogForm
                        patientToEdit={p}
                        buttonTitle={<EditIcon />}
                        onSuccess={loadPatients}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p._id);
                        }}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>

                  {expandedRow === p._id && <PatientDetailsRow patient={p} />}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getAllPatients, deletePatient } from "../../lib/patientApi";
import { useNavigate } from "react-router-dom";
import PatientDialogForm from "./PatientDialogForm";

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="font-semibold">{label}:</span>
    <span>{value || "N/A"}</span>
  </div>
);

const PatientDetailsRow = ({ patient }) => (
  <tr className="bg-gray-50 border-t">
    <td colSpan={7} className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <DetailItem label="Address" value={patient.address} />
        <DetailItem label="Medical History" value={patient.medicalHistory} />
        <DetailItem label="Current Medications" value={patient.currentMedications} />
        <DetailItem label="Allergies" value={patient.allergies} />
        <DetailItem label="Physical Exam" value={patient.physicalExam} />
        <DetailItem label="Lab Results" value={patient.labResults} />
        <DetailItem label="Diagnosis" value={patient.diagnosis} />
        <DetailItem label="Treatment Plan" value={patient.treatmentPlan} />
        <DetailItem label="Next Appointment" value={patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleString() : "None"} />
        <DetailItem label="Reason for Visit" value={patient.reason} />
      </div>
    </td>
  </tr>
);

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (err) {
      console.error("Failed to load patients:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await deletePatient(id);
      loadPatients();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const toggleRow = (id) => setExpandedRow(expandedRow === id ? null : id);

  const filtered = patients.filter(p =>
    `${p.firstName} ${p.lastName} ${p.phone} ${p.diagnosis}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🏥 Patient Directory</h1>
        <button
          onClick={() => navigate("/create")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Patient
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by Name, Phone, or Diagnosis..."
        className="w-full px-4 py-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto shadow rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white sticky top-0">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Age</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Details</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No patients found.
                </td>
              </tr>
            )}

            {filtered.map((p, idx) => (
              <tbody key={p._id}>
                <tr
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => toggleRow(p._id)}
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{p.firstName} {p.lastName}</td>
                  <td className="p-3">{p.age}</td>
                  <td className="p-3">{p.gender}</td>
                  <td className="p-3">{p.phone}</td>
                  <td className="p-3 text-center">
                    {expandedRow === p._id ? "▲ Hide" : "▼ Show"}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <PatientDialogForm patientToEdit={p} onSuccess={loadPatients} buttonTitle="Edit" />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {expandedRow === p._id && <PatientDetailsRow patient={p} />}
              </tbody>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

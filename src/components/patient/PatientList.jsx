import React, { useEffect, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react"; // Using Lucide for the transfer icon
import PatientDialogForm from "../../components/patient/PatientDialogForm";
import { getAllPatients, deletePatient } from "../../lib/patientApi";

const EditIcon = () => <span role="img" aria-label="edit">✏️</span>;
const DeleteIcon = () => <span role="img" aria-label="delete">🗑️</span>;

const formatDate = (dateString) => {
  if (!dateString) return "None";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "None";
  }
};

// --- Expanded row details ---
const PatientDetailsRow = ({ patient }) => (
  <tr className="bg-gray-50 border-t border-b border-gray-200">
    <td colSpan="7" className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {[
          ["Region", patient.region || "None"],
          ["District", patient.district || "None"],
          ["Address", patient.address || "None"],
          ["Medical History", patient.medicalHistory || "None"],
          ["Current Medications", patient.currentMedications || "None"],
          ["Allergies", patient.allergies || "None"],
          ["Diagnosis", patient.diagnosis || "None"],
          ["Physical Exam", patient.physicalExam || "None"],
          ["Lab Results", patient.labResults || "None"],
          [
            "Treatment Plan",
            Array.isArray(patient.treatmentPlan)
              ? patient.treatmentPlan.map((t, idx) => `${idx + 1}. ${t.medication || ""} (${t.dosage || ""})`).join("\n")
              : "None",
          ],
          [
            "Instructions",
            Array.isArray(patient.treatmentPlan)
              ? patient.treatmentPlan.map((t, idx) => `${idx + 1}. ${t.instructions || ""}`).join("\n")
              : "None",
          ],
          ["Next Appointment", patient.nextAppointment ? formatDate(patient.nextAppointment) : "None"],
          ["Reason", patient.reason || "None"],
          [
            "Vaccinations",
            Array.isArray(patient.vaccinations) && patient.vaccinations.length
              ? patient.vaccinations.map((v, idx) => `${idx + 1}. ${v.vaccineName || ""} (${v.dateGiven ? formatDate(v.dateGiven) : "N/A"})`).join("\n")
              : "None",
          ],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <span className="font-semibold text-gray-700">{label}:</span>
            <span className="text-gray-600 break-words whitespace-pre-line">{value}</span>
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
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  // --- Load patients ---
  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllPatients();
      const patientArray = Array.isArray(data) ? data : Array.isArray(data.patients) ? data.patients : [];
      setPatients(patientArray);
    } catch {
      toast.error("Failed to load patient data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  // --- Delete patient ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await deletePatient(id);
      toast.success("Patient deleted successfully!");
      loadPatients();
    } catch {
      toast.error("Deletion failed.");
    }
  };

  const toggleRow = (id) => setExpandedRow(expandedRow === id ? null : id);

  // --- Search filtering ---
  const filteredPatients = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return patients.filter((p) => {
      const fullName = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();
      const treatments = Array.isArray(p.treatmentPlan)
        ? p.treatmentPlan.map((t) => `${t.medication || ""} ${t.dosage || ""}`).join(" ")
        : "";
      const vaccinationStr = Array.isArray(p.vaccinations)
        ? p.vaccinations.map((v) => v.vaccineName || "").join(" ").toLowerCase()
        : "";
      return (
        fullName.includes(s) ||
        (p.diagnosis || "").toLowerCase().includes(s) ||
        (p.phone || "").toLowerCase().includes(s) ||
        (p.gender || "").toLowerCase().includes(s) ||
        (p.region || "").toLowerCase().includes(s) ||
        (p.district || "").toLowerCase().includes(s) ||
        String(p.age ?? "").toLowerCase().includes(s) ||
        treatments.toLowerCase().includes(s) ||
        vaccinationStr.includes(s)
      );
    });
  }, [patients, searchTerm]);

  // --- CSV export ---
  const downloadCSV = () => {
    if (!filteredPatients.length) return toast.error("No patient data to download.");
    const headers = [
      "First Name","Last Name","Age","Gender","Phone","Region","District","Address",
      "Medical History","Current Medications","Allergies","Diagnosis","Physical Exam","Lab Results",
      "Treatment Plan","Instructions","Next Appointment","Reason","Vaccinations"
    ];

    const rows = filteredPatients.map((p) => [
      p.firstName || "None",
      p.lastName || "None",
      p.age ?? "None",
      p.gender || "None",
      p.phone || "None",
      p.region || "None",
      p.district || "None",
      p.address || "None",
      p.medicalHistory || "None",
      p.currentMedications || "None",
      p.allergies || "None",
      p.diagnosis || "None",
      p.physicalExam || "None",
      p.labResults || "None",
      Array.isArray(p.treatmentPlan) ? p.treatmentPlan.map((t) => `${t.medication || ""} (${t.dosage || ""})`).join("; ") : "None",
      Array.isArray(p.treatmentPlan) ? p.treatmentPlan.map((t) => t.instructions || "").join("; ") : "None",
      p.nextAppointment ? formatDate(p.nextAppointment) : "None",
      p.reason || "None",
      Array.isArray(p.vaccinations) ? p.vaccinations.map((v) => `${v.vaccineName} (${v.dateGiven ? formatDate(v.dateGiven) : "N/A"})`).join("; ") : "None"
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.setAttribute("download", "patients_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Print single patient ---
  const printPatient = (patient) => {
    if (!patient) return toast.error("No patient selected for printing.");
    const printWindow = window.open("", "_blank", "width=800,height=600");
    const content = `
      <html><head><title>Patient Record</title></head><body>
      <h1>Patient Record</h1>
      <p><strong>Name:</strong> ${patient.firstName} ${patient.lastName}</p>
      <p><strong>Age:</strong> ${patient.age}</p>
      <p><strong>Gender:</strong> ${patient.gender}</p>
      <p><strong>Phone:</strong> ${patient.phone}</p>
      <p><strong>Region:</strong> ${patient.region}</p>
      <p><strong>District:</strong> ${patient.district}</p>
      <p><strong>Address:</strong> ${patient.address}</p>
      <p><strong>Medical History:</strong> ${patient.medicalHistory}</p>
      <p><strong>Current Medications:</strong> ${patient.currentMedications}</p>
      <p><strong>Allergies:</strong> ${patient.allergies}</p>
      <p><strong>Diagnosis:</strong> ${patient.diagnosis}</p>
      <p><strong>Physical Exam:</strong> ${patient.physicalExam}</p>
      <p><strong>Lab Results:</strong> ${patient.labResults}</p>
      <p><strong>Treatment Plan:</strong> ${
        Array.isArray(patient.treatmentPlan) ? patient.treatmentPlan.map((t) => `${t.medication} (${t.dosage})`).join("; ") : "None"
      }</p>
      <p><strong>Instructions:</strong> ${
        Array.isArray(patient.treatmentPlan) ? patient.treatmentPlan.map((t) => t.instructions).join("; ") : "None"
      }</p>
      <p><strong>Next Appointment:</strong> ${patient.nextAppointment ? formatDate(patient.nextAppointment) : "None"}</p>
      <p><strong>Reason:</strong> ${patient.reason}</p>
      <p><strong>Vaccinations:</strong> ${
        Array.isArray(patient.vaccinations) ? patient.vaccinations.map((v) => `${v.vaccineName} (${v.dateGiven ? formatDate(v.dateGiven) : "N/A"})`).join("; ") : "None"
      }</p>
      </body></html>`;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // --- Print all patients ---
  const printAllPatients = () => {
    if (!filteredPatients.length) return toast.error("No patient data to print.");
    const printWindow = window.open("", "_blank", "width=1000,height=800");

    const rowsHtml = filteredPatients.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${p.firstName} ${p.lastName}</td>
        <td>${p.age ?? ""}</td>
        <td>${p.gender ?? ""}</td>
        <td>${p.phone ?? ""}</td>
        <td>${p.region ?? ""}</td>
        <td>${p.district ?? ""}</td>
        <td>${p.diagnosis ?? ""}</td>
        <td>${Array.isArray(p.treatmentPlan) ? p.treatmentPlan.map((t) => `${t.medication} (${t.dosage})`).join("; ") : ""}</td>
        <td>${Array.isArray(p.vaccinations) ? p.vaccinations.map((v) => `${v.vaccineName} (${v.dateGiven ? formatDate(v.dateGiven) : "N/A"})`).join("; ") : ""}</td>
      </tr>`).join("");

    const content = `
      <html>
        <head>
          <title>All Patients</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
            th { background: #f0f0f0; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>All Patients</h1>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Region</th>
                <th>District</th>
                <th>Diagnosis</th>
                <th>Treatment Plan</th>
                <th>Vaccinations</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border overflow-hidden p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">🏥 Patient Directory</h1>
        <div className="flex gap-3">
          {/* NEW TRANSFER PORTAL BUTTON */}
          <button onClick={() => navigate("/transfer")} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2">
            <Send size={18} /> Referral Portal
          </button>
          
          <button onClick={downloadCSV} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">⬇ Download CSV</button>
          <button onClick={printAllPatients} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">🖨 Print All Patients</button>
          <button onClick={() => navigate("/create")} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">+ Add Patient</button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name, diagnosis, phone, gender, age, region, district, medication, vaccination..."
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
                <td colSpan={7} className="p-5 text-center text-blue-500 font-medium">Loading patients...</td>
              </tr>
            )}
            {!loading && filteredPatients.length === 0 && (
              <tr>
                <td colSpan={7} className="p-5 text-center text-gray-500">No patients found.</td>
              </tr>
            )}
            {!loading && filteredPatients.map((p, i) => (
              <React.Fragment key={p._id}>
                <tr className="hover:bg-gray-50 transition border-b border-gray-100 cursor-pointer" onClick={() => { toggleRow(p._id); setSelectedPatient(p); }}>
                  <td className="p-3 text-sm font-medium text-gray-500">{i + 1}</td>
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
                    {/* NEW PER-PATIENT TRANSFER ICON */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate("/transfer"); }} 
                      className="text-emerald-600 hover:text-emerald-800 p-1 rounded"
                      title="Transfer Patient"
                    >
                      <Send size={18} />
                    </button>

                    <PatientDialogForm patientToEdit={p} buttonTitle={<EditIcon />} onSuccess={loadPatients} />
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }} className="text-red-600 hover:text-red-800 p-1 rounded"><DeleteIcon /></button>
                    <button onClick={(e) => { e.stopPropagation(); printPatient(p); }} className="text-yellow-600 hover:text-yellow-800 p-1 rounded">🖨</button>
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
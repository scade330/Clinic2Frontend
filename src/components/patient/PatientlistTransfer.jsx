import React, { useEffect, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import { 
  Search, Trash2, Send, FileText, Phone, X, 
  MapPin, Download, Filter, ChevronDown, ChevronUp, Activity, ClipboardList
} from "lucide-react";
import PatientDialogForm from "../../components/patient/PatientDialogForm";
import { getAllPatients, deletePatient } from "../../lib/patientApi";

const statusColors = {
  Critical: "bg-red-100 text-red-700 border-red-500",
  "Under Observation": "bg-yellow-100 text-yellow-700 border-yellow-500",
};

export default function PatientlistTransfer() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newNumber, setNewNumber] = useState("");
  const [savedNumbers, setSavedNumbers] = useState(() => {
    const stored = localStorage.getItem("savedNumbers");
    return stored ? JSON.parse(stored) : ["+252 615 000000"]; 
  });
  const [expandedPatient, setExpandedPatient] = useState(null);

  const loadPatients = useCallback(async () => {
    const data = await getAllPatients();
    setPatients(Array.isArray(data) ? data : data?.patients || []);
  }, []);

  useEffect(() => { loadPatients(); }, [loadPatients]);

  const filteredPatients = useMemo(() => {
    return patients
      .filter(p => `${p.firstName} ${p.lastName} ${p.phone} ${p.diagnosis}`.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => (a.status === "Critical" ? -1 : 1));
  }, [patients, searchTerm]);

  const formatValue = (val) => {
    if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : "None Recorded";
    if (!val || val === "null") return "N/A";
    return val;
  };

  // --- PDF GENERATION & WHATSAPP REDIRECT ---
  const sendToWhatsApp = () => {
    if (!recipientPhone) return toast.error("Select recipient");
    const phone = recipientPhone.replace(/\D/g, "");
    const doc = new jsPDF();
    
    doc.setFontSize(18).setFont("helvetica", "bold").text("MEDICAL REFERRAL FORM", 20, 20);
    doc.setLineWidth(0.5).line(20, 22, 190, 22);

    const fields = [
      ["Patient ID", selectedPatient._id],
      ["Full Name", `${selectedPatient.firstName} ${selectedPatient.lastName}`],
      ["Demographics", `${selectedPatient.age}Y / ${selectedPatient.gender}`],
      ["Contact", selectedPatient.phone],
      ["Address", `${selectedPatient.address}, ${selectedPatient.district}, ${selectedPatient.region}`],
      ["Provider", selectedPatient.healthProviderType],
      ["Medical History", selectedPatient.medicalHistory],
      ["Allergies", selectedPatient.allergies],
      ["Current Meds", selectedPatient.currentMedications],
      ["Diagnosis", selectedPatient.diagnosis],
      ["Physical Exam", selectedPatient.physicalExam],
      ["Lab Results", selectedPatient.labResults],
      ["Vaccinations", formatValue(selectedPatient.vaccinations)],
      ["Treatment Plan", formatValue(selectedPatient.treatmentPlan)],
      ["Next Appointment", selectedPatient.nextAppointment],
      ["Referral Reason", selectedPatient.reason]
    ];

    let y = 35;
    doc.setFontSize(10);
    fields.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold").text(`${label}:`, 20, y);
      const textVal = formatValue(value);
      const splitText = doc.splitTextToSize(textVal, 130);
      doc.setFont("helvetica", "normal").text(splitText, 60, y);
      y += (splitText.length * 6) + 2;
      if (y > 275) { doc.addPage(); y = 20; }
    });

    doc.save(`Referral_${selectedPatient.lastName}.pdf`);
    
    const msg = `*REFERRAL NOTICE*\nPatient: ${selectedPatient.firstName} ${selectedPatient.lastName}\nDiagnosis: ${selectedPatient.diagnosis}\n\nPDF downloaded. Attaching now...`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    setShowDialog(false);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this patient record?")) {
      await deletePatient(id);
      toast.success("Record deleted");
      loadPatients();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans text-gray-900">
      {/* Search Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl font-black mb-4 flex items-center gap-2">
          <Activity className="text-emerald-600" /> PATIENT TRANSFER PORTAL
        </h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, diagnosis, or phone..." 
            className="w-full p-4 pl-12 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Patient Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(p => (
          <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
            <div 
              className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedPatient(expandedPatient === p._id ? null : p._id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black">
                  {p.firstName[0]}{p.lastName[0]}
                </div>
                <div>
                  <h2 className="font-bold text-lg">{p.firstName} {p.lastName}</h2>
                  <p className="text-sm text-gray-500">{p.phone}</p>
                </div>
              </div>
              {expandedPatient === p._id ? <ChevronUp /> : <ChevronDown />}
            </div>

            {expandedPatient === p._id && (
              <div className="px-5 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2">
                <hr />
                {/* Clinical Overview Block */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div><p className="text-gray-500 font-bold uppercase text-[10px]">Diagnosis</p><p className="font-semibold text-red-600">{p.diagnosis || "Pending"}</p></div>
                   <div><p className="text-gray-500 font-bold uppercase text-[10px]">District</p><p className="font-semibold">{p.district}</p></div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="font-bold flex items-center gap-2 mb-1"><ClipboardList size={14}/> Physical Exam</p>
                    <p className="text-gray-600 leading-relaxed">{p.physicalExam || "No details provided"}</p>
                  </div>

                  <div><p className="font-bold text-gray-700">Medical History:</p><p className="text-gray-600">{p.medicalHistory || "None"}</p></div>
                  <div><p className="font-bold text-gray-700">Lab Results:</p><p className="text-gray-600">{p.labResults || "N/A"}</p></div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1"><p className="font-bold text-gray-700">Vaccinations:</p><p className="text-gray-600">{formatValue(p.vaccinations)}</p></div>
                    <div className="flex-1"><p className="font-bold text-gray-700">Treatments:</p><p className="text-gray-600">{formatValue(p.treatmentPlan)}</p></div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => { setSelectedPatient(p); setShowDialog(true); }}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-sm transition"
                  >
                    <Send size={16} /> REFERRAL
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Referral Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Process Referral</h3>
              <button onClick={() => setShowDialog(false)}><X /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Recipient Hospital/Doctor</label>
                <select 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 outline-none font-semibold"
                  value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)}
                >
                  <option value="">Choose Contact...</option>
                  {savedNumbers.map((n, i) => <option key={i} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="flex gap-2">
                <input 
                  placeholder="New phone +252..." className="flex-1 p-3 border rounded-xl"
                  value={newNumber} onChange={(e) => setNewNumber(e.target.value)}
                />
                <button onClick={() => { if(newNumber) { setSavedNumbers([...new Set([...savedNumbers, newNumber])]); setRecipientPhone(newNumber); setNewNumber(""); }}} className="bg-gray-800 text-white px-4 rounded-xl font-bold">ADD</button>
              </div>

              <button 
                onClick={sendToWhatsApp}
                className="w-full py-5 bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg hover:bg-emerald-700 transition"
              >
                SEND VIA WHATSAPP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
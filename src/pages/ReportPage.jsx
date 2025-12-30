import React, { useEffect, useState } from "react";
import { getAllPatients } from "../lib/patientApi";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6384"];

const Reports = () => {
  const [patients, setPatients] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPatients();
        if (data?.patients) {
          setPatients(data.patients);

          // --- Gender Distribution ---
          const genderCount = data.patients.reduce((acc, p) => {
            const gender = p.gender || "Unknown";
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
          }, {});
          setGenderData(Object.entries(genderCount).map(([key, value]) => ({ name: key, value })));

          // --- Diagnosis Distribution ---
          const diagnosisCount = data.patients.reduce((acc, p) => {
            const diag = p.diagnosis || "Unknown";
            acc[diag] = (acc[diag] || 0) + 1;
            return acc;
          }, {});
          setDiagnosisData(Object.entries(diagnosisCount).map(([key, value]) => ({ name: key, value })));
        }
      } catch (err) {
        console.error("Failed to fetch patient data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Gender Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4">Gender Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={genderData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Diagnosis Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4">Diagnosis Distribution</h3>
          <BarChart
            width={500}
            height={300}
            data={diagnosisData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-30} textAnchor="end"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

      </div>
    </div>
  );
};

export default Reports;

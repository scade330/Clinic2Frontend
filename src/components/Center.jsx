import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllPatients } from "../lib/patientApi"; // make sure path is correct
import { useUser } from "../hooks/useUser";

const HomePage = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { user, logout } = useUser(); // useUser hook
  const [openSidebar, setOpenSidebar] = useState(false);

  const [totalPatients, setTotalPatients] = useState(0);
  const [appointmentsToday, setAppointmentsToday] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch patients and calculate metrics
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getAllPatients(); // GET /api/patientsClinic3/
        if (data?.patients) {
          setTotalPatients(data.patients.length);

          const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
          const countToday = data.patients.filter((p) => {
            if (!p.nextAppointment) return false;
            const apptDate = new Date(p.nextAppointment)
              .toISOString()
              .split("T")[0];
            return apptDate === today;
          }).length;

          setAppointmentsToday(countToday);
        }
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };
    fetchPatients();
  }, []);

  // Sidebar primary modules
  const primaryModules = [
    {
      to: "/appointment",
      title: "Follow-up",
      subtitle: "Schedule & View Bookings",
      icon: "🗓️",
      color: "from-indigo-600 to-indigo-800 hover:to-indigo-900",
      shadow: "shadow-indigo-500/50",
    },
    {
      to: "/patients",
      title: "Patient Records",
      subtitle: "Access Medical History & Vitals",
      icon: "🧑",
      color: "from-emerald-600 to-teal-600 hover:to-teal-700",
      shadow: "shadow-emerald-500/50",
    },
  ];

  const NavLink = ({ to, icon, label }) => (
    <Link
      to={to}
      className="flex items-center gap-4 p-3 rounded-xl text-gray-300 hover:bg-indigo-700 hover:text-white transition-all duration-200 group relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
      <span className="text-2xl ml-1 group-hover:scale-110 transition">{icon}</span>
      <span className="font-semibold text-lg">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar & toggle */}
      <button
        onClick={() => setOpenSidebar(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
      >
        <span className="text-xl">☰</span>
      </button>

      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-gray-100 p-6 shadow-2xl shadow-gray-900/50 transform transition-transform duration-300 z-40 flex flex-col ${
          openSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-3xl font-black text-indigo-400 mb-10 border-b-2 border-emerald-400 pb-4 tracking-wider">
          <span className="text-white">Kalkaal</span>{" "}
          <span className="font-light text-emerald-400">MED</span>
        </h2>

        <nav className="space-y-2 flex-grow">
          <NavLink to="#" icon="🏠" label="Dashboard" />
          {primaryModules.map((item) => (
            <NavLink to={item.to} icon={item.icon} label={item.title} key={item.to} />
          ))}
          <NavLink to="/report" icon="📊" label="Reports & Analytics" />
          <NavLink to="#" icon="⚙️" label="Settings" />
        </nav>

        <div className="mt-auto text-xs text-gray-400 pt-8 border-t border-gray-700">
          <p className="font-semibold text-sm text-indigo-400">Sahlan Medical System</p>
          <p className="mt-1">© {currentYear} All rights reserved.</p>
        </div>

        <button
          onClick={() => setOpenSidebar(false)}
          className="md:hidden mt-6 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg w-full font-semibold transition"
        >
          Close Menu
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="w-full bg-white shadow-xl p-5 sticky top-0 z-20">
          <div className="flex justify-between items-center px-4 md:px-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Welcome, {user?.username || "Administrator"}
            </h1>
            <button
              onClick={logout} // use logout from useUser
              className="px-4 py-2 text-sm font-bold rounded-full bg-red-600 text-white shadow-lg shadow-red-500/50 hover:bg-red-700 transition transform hover:scale-[1.05]"
            >
              LOGOUT
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-300">
            Key Metrics Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Total Patients */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-indigo-500 transform hover:shadow-2xl hover:translate-y-[-3px] transition duration-300">
              <p className="text-sm font-semibold text-indigo-600 mb-2 flex items-center gap-2 tracking-wider">
                <span className="text-xl">🧑‍⚕️</span> TOTAL PATIENTS
              </p>
              <p className="text-5xl font-extrabold text-gray-900 leading-none mt-2">
                {totalPatients.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-3 border-t pt-2">
                Total records in the system.
              </p>
            </div>

            {/* Appointments Today */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-emerald-500 transform hover:shadow-2xl hover:translate-y-[-3px] transition duration-300">
              <p className="text-sm font-semibold text-emerald-600 mb-2 flex items-center gap-2 tracking-wider">
                <span className="text-xl">🗓️</span> Follow-up TODAY
              </p>
              <p className="text-5xl font-extrabold text-gray-900 leading-none mt-2">
                {appointmentsToday}
              </p>
              <p className="text-xs text-gray-500 mt-3 border-t pt-2">
                Confirmed and scheduled appointments.
              </p>
            </div>
          </div>
        </main>

        <footer className="w-full bg-gray-900 text-gray-400 py-4 text-sm shadow-inner mt-auto">
          <div className="flex flex-col md:flex-row justify-between px-4 md:px-8 gap-2 md:gap-0">
            <span className="text-center md:text-left">
              Sahlan Medical System — Version 2.2.0
            </span>
            <span className="text-center md:text-right">© {currentYear} All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;

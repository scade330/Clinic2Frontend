import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { Button } from "./ui/button";

export default function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* 🔵 HEADER */}
      <header className="w-full bg-white text-gray-800 border-b-4 border-blue-500/10 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">

          {/* Clinic Name */}
          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-800 tracking-tighter">
            Kalkaal <span className="text-blue-500 font-extralight">CLINIC</span>
          </div>

          {/* Show button only if logged in (optional) */}
          {user && (
            <Button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg hidden sm:block"
            >
              Logout
            </Button>
          )}
        </div>
      </header>

      {/* Only show home content on "/" */}
      {location.pathname === "/" && (
        <main className="bg-white">

          {/* 🔵 HERO SECTION */}
          <section className="bg-gradient-to-tr from-blue-50 to-white py-20 md:py-32 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 items-center gap-12 md:gap-16">

              {/* LEFT SIDE */}
              <div className="space-y-6 text-center lg:text-left lg:col-span-7">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black text-gray-900 leading-tight">
                  <span className="text-blue-700 block">The Future</span>
                  of Health is Personal.
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed">
                  <strong>Sahlan Clinic</strong> focuses on precision diagnostics,
                  proactive wellness, and a clinical experience designed around you.
                </p>

                <Button
                  onClick={() => navigate("/login")}
                  className="
                    mt-8
                    bg-blue-700
                    hover:bg-red-600
                    text-white
                    px-10 sm:px-14 md:px-16 py-4
                    rounded-full
                    text-lg sm:text-xl md:text-2xl
                    font-black
                    uppercase tracking-widest
                    transition duration-500
                    shadow-xl
                    hover:shadow-[0_10px_20px_rgba(255,0,0,0.5)]
                    hover:-translate-y-1
                  "
                >
                  Clinic Management System
                </Button>
              </div>

              {/* RIGHT SIDE IMAGE */}
              <div className="hidden lg:block lg:col-span-5">
                <div className="w-full h-[350px] md:h-[450px] bg-blue-200/40 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white">
                  <img
                    src="https://ebmedical.ca/wp-content/uploads/2023/11/eb-medical-clinic-dougall-rd-0017-scaled.jpg"
                    alt="Medical clinic"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 🔵 SERVICES SECTION */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900">
                Our <span className="text-blue-700">Expert Services</span>
              </h2>

              <p className="text-lg sm:text-xl text-center max-w-3xl mx-auto text-gray-600">
                Our departments work together to deliver seamless and holistic healthcare.
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

                {/* CARD 1 */}
                <div className="space-y-4 p-6 sm:p-8 rounded-2xl bg-white shadow-2xl border-t-4 border-blue-600 hover:scale-105 transition">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">PRIMARY CARE</div>
                  <p className="text-gray-600">
                    Regular check-ups, condition management, and personalized health planning.
                  </p>
                 
                </div>

                {/* CARD 2 */}
                <div className="space-y-4 p-6 sm:p-8 rounded-2xl bg-white shadow-2xl border-t-4 border-blue-600 hover:scale-105 transition">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">DIAGNOSTICS</div>
                  <p className="text-gray-600">
                    Advanced labs and imaging for fast, accurate assessments.
                  </p>
                 
                </div>

                {/* CARD 3 */}
                <div className="space-y-4 p-6 sm:p-8 rounded-2xl bg-white shadow-2xl border-t-4 border-blue-600 hover:scale-105 transition">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">WELLNESS</div>
                  <p className="text-gray-600">
                    Preventative care, nutrition guidance, and lifestyle planning.
                  </p>
          
                </div>
              </div>
            </div>
          </section>

          {/* 🔵 TESTIMONIAL SECTION */}
          <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
                A Reputation Built on <span className="text-blue-700">Trust</span>
              </h2>

              <blockquote className="bg-blue-50 p-8 sm:p-10 rounded-2xl shadow-inner border-l-8 border-blue-600">
                <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-gray-800">
                  "The doctors here offer unmatched professionalism and care. Truly exceptional."
                </p>
              </blockquote>
            </div>
          </section>

          {/* 🔵 FINAL CTA */}
          <section className="py-16 bg-blue-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center text-white space-y-6 md:space-y-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide">
                Secure Your Health Consultation Today.
              </h2>
            </div>
          </section>

        </main>
      )}
    </>
  );
}

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/center");
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/user/login-user", formData, {
        withCredentials: true, // cookies enabled
      });

      toast.success("Successfully logged in!");
      login(data.user || data); // store user in context
      navigate("/center");
    } catch (err) {
      if (err.response) {
        toast.error(err.response?.data?.message || "Login failed");
        console.error("Backend error:", err.response);
      } else if (err.request) {
        toast.error("No response from server");
        console.error("No response:", err.request);
      } else {
        toast.error("Login error");
        console.error("Error:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-red-900 px-6">
      <div className="flex flex-col md:flex-row w-full max-w-7xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden shadow-neon-pink">
        
        <div className="md:w-1/2 bg-gradient-to-br from-purple-700 via-pink-600 to-red-600 p-16 flex flex-col justify-center text-white space-y-4">
          <h1 className="text-6xl font-extrabold mb-4 drop-shadow-2xl">
            Welcome Back!
          </h1>
          <p className="text-xl text-white/90 font-light">
            Login to access your dashboard and manage resources efficiently. 
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/intro")}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-700 transition duration-300 py-3 px-8 text-lg rounded-full"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="md:w-1/2 p-16 flex items-center justify-center">
          <Card className="w-full max-w-md bg-gradient-to-br from-white/95 to-white/90 rounded-3xl shadow-3xl p-10 transform hover:scale-[1.02] transition-transform duration-500">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-extrabold text-indigo-800">
                Secure Login 🔒
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-8 mt-6">
                  <div className="flex flex-col space-y-3">
                    <Label htmlFor="email" className="text-lg font-semibold text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g., agent@example.com"
                      onChange={handleInputChange}
                      className="rounded-xl px-5 py-3 text-lg border-2 border-gray-300 focus:border-pink-500 transition duration-300"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-3">
                    <Label htmlFor="password" className="text-lg font-semibold text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter secret code"
                      onChange={handleInputChange}
                      className="rounded-xl px-5 py-3 text-lg border-2 border-gray-300 focus:border-pink-500 transition duration-300"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-pink-500/50 hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] transition-all duration-300 text-xl tracking-wider uppercase"
                  >
                    {loading ? "Initializing..." : "Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

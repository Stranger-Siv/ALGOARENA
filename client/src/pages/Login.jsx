import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/users/login", { email, password }, { withCredentials: true });
      const role = res.data.user.role;
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4">
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/10">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-[#00F260] to-[#0575E6] bg-clip-text text-transparent">
          Login
        </h2>
        <p className="text-center text-gray-300 mt-2 mb-6">Enter the Arena</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00F260]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00F260]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#00F260] hover:bg-[#00c154] text-black py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#00F260] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;

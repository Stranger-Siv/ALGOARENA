import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/users/register", form, { withCredentials: true });
      const role = res.data.user.role;
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4">
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/10">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-[#00F260] to-[#0575E6] bg-clip-text text-transparent">
          Register
        </h2>
        <p className="text-center text-gray-300 mt-2 mb-6">Join the Dev Arena</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00F260]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00F260]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00F260]"
            required
          />
          <select
            name="role"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F260]"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full bg-[#00F260] hover:bg-[#00c154] text-black py-3 rounded-lg font-semibold transition"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-[#00F260] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Register;

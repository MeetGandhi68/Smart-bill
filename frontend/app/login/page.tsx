"use client";

import { useState } from "react";

import axios from "axios";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://name-smartbill-backend.onrender.com/api/auth/login",
        {
          email,
          password,
        },
      );

      console.log(response.data);

      localStorage.setItem("token", response.data.token);

      alert("Login successful");

      router.push("/dashboard");
    } catch (error: any) {
      console.log(error);

      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-5">
      <div className="rounded-3xl p-6 md:p-8 bg-[#111827] border border-gray-800 shadow-xl text-white overflow-x-auto">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          SmartBill AI
        </h1>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border text-white rounded-xl px-4 py-3 outline-none focus:border-orange-500 hover:scale-105 transition-all duration-200"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border text-white rounded-xl px-4 py-3 outline-none focus:border-orange-500 hover:scale-105 transition-all duration-200"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200 py-3 rounded-xl font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

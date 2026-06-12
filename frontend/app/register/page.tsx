"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://name-smartbill-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Account created successfully!");
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-5">
      <div className="rounded-3xl p-6 md:p-8 bg-[#111827] border border-gray-800 shadow-xl text-white w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          SmartBill AI
        </h1>

        <p className="text-center text-gray-400 mb-8">Create Your Account</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-700 bg-transparent text-white rounded-xl px-4 py-3 outline-none focus:border-orange-500 hover:scale-105 transition-all duration-200"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-700 bg-transparent text-white rounded-xl px-4 py-3 outline-none focus:border-orange-500 hover:scale-105 transition-all duration-200"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border border-gray-700 bg-transparent text-white rounded-xl px-4 py-3 outline-none focus:border-orange-500 hover:scale-105 transition-all duration-200"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200 py-3 rounded-xl font-semibold"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-orange-500 cursor-pointer hover:text-orange-400"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

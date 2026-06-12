"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute bottom-20 right-20 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-8 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">
          SmartBill <span className="text-orange-500">AI</span>
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-gray-300 hover:text-white transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg transition-all duration-300"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 md:px-6 py-20 md:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
          SmartBill <span className="text-orange-500">AI</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-4 px-2">
          AI-Powered Invoice OCR & Smart Bill Management System
        </p>

        <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-6 px-2">
          Extract invoices automatically, manage customers, generate bills,
          detect duplicates, and track business performance from a single
          intelligent dashboard.
        </p>

        <p className="text-orange-500 font-semibold mb-4">
          Managed by MJG Enterprise
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-10">
          🚀 AI Powered Invoice Automation
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push("/register")}
            className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/login")}
            className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
          >
            Login
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 container mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ["500+", "Invoices Processed"],
            ["99%", "OCR Accuracy"],
            ["100+", "Customers Managed"],
            ["24/7", "Cloud Access"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="bg-[#111827] border border-gray-800 rounded-2xl p-6 text-center hover:border-orange-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all duration-300"
            >
              <h3 className="text-3xl font-bold text-orange-500">{value}</h3>
              <p className="text-gray-400 mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-14">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "AI OCR",
              desc: "Automatically extract invoice data from images and PDFs.",
            },
            {
              title: "Customer Management",
              desc: "Store and manage customers with complete invoice history.",
            },
            {
              title: "Smart Billing",
              desc: "Create, edit and manage invoices efficiently.",
            },
            {
              title: "Analytics",
              desc: "Monitor revenue and customer growth with insights.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-orange-500 hover:-translate-y-3 hover:shadow-[0_0_30px_rgba(249,115,22,0.25)] transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 text-orange-500">
                {feature.title}
              </h3>

              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 container mx-auto px-6 pb-20">
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-10 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Invoice Management?
          </h2>

          <p className="text-gray-400 mb-8">
            Join SmartBill AI and automate your billing workflow today.
          </p>

          <button
            onClick={() => router.push("/register")}
            className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
          >
            Start Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-8 text-center">
        <p className="text-gray-500">© 2026 SmartBill AI</p>

        <p className="text-orange-500 mt-2 font-medium">
          Managed by MJG Enterprise
        </p>
      </footer>
    </div>
  );
}

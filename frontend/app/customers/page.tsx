"use client";

import axios from "axios";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

interface Customer {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  totalBills?: number;
  totalAmount?: number;
}

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState("name");

  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://name-smartbill-backend.onrender.com/api/customers/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCustomers(response.data.customers || []);
    } catch (error: any) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        router.replace("/login");
      }, 0);

      return;
    }
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  //Filter Logic
  const filteredCustomers = [...customers]
    .filter(
      (customer) =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Customers</h1>

            <p className="text-gray-400 mt-2">Manage customer invoices</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
        w-full md:w-80
        bg-[#111827]
        border border-gray-700
        rounded-xl
        px-4 py-3
        text-white
        placeholder:text-gray-500
        focus:outline-none
        focus:border-orange-500
        transition-all
      "
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="
    bg-[#111827]
    border border-gray-700
    rounded-xl
    px-4 py-3
    text-gray-500
    focus:outline-none
    focus:border-orange-500
    transition-all
  "
            >
              <option value="name">Name A-Z</option>
            </select>

            <button
              onClick={() => router.push("/customers/create")}
              className="
    bg-orange-500
    hover:bg-orange-600
    px-5
    py-3
    rounded-xl
    font-semibold
  "
            >
              + Add Customer
            </button>

            <button
              onClick={() => router.back()}
              className="
        bg-gray-700
        hover:bg-gray-600
        px-5
        py-3
        rounded-xl
        whitespace-nowrap
      "
            >
              Back
            </button>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredCustomers.length === 0 && (
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-10 text-center text-gray-400">
            No matching customers found
          </div>
        )}

        {/* CUSTOMER GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              onClick={() => router.push(`/customers/${customer._id}`)}
              className="bg-[#111827] border border-gray-800 rounded-3xl p-6 shadow-xl hover:scale-105 hover:border-orange-500 transition-all duration-300 cursor-pointer"
            >
              {/* CUSTOMER NAME */}
              <h2 className="text-2xl font-bold text-orange-400">
                {customer.name}
              </h2>

              {/* CUSTOMER INFO */}
              <div className="mt-6 space-y-3">
                <p className="text-gray-300">
                  Mobile:
                  <span className="font-semibold ml-2 text-white">
                    {customer.phone || "N/A"}
                  </span>
                </p>

                <p className="text-gray-300">
                  Email:
                  <span className="font-semibold ml-2 text-white">
                    {customer.email || "N/A"}
                  </span>
                </p>
              </div>

              {/* VIEW BUTTON */}
              <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200 py-3 rounded-xl font-semibold">
                View Customer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

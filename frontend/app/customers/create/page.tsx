"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCustomerPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
  });

  const handleCreate = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "https://name-smartbill-backend.onrender.com/api/customers/create",
        customer,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Customer created successfully");

      router.push("/customers");
    } catch (error) {
      console.log(error);

      alert("Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">Create Customer</h1>

            <p className="text-gray-400 mt-2">Add a new customer</p>
          </div>

          <button
            onClick={() => router.back()}
            className="bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-xl"
          >
            Back
          </button>
        </div>

        {/* FORM */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400">Customer Name</label>

              <input
                value={customer.name}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    name: e.target.value,
                  })
                }
                className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-gray-400">Mobile Number</label>

              <input
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    phone: e.target.value,
                  })
                }
                className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-gray-400">Email</label>

            <input
              value={customer.email}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  email: e.target.value,
                })
              }
              className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
            />
          </div>

          <div className="mt-6">
            <label className="text-gray-400">GST Number</label>

            <input
              value={customer.gstNumber}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  gstNumber: e.target.value,
                })
              }
              className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
            />
          </div>

          <div className="mt-6">
            <label className="text-gray-400">Address</label>

            <textarea
              rows={4}
              value={customer.address}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: e.target.value,
                })
              }
              className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
            />
          </div>

          <div className="mt-8">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-semibold"
            >
              {loading ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

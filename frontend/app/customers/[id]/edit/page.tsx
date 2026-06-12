"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCustomerPage() {
  const params = useParams();

  const router = useRouter();

  const customerId = params.id as string;

  const [customer, setCustomer] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(
        `https://name-smartbill-backend.onrender.com/api/customers/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCustomer(response.data.customer);
    } catch (error) {
      console.log(error);

      alert("Failed to load customer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setTimeout(() => {
          router.replace("/login");
        }, 0);

        return;
      }

      if (customerId) {
        await fetchCustomer();
      }
    };

    checkAuthAndFetch();
  }, [customerId]);

  const handleSave = async () => {
    try {
      setSaving(true);

      await axios.put(
        `https://name-smartbill-backend.onrender.com/api/customers/${customerId}`,
        customer,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Customer updated successfully");

      router.replace(`/customers/${customerId}`);
      router.refresh();
    } catch (error) {
      console.log(error);

      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold">Edit Customer</h1>

            <p className="text-gray-400 mt-2">Update customer information</p>
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
            {/* NAME */}
            <div>
              <label className="text-gray-400 text-sm">Customer Name</label>

              <input
                value={customer?.name || ""}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    name: e.target.value,
                  })
                }
                className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-gray-400 text-sm">Mobile Number</label>

              <input
                value={customer?.phone || ""}
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

          {/* EMAIL */}
          <div className="mt-8">
            <label className="text-gray-400 text-sm">Email</label>

            <input
              value={customer?.email || ""}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  email: e.target.value,
                })
              }
              className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
            />
          </div>

          {/* ADDRESS */}
          <div className="mt-8">
            <label className="text-gray-400 text-sm">Address</label>

            <textarea
              rows={5}
              value={customer?.address || ""}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: e.target.value,
                })
              }
              className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => router.back()}
              className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  totalAmount: number;
  billDate: string;
}

interface Customer {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  gstNumber?: string;
}

export default function CustomerDetailsPage() {
  const router = useRouter();

  const params = useParams();

  const customerId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const [customer, setCustomer] = useState<Customer | null>(null);

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* FETCH CUSTOMER + INVOICES */
  const fetchCustomerDetails = async () => {
    try {
      const customerResponse = await axios.get(
        `https://name-smartbill-backend.onrender.com/api/customers/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCustomer(customerResponse.data.customer);

      const invoiceResponse = await axios.get(
        `https://name-smartbill-backend.onrender.com/api/invoices/customer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInvoices(invoiceResponse.data.invoices || []);
    } catch (error) {
      console.log(error);

      alert("Failed to load customer details");
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

    if (!customerId) return;

    const loadCustomer = async () => {
      await fetchCustomerDetails();
    };

    loadCustomer();
  }, [customerId]);

  /* TOTAL REVENUE */
  const totalAmount = invoices.reduce(
    (acc, invoice) => acc + invoice.totalAmount,
    0,
  );

  /* DELETE INVOICE */
  const handleDeleteInvoice = async (invoiceId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://name-smartbill-backend.onrender.com/api/invoices/${invoiceId}}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInvoices((prev) =>
        prev.filter((invoice) => invoice._id !== invoiceId),
      );

      alert("Invoice deleted successfully");
    } catch (error) {
      console.log(error);

      alert("Delete failed");
    }
  };

  //  For Delete Customer
  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://name-smartbill-backend.onrender.com/api/customers/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Customer deleted successfully");

      router.push("/customers");
    } catch (error) {
      console.log(error);

      alert("Delete failed");
    }
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  /* NO CUSTOMER */
  if (!customer) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-2xl">
        Customer not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Customer Details</h1>

            <p className="text-gray-400 mt-2">View customer invoice history</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-xl transition-all duration-200"
            >
              Back
            </button>

            <button
              onClick={() => router.push(`/customers/${customerId}/edit`)}
              className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl transition-all duration-200"
            >
              Edit Customer
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl"
            >
              Delete Customer
            </button>
          </div>
        </div>

        {/* CUSTOMER CARD */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-orange-500">
            {customer.name}
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <p className="text-gray-400 text-sm">Mobile Number</p>

              <p className="text-xl mt-1">{customer.phone || "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Email</p>

              <p className="text-xl mt-1">{customer.email || "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Address</p>

              <p className="text-xl mt-1">{customer.address || "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">GST Number</p>

              <p className="text-xl mt-1">{customer.gstNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
            <p className="text-gray-400">Total Invoices</p>

            <h3 className="text-4xl font-bold mt-2">{invoices.length}</h3>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
            <p className="text-gray-400">Total Revenue</p>

            <h3 className="text-4xl font-bold mt-2 text-orange-500">
              ₹{totalAmount}
            </h3>
          </div>
        </div>

        {/* INVOICE HISTORY */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-2xl font-bold">Invoice History</h3>
          </div>

          {/* SCROLLABLE AREA */}
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-[#1f2937] sticky top-0 z-10">
                <tr className="text-left text-gray-400">
                  <th className="px-6 py-4">Invoice Number</th>

                  <th className="px-6 py-4">Amount</th>

                  <th className="px-6 py-4">Bill Date</th>

                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    onClick={() => router.push(`/invoices/${invoice._id}/edit`)}
                    className="border-t border-gray-800 hover:bg-[#1f2937] transition-all cursor-pointer"
                  >
                    <td className="px-6 py-4">{invoice.invoiceNumber}</td>

                    <td className="px-6 py-4 text-orange-500 font-semibold">
                      ₹{invoice.totalAmount}
                    </td>

                    <td className="px-6 py-4 text-gray-400">
                      {invoice.billDate}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDeleteInvoice(invoice._id);
                        }}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition-all duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {invoices.length === 0 && (
              <div className="p-10 text-center text-gray-400">
                No invoices found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

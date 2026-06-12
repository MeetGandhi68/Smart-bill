"use client";

import axios from "axios";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

export default function InvoiceDetailsPage() {
  const params = useParams();

  const router = useRouter();

  const [invoice, setInvoice] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `https://name-smartbill-backend.onrender.com/api/invoices/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInvoice(response.data.invoice);
    } catch (error) {
      console.log(error);

      alert("Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInvoice = async () => {
      await fetchInvoice();
    };

    loadInvoice();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text("Invoice Details", 14, 20);

    doc.setFontSize(12);

    doc.text(`Invoice Number: ${invoice.invoiceNumber || "N/A"}`, 14, 35);

    doc.text(`Customer Name: ${invoice.customerName || "N/A"}`, 14, 45);

    doc.text(`Bill Date: ${invoice.billDate || "N/A"}`, 14, 55);

    doc.text(`GST Amount: ₹ ${invoice.gstAmount || 0}`, 14, 65);

    doc.text(`Total Amount: ₹ ${invoice.totalAmount || 0}`, 14, 75);

    autoTable(doc, {
      startY: 90,

      head: [["Item", "Quantity", "Price"]],

      body: invoice.items.map((item: any) => [
        item.name,
        item.quantity || "N/A",
        `₹ ${item.price}`,
      ]),
    });

    const finalY = (doc as any).lastAutoTable.finalY || 120;

    doc.text("Notes:", 14, finalY + 15);

    doc.text(invoice.notes || "No notes added", 14, finalY + 25);

    doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this invoice?");

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://name-smartbill-backend.onrender.com/api/invoices/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Invoice deleted");

      router.push("/");
    } catch (error) {
      console.log(error);

      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        Invoice not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-10 overflow-x-hidden">
      <div className="max-w-6xl w-full mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Invoice Details</h1>

            <p className="mt-2 text-gray-400">View invoice information</p>
          </div>

          <button
            onClick={() => router.back()}
            className="bg-gray-700 hover:bg-gray-600 hover:scale-105 transition-all duration-200 px-5 py-3 rounded-xl"
          >
            Back
          </button>
        </div>

        {/* CARD */}
        <div className="rounded-3xl p-6 md:p-8 bg-[#111827] border border-gray-800 shadow-xl text-white overflow-x-auto">
          {/* TOP GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400">Invoice Number</p>

              <h2 className="text-xl font-semibold mt-1">
                {invoice.invoiceNumber || "N/A"}
              </h2>
            </div>

            <div>
              <p className="text-sm text-gray-400">Customer Name</p>

              <h2 className="text-xl font-semibold mt-1">
                {invoice.customerName || "N/A"}
              </h2>
            </div>

            <div>
              <p className="text-sm text-gray-400">Bill Date</p>

              <h2 className="text-xl font-semibold mt-1">
                {invoice.billDate || "N/A"}
              </h2>
            </div>

            <div>
              <p className="text-sm text-gray-400">GST Amount</p>

              <h2 className="text-xl font-semibold mt-1">
                ₹ {invoice.gstAmount || 0}
              </h2>
            </div>

            <div>
              <p className="text-sm text-gray-400">Total Amount</p>

              <h2 className="text-2xl font-bold text-orange-400 mt-1">
                ₹ {invoice.totalAmount || 0}
              </h2>
            </div>
          </div>

          {/* ITEMS */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6">Items</h3>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-gray-400">
                    <th className="pb-4">Item</th>

                    <th className="pb-4">Quantity</th>

                    <th className="pb-4">Price</th>
                  </tr>
                </thead>

                <tbody>
                  {invoice.items?.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-4">{item.name}</td>

                      <td className="py-4">{item.quantity || "N/A"}</td>

                      <td className="py-4">₹ {item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NOTES */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4">Notes</h3>

            <div className="rounded-2xl p-5 bg-[#1f2937] border border-gray-700 text-gray-300">
              {invoice.notes || "No notes added"}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col md:flex-row gap-4 mt-12">
            <button
              onClick={() => router.push(`/invoices/${invoice._id}/edit`)}
              className="bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200 px-8 py-3 rounded-xl font-semibold"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 hover:scale-105 transition-all duration-200 px-8 py-3 rounded-xl font-semibold"
            >
              Delete
            </button>

            <button
              onClick={handleDownloadPDF}
              className="bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200 px-8 py-3 rounded-xl font-semibold"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

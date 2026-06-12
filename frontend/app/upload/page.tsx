"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [invoiceData, setInvoiceData] = useState<any>(null);

  const [invoiceId, setInvoiceId] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* UPLOAD INVOICE */
  const handleUpload = async () => {
    if (!file) {
      alert("Please select invoice image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("invoice", file);

      const response = await axios.post(
        "https://name-smartbill-backend.onrender.com/api/upload",

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setInvoiceData(response.data.savedInvoice);

      setInvoiceId(response.data.savedInvoice._id);

      alert("Invoice processed successfully");
    } catch (error: any) {
      console.log(error);

      alert(error?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* SAVE EDITED INVOICE */
  const handleSaveInvoice = async () => {
    try {
      await axios.put(
        `https://name-smartbill-backend.onrender.com/api/invoices/${invoiceId}`,

        invoiceData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Invoice updated successfully");
    } catch (error: any) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed to save invoice");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Upload Invoice</h1>

            <p className="text-gray-400 mt-2">
              AI-powered OCR invoice extraction
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-gray-700 hover:bg-gray-600 hover:scale-105 transition-all duration-200 px-5 py-3 rounded-xl"
          >
            Back
          </button>
        </div>

        {/* UPLOAD CARD */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 shadow-xl">
          <div className="border-2 border-dashed border-orange-500 rounded-2xl p-10 text-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mb-6 block w-full text-sm text-gray-300"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 transition-all px-8 py-3 rounded-xl font-semibold"
            >
              {loading ? "Processing..." : "Upload Invoice"}
            </button>
          </div>
        </div>

        {/* PREVIEW */}
        {invoiceData && (
          <div className="mt-10 bg-[#111827] border border-gray-800 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Parsed Invoice Preview</h2>

              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                OCR Success
              </span>
            </div>

            {/* FORM GRID */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* INVOICE NUMBER */}
              <div>
                <label className="text-sm text-gray-400">Invoice Number</label>

                <input
                  value={invoiceData.invoiceNumber || ""}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      invoiceNumber: e.target.value,
                    })
                  }
                  className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              {/* CUSTOMER NAME */}
              <div>
                <label className="text-sm text-gray-400">Customer Name</label>

                <input
                  value={invoiceData.customerName || ""}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      customerName: e.target.value,
                    })
                  }
                  className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              {/* BILL DATE */}
              <div>
                <label className="text-sm text-gray-400">Bill Date</label>

                <input
                  value={invoiceData.billDate || ""}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      billDate: e.target.value,
                    })
                  }
                  className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              {/* GST */}
              <div>
                <label className="text-sm text-gray-400">GST Amount</label>

                <input
                  type="number"
                  value={invoiceData.gstAmount || ""}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      gstAmount: e.target.value,
                    })
                  }
                  className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              {/* TOTAL */}
              <div>
                <label className="text-sm text-gray-400">Total Amount</label>

                <input
                  type="number"
                  value={invoiceData.totalAmount || ""}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      totalAmount: e.target.value,
                    })
                  }
                  className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* NOTES */}
            <div className="mt-10">
              <label className="text-sm text-gray-400">Notes</label>

              <textarea
                rows={4}
                value={invoiceData.notes || ""}
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    notes: e.target.value,
                  })
                }
                placeholder="Optional notes..."
                className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-orange-500 resize-none"
              />
            </div>

            {/* ITEMS */}
            <div className="mt-10">
              <h3 className="text-2xl font-semibold mb-6">Items</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-800">
                      <th className="pb-4">Item</th>
                      <th className="pb-4">Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoiceData.items?.map((item: any, index: number) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-4 pr-4">
                          <input
                            value={item.name}
                            onChange={(e) => {
                              const updatedItems = [...invoiceData.items];

                              updatedItems[index].name = e.target.value;

                              setInvoiceData({
                                ...invoiceData,
                                items: updatedItems,
                              });
                            }}
                            className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-orange-500"
                          />
                        </td>

                        <td className="py-4">
                          <input
                            value={item.price}
                            onChange={(e) => {
                              const updatedItems = [...invoiceData.items];

                              updatedItems[index].price = e.target.value;

                              setInvoiceData({
                                ...invoiceData,
                                items: updatedItems,
                              });
                            }}
                            className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-orange-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-10">
              <button
                onClick={handleSaveInvoice}
                className="bg-orange-500 hover:bg-orange-600 transition-all px-8 py-3 rounded-xl font-semibold"
              >
                Save Invoice
              </button>

              <button
                onClick={() => setInvoiceData(null)}
                className="bg-gray-700 hover:bg-gray-600 transition-all px-8 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

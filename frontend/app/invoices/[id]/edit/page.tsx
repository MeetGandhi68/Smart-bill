"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type InvoiceItem = {
  name: string;
  quantity: string;
  price: string;
};

type InvoiceState = {
  customer: string;
  customerName: string;
  invoiceNumber: string;
  billDate: string;
  totalAmount: string;
  gstAmount: string;
  notes: string;
  items: InvoiceItem[];
};

export default function EditInvoicePage() {
  const params = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [invoice, setInvoice] = useState<InvoiceState>({
    customer: "",
    customerName: "",
    invoiceNumber: "",
    billDate: "",
    totalAmount: "",
    gstAmount: "",
    notes: "",
    items: [],
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* FETCH INVOICE */
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

      const data = response.data.invoice;

      setInvoice({
        customer: data.customer || "",
        customerName: data.customerName || "",
        invoiceNumber: data.invoiceNumber || "",
        billDate: data.billDate || "",
        totalAmount: String(data.totalAmount || ""),
        gstAmount: String(data.gstAmount || ""),
        notes: data.notes || "",
        items:
          data.items?.map((item: any) => ({
            name: item.name || "",
            quantity: item.quantity || "",
            price: String(item.price || ""),
          })) || [],
      });
    } catch (error) {
      console.log(error);

      alert("Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchInvoice();
    }
  }, [params.id]);

  /* SAVE */
  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        customerName: invoice.customerName,
        invoiceNumber: invoice.invoiceNumber,
        billDate: invoice.billDate,
        totalAmount: invoice.totalAmount,
        gstAmount: invoice.gstAmount,
        notes: invoice.notes,
        items: invoice.items,
      };

      await axios.put(
        `https://name-smartbill-backend.onrender.com/api/invoices/${params.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Invoice updated successfully");

      router.push(`/invoices/${params.id}`);
    } catch (error) {
      console.log(error);

      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ADD ITEM */
  const handleAddItem = () => {
    setInvoice({
      ...invoice,

      items: [
        ...invoice.items,

        {
          name: "",
          quantity: "",
          price: "",
        },
      ],
    });
  };

  /* REMOVE ITEM */
  const handleRemoveItem = (index: number) => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);

    setInvoice({
      ...invoice,
      items: updatedItems,
    });
  };

  /* UPDATE ITEM */
  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string,
  ) => {
    const updatedItems = [...invoice.items];

    updatedItems[index][field] = value;

    setInvoice({
      ...invoice,
      items: updatedItems,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-10 overflow-x-hidden">
      <div className="max-w-6xl w-full mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold">Edit Invoice</h1>

            <p className="text-gray-400 mt-2">Update invoice details</p>
          </div>

          <button
            onClick={() => router.back()}
            className="bg-gray-700 hover:bg-gray-600 hover:scale-105 transition-all duration-200 px-5 py-3 rounded-xl"
          >
            Back
          </button>
        </div>

        {/* FORM */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="grid md:grid-cols-3 gap-4">
            {/* CUSTOMER */}
            <div>
              <label className="text-sm text-gray-400">Customer Name</label>

              <input
                value={invoice.customerName}
                onChange={(e) =>
                  setInvoice({
                    ...invoice,
                    customerName: e.target.value,
                  })
                }
                className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
              />
            </div>

            {/* INVOICE */}
            <div>
              <label className="text-sm text-gray-400">Invoice Number</label>

              <input
                value={invoice.invoiceNumber}
                onChange={(e) =>
                  setInvoice({
                    ...invoice,
                    invoiceNumber: e.target.value,
                  })
                }
                className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="text-sm text-gray-400">Bill Date</label>

              <input
                value={invoice.billDate}
                onChange={(e) =>
                  setInvoice({
                    ...invoice,
                    billDate: e.target.value,
                  })
                }
                className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
              />
            </div>

            {/* TOTAL */}
            <div>
              <label className="text-sm text-gray-400">Total Amount</label>

              <input
                value={invoice.totalAmount}
                onChange={(e) =>
                  setInvoice({
                    ...invoice,
                    totalAmount: e.target.value,
                  })
                }
                className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
              />
            </div>

            {/* GST */}
            <div>
              <label className="text-sm text-gray-400">GST Amount</label>

              <input
                value={invoice.gstAmount}
                onChange={(e) =>
                  setInvoice({
                    ...invoice,
                    gstAmount: e.target.value,
                  })
                }
                className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
              />
            </div>
          </div>

          {/* ITEMS */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Items</h2>

              <button
                onClick={handleAddItem}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl"
              >
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {invoice.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  {/* NAME */}
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    placeholder="Item Name"
                    className="bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
                  />

                  {/* QUANTITY */}
                  <input
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    placeholder="Quantity"
                    className="bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
                  />

                  {/* PRICE */}
                  <input
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", e.target.value)}
                    placeholder="Price"
                    className="bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
                  />

                  {/* REMOVE */}
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="bg-red-500 hover:bg-red-600 rounded-xl px-4 py-3"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* NOTES */}
          <div className="mt-10">
            <label className="text-sm text-gray-400">Notes</label>

            <textarea
              value={invoice.notes}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  notes: e.target.value,
                })
              }
              rows={5}
              className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col md:flex-row gap-4 mt-12">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => router.back()}
              className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

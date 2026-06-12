"use client";

import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Customer {
  _id: string;
  name: string;
}

interface InvoiceItem {
  name: string;
  quantity: string;
  price: string;
}

export default function CreateInvoicePage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [searchCustomer, setSearchCustomer] = useState("");

  const [showCustomerList, setShowCustomerList] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [customers, setCustomers] = useState<Customer[]>([]);

  const [invoice, setInvoice] = useState({
    customer: "",
    customerName: "",
    invoiceNumber: "",
    billDate: "",
    totalAmount: "",
    gstAmount: "",
    notes: "",
    items: [
      {
        name: "",
        quantity: "",
        price: "",
      },
    ] as InvoiceItem[],
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* FETCH CUSTOMERS */
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Add filtered customers
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchCustomer.toLowerCase()),
  );

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

  /* SAVE INVOICE */
  const handleSave = async () => {
    try {
      if (!invoice.customer) {
        alert("Please select customer");
        return;
      }

      setSaving(true);

      const selectedCustomer = customers.find(
        (customer) => customer._id === invoice.customer,
      );

      await axios.post(
        "https://name-smartbill-backend.onrender.com/api/invoices/manual",
        {
          ...invoice,
          customerName: selectedCustomer?.name || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Invoice created successfully");

      router.push("/dashboard");
    } catch (error) {
      console.log(error);

      alert("Failed to create invoice");
    } finally {
      setSaving(false);
    }
  };

  /*Create NEW Customer */
  const handleCreateCustomer = async () => {
    try {
      if (!newCustomer.name) {
        alert("Customer name is required");

        return;
      }

      const response = await axios.post(
        "https://name-smartbill-backend.onrender.com/api/customers/create",
        newCustomer,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const createdCustomer = response.data.customer;

      setCustomers((prev: any) => [...prev, createdCustomer]);

      setInvoice({
        ...invoice,
        customer: createdCustomer._id,
        customerName: createdCustomer.name,
      });

      setNewCustomer({
        name: "",
        phone: "",
        address: "",
      });

      setShowCustomerModal(false);

      alert("Customer created successfully");
    } catch (error) {
      console.log(error);

      alert("Failed to create customer");
    }
  };

  /* DOWNLOAD PDF */
  const handleDownloadPDF = () => {
    const selectedCustomer = customers.find(
      (customer) => customer._id === invoice.customer,
    );

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text("Manual Invoice", 14, 20);

    doc.setFontSize(12);

    doc.text(`Customer Name: ${selectedCustomer?.name || "N/A"}`, 14, 40);

    doc.text(`Invoice Number: ${invoice.invoiceNumber || "N/A"}`, 14, 50);

    doc.text(`Bill Date: ${invoice.billDate || "N/A"}`, 14, 60);

    doc.text(`GST Amount: ₹ ${invoice.gstAmount || 0}`, 14, 70);

    doc.text(`Total Amount: ₹ ${invoice.totalAmount || 0}`, 14, 80);

    autoTable(doc, {
      startY: 95,

      head: [["Item", "Quantity", "Price"]],

      body: invoice.items.map((item) => [
        item.name,
        item.quantity || "N/A",
        `₹ ${item.price}`,
      ]),
    });

    const finalY = (doc as any).lastAutoTable.finalY || 120;

    doc.text("Notes:", 14, finalY + 15);

    doc.text(invoice.notes || "No notes added", 14, finalY + 25);

    doc.save(`invoice-${invoice.invoiceNumber || "manual"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-10 overflow-x-hidden">
      <div className="max-w-6xl w-full mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Create Invoice</h1>

            <p className="text-gray-400 mt-2">Add a new invoice manually</p>
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
          <div className="grid md:grid-cols-2 gap-6">
            {/* This adds the + Add Customer button. */}
            {/* CUSTOMER */}
            <div className="relative">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Select Customer</label>

                <button
                  type="button"
                  onClick={() => setShowCustomerModal(true)}
                  className="text-orange-400 text-sm hover:text-orange-300"
                >
                  + Add Customer
                </button>
              </div>

              {/* SEARCH INPUT */}
              <input
                type="text"
                placeholder="Search customer..."
                value={
                  customers.find(
                    (customer) => customer._id === invoice.customer,
                  )?.name || searchCustomer
                }
                onChange={(e) => {
                  setSearchCustomer(e.target.value);

                  setInvoice({
                    ...invoice,
                    customer: "",
                  });
                }}
                onFocus={() => setShowCustomerList(true)}
                className="w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3 text-white"
              />

              {/* DROPDOWN */}
              {showCustomerList && searchCustomer && (
                <div className="absolute z-50 w-full mt-2 bg-[#1f2937] border border-gray-700 rounded-xl max-h-60 overflow-y-auto shadow-lg">
                  {customers
                    .filter((customer) =>
                      customer.name
                        .toLowerCase()
                        .includes(searchCustomer.toLowerCase()),
                    )
                    .map((customer) => (
                      <div
                        key={customer._id}
                        onClick={() => {
                          setInvoice({
                            ...invoice,
                            customer: customer._id,
                          });

                          setSearchCustomer(customer.name);

                          setShowCustomerList(false);
                        }}
                        className="px-4 py-3 hover:bg-[#374151] cursor-pointer transition-all"
                      >
                        {customer.name}
                      </div>
                    ))}

                  {customers.filter((customer) =>
                    customer.name
                      .toLowerCase()
                      .includes(searchCustomer.toLowerCase()),
                  ).length === 0 && (
                    <div className="px-4 py-3 text-gray-400">
                      No customer found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* INVOICE NUMBER */}
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

            {/* BILL DATE */}
            <div>
              <label className="text-sm text-gray-400">Bill Date</label>

              <input
                type="date"
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
                className="bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200 px-4 py-2 rounded-xl"
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
                  <input
                    value={item.name}
                    onChange={(e) => {
                      const updatedItems = [...invoice.items];

                      updatedItems[index].name = e.target.value;

                      setInvoice({
                        ...invoice,
                        items: updatedItems,
                      });
                    }}
                    placeholder="Item Name"
                    className="bg-[#1f2937] border border-gray-700 hover:scale-105 transition-all duration-200 rounded-xl px-4 py-3"
                  />

                  <input
                    value={item.quantity}
                    onChange={(e) => {
                      const updatedItems = [...invoice.items];

                      updatedItems[index].quantity = e.target.value;

                      setInvoice({
                        ...invoice,
                        items: updatedItems,
                      });
                    }}
                    placeholder="Quantity"
                    className="bg-[#1f2937] border border-gray-700 hover:scale-105 transition-all duration-200 rounded-xl px-4 py-3"
                  />

                  <input
                    value={item.price}
                    onChange={(e) => {
                      const updatedItems = [...invoice.items];

                      updatedItems[index].price = e.target.value;

                      setInvoice({
                        ...invoice,
                        items: updatedItems,
                      });
                    }}
                    placeholder="Price"
                    className="bg-[#1f2937] border border-gray-700 hover:scale-105 transition-all duration-200 rounded-xl px-4 py-3"
                  />

                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="bg-red-500 hover:bg-red-600 hover:scale-105 transition-all duration-200 rounded-xl px-4 py-3"
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
              rows={5}
              value={invoice.notes}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  notes: e.target.value,
                })
              }
              className="w-full mt-2 bg-[#1f2937] border border-gray-700 hover:scale-102 transition-all duration-200 rounded-xl px-4 py-3"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col md:flex-row gap-4 mt-10">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200 px-8 py-3 rounded-xl font-semibold"
            >
              {saving ? "Saving..." : "Create Invoice"}
            </button>

            <button
              onClick={() => router.back()}
              className="bg-gray-700 hover:bg-gray-600 hover:scale-105 transition-all duration-200 px-8 py-3 rounded-xl font-semibold"
            >
              Cancel
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
      {/* CUSTOMER MODAL */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Add New Customer</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    name: e.target.value,
                  })
                }
                className="w-full bg-[#1f2937] border border-gray-700 hover:scale-105 transition-all duration-200 rounded-xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Mobile Number"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    phone: e.target.value,
                  })
                }
                className="w-full bg-[#1f2937] border border-gray-700 hover:scale-105 transition-all duration-200 rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Address"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    address: e.target.value,
                  })
                }
                className="w-full bg-[#1f2937] border border-gray-700 hover:scale-105 transition-all duration-200 rounded-xl px-4 py-3"
                rows={4}
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateCustomer}
                className="bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200 px-6 py-3 rounded-xl font-semibold"
              >
                Save Customer
              </button>

              <button
                onClick={() => setShowCustomerModal(false)}
                className="bg-gray-700 hover:bg-gray-600 hover:scale-105 transition-all duration-200 px-6 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

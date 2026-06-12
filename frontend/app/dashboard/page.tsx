"use client";

import axios from "axios";

import { useEffect, useState } from "react";

import {
  Menu,
  X,
  FileText,
  Users,
  IndianRupee,
  BarChart3,
  LayoutDashboard,
  Upload,
  SquarePen,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { useRouter } from "next/navigation";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  billDate: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [customers, setCustomers] = useState<any[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invoices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInvoices(response.data.invoices);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customers/all`,
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
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      await fetchInvoices();
      await fetchCustomers();
    };

    loadData();
  }, []);

  const totalRevenue = invoices.reduce(
    (acc, invoice) => acc + invoice.totalAmount,
    0,
  );

  const averageInvoice = invoices.length
    ? Math.round(totalRevenue / invoices.length)
    : 0;

  // Filter Invoices

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatCurrency = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;

    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;

    if (num >= 1000) return `₹${(num / 1000).toFixed(1)} K`;

    return `₹${num}`;
  };
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-dvh md:h-screen overflow-y-auto bg-[#111827] text-white
          ${collapsed ? "w-20" : "w-64"}
          flex flex-col justify-between
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div>
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-orange-500">
              {collapsed ? "SB" : "SmartBill AI"}
            </h1>

            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X size={24} />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-2 rounded-lg hover:bg-gray-800"
            >
              {collapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>
          </div>

          <nav className={`mt-6 ${collapsed ? "px-1" : "px-4"} space-y-2`}>
            <button
              className={`
w-full
py-3
rounded-xl
flex
items-center
${collapsed ? "justify-center px-0" : "px-4"}
hover:bg-orange-500
hover:text-white
transition-all
duration-300
`}
            >
              {collapsed ? <LayoutDashboard size={20} /> : "Dashboard"}
            </button>

            <button
              onClick={() => router.push("/upload")}
              className="
w-full
text-left
px-4
py-3
rounded-xl
hover:bg-orange-500
hover:text-white
hover:translate-x-2
transition-all
duration-300
"
            >
              {collapsed ? <Upload size={20} /> : "Upload Invoice"}
            </button>

            <button
              onClick={() => router.push("/invoices/create")}
              className="
w-full
text-left
px-4
py-3
rounded-xl
hover:bg-orange-500
hover:text-white
hover:translate-x-2
transition-all
duration-300
"
            >
              {collapsed ? <SquarePen size={20} /> : "Manual Entry"}
            </button>

            <button
              onClick={() => router.push("/customers")}
              className="
w-full
text-left
px-4
py-3
rounded-xl
hover:bg-orange-500
hover:text-white
hover:translate-x-2
transition-all
duration-300
"
            >
              {collapsed ? <Users size={20} /> : "Customers"}
            </button>
          </nav>
        </div>

        <div className="p-5 border-t border-gray-800 bg-[#111827]">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/");
            }}
            className="w-full bg-red-500 hover:bg-red-600 transition py-3 rounded-xl font-medium"
          >
            {collapsed ? "L/O" : "Log Out"}
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-screen flex flex-col p-4 md:p-8 bg-[#0f172a] text-white overflow-x-hidden">
        <div className="flex-1">
          {/* MOBILE HEADER */}
          <div className="md:hidden flex items-center justify-between mb-6 bg-[#111827] border border-gray-800 p-4 rounded-2xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-xl font-bold text-orange-500">SmartBill AI</h1>
          </div>

          {/* TOPBAR */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Dashboard</h2>

              <p className="text-gray-500 mt-1">Welcome back to SmartBill AI</p>
            </div>

            <button
              onClick={() => router.push("/invoices/create")}
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-300 px-5 py-3 rounded-xl font-semibold"
            >
              + Create Invoice
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4  gap-6 mb-8">
            <div
              className="bg-[#111827]
rounded-2xl
p-6
border
border-gray-800
hover:border-orange-500
hover:-translate-y-2
hover:shadow-[0_0_25px_rgba(249,115,22,0.3)]
transition-all
duration-300"
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">Total Invoices</p>
                <FileText size={20} className="text-orange-500" />
              </div>

              <h3 className="text-xl sm:text-2xl md:text-4xl font-bold mt-2 text-white">
                {invoices.length}
              </h3>
            </div>
            <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800 hover:border-orange-500 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">Total Revenue</p>

                <IndianRupee size={20} className="text-orange-500" />
              </div>

              <h3 className="text-xl sm:text-2xl md:text-4xl font-bold mt-2 text-orange-500">
                {formatCurrency(totalRevenue)}
              </h3>
            </div>
            <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800 hover:border-orange-500 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">Customers</p>

                <Users size={20} className="text-orange-500" />
              </div>

              <h3 className="text-xl sm:text-2xl md:text-4xl font-bold mt-2 text-white">
                {customers.length}
              </h3>
            </div>
            <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800 hover:border-orange-500 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">Average Invoice</p>

                <BarChart3 size={20} className="text-orange-500" />
              </div>

              <h3 className="text-xl sm:text-2xl md:text-4xl font-bold mt-2 text-white">
                {formatCurrency(averageInvoice)}
              </h3>
            </div>
          </div>

          {/* SEARCH + FILTER BAR */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search invoice number, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full
bg-[#111827]
border border-gray-800
rounded-2xl
px-5 py-4
pl-12
text-white
placeholder-gray-500
focus:outline-none
focus:ring-2
focus:ring-orange-500
      "
              />

              <svg
                className="absolute left-4 top-4 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                />
              </svg>
            </div>
          </div>

          {/* RECENT INVOICES */}
          <div className="bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-white">Recent Invoices</h3>
            </div>

            <div>
              {/* Mobile Cards */}
              <div className="sm:hidden p-4 space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice._id}
                    onClick={() => router.push(`/invoices/${invoice._id}`)}
                    className="bg-[#0f172a] border border-gray-800 rounded-xl p-4"
                  >
                    <p className="font-semibold">
                      #{invoice.invoiceNumber || "N/A"}
                    </p>

                    <p className="text-gray-400 mt-2">
                      {invoice.customerName || "Unknown"}
                    </p>

                    <p className="text-orange-500 font-bold mt-2">
                      ₹{invoice.totalAmount}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      {invoice.billDate || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
              <table className="w-full min-w-[650px]">
                <thead className="bg-black sticky top-0 z-10">
                  <tr className="text-left text-gray-300 text-sm">
                    <th className="px-6 py-4">Invoice No</th>

                    <th className="px-6 py-4">Customer</th>

                    <th className="px-6 py-4">Amount</th>

                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="border-t border-gray-800 hover:bg-orange-500/10 transition-all duration-300 cursor-pointer"
                      onClick={() => router.push(`/invoices/${invoice._id}`)}
                    >
                      <td className="px-3 md:px-6 py-4 text-sm md:text-base font-medium text-white">
                        {invoice.invoiceNumber || "N/A"}
                      </td>

                      <td className="px-3 md:px-6 py-4 text-sm md:text-base font-medium text-white">
                        {invoice.customerName || "Unknown"}
                      </td>

                      <td className="px-3 md:px-6 py-4 text-sm md:text-base font-medium text-white">
                        ₹{invoice.totalAmount}
                      </td>

                      <td className="px-3 md:px-6 py-4 text-sm md:text-base font-medium text-white">
                        {invoice.billDate || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          SmartBill AI • Managed by MJG Enterprise
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  MoreVertical,
  Download,
  Calendar,
} from "lucide-react";

// Analytics Data
const monthlyRevenueData = [
  { month: "JAN", revenue: 4200, pending: 1200 },
  { month: "FEB", revenue: 5800, pending: 800 },
  { month: "MAR", revenue: 7100, pending: 2100 },
  { month: "APR", revenue: 6400, pending: 1500 },
  { month: "MAY", revenue: 9200, pending: 1100 },
  { month: "JUN", revenue: 8500, pending: 2400 },
  { month: "JUL", revenue: 11400, pending: 1800 },
];

const recentInvoices = [
  {
    id: "INV-2026-001",
    client: "Acme Corporation",
    email: "billing@acme.com",
    date: "Jul 24, 2026",
    dueDate: "Aug 07, 2026",
    amount: "₹45,000.00",
    status: "Paid",
  },
  {
    id: "INV-2026-002",
    client: "Nexus Tech Solutions",
    email: "finance@nexus.io",
    date: "Jul 22, 2026",
    dueDate: "Aug 05, 2026",
    amount: "₹28,500.00",
    status: "Pending",
  },
  {
    id: "INV-2026-003",
    client: "Vortex Digital",
    email: "hello@vortex.com",
    date: "Jul 10, 2026",
    dueDate: "Jul 24, 2026",
    amount: "₹12,000.00",
    status: "Overdue",
  },
  {
    id: "INV-2026-004",
    client: "Starlight Media",
    email: "accounts@starlight.com",
    date: "Jul 01, 2026",
    dueDate: "Jul 15, 2026",
    amount: "₹64,200.00",
    status: "Paid",
  },
];

export default function OverviewDashboard() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="min-h-screen bg-[#090909] text-neutral-200 p-4 space-y-3 font-mono rounded-none border-l border-neutral-800">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-neutral-800">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white uppercase flex items-center gap-2">
            OVERVIEW
          </h1>
          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
            Real-time financial telemetry & invoice metadata monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2 font-sans">
          <button className="flex items-center gap-2 px-3 py-1 text-xs font-medium bg-[#141414] border border-neutral-800 text-neutral-300 hover:bg-neutral-800 transition rounded-none">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold bg-[#00D2B5] text-[#090909] hover:bg-[#00b89f] transition rounded-none">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Metric Cards Row - Ultra-Boxy Neutral Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Total Revenue */}
        <div className="bg-[#121212] border border-neutral-800 p-3.5 rounded-none">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-sans font-medium text-neutral-400 uppercase tracking-wide">Total Revenue</span>
            <div className="p-1 bg-[#00D2B5]/10 text-[#00D2B5] rounded-none">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-bold text-white tracking-tight">₹1,21,500.00</h3>
            <p className="text-[10px] font-sans text-[#00D2B5] mt-1">
              ↑ 14.2% <span className="text-neutral-500">vs last month</span>
            </p>
          </div>
        </div>

        {/* Pending Cash Flow */}
        <div className="bg-[#121212] border border-neutral-800 p-3.5 rounded-none">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-sans font-medium text-neutral-400 uppercase tracking-wide">Pending Amount</span>
            <div className="p-1 bg-neutral-800 text-neutral-300 rounded-none">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-bold text-white tracking-tight">₹28,500.00</h3>
            <p className="text-[10px] font-sans text-neutral-500 mt-1">2 invoices awaiting payment</p>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-[#121212] border border-neutral-800 p-3.5 rounded-none">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-sans font-medium text-neutral-400 uppercase tracking-wide">Overdue Amount</span>
            <div className="p-1 bg-neutral-800 text-neutral-300 rounded-none">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-bold text-white tracking-tight">₹12,000.00</h3>
            <p className="text-[10px] font-sans text-neutral-400 mt-1">1 invoice past due</p>
          </div>
        </div>

        {/* Paid Rate */}
        <div className="bg-[#121212] border border-neutral-800 p-3.5 rounded-none">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-sans font-medium text-neutral-400 uppercase tracking-wide">Paid Rate</span>
            <div className="p-1 bg-neutral-800 text-neutral-300 rounded-none">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-bold text-white tracking-tight">88.5%</h3>
            <p className="text-[10px] font-sans text-neutral-500 mt-1">Avg turnaround: 6 days</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-[#121212] border border-neutral-800 p-3.5 rounded-none flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3 font-sans">
            <div>
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Revenue Trend</h2>
              <p className="text-[10px] text-neutral-500">Collected vs Pending monthly cashflow</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-none bg-[#00D2B5]" />
                <span className="text-neutral-400 text-[10px] uppercase">Collected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-none bg-neutral-600" />
                <span className="text-neutral-400 text-[10px] uppercase">Pending</span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D2B5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00D2B5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#525252" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#525252" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="1 1" stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#525252" fontSize={10} tickLine={false} />
                <YAxis stroke="#525252" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    borderColor: "#333333",
                    borderRadius: "0px",
                    color: "#F5F5F5",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
                <Area type="linear" dataKey="revenue" stroke="#00D2B5" strokeWidth={1.5} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="linear" dataKey="pending" stroke="#737373" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorPending)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Boxy Volume Chart */}
        <div className="bg-[#121212] border border-neutral-800 p-3.5 rounded-none flex flex-col justify-between">
          <div className="font-sans">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Invoice Volume</h2>
            <p className="text-[10px] text-neutral-500">Total volume count</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="1 1" stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#525252" fontSize={10} tickLine={false} />
                <YAxis stroke="#525252" fontSize={10} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#171717" }}
                  contentStyle={{
                    backgroundColor: "#171717",
                    borderColor: "#333333",
                    borderRadius: "0px",
                    color: "#F5F5F5",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
                <Bar dataKey="revenue" fill="#00D2B5" radius={[0, 0, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Invoices Table Section */}
      <div className="bg-[#121212] border border-neutral-800 rounded-none p-3.5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 font-sans">
          <div>
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Invoice Registry</h2>
            <p className="text-[10px] text-neutral-500">Stored metadata logs</p>
          </div>

          {/* Boxy Neutral Filter Segmented Control */}
          <div className="flex items-center bg-[#090909] p-0.5 border border-neutral-800 rounded-none text-xs">
            {["All", "Paid", "Pending", "Overdue"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-3 py-0.5 text-[10px] font-medium transition rounded-none uppercase ${
                  filter === item
                    ? "bg-[#1F1F1F] text-[#00D2B5] border border-neutral-700"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Flat Border Table */}
        <div className="overflow-x-auto border border-neutral-800 rounded-none">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#1A1A1A] text-neutral-400 font-sans uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-2 px-3">Invoice ID</th>
                <th className="py-2 px-3">Client</th>
                <th className="py-2 px-3">Issued</th>
                <th className="py-2 px-3">Due</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 bg-[#121212]">
              {recentInvoices
                .filter((inv) => filter === "All" || inv.status === filter)
                .map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-neutral-800/40 transition">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-neutral-300">
                      {invoice.id}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-medium text-white text-xs">{invoice.client}</div>
                      <div className="text-[10px] text-neutral-500">{invoice.email}</div>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-400 text-[11px] font-sans">{invoice.date}</td>
                    <td className="py-2.5 px-3 text-neutral-400 text-[11px] font-sans">{invoice.dueDate}</td>
                    <td className="py-2.5 px-3 font-semibold text-white text-xs">{invoice.amount}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-semibold uppercase rounded-none border ${
                          invoice.status === "Paid"
                            ? "bg-[#00D2B5]/10 text-[#00D2B5] border-[#00D2B5]/30"
                            : invoice.status === "Pending"
                            ? "bg-neutral-800 text-neutral-300 border-neutral-700"
                            : "bg-neutral-900 text-neutral-400 border-neutral-700"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-none ${
                            invoice.status === "Paid" ? "bg-[#00D2B5]" : "bg-neutral-400"
                          }`}
                        />
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-neutral-400">
                        <button className="p-1 hover:text-white transition rounded-none" title="Download">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-white transition rounded-none" title="Options">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
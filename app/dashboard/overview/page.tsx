"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
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
  Calendar,
  ExternalLink,
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

const statusDistribution = [
  { name: "Paid", value: 68, color: "#0D9488" },    // Teal / Emerald
  { name: "Pending", value: 22, color: "#D97706" }, // Amber
  { name: "Overdue", value: 10, color: "#E11D48" }, // Rose
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
];

export default function OverviewDashboard() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="w-full h-auto bg-[#FAFAFA] text-zinc-800 p-3 sm:p-4 font-sans select-none flex flex-col gap-3 lg:overflow-hidden overflow-y-auto">
      
      {/* Top Header Bar */}
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200/80 shrink-0">
        <div className="space-y-0.5">
          <h1 className="text-xs sm:text-sm font-bold tracking-tight text-zinc-900 uppercase flex items-center gap-2 font-mono">
            <span className="w-1.5 h-3 bg-teal-600 inline-block" />
            Overview Dashboard
          </h1>
          <p className="text-[11px] text-zinc-400 font-sans">
            Real-time telemetry, revenue analytics & invoice collections.
          </p>
        </div>

        <div className="flex items-center gap-2 font-sans">
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-white border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 transition-colors rounded-xs shadow-2xs cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Last 30 Days</span>
          </button>
          
          <Link href="/dashboard/createInvoice">
            <button className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-zinc-950 text-white hover:bg-black transition-colors rounded-xs shadow-2xs cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Metrics Row (Fixed Shrink) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 shrink-0">
        
        {/* Metric 1 */}
        <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Total Revenue
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight font-mono">
              ₹1,21,500
            </h3>
            <p className="text-[10px] font-sans text-teal-700 font-medium">
              +14.2% <span className="text-zinc-400 font-normal">vs prev</span>
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Pending
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight font-mono">
              ₹28,500
            </h3>
            <p className="text-[10px] font-sans text-zinc-400">
              2 active pending
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Overdue
            </span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight font-mono">
              ₹12,000
            </h3>
            <p className="text-[10px] font-sans text-zinc-400">
              1 past due date
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Paid Rate
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight font-mono">
              88.5%
            </h3>
            <p className="text-[10px] font-sans text-zinc-400">
              Avg 6-day turnaround
            </p>
          </div>
        </div>

      </div>

      {/* Analytics Charts Section (Flex-1 expands/contracts to fit space) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 flex-1 min-h-85">
        
        {/* Cash Flow Chart */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs flex flex-col justify-between lg:min-h-full min-h-80">
          <div className="flex justify-between items-center font-sans shrink-0 mb-1">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
              Cash Flow Telemetry
            </h2>

            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-teal-600 rounded-2xs" />
                <span className="text-zinc-500 uppercase">COLLECTED</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-2xs" />
                <span className="text-zinc-500 uppercase">PENDING</span>
              </div>
            </div>
          </div>

          <div className="w-full flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyRevenueData}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenueLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#F1F1F4" vertical={false} />
                <XAxis dataKey="month" stroke="#A1A1AA" fontSize={9} tickLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E4E4E7",
                    borderRadius: "2px",
                    color: "#18181B",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0D9488"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenueLight)"
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stroke="#A1A1AA"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Donut Chart */}
        <div className="lg:col-span-4 bg-white border  border-zinc-200/80 p-3 rounded-xs shadow-2xs flex flex-col justify-between lg:min-h-full min-h-60">
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono shrink-0">
            Status Breakdown
          </h2>

          <div className="w-full flex-1 min-h-0 relative flex items-center justify-center my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="100%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E4E4E7",
                    borderRadius: "2px",
                    fontSize: "10px",
                    color: "#18181B",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-bold text-zinc-900 font-mono">88.5%</span>
              <span className="text-[8px] text-zinc-400 font-mono uppercase">PAID</span>
            </div>
          </div>

          <div className="flex justify-around pt-2 border-t border-zinc-100 text-[10px] font-mono shrink-0">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-zinc-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Invoices Table Section (Fixed Shrink) */}
      <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs shrink-0 space-y-2">
        
        {/* Table Controls */}
        <div className="flex justify-between items-center gap-2 font-sans">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
              Recent Activity
            </h2>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
              (2 latest records)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter segmented control */}
            <div className="flex items-center bg-zinc-100/70 p-0.5 border border-zinc-200/80 rounded-2xs text-[10px] font-mono">
              {["All", "Paid", "Pending"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`px-2 py-0.5 font-semibold transition-all cursor-pointer uppercase ${
                    filter === item
                      ? "bg-white text-zinc-900 border border-zinc-200 shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <Link
              href="/invoices"
              className="flex items-center gap-1 text-[11px] text-teal-700 hover:text-teal-800 transition-colors font-medium"
            >
              <span className="hidden sm:inline">View All</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-zinc-200/80 rounded-2xs">
          <table className="w-full text-left text-xs text-zinc-700 font-sans">
            <thead className="bg-zinc-50 border-b border-zinc-200/80 text-zinc-400 font-mono uppercase text-[9px] tracking-wider">
              <tr>
                <th className="py-2 px-3">Invoice ID</th>
                <th className="py-2 px-3">Client</th>
                <th className="py-2 px-3">Issued</th>
                <th className="py-2 px-3">Due</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {recentInvoices
                .filter((inv) => filter === "All" || inv.status === filter)
                .map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-zinc-50/80 transition-colors"
                  >
                    <td className="py-2 px-3 font-mono text-[11px] text-zinc-500 font-semibold">
                      {invoice.id}
                    </td>
                    <td className="py-2 px-3">
                      <div className="font-medium text-zinc-900 text-xs leading-tight">
                        {invoice.client}
                      </div>
                      <div className="text-[9px] text-zinc-400 font-mono leading-tight">
                        {invoice.email}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-zinc-500 text-[10px] font-mono">
                      {invoice.date}
                    </td>
                    <td className="py-2 px-3 text-zinc-500 text-[10px] font-mono">
                      {invoice.dueDate}
                    </td>
                    <td className="py-2 px-3 font-semibold text-zinc-900 font-mono text-xs">
                      {invoice.amount}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-2xs border ${
                          invoice.status === "Paid"
                            ? "bg-teal-50 text-teal-800 border-teal-200/80"
                            : "bg-amber-50 text-amber-800 border-amber-200/80"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            invoice.status === "Paid"
                              ? "bg-teal-600"
                              : "bg-amber-600"
                          }`}
                        />
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer rounded-2xs hover:bg-zinc-100"
                        title="Manage Invoice"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
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
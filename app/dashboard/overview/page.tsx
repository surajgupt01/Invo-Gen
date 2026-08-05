"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  BarChart,
  Bar,
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
  ExternalLink,
  ChevronDown,
  Loader2,
} from "lucide-react";

export interface InvoiceRecord {
  InvoiceId: string;
  invoiceNumber: string;
  CustomerName: string | null;
  CustomerEmail: string | null;
  CustomerAddress: string | null;
  Subject: string | null;
  IssueDate: string;
  DueDate: string;
  Currency: string;
  subtotal: string | number;
  tax: string | number;
  discount: string | number;
  total: string | number;
  paymentStatus: "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

interface InvoicesApiResponse {
  invoices: InvoiceRecord[];
  meta?: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const STATUS_COLORS: Record<string, string> = {
  PAID: "#0D9488",
  PENDING: "#D97706",
  OVERDUE: "#E11D48",
  DRAFT: "#71717A",
  CANCELLED: "#A1A1AA",
};

export default function OverviewDashboard() {
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  const currentYearStr = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr);
  const [selectedQuarter, setSelectedQuarter] = useState<string>("ALL");
  const [recentFilter, setRecentFilter] = useState("All");

  // Fetch all user invoices from database
  const { data, isLoading } = useQuery<InvoicesApiResponse>({
    queryKey: ["dashboard-invoices", userId],
    queryFn: async () => {
      if (!userId) return { invoices: [] };
      const res = await fetch(`/api/invoice?userId=${userId}&limit=1000`);
      if (!res.ok) throw new Error("Failed to fetch dashboard telemetry");
      return res.json();
    },
    enabled: !!userId,
  });

  const rawInvoices = data?.invoices || [];

  // DYNAMIC: Extract unique years present in the database records
  const availableYears = useMemo(() => {
    if (!rawInvoices.length) return [currentYearStr];

    const yearSet = new Set<string>();
    rawInvoices.forEach((inv) => {
      if (inv.IssueDate) {
        const year = new Date(inv.IssueDate).getFullYear().toString();
        if (!isNaN(Number(year))) {
          yearSet.add(year);
        }
      }
    });

    // Ensure the current year is always available in the selector
    yearSet.add(currentYearStr);

    // Sort years descending (e.g., 2027, 2026, 2025, 2024)
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
  }, [rawInvoices, currentYearStr]);

  // Sync selectedYear if the active year is not in the extracted list
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // 1. Calculate high-level metrics across all user invoices
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalPending = 0;
    let totalOverdue = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let paidCount = 0;

    const now = new Date();

    rawInvoices.forEach((inv) => {
      const amount = Number(inv.total) || 0;
      const isPastDue = new Date(inv.DueDate) < now && inv.paymentStatus !== "PAID";

      if (inv.paymentStatus === "PAID") {
        totalRevenue += amount;
        paidCount += 1;
      } else if (inv.paymentStatus === "PENDING") {
        if (isPastDue) {
          totalOverdue += amount;
          overdueCount += 1;
        } else {
          totalPending += amount;
          pendingCount += 1;
        }
      } else if (inv.paymentStatus === "OVERDUE") {
        totalOverdue += amount;
        overdueCount += 1;
      }
    });

    const totalTracked = paidCount + pendingCount + overdueCount;
    const paidRate = totalTracked > 0 ? ((paidCount / totalTracked) * 100).toFixed(1) : "0.0";

    return {
      totalRevenue,
      totalPending,
      totalOverdue,
      pendingCount,
      overdueCount,
      paidRate,
      paidCount,
      totalTracked,
    };
  }, [rawInvoices]);

  // 2. Aggregate telemetry data by month for selected fiscal year & quarter
  const chartData = useMemo(() => {
    const monthsMap: Record<number, { month: string; revenue: number; pending: number }> = {};

    for (let i = 0; i < 12; i++) {
      monthsMap[i] = { month: MONTH_NAMES[i], revenue: 0, pending: 0 };
    }

    rawInvoices.forEach((inv) => {
      const dateObj = new Date(inv.IssueDate);
      const invYear = dateObj.getFullYear().toString();

      if (invYear === selectedYear) {
        const monthIdx = dateObj.getMonth();
        const amt = Number(inv.total) || 0;

        if (inv.paymentStatus === "PAID") {
          monthsMap[monthIdx].revenue += amt;
        } else if (inv.paymentStatus === "PENDING" || inv.paymentStatus === "DRAFT") {
          monthsMap[monthIdx].pending += amt;
        }
      }
    });

    let result = Object.keys(monthsMap).map((key) => {
      const idx = Number(key);
      return {
        monthIndex: idx,
        ...monthsMap[idx],
      };
    });

    // Apply Quarter Filtering
    if (selectedQuarter === "Q1") result = result.filter((d) => d.monthIndex <= 2);
    if (selectedQuarter === "Q2") result = result.filter((d) => d.monthIndex >= 3 && d.monthIndex <= 5);
    if (selectedQuarter === "Q3") result = result.filter((d) => d.monthIndex >= 6 && d.monthIndex <= 8);
    if (selectedQuarter === "Q4") result = result.filter((d) => d.monthIndex >= 9);

    return result;
  }, [rawInvoices, selectedYear, selectedQuarter]);

  // 3. Status breakdown calculation for Donut Chart
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = { Paid: 0, Pending: 0, Overdue: 0 };

    rawInvoices.forEach((inv) => {
      if (inv.paymentStatus === "PAID") counts.Paid += 1;
      else if (inv.paymentStatus === "OVERDUE") counts.Overdue += 1;
      else counts.Pending += 1;
    });

    return [
      { name: "Paid", value: counts.Paid, color: STATUS_COLORS.PAID },
      { name: "Pending", value: counts.Pending, color: STATUS_COLORS.PENDING },
      { name: "Overdue", value: counts.Overdue, color: STATUS_COLORS.OVERDUE },
    ];
  }, [rawInvoices]);

  return (
    <div className="w-full h-auto bg-[#FAFAFA] text-zinc-800 p-3 sm:p-4 font-sans select-none flex flex-col gap-3 lg:overflow-hidden overflow-y-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-200/80 shrink-0">
        <div className="space-y-0.5">
          <h1 className="text-xs sm:text-sm font-bold tracking-tight text-zinc-900 uppercase flex items-center gap-2 font-mono">
            <span className="w-1.5 h-3 bg-teal-600 inline-block" />
            Overview Dashboard
          </h1>
          <p className="text-[11px] text-zinc-400 font-sans">
            Real-time telemetry, revenue analytics & invoice collections.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 font-sans flex-wrap">
          {/* DYNAMIC: Fiscal Year Filter populated from DB */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none px-2.5 py-1 pr-6 text-xs bg-white border border-zinc-200/80 text-zinc-800 font-mono font-medium rounded-xs shadow-2xs cursor-pointer focus:outline-none"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  FY {year}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Quarter Segmented Filter */}
          <div className="flex items-center bg-zinc-100/70 p-0.5 border border-zinc-200/80 rounded-2xs text-[10px] font-mono">
            {["ALL", "Q1", "Q2", "Q3", "Q4"].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setSelectedQuarter(q)}
                className={`px-2 py-0.5 font-semibold transition-all cursor-pointer ${
                  selectedQuarter === q
                    ? "bg-white text-zinc-900 border border-zinc-200 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <Link href="/dashboard/createInvoice">
            <button className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-zinc-950 text-white hover:bg-black transition-colors rounded-xs shadow-2xs cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Dynamic Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 shrink-0">
        <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Total Revenue
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight font-mono">
              ₹{metrics.totalRevenue.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] font-sans text-teal-700 font-medium">
              Collected <span className="text-zinc-400 font-normal">from settled invoices</span>
            </p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Pending
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight font-mono">
              ₹{metrics.totalPending.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] font-sans text-zinc-400">
              {metrics.pendingCount} active pending
            </p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Overdue
            </span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight font-mono">
              ₹{metrics.totalOverdue.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] font-sans text-zinc-400">
              {metrics.overdueCount} past due date
            </p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Paid Rate
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight font-mono">
              {metrics.paidRate}%
            </h3>
            <p className="text-[10px] font-sans text-zinc-400">
              {metrics.paidCount} of {metrics.totalTracked} resolved
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 flex-1 min-h-85">
        {/* Cash Flow Bar Chart */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs flex flex-col justify-between lg:min-h-full min-h-80">
          <div className="flex justify-between items-center font-sans shrink-0 mb-1">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
              Cash Flow Telemetry ({selectedYear})
            </h2>

            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#1875f0] rounded-2xs" />
                <span className="text-zinc-500 uppercase">COLLECTED</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-black rounded-2xs" />
                <span className="text-zinc-500 uppercase">PENDING</span>
              </div>
            </div>
          </div>

          <div className="w-full flex-1 min-h-0 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="2 2" stroke="#F1F1F4" vertical={false} />
                  <XAxis dataKey="month" stroke="#A1A1AA" fontSize={9} tickLine={false} />
                  <YAxis stroke="#A1A1AA" fontSize={9} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "#F4F4F5", opacity: 0.5 }}
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
                  <Bar
                    dataKey="revenue"
                    name="Collected"
                    fill="#1875f0"
                    radius={[2, 2, 0, 0]}
                    barSize={12}
                  />
                  <Bar
                    dataKey="pending"
                    name="Pending"
                    fill="#000000"
                    radius={[2, 2, 0, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status Breakdown Donut Chart */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs flex flex-col justify-between lg:min-h-full min-h-60">
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
              <span className="text-sm font-bold text-zinc-900 font-mono">
                {metrics.paidRate}%
              </span>
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

      {/* Invoices Table Section */}
      <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs shrink-0 space-y-2">
        <div className="flex justify-between items-center gap-2 font-sans">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
              Recent Activity
            </h2>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
              (Latest live database records)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-zinc-100/70 p-0.5 border border-zinc-200/80 rounded-2xs text-[10px] font-mono">
              {["All", "Paid", "Pending", "Overdue"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRecentFilter(item)}
                  className={`px-2 py-0.5 font-semibold transition-all cursor-pointer uppercase ${
                    recentFilter === item
                      ? "bg-white text-zinc-900 border border-zinc-200 shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <Link
              href="/dashboard/invoices"
              className="flex items-center gap-1 text-[11px] text-teal-700 hover:text-teal-800 transition-colors font-medium"
            >
              <span className="hidden sm:inline">View All</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-zinc-400 font-mono text-xs">
                    Loading recent activity...
                  </td>
                </tr>
              ) : rawInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-zinc-400 font-mono text-xs">
                    No invoices recorded yet.
                  </td>
                </tr>
              ) : (
                rawInvoices
                  .filter((inv) =>
                    recentFilter === "All"
                      ? true
                      : inv.paymentStatus.toUpperCase() === recentFilter.toUpperCase()
                  )
                  .slice(0, 2)
                  .map((inv) => (
                    <tr key={inv.InvoiceId} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-2 px-3 font-mono text-[11px] text-zinc-500 font-semibold">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-medium text-zinc-900 text-xs leading-tight">
                          {inv.CustomerName || "Unassigned"}
                        </div>
                        <div className="text-[9px] text-zinc-400 font-mono leading-tight">
                          {inv.CustomerEmail || "—"}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-zinc-500 text-[10px] font-mono">
                        {new Date(inv.IssueDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-2 px-3 text-zinc-500 text-[10px] font-mono">
                        {new Date(inv.DueDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-2 px-3 font-semibold text-zinc-900 font-mono text-xs">
                        {inv.Currency} {Number(inv.total).toFixed(2)}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-2xs border ${
                            inv.paymentStatus === "PAID"
                              ? "bg-teal-50 text-teal-800 border-teal-200/80"
                              : inv.paymentStatus === "OVERDUE"
                              ? "bg-rose-50 text-rose-800 border-rose-200/80"
                              : "bg-amber-50 text-amber-800 border-amber-200/80"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              inv.paymentStatus === "PAID"
                                ? "bg-teal-600"
                                : inv.paymentStatus === "OVERDUE"
                                ? "bg-rose-600"
                                : "bg-amber-600"
                            }`}
                          />
                          {inv.paymentStatus}
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
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
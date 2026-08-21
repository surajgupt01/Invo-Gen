"use client";

import React, { useState, useMemo } from "react";
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
  ChevronDown,
  ArrowUpRight,
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

interface InvoiceSummaryData {
  totalPaid: number;
  totalOverdue: number;
  totalPending: number;
  totalCount: number;
  paidCount: number;
  overdueCount: number;
  pendingCount: number;
}

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  amount?: number;
  value?: string;
  subtext: string;
  color?: "teal" | "rose" | "amber" | "default";
}

type RechartsValueType = number | string | readonly (string | number)[] | undefined;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
] as const;

const STATUS_COLORS: Record<string, string> = {
  PAID: "#0D9488",
  PENDING: "#D97706",
  OVERDUE: "#E11D48",
  DRAFT: "#71717A",
  CANCELLED: "#A1A1AA",
};

function formatNumericValue(val: RechartsValueType): number {
  if (val === undefined || val === null) return 0;
  if (Array.isArray(val)) {
    const first = val[0];
    return typeof first === "number" ? first : parseFloat(String(first)) || 0;
  }
  return typeof val === "number" ? val : parseFloat(String(val)) || 0;
}

export default function OverviewDashboard() {
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  const currentYearNum = new Date().getFullYear();
  const currentYearStr = currentYearNum.toString();

  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr);
  const [selectedQuarter, setSelectedQuarter] = useState<string>("ALL");

  // 1. Summary Query
  const { data: summary } = useQuery<InvoiceSummaryData>({
    queryKey: ["invoice-summary", userId],
    queryFn: async () => {
      const res = await fetch(`/api/invoice/summary?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch summary");
      return res.json();
    },
    enabled: !!userId,
  });

  // 2. Year-based Invoices Query
  const { data, isLoading } = useQuery<{ invoices: InvoiceRecord[] }>({
    queryKey: ["dashboard-invoices", userId, selectedYear],
    queryFn: async () => {
      if (!userId) return { invoices: [] };
      const res = await fetch(
        `/api/invoice?userId=${userId}&year=${selectedYear}&limit=1000`
      );
      if (!res.ok) throw new Error("Failed to fetch dashboard telemetry");
      return res.json();
    },
    enabled: !!userId,
  });

  const rawInvoices = useMemo(() => data?.invoices || [], [data]);

  // Fiscal Years
  const availableYears = useMemo(() => {
    const yearSet = new Set<number>();
    for (let y = currentYearNum + 2; y >= 2024; y--) {
      yearSet.add(y);
    }
    const parsedSelected = parseInt(selectedYear, 10);
    if (!isNaN(parsedSelected)) {
      yearSet.add(parsedSelected);
    }
    rawInvoices.forEach((inv) => {
      if (inv.IssueDate) {
        const invYear = new Date(inv.IssueDate).getFullYear();
        if (!isNaN(invYear)) {
          yearSet.add(invYear);
        }
      }
    });
    return Array.from(yearSet).sort((a, b) => b - a).map(String);
  }, [rawInvoices, currentYearNum, selectedYear]);

  // Totals & counts calculation
  const counts = useMemo(() => {
    const pCount = Number(summary?.paidCount ?? 0);
    const pendCount = Number(summary?.pendingCount ?? 0);
    const oCount = Number(summary?.overdueCount ?? 0);
    const tCount = Number(summary?.totalCount ?? 0);

    if (pCount === 0 && pendCount === 0 && oCount === 0 && rawInvoices.length > 0) {
      let paid = 0, pending = 0, overdue = 0;
      let totalPaid = 0, totalPending = 0, totalOverdue = 0;

      rawInvoices.forEach((inv) => {
        const amt = Number(inv.total) || 0;
        if (inv.paymentStatus === "PAID") {
          paid++;
          totalPaid += amt;
        } else if (inv.paymentStatus === "OVERDUE") {
          overdue++;
          totalOverdue += amt;
        } else if (inv.paymentStatus === "PENDING") {
          pending++;
          totalPending += amt;
        }
      });

      return {
        paid,
        pending,
        overdue,
        total: rawInvoices.length,
        totalPaid,
        totalPending,
        totalOverdue,
      };
    }

    return {
      paid: pCount,
      pending: pendCount,
      overdue: oCount,
      total: tCount,
      totalPaid: Number(summary?.totalPaid ?? 0),
      totalPending: Number(summary?.totalPending ?? 0),
      totalOverdue: Number(summary?.totalOverdue ?? 0),
    };
  }, [summary, rawInvoices]);

  // Chart data
  const chartData = useMemo(() => {
    const monthsMap = Array.from({ length: 12 }, (_, i) => ({
      monthIndex: i,
      month: MONTH_NAMES[i],
      revenue: 0,
      pending: 0,
    }));

    rawInvoices.forEach((inv) => {
      const dateObj = new Date(inv.IssueDate);
      if (dateObj.getFullYear().toString() === selectedYear) {
        const mIdx = dateObj.getMonth();
        const amt = Number(inv.total) || 0;

        if (inv.paymentStatus === "PAID") {
          monthsMap[mIdx].revenue += amt;
        } else if (inv.paymentStatus === "PENDING" || inv.paymentStatus === "DRAFT") {
          monthsMap[mIdx].pending += amt;
        }
      }
    });

    if (selectedQuarter === "Q1") return monthsMap.filter((d) => d.monthIndex <= 2);
    if (selectedQuarter === "Q2") return monthsMap.filter((d) => d.monthIndex >= 3 && d.monthIndex <= 5);
    if (selectedQuarter === "Q3") return monthsMap.filter((d) => d.monthIndex >= 6 && d.monthIndex <= 8);
    if (selectedQuarter === "Q4") return monthsMap.filter((d) => d.monthIndex >= 9);

    return monthsMap;
  }, [rawInvoices, selectedYear, selectedQuarter]);

  // Donut chart status distribution
  const statusDistribution = useMemo(() => {
    const hasData = counts.paid > 0 || counts.pending > 0 || counts.overdue > 0;

    if (!hasData) {
      return [{ name: "No Invoices", value: 1, color: "#F4F4F5" }];
    }

    return [
      { name: "Paid", value: counts.paid, color: STATUS_COLORS.PAID },
      { name: "Pending", value: counts.pending, color: STATUS_COLORS.PENDING },
      { name: "Overdue", value: counts.overdue, color: STATUS_COLORS.OVERDUE },
    ].filter((item) => item.value > 0);
  }, [counts]);

  const paidRate = useMemo(() => {
    const totalTracked = counts.paid + counts.pending + counts.overdue;
    return totalTracked > 0 ? ((counts.paid / totalTracked) * 100).toFixed(1) : "0.0";
  }, [counts]);

  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 font-sans select-none pb-16">
      {/* Top Banner / Breadcrumb area */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium mb-1">
                Luen Telemetry & Analytics
              </p>
              <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-950">
                Dashboard Overview
              </h1>
            </div>

            {/* Top Bar Actions & Filters */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Year Filter */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 text-xs bg-white border border-zinc-200 text-zinc-900 font-mono font-medium rounded-md shadow-xs cursor-pointer focus:outline-none focus:border-zinc-900"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      FY {year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Quarter Filter */}
              <div className="flex items-center bg-zinc-100 p-1 rounded-md border border-zinc-200/70 text-xs font-mono">
                {["ALL", "Q1", "Q2", "Q3", "Q4"].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSelectedQuarter(q)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-sm transition-all cursor-pointer ${
                      selectedQuarter === q
                        ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/50"
                        : "text-zinc-500 hover:text-zinc-950"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Primary Action Button */}
              <Link
                href="/dashboard/createInvoice"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-950 hover:bg-zinc-800 rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Invoice</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue"
            icon={<TrendingUp className="w-4 h-4 text-teal-600" />}
            amount={counts.totalPaid}
            subtext="Settled & collected payments"
            color="teal"
          />
          <MetricCard
            title="Pending Invoices"
            icon={<Clock className="w-4 h-4 text-amber-500" />}
            amount={counts.totalPending}
            subtext={`${counts.pending} invoices awaiting payout`}
            color="amber"
          />
          <MetricCard
            title="Overdue Balance"
            icon={<AlertCircle className="w-4 h-4 text-rose-500" />}
            amount={counts.totalOverdue}
            subtext={`${counts.overdue} invoices past due`}
            color="rose"
          />
          <MetricCard
            title="Collection Rate"
            icon={<CheckCircle2 className="w-4 h-4 text-zinc-700" />}
            value={`${paidRate}%`}
            subtext={`${counts.paid} of ${counts.total} resolved`}
          />
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Revenue & Cash Flow Bar Chart */}
          <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs flex flex-col justify-between min-h-[380px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100 mb-4">
              <div>
                <h2 className="text-sm font-medium text-zinc-950 tracking-tight">
                  Cash Flow Activity
                </h2>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Collected vs Pending for FY {selectedYear}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-zinc-600">
                  <span className="w-2 h-2 bg-teal-600 rounded-xs" />
                  Collected
                </span>
                <span className="flex items-center gap-1.5 text-zinc-600">
                  <span className="w-2 h-2 bg-zinc-950 rounded-xs" />
                  Pending
                </span>
              </div>
            </div>

            <div className="w-full flex-1 min-h-[260px] relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                    <XAxis dataKey="month" stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={{ stroke: "#E4E4E7" }} />
                    <YAxis stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "#F4F4F5", opacity: 0.6 }}
                      formatter={(val: RechartsValueType) => [
                        `₹${formatNumericValue(val).toLocaleString("en-IN")}`,
                        "Amount",
                      ]}
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E4E4E7",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      }}
                    />
                    <Bar dataKey="revenue" name="Collected" fill="#0D9488" radius={[4, 4, 0, 0]} barSize={14} />
                    <Bar dataKey="pending" name="Pending" fill="#18181B" radius={[4, 4, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Status Breakdown Donut Chart */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs flex flex-col justify-between min-h-[380px]">
            <div className="pb-4 border-b border-zinc-100">
              <h2 className="text-sm font-medium text-zinc-950 tracking-tight">
                Status Distribution
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                Current invoice lifecycle
              </p>
            </div>

            <div className="w-full flex-1 relative flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={80}
                    paddingAngle={statusDistribution.length > 1 ? 4 : 0}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: RechartsValueType, name: unknown) => [
                      String(name) === "No Invoices" ? 0 : formatNumericValue(val),
                      String(name ?? ""),
                    ]}
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E4E4E7",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontFamily: "monospace",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-zinc-950 font-mono">
                  {paidRate}%
                </span>
                <span className="text-[9px] text-zinc-400 font-mono uppercase tracking-wider">
                  Settled
                </span>
              </div>
            </div>

            <div className="flex justify-around pt-4 border-t border-zinc-100 text-xs font-mono">
              {[
                { name: "Paid", color: STATUS_COLORS.PAID },
                { name: "Pending", color: STATUS_COLORS.PENDING },
                { name: "Overdue", color: STATUS_COLORS.OVERDUE },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recent Invoices Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
          <div className="flex items-center justify-between p-5 border-b border-zinc-200">
            <div>
              <h2 className="text-sm font-medium text-zinc-950 tracking-tight">
                Recent Invoices
              </h2>
              <p className="text-xs text-zinc-500">
                Latest client activity and invoice settlements
              </p>
            </div>
            
            <Link
              href="/dashboard/invoices"
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              <span>View All Invoices</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <RecentActivityTable invoices={rawInvoices} isLoading={isLoading} />
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, icon, amount, value, subtext, color }: MetricCardProps) {
  return (
    <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-xs space-y-3 hover:border-zinc-300 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          {title}
        </span>
        <div className="p-1.5 rounded-md bg-zinc-50 border border-zinc-100">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-zinc-950 tracking-tight font-mono">
          {value !== undefined ? value : `₹${(amount || 0).toLocaleString("en-IN")}`}
        </h3>
        <p
          className={`text-xs mt-1 ${
            color === "teal"
              ? "text-teal-700 font-medium"
              : color === "rose"
              ? "text-rose-600 font-medium"
              : "text-zinc-500"
          }`}
        >
          {subtext}
        </p>
      </div>
    </div>
  );
}

function RecentActivityTable({
  invoices,
  isLoading,
}: {
  invoices: InvoiceRecord[];
  isLoading: boolean;
}) {
  const recentInvoices = useMemo(() => invoices.slice(0, 5), [invoices]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-xs text-zinc-700 font-sans">
        <thead className="bg-zinc-50/70 border-b border-zinc-200 text-zinc-400 font-mono uppercase text-[10px] tracking-wider">
          <tr>
            <th className="py-3 px-5 font-medium">Invoice</th>
            <th className="py-3 px-5 font-medium">Client</th>
            <th className="py-3 px-5 font-medium">Issued Date</th>
            <th className="py-3 px-5 font-medium">Due Date</th>
            <th className="py-3 px-5 font-medium">Amount</th>
            <th className="py-3 px-5 font-medium">Status</th>
            <th className="py-3 px-5 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="py-10 text-center text-zinc-400 font-mono text-xs">
                Loading telemetry...
              </td>
            </tr>
          ) : recentInvoices.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-10 text-center text-zinc-400 font-mono text-xs">
                No recent invoices recorded.
              </td>
            </tr>
          ) : (
            recentInvoices.map((inv) => (
              <tr key={inv.InvoiceId} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-3.5 px-5 font-mono text-xs text-zinc-900 font-semibold">
                  {inv.invoiceNumber}
                </td>
                <td className="py-3.5 px-5">
                  <div className="font-medium text-zinc-900 text-xs leading-tight">
                    {inv.CustomerName || "Unassigned"}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono leading-tight mt-0.5">
                    {inv.CustomerEmail || "—"}
                  </div>
                </td>
                <td className="py-3.5 px-5 text-zinc-500 text-xs font-mono">
                  {new Date(inv.IssueDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3.5 px-5 text-zinc-500 text-xs font-mono">
                  {new Date(inv.DueDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3.5 px-5 font-medium text-zinc-950 font-mono text-xs">
                  {inv.Currency} {Number(inv.total).toFixed(2)}
                </td>
                <td className="py-3.5 px-5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium uppercase rounded-sm border ${
                      inv.paymentStatus === "PAID"
                        ? "bg-teal-50 text-teal-800 border-teal-200/80"
                        : inv.paymentStatus === "OVERDUE"
                        ? "bg-rose-50 text-rose-800 border-rose-200/80"
                        : "bg-amber-50 text-amber-800 border-amber-200/80"
                    }`}
                  >
                    {inv.paymentStatus}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <Link
                    href={`/dashboard/invoice/${inv.InvoiceId}`}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors inline-block rounded-md hover:bg-zinc-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
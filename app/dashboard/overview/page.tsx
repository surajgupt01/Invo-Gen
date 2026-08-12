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
  color?: "teal" | "default";
}

type RechartsValueType = number | string | readonly (string | number)[] | undefined;

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
] as const;

const STATUS_COLORS: Record<string, string> = {
  PAID: "#0D9488",
  PENDING: "#D97706",
  OVERDUE: "#E11D48",
  DRAFT: "#71717A",
  CANCELLED: "#A1A1AA",
};

// Helper function to extract a clean number from Recharts' ValueType
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

  // 1. Fetch pre-aggregated summary metrics
  const { data: summary } = useQuery<InvoiceSummaryData>({
    queryKey: ["invoice-summary", userId],
    queryFn: async () => {
      const res = await fetch(`/api/invoice/summary?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch summary");
      return res.json();
    },
    enabled: !!userId,
  });

  // 2. Fetch invoices specifically for selected year
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

  // Dynamic fiscal year window generator
  const availableYears = useMemo(() => {
    const yearSet = new Set<number>();

    for (let y = currentYearNum + 3; y >= 2024; y--) {
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

    return Array.from(yearSet)
      .sort((a, b) => b - a)
      .map(String);
  }, [rawInvoices, currentYearNum, selectedYear]);

  // Compute metric row totals with live fallback
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

  // Monthly telemetry calculation for bar chart
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

  // Status breakdown for donut chart
  const statusDistribution = useMemo(() => {
    const hasData = counts.paid > 0 || counts.pending > 0 || counts.overdue > 0;

    if (!hasData) {
      return [{ name: "No Invoices", value: 1, color: "#E4E4E7" }];
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
    <div className="w-full h-auto bg-[#FAFAFA] text-zinc-800 p-3 sm:p-4 font-sans select-none flex flex-col gap-3 lg:overflow-hidden overflow-y-auto">
      {/* Header */}
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

        <div className="flex items-center gap-2 font-sans flex-wrap">
          {/* Fiscal Year Filter Dropdown */}
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

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 shrink-0">
        <MetricCard
          title="Total Revenue"
          icon={<TrendingUp className="w-3.5 h-3.5 text-teal-600" />}
          amount={counts.totalPaid}
          subtext="Collected from settled invoices"
          color="teal"
        />
        <MetricCard
          title="Pending"
          icon={<Clock className="w-3.5 h-3.5 text-amber-600" />}
          amount={counts.totalPending}
          subtext={`${counts.pending} active pending`}
        />
        <MetricCard
          title="Overdue"
          icon={<AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
          amount={counts.totalOverdue}
          subtext={`${counts.overdue} past due date`}
        />
        <MetricCard
          title="Paid Rate"
          icon={<CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
          value={`${paidRate}%`}
          subtext={`${counts.paid} of ${counts.total} resolved`}
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 flex-1 min-h-85">
        {/* Cash Flow Bar Chart */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs flex flex-col justify-between lg:min-h-full min-h-80">
          <div className="flex justify-between items-center font-sans shrink-0 mb-1">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
              Cash Flow Telemetry ({selectedYear})
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-zinc-500 uppercase">
                <span className="w-1.5 h-1.5 bg-[#1875f0] rounded-2xs" />
                COLLECTED
              </span>
              <span className="flex items-center gap-1 text-zinc-500 uppercase">
                <span className="w-1.5 h-1.5 bg-black rounded-2xs" />
                PENDING
              </span>
            </div>
          </div>

          <div className="w-full flex-1 min-h-0 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#F1F1F4" vertical={false} />
                  <XAxis dataKey="month" stroke="#A1A1AA" fontSize={9} tickLine={false} />
                  <YAxis stroke="#A1A1AA" fontSize={9} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "#F4F4F5", opacity: 0.5 }}
                    formatter={(val: RechartsValueType) => [
                      `₹${formatNumericValue(val).toLocaleString("en-IN")}`,
                      "Amount",
                    ]}
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E4E4E7",
                      borderRadius: "2px",
                      fontSize: "10px",
                      fontFamily: "monospace",
                    }}
                  />
                  <Bar dataKey="revenue" name="Collected" fill="#1875f0" radius={[2, 2, 0, 0]} barSize={12} />
                  <Bar dataKey="pending" name="Pending" fill="#000000" radius={[2, 2, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status Donut Chart */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs flex flex-col justify-between lg:min-h-full min-h-60">
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono shrink-0">
            Status Breakdown
          </h2>

          <div className="w-full flex-1 min-h-36 relative flex items-center justify-center my-1">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={statusDistribution.length > 1 ? 3 : 0}
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
                    borderRadius: "2px",
                    fontSize: "10px",
                    fontFamily: "monospace",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-bold text-zinc-900 font-mono">
                {paidRate}%
              </span>
              <span className="text-[8px] text-zinc-400 font-mono uppercase">PAID</span>
            </div>
          </div>

          <div className="flex justify-around pt-2 border-t border-zinc-100 text-[10px] font-mono shrink-0">
            {[
              { name: "Paid", color: STATUS_COLORS.PAID },
              { name: "Pending", color: STATUS_COLORS.PENDING },
              { name: "Overdue", color: STATUS_COLORS.OVERDUE },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table (Strictly 2 most recent records) */}
      <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs shrink-0 space-y-2">
        <div className="flex justify-between items-center gap-2 font-sans">
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
            Recent Activity
          </h2>
          <Link href="/dashboard/invoices" className="flex items-center gap-1 text-[11px] text-teal-700 hover:text-teal-800 transition-colors font-medium">
            <span className="hidden sm:inline">View All</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <RecentActivityTable invoices={rawInvoices} isLoading={isLoading} />
      </div>
    </div>
  );
}

function MetricCard({ title, icon, amount, value, subtext, color }: MetricCardProps) {
  return (
    <div className="bg-white border border-zinc-200/80 p-3 rounded-xs shadow-2xs space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">{title}</span>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight font-mono">
          {value !== undefined ? value : `₹${(amount || 0).toLocaleString("en-IN")}`}
        </h3>
        <p className={`text-[10px] font-sans ${color === "teal" ? "text-teal-700 font-medium" : "text-zinc-400"}`}>{subtext}</p>
      </div>
    </div>
  );
}

function RecentActivityTable({ invoices, isLoading }: { invoices: InvoiceRecord[]; isLoading: boolean }) {
  const recentInvoices = useMemo(() => invoices.slice(0, 2), [invoices]);

  return (
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
            <tr><td colSpan={7} className="py-6 text-center text-zinc-400 font-mono text-xs">Loading activity...</td></tr>
          ) : recentInvoices.length === 0 ? (
            <tr><td colSpan={7} className="py-6 text-center text-zinc-400 font-mono text-xs">No records found.</td></tr>
          ) : (
            recentInvoices.map((inv) => (
              <tr key={inv.InvoiceId} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-2 px-3 font-mono text-[11px] text-zinc-500 font-semibold">{inv.invoiceNumber}</td>
                <td className="py-2 px-3">
                  <div className="font-medium text-zinc-900 text-xs leading-tight">{inv.CustomerName || "Unassigned"}</div>
                  <div className="text-[9px] text-zinc-400 font-mono leading-tight">{inv.CustomerEmail || "—"}</div>
                </td>
                <td className="py-2 px-3 text-zinc-500 text-[10px] font-mono">{new Date(inv.IssueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td className="py-2 px-3 text-zinc-500 text-[10px] font-mono">{new Date(inv.DueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td className="py-2 px-3 font-semibold text-zinc-900 font-mono text-xs">{inv.Currency} {Number(inv.total).toFixed(2)}</td>
                <td className="py-2 px-3">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-2xs border ${
                    inv.paymentStatus === "PAID" ? "bg-teal-50 text-teal-800 border-teal-200/80" :
                    inv.paymentStatus === "OVERDUE" ? "bg-rose-50 text-rose-800 border-rose-200/80" :
                    "bg-amber-50 text-amber-800 border-amber-200/80"
                  }`}>
                    {inv.paymentStatus}
                  </span>
                </td>
                <td className="py-2 px-3 text-right">
                  <button type="button" className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors rounded-2xs hover:bg-zinc-100">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
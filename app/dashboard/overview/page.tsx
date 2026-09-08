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
  discount: string | number | null;
  total: string | number;
  paymentStatus: "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

interface MonthlyBarData {
  monthIndex: number;
  month: string;
  revenue: number;
  pending: number;
}

interface DashboardStatsResponse {
  activeCurrency: string;
  availableCurrencies: string[];
  availableYears: string[];
  summary: {
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    paidCount: number;
    pendingCount: number;
    overdueCount: number;
    totalCount: number;
  };
  chartData: MonthlyBarData[];
  recentInvoices: InvoiceRecord[];
}

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  amount?: number;
  value?: string;
  subtext: string;
  currency?: string;
  color?: "teal" | "rose" | "amber" | "default";
}

type RechartsValueType =
  | number
  | string
  | readonly (string | number)[]
  | undefined;

const STATUS_COLORS: Record<string, string> = {
  PAID: "#0D9488",
  PENDING: "#D97706",
  OVERDUE: "#E11D48",
  DRAFT: "#71717A",
  CANCELLED: "#A1A1AA",
};

function formatCurrency(
  amount: number | string | undefined | null,
  currency = "INR",
): string {
  const num =
    typeof amount === "number" ? amount : parseFloat(String(amount || 0)) || 0;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${currency.toUpperCase()} ${num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

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

  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr);
  const [selectedQuarter, setSelectedQuarter] = useState<string>("ALL");

  // Single query delegating aggregation to PostgreSQL backend
  const { data, isLoading } = useQuery<DashboardStatsResponse>({
    queryKey: ["dashboard-stats", userId, selectedCurrency, selectedYear],
    queryFn: async () => {
      if (!userId) return null;
      const params = new URLSearchParams({
        userId,
        stats: "true",
        year: selectedYear,
        ...(selectedCurrency ? { currency: selectedCurrency } : {}),
      });

      const res = await fetch(`/api/invoice?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
    enabled: !!userId,
  });

  // Sync active currency from DB response
  useEffect(() => {
    if (data?.activeCurrency && !selectedCurrency) {
      setSelectedCurrency(data.activeCurrency);
    }
  }, [data?.activeCurrency, selectedCurrency]);

  const activeCurrency = data?.activeCurrency || selectedCurrency || "INR";
  const availableCurrencies = useMemo(() => {
    if (data?.availableCurrencies && data.availableCurrencies.length > 0) {
      return data.availableCurrencies;
    }
    return [activeCurrency];
  }, [data?.availableCurrencies, activeCurrency]);

  // Fiscal Years

  // Read available years directly from DB response
  const availableYears = useMemo(() => {
    if (data?.availableYears && data.availableYears.length > 0) {
      return data.availableYears;
    }
    return [currentYearStr];
  }, [data?.availableYears, currentYearStr]);

  // If the currently selected year isn't in the available range, auto-select the highest available year
  useEffect(() => {
    if (data?.availableYears && data.availableYears.length > 0) {
      if (!data.availableYears.includes(selectedYear)) {
        setSelectedYear(data.availableYears[0]); // [0] is the highest year
      }
    }
  }, [data?.availableYears, selectedYear]);

  // Summary counts and financial metrics from backend
  const summary = data?.summary;
  const totalPaid = summary?.totalPaid ?? 0;
  const totalPending = summary?.totalPending ?? 0;
  const totalOverdue = summary?.totalOverdue ?? 0;
  const paidCount = summary?.paidCount ?? 0;
  const pendingCount = summary?.pendingCount ?? 0;
  const overdueCount = summary?.overdueCount ?? 0;
  const totalInvoices = summary?.totalCount ?? 0;

  // Paid rate handling 0/0 edge case
  const paidRate = useMemo(() => {
    const totalTracked = paidCount + pendingCount + overdueCount;
    return totalTracked > 0
      ? ((paidCount / totalTracked) * 100).toFixed(1)
      : "0.0";
  }, [paidCount, pendingCount, overdueCount]);

  // Quarter filtering over the pre-computed 12-month SQL aggregate
  const filteredChartData = useMemo(() => {
    const rawData = data?.chartData || [];
    if (selectedQuarter === "Q1")
      return rawData.filter((d) => d.monthIndex <= 2);
    if (selectedQuarter === "Q2")
      return rawData.filter((d) => d.monthIndex >= 3 && d.monthIndex <= 5);
    if (selectedQuarter === "Q3")
      return rawData.filter((d) => d.monthIndex >= 6 && d.monthIndex <= 8);
    if (selectedQuarter === "Q4")
      return rawData.filter((d) => d.monthIndex >= 9);
    return rawData;
  }, [data?.chartData, selectedQuarter]);

  // Donut chart status distribution
  const statusDistribution = useMemo(() => {
    const hasData = paidCount > 0 || pendingCount > 0 || overdueCount > 0;

    if (!hasData) {
      return [{ name: "No Invoices", value: 1, color: "#F4F4F5" }];
    }

    return [
      { name: "Paid", value: paidCount, color: STATUS_COLORS.PAID },
      { name: "Pending", value: pendingCount, color: STATUS_COLORS.PENDING },
      { name: "Overdue", value: overdueCount, color: STATUS_COLORS.OVERDUE },
    ].filter((item) => item.value > 0);
  }, [paidCount, pendingCount, overdueCount]);

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
              {/* Currency Filter */}
              <div className="relative">
                <select
                  value={activeCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 text-xs bg-white border border-zinc-200 text-zinc-900 font-mono font-medium rounded-md shadow-xs cursor-pointer focus:outline-none focus:border-zinc-900"
                >
                  {availableCurrencies.map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

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
            amount={totalPaid}
            currency={activeCurrency}
            subtext="Settled & collected payments"
            color="teal"
          />
          <MetricCard
            title="Pending Invoices"
            icon={<Clock className="w-4 h-4 text-amber-500" />}
            amount={totalPending}
            currency={activeCurrency}
            subtext={`${pendingCount} invoices awaiting payout`}
            color="amber"
          />
          <MetricCard
            title="Overdue Balance"
            icon={<AlertCircle className="w-4 h-4 text-rose-500" />}
            amount={totalOverdue}
            currency={activeCurrency}
            subtext={`${overdueCount} invoices past due`}
            color="rose"
          />
          <MetricCard
            title="Collection Rate"
            icon={<CheckCircle2 className="w-4 h-4 text-zinc-700" />}
            value={`${paidRate}%`}
            subtext={`${paidCount} of ${totalInvoices} resolved`}
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
                  Collected vs Pending ({activeCurrency}) for FY {selectedYear}
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
                  <BarChart
                    data={filteredChartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barGap={6}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#F4F4F5"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#A1A1AA"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#E4E4E7" }}
                    />
                    <YAxis
                      stroke="#A1A1AA"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#F4F4F5", opacity: 0.6 }}
                      formatter={(val: RechartsValueType) => [
                        formatCurrency(formatNumericValue(val), activeCurrency),
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
                    <Bar
                      dataKey="revenue"
                      name="Collected"
                      fill="#0D9488"
                      radius={[4, 4, 0, 0]}
                      barSize={14}
                    />
                    <Bar
                      dataKey="pending"
                      name="Pending"
                      fill="#18181B"
                      radius={[4, 4, 0, 0]}
                      barSize={14}
                    />
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
                Current invoice lifecycle ({activeCurrency})
              </p>
            </div>

            <div className="w-full flex-1 relative flex items-center justify-center my-2">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              ) : (
                <>
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
                          String(name) === "No Invoices"
                            ? 0
                            : formatNumericValue(val),
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
                </>
              )}
            </div>

            <div className="flex justify-around pt-4 border-t border-zinc-100 text-xs font-mono">
              {[
                { name: "Paid", color: STATUS_COLORS.PAID },
                { name: "Pending", color: STATUS_COLORS.PENDING },
                { name: "Overdue", color: STATUS_COLORS.OVERDUE },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
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
                Recent Invoices ({activeCurrency})
              </h2>
              <p className="text-xs text-zinc-500">
                Latest client activity and invoice settlements in{" "}
                {activeCurrency}
              </p>
            </div>

            <Link
              href={`/dashboard/invoices?currency=${activeCurrency}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              <span>View All Invoices</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <RecentActivityTable
            invoices={data?.recentInvoices || []}
            isLoading={isLoading}
            currency={activeCurrency}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  icon,
  amount,
  value,
  subtext,
  currency = "INR",
  color,
}: MetricCardProps) {
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
          {value !== undefined ? value : formatCurrency(amount, currency)}
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
  currency,
}: {
  invoices: InvoiceRecord[];
  isLoading: boolean;
  currency: string;
}) {
  const safeFormatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
            {/* <th className="py-3 px-5 text-right font-medium">Action</th> */}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white">
          {isLoading ? (
            <tr>
              <td
                colSpan={7}
                className="py-10 text-center text-zinc-400 font-mono text-xs"
              >
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  <span>Loading telemetry...</span>
                </div>
              </td>
            </tr>
          ) : invoices.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-10 text-center text-zinc-400 font-mono text-xs"
              >
                No recent invoices recorded for {currency}.
              </td>
            </tr>
          ) : (
            invoices.map((inv) => (
              <tr
                key={inv.InvoiceId}
                className="hover:bg-zinc-50/80 transition-colors"
              >
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
                  {safeFormatDate(inv.IssueDate)}
                </td>
                <td className="py-3.5 px-5 text-zinc-500 text-xs font-mono">
                  {safeFormatDate(inv.DueDate)}
                </td>
                <td className="py-3.5 px-5 font-medium text-zinc-950 font-mono text-xs">
                  {formatCurrency(inv.total, inv.Currency || currency)}
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
                {/* <td className="py-3.5 px-5 text-right">
                  <Link
                    href={`/dashboard/invoice/${inv.InvoiceId}`}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors inline-block rounded-md hover:bg-zinc-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Link>
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

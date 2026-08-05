"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  FileText,
  MoreVertical,
  Check,
  AlertCircle,
  Clock,
  XCircle,
  FileEdit,
} from "lucide-react";
import Link from "next/link";

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

interface InvoicesResponse {
  invoices: InvoiceRecord[];
  meta: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const STATUS_CONFIG: Record<
  string,
  { badge: string; dot: string; icon: React.ElementType }
> = {
  DRAFT: {
    badge: "bg-zinc-100 text-zinc-700 border-zinc-300",
    dot: "bg-zinc-500",
    icon: FileEdit,
  },
  PENDING: {
    badge: "bg-amber-50 text-amber-800 border-amber-300/80",
    dot: "bg-amber-600",
    icon: Clock,
  },
  PAID: {
    badge: "bg-teal-50 text-teal-800 border-teal-300/80",
    dot: "bg-teal-600",
    icon: Check,
  },
  OVERDUE: {
    badge: "bg-rose-50 text-rose-800 border-rose-300/80",
    dot: "bg-rose-600",
    icon: AlertCircle,
  },
  CANCELLED: {
    badge: "bg-zinc-200/70 text-zinc-500 border-zinc-300",
    dot: "bg-zinc-400",
    icon: XCircle,
  },
};

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function InvoicesDashboard() {
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Set page limit to 8 items so content fits without viewport scrolling
  const limit = 8;
  const debouncedSearch = useDebounce(searchTerm, 350);

  // Fetcher Function
  const fetchInvoices = async (): Promise<InvoicesResponse> => {
    if (!userId)
      return { invoices: [], meta: { totalCount: 0, page: 1, limit, totalPages: 0 } };

    const params = new URLSearchParams({
      userId,
      search: debouncedSearch,
      status: statusFilter,
      sortBy,
      sortOrder,
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await fetch(`/api/invoice?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to load invoices");
    }
    return res.json();
  };

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["invoices", userId, debouncedSearch, statusFilter, sortBy, sortOrder, page],
    queryFn: fetchInvoices,
    enabled: !!userId,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });

  // Mutation for inline status changes
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      invoiceId,
      newStatus,
    }: {
      invoiceId: string;
      newStatus: string;
    }) => {
      const res = await fetch("/api/invoice", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, paymentStatus: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-invoices"] });
      setActiveMenuId(null);
    },
  });

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#FAFAFA] font-mono text-xs text-zinc-800 p-3 sm:p-5 overflow-hidden">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3.5 px-5 rounded-xs border border-zinc-200/80 shadow-2xs shrink-0">
        <div>
          <h1 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-teal-600 inline-block" />
            Invoice Register
          </h1>
          <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
            Manage, update status, and track customer invoice telemetry.
          </p>
        </div>

        <Link
          href="/dashboard/createInvoice"
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-950 text-white hover:bg-black rounded-xs shadow-2xs transition shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Invoice
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 my-3 shrink-0">
        {/* Search Input */}
        <div className="md:col-span-5 relative flex items-center">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search invoice #, customer name, email..."
            className="w-full bg-white border border-zinc-200/80 pl-9 pr-3 py-1.5 rounded-xs text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-teal-700 transition"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3 flex items-center gap-1.5 bg-white border border-zinc-200/80 px-2.5 py-1 rounded-xs">
          <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-[10px] uppercase font-bold text-zinc-400 shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-xs text-zinc-800 focus:outline-none cursor-pointer font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-4 flex items-center gap-1.5 bg-white border border-zinc-200/80 px-2.5 py-1 rounded-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-[10px] uppercase font-bold text-zinc-400 shrink-0">Sort By:</span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order as "asc" | "desc");
              setPage(1);
            }}
            className="w-full bg-transparent text-xs text-zinc-800 focus:outline-none cursor-pointer font-semibold"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="total-desc">Amount: High to Low</option>
            <option value="total-asc">Amount: Low to High</option>
            <option value="DueDate-asc">Due Date: Nearest First</option>
          </select>
        </div>
      </div>

      {/* Table Container - Fits exact viewport height */}
      <div className="bg-white border border-zinc-200/80 rounded-xs shadow-2xs flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {isLoading ? (
          <div className="flex-1 flex flex-col justify-center items-center p-8 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin mb-2 text-teal-700" />
            <span className="text-xs">Fetching records...</span>
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col justify-center items-center p-8 text-rose-600">
            <span className="text-xs font-bold mb-1">Failed to load invoices</span>
            <span className="text-[11px] text-zinc-500">{error?.message}</span>
          </div>
        ) : !data?.invoices || data.invoices.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center p-8 text-zinc-400">
            <FileText className="w-8 h-8 stroke-1 mb-2 text-zinc-300" />
            <span className="text-xs font-semibold text-zinc-600">No invoices found</span>
            <span className="text-[11px] text-zinc-400 mt-0.5">
              Try adjusting your query filters or create a new invoice.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200/80 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <th
                    className="py-2.5 px-3.5 cursor-pointer hover:text-zinc-800 transition"
                    onClick={() => handleSortChange("invoiceNumber")}
                  >
                    <div className="flex items-center gap-1">
                      Invoice #
                      <ArrowUpDown className="w-2.5 h-2.5" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3.5">Customer</th>
                  <th
                    className="py-2.5 px-3.5 cursor-pointer hover:text-zinc-800 transition"
                    onClick={() => handleSortChange("IssueDate")}
                  >
                    Issue Date
                  </th>
                  <th
                    className="py-2.5 px-3.5 cursor-pointer hover:text-zinc-800 transition"
                    onClick={() => handleSortChange("DueDate")}
                  >
                    Due Date
                  </th>
                  <th
                    className="py-2.5 px-3.5 text-right cursor-pointer hover:text-zinc-800 transition"
                    onClick={() => handleSortChange("total")}
                  >
                    Amount
                  </th>
                  <th className="py-2.5 px-3.5 text-center">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {data.invoices.map((inv) => {
                  const statusInfo = STATUS_CONFIG[inv.paymentStatus] || STATUS_CONFIG.PENDING;

                  return (
                    <tr
                      key={inv.InvoiceId}
                      className="hover:bg-zinc-50/80 transition duration-150 group"
                    >
                      {/* Invoice Serial */}
                      <td className="py-2.5 px-3.5 font-semibold text-zinc-900 group-hover:text-teal-700 transition">
                        {inv.invoiceNumber}
                      </td>

                      {/* Customer Information */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-800 leading-tight">
                            {inv.CustomerName || "Unassigned Client"}
                          </span>
                          <span className="text-[10px] text-zinc-400 leading-tight">
                            {inv.CustomerEmail || "No email attached"}
                          </span>
                        </div>
                      </td>

                      {/* Issue Date */}
                      <td className="py-2.5 px-3.5 text-zinc-500 font-normal">
                        {new Date(inv.IssueDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Due Date */}
                      <td className="py-2.5 px-3.5 text-zinc-500 font-normal">
                        {new Date(inv.DueDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Amount */}
                      <td className="py-2.5 px-3.5 text-right font-semibold text-zinc-900">
                        {inv.Currency} {Number(inv.total).toFixed(2)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide rounded-2xs border ${statusInfo.badge}`}
                        >
                          <span className={`w-1 h-1 rounded-full ${statusInfo.dot}`} />
                          {inv.paymentStatus}
                        </span>
                      </td>

                      {/* 3-Dot Action Menu */}
                      <td className="py-2.5 px-3.5 text-right relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === inv.InvoiceId ? null : inv.InvoiceId
                            )
                          }
                          className="p-1 text-zinc-400 hover:text-zinc-800 transition cursor-pointer rounded-2xs hover:bg-zinc-100"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Interactive Status Popover */}
                        {activeMenuId === inv.InvoiceId && (
                          <StatusMenuPopover
                            currentStatus={inv.paymentStatus}
                            onSelect={(newStatus) =>
                              updateStatusMutation.mutate({
                                invoiceId: inv.InvoiceId,
                                newStatus,
                              })
                            }
                            onClose={() => setActiveMenuId(null)}
                            isPending={updateStatusMutation.isPending}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Clean Footer Pagination */}
        {data?.meta && (
          <div className="bg-zinc-50 border-t border-zinc-200/80 p-2.5 px-4 flex items-center justify-between text-xs text-zinc-500 shrink-0">
            <div>
              Showing <span className="font-bold text-zinc-800">{(page - 1) * limit + 1}</span> to{" "}
              <span className="font-bold text-zinc-800">
                {Math.min(page * limit, data.meta.totalCount)}
              </span>{" "}
              of <span className="font-bold text-zinc-800">{data.meta.totalCount}</span> records
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1 border border-zinc-200/80 rounded-2xs bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-semibold text-zinc-800 text-xs">
                {page} / {data.meta.totalPages || 1}
              </span>
              <button
                disabled={page >= data.meta.totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="p-1 border border-zinc-200/80 rounded-2xs bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline Status Change Menu
function StatusMenuPopover({
  currentStatus,
  onSelect,
  onClose,
  isPending,
}: {
  currentStatus: string;
  onSelect: (status: string) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const statuses = ["PAID", "PENDING", "OVERDUE", "DRAFT", "CANCELLED"];

  return (
    <div
      ref={menuRef}
      className="absolute right-3 top-8 z-50 w-36 bg-white border border-zinc-200/90 shadow-lg rounded-xs p-1 text-left font-mono text-[11px]"
    >
      <div className="px-2 py-1 text-[9px] uppercase font-bold text-zinc-400 border-b border-zinc-100">
        Update Status
      </div>
      {statuses.map((st) => (
        <button
          key={st}
          disabled={isPending}
          onClick={() => onSelect(st)}
          className={`w-full flex items-center justify-between px-2 py-1.5 hover:bg-zinc-100 rounded-2xs transition cursor-pointer ${
            currentStatus === st ? "font-bold text-teal-700 bg-teal-50/50" : "text-zinc-700"
          }`}
        >
          <span>{st}</span>
          {currentStatus === st && <Check className="w-3 h-3 text-teal-700" />}
        </button>
      ))}
    </div>
  );
}
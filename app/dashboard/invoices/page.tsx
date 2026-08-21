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
  Eye,
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
    badge: "bg-zinc-100 text-zinc-700 border-zinc-300/80",
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
    badge: "bg-zinc-100 text-zinc-500 border-zinc-300/80",
    dot: "bg-zinc-400",
    icon: XCircle,
  },
};

function useDebounce<T>(value: T, delay: number = 300): T {
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
      queryClient.invalidateQueries({ queryKey: ["invoice-summary"] });
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
    <div className="w-full min-h-screen bg-white text-zinc-950 font-sans select-none pb-16">
      {/* Top Banner / Header Area */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium mb-1">
                Records & Status History
              </p>
              <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-950">
                Invoice Register
              </h1>
            </div>

            <Link
              href="/dashboard/createInvoice"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-950 hover:bg-zinc-800 rounded-md transition-colors shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Invoice</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Filter and Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by invoice #, client name, email..."
              className="w-full bg-white border border-zinc-200 pl-10 pr-3.5 py-2 rounded-md text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 transition shadow-2xs"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3 flex items-center gap-2 bg-white border border-zinc-200 px-3 py-2 rounded-md shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-[10px] uppercase font-mono font-medium text-zinc-400 shrink-0">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-transparent text-xs text-zinc-900 focus:outline-none cursor-pointer font-medium"
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
          <div className="md:col-span-3 flex items-center gap-2 bg-white border border-zinc-200 px-3 py-2 rounded-md shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-[10px] uppercase font-mono font-medium text-zinc-400 shrink-0">
              Sort:
            </span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order as "asc" | "desc");
                setPage(1);
              }}
              className="w-full bg-transparent text-xs text-zinc-900 focus:outline-none cursor-pointer font-medium"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="total-desc">Amount: High to Low</option>
              <option value="total-asc">Amount: Low to High</option>
              <option value="DueDate-asc">Due Date: Nearest</option>
            </select>
          </div>
        </div>

        {/* Table Container Card */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs flex flex-col min-h-[460px]">
          {isLoading ? (
            <div className="flex-1 flex flex-col justify-center items-center p-12 text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-zinc-950" />
              <span className="text-xs font-mono">Fetching records...</span>
            </div>
          ) : isError ? (
            <div className="flex-1 flex flex-col justify-center items-center p-12 text-rose-600">
              <span className="text-xs font-semibold mb-1">Failed to load invoices</span>
              <span className="text-[11px] text-zinc-500 font-mono">{error?.message}</span>
            </div>
          ) : !data?.invoices || data.invoices.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center p-12 text-zinc-400">
              <FileText className="w-9 h-9 stroke-1 mb-2 text-zinc-300" />
              <span className="text-sm font-medium text-zinc-900">No invoices found</span>
              <span className="text-xs text-zinc-400 mt-1">
                Try adjusting your search criteria or create a new invoice.
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse text-xs text-zinc-700">
                <thead className="bg-zinc-50/70 border-b border-zinc-200 text-[10px] font-mono font-medium uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th
                      className="py-3 px-5 cursor-pointer hover:text-zinc-900 transition"
                      onClick={() => handleSortChange("invoiceNumber")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Invoice #</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3 px-5">Client</th>
                    <th
                      className="py-3 px-5 cursor-pointer hover:text-zinc-900 transition"
                      onClick={() => handleSortChange("IssueDate")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Issue Date</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-5 cursor-pointer hover:text-zinc-900 transition"
                      onClick={() => handleSortChange("DueDate")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Due Date</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-5 text-right cursor-pointer hover:text-zinc-900 transition"
                      onClick={() => handleSortChange("total")}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Amount</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3 px-5 text-center">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {data.invoices.map((inv) => {
                    const statusInfo = STATUS_CONFIG[inv.paymentStatus] || STATUS_CONFIG.PENDING;

                    return (
                      <tr
                        key={inv.InvoiceId}
                        className="hover:bg-zinc-50/80 transition duration-150 group"
                      >
                        {/* Invoice Number */}
                        <td className="py-3.5 px-5 font-mono text-xs font-semibold text-zinc-900">
                          {inv.invoiceNumber}
                        </td>

                        {/* Customer Info */}
                        <td className="py-3.5 px-5">
                          <div className="flex flex-col">
                            <span className="font-medium text-zinc-900 text-xs leading-tight">
                              {inv.CustomerName || "Unassigned Client"}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono leading-tight mt-0.5">
                              {inv.CustomerEmail || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Issue Date */}
                        <td className="py-3.5 px-5 text-zinc-500 font-mono text-xs">
                          {new Date(inv.IssueDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Due Date */}
                        <td className="py-3.5 px-5 text-zinc-500 font-mono text-xs">
                          {new Date(inv.DueDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-5 text-right font-medium text-zinc-950 font-mono text-xs">
                          {inv.Currency} {Number(inv.total).toFixed(2)}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-5 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-medium uppercase rounded-sm border ${statusInfo.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                            {inv.paymentStatus}
                          </span>
                        </td>

                        {/* Action Popover */}
                        <td className="py-3.5 px-5 text-right relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(
                                activeMenuId === inv.InvoiceId ? null : inv.InvoiceId
                              )
                            }
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 transition rounded-md hover:bg-zinc-100 cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Status Popover */}
                          {activeMenuId === inv.InvoiceId && (
                            <StatusMenuPopover
                              invoiceId={inv.InvoiceId}
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

          {/* Clean Pagination Footer */}
          {data?.meta && (
            <div className="bg-zinc-50/70 border-t border-zinc-200 p-3.5 px-5 flex items-center justify-between text-xs text-zinc-500 shrink-0 font-sans">
              <div>
                Showing <span className="font-semibold text-zinc-900">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-semibold text-zinc-900">
                  {Math.min(page * limit, data.meta.totalCount)}
                </span>{" "}
                of <span className="font-semibold text-zinc-900">{data.meta.totalCount}</span> records
              </div>

              <div className="flex items-center gap-2 font-mono">
                <button
                  disabled={page === 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 border border-zinc-200 rounded-md bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 transition cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-medium text-zinc-900">
                  {page} / {data.meta.totalPages || 1}
                </span>
                <button
                  disabled={page >= data.meta.totalPages || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 border border-zinc-200 rounded-md bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 transition cursor-pointer shadow-2xs"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusMenuPopover({
  invoiceId,
  currentStatus,
  onSelect,
  onClose,
  isPending,
}: {
  invoiceId: string;
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
      className="absolute right-4 top-10 z-50 w-44 bg-white border border-zinc-200 rounded-lg shadow-xl p-1.5 text-left font-sans text-xs"
    >
      <Link
        href={`/dashboard/invoice/${invoiceId}`}
        onClick={onClose}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-md transition font-medium"
      >
        <Eye className="w-3.5 h-3.5 text-zinc-400" />
        <span>View Invoice</span>
      </Link>

      <div className="border-t border-zinc-100 my-1" />

      <div className="px-2.5 py-1 text-[10px] uppercase font-mono font-medium text-zinc-400">
        Update Status
      </div>

      {statuses.map((st) => (
        <button
          key={st}
          disabled={isPending}
          onClick={() => onSelect(st)}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition cursor-pointer font-mono text-[11px] ${
            currentStatus === st
              ? "font-semibold text-teal-800 bg-teal-50"
              : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          <span>{st}</span>
          {currentStatus === st && <Check className="w-3.5 h-3.5 text-teal-700" />}
        </button>
      ))}
    </div>
  );
}
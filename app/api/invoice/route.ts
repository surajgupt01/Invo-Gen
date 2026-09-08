import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { InvoiceStatus, Prisma } from "@prisma/client";

interface CreateInvoicePayload {
  userId?: string;
  invoiceNumber?: string;
  CustomerName?: string;
  CustomerEmail?: string;
  CustomerAddress?: string;
  Subject?: string;
  IssueDate?: string;
  DueDate?: string;
  Currency?: string;
  paymentStatus?: string;
  subtotal?: number | string;
  tax?: number | string;
  discount?: number | string;
  total?: number | string;
  fileSizeBytes?: number | string;
}

interface PatchInvoicePayload {
  invoiceId?: string;
  paymentStatus?: string;
}

function parseDecimal(
  value: number | string | undefined | null,
  fallback = "0.00",
): Prisma.Decimal {
  if (value === undefined || value === null)
    return new Prisma.Decimal(fallback);
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  return cleaned && !isNaN(Number(cleaned))
    ? new Prisma.Decimal(cleaned)
    : new Prisma.Decimal(fallback);
}

function parseString(value: unknown): string | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

const ALLOWED_SORT_FIELDS = new Set<
  keyof Prisma.InvoiceOrderByWithRelationInput
>(["createdAt", "updatedAt", "IssueDate", "DueDate", "total", "invoiceNumber"]);

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

// ─── GET: Invoices List OR High-Performance DB Aggregations ───────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId parameter" },
        { status: 400 },
      );
    }

    const isStatsMode = searchParams.get("stats") === "true";
    const requestedCurrency = searchParams
      .get("currency")
      ?.trim()
      .toUpperCase();
    const yearParam = searchParams.get("year");

    // ──────────────────────────────────────────────────────────────────────────
    // 1. DASHBOARD STATS AGGREGATION MODE (Database computes all metrics)
    // ──────────────────────────────────────────────────────────────────────────
    if (isStatsMode) {
      // Inside the `if (isStatsMode)` block in GET:

      // 1. Fetch distinct currencies and date range boundaries
      const [distinctCurrencies, dateBoundaries] = await Promise.all([
        prisma.invoice.findMany({
          where: { userId },
          distinct: ["Currency"],
          select: { Currency: true },
        }),
        prisma.invoice.aggregate({
          where: { userId },
          _min: { IssueDate: true },
          _max: { IssueDate: true },
        }),
      ]);

      const currentYear = new Date().getFullYear();
      const minDate = dateBoundaries._min.IssueDate;
      const maxDate = dateBoundaries._max.IssueDate;

      let availableYears: string[];

      if (!minDate || !maxDate) {
        // If user has zero invoices, default to current year
        availableYears = [currentYear.toString()];
      } else {
        const lowestYear = new Date(minDate).getFullYear();
        const highestYear = new Date(maxDate).getFullYear();

        const years: string[] = [];
        // Descending list from highest year to lowest year
        for (let y = highestYear; y >= lowestYear; y--) {
          years.push(y.toString());
        }
        availableYears = years;
      }
      const year =
        yearParam && !isNaN(parseInt(yearParam, 10))
          ? parseInt(yearParam, 10)
          : new Date().getFullYear();

      // Find all distinct currencies used by this user
      // const distinctCurrencies = await prisma.invoice.findMany({
      //   where: { userId },
      //   distinct: ["Currency"],
      //   select: { Currency: true },
      // });

      const availableCurrencies = distinctCurrencies.map((c) =>
        c.Currency.toUpperCase(),
      );
      const activeCurrency =
        requestedCurrency && availableCurrencies.includes(requestedCurrency)
          ? requestedCurrency
          : availableCurrencies[0] || "INR";

      const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
      const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

      // A. KPI Totals Grouped by Status in DB
      const statusAggregates = await prisma.invoice.groupBy({
        by: ["paymentStatus"],
        where: {
          userId,
          Currency: { equals: activeCurrency, mode: "insensitive" },
        },
        _sum: { total: true },
        _count: { _all: true },
      });

      let totalPaid = 0;
      let totalPending = 0;
      let totalOverdue = 0;
      let paidCount = 0;
      let pendingCount = 0;
      let overdueCount = 0;
      let totalCount = 0;

      for (const group of statusAggregates) {
        const sum = Number(group._sum.total ?? 0);
        const count = group._count._all;
        totalCount += count;

        if (group.paymentStatus === InvoiceStatus.PAID) {
          totalPaid = sum;
          paidCount = count;
        } else if (
          group.paymentStatus === InvoiceStatus.PENDING ||
          group.paymentStatus === InvoiceStatus.DRAFT
        ) {
          totalPending += sum;
          pendingCount += count;
        } else if (group.paymentStatus === InvoiceStatus.OVERDUE) {
          totalOverdue = sum;
          overdueCount = count;
        }
      }

      // B. Monthly Cashflow Buckets Grouped in PostgreSQL
      const monthlyBuckets = await prisma.$queryRaw<
        Array<{ month_idx: number; revenue: number; pending: number }>
      >`
        SELECT 
          CAST(EXTRACT(MONTH FROM "IssueDate") - 1 AS INTEGER) AS month_idx,
          COALESCE(SUM(CASE WHEN "paymentStatus" = 'PAID' THEN "total" ELSE 0 END), 0)::FLOAT AS revenue,
          COALESCE(SUM(CASE WHEN "paymentStatus" IN ('PENDING', 'DRAFT') THEN "total" ELSE 0 END), 0)::FLOAT AS pending
        FROM "invoice"
        WHERE "userId" = ${userId}
          AND UPPER("Currency") = ${activeCurrency}
          AND "IssueDate" >= ${startOfYear}
          AND "IssueDate" <= ${endOfYear}
        GROUP BY month_idx
        ORDER BY month_idx ASC;
      `;

      const chartData = MONTH_NAMES.map((name, i) => {
        const row = monthlyBuckets.find((m) => m.month_idx === i);
        return {
          monthIndex: i,
          month: name,
          revenue: row ? row.revenue : 0,
          pending: row ? row.pending : 0,
        };
      });

      // C. Top 5 Most Recent Invoices for the Selected Currency
      const recentInvoices = await prisma.invoice.findMany({
        where: {
          userId,
          Currency: { equals: activeCurrency, mode: "insensitive" },
        },
        orderBy: { IssueDate: "desc" },
        take: 5,
      });

      return NextResponse.json({
        activeCurrency,
        availableCurrencies:
          availableCurrencies.length > 0 ? availableCurrencies : ["INR"],
        availableYears,
        summary: {
          totalPaid,
          totalPending,
          totalOverdue,
          paidCount,
          pendingCount,
          overdueCount,
          totalCount,
        },
        chartData,
        recentInvoices,
      });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. STANDARD INVOICE LIST QUERY (Paginated + Filtered)
    // ──────────────────────────────────────────────────────────────────────────
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const sortByParam = searchParams.get("sortBy") || "IssueDate";
    const sortOrderParam = searchParams.get("sortOrder") || "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));

    const skip = (page - 1) * limit;
    const sortBy = ALLOWED_SORT_FIELDS.has(
      sortByParam as keyof Prisma.InvoiceOrderByWithRelationInput,
    )
      ? sortByParam
      : "IssueDate";
    const sortOrder: Prisma.SortOrder =
      sortOrderParam.toLowerCase() === "asc" ? "asc" : "desc";

    const andConditions: Prisma.InvoiceWhereInput[] = [];

    // Currency filter
    if (requestedCurrency && requestedCurrency !== "ALL") {
      andConditions.push({
        Currency: { equals: requestedCurrency, mode: "insensitive" },
      });
    }

    // Text search
    if (search.trim()) {
      andConditions.push({
        OR: [
          { invoiceNumber: { contains: search, mode: "insensitive" } },
          { CustomerName: { contains: search, mode: "insensitive" } },
          { CustomerEmail: { contains: search, mode: "insensitive" } },
          { Subject: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    // Payment status filter
    if (
      status !== "ALL" &&
      Object.values(InvoiceStatus).includes(status as InvoiceStatus)
    ) {
      andConditions.push({ paymentStatus: status as InvoiceStatus });
    }

    // Year range filter
    if (yearParam && !isNaN(parseInt(yearParam, 10))) {
      const parsedYear = parseInt(yearParam, 10);
      const startOfYear = new Date(`${parsedYear}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${parsedYear}-12-31T23:59:59.999Z`);

      andConditions.push({
        IssueDate: {
          gte: startOfYear,
          lte: endOfYear,
        },
      });
    }

    const whereClause: Prisma.InvoiceWhereInput = {
      userId,
      ...(andConditions.length > 0 ? { AND: andConditions } : {}),
    };

    const [invoices, totalCount] = await Promise.all([
      prisma.invoice.findMany({
        where: whereClause,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      invoices,
      meta: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: unknown) {
    console.error("[INVOICES_GET_ERROR]:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch invoices";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── POST: Create Invoice & Atomic Quota/Storage Update ───────────────────────
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateInvoicePayload;

    const userId = parseString(body.userId);
    const invoiceNumber = parseString(body.invoiceNumber);
    const issueDateStr = body.IssueDate;
    const dueDateStr = body.DueDate;

    if (!userId || !invoiceNumber || !issueDateStr || !dueDateStr) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: userId, invoiceNumber, IssueDate, or DueDate.",
        },
        { status: 400 },
      );
    }

    const parsedIssueDate = new Date(issueDateStr);
    const parsedDueDate = new Date(dueDateStr);

    if (isNaN(parsedIssueDate.getTime()) || isNaN(parsedDueDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid IssueDate or DueDate format." },
        { status: 400 },
      );
    }

    const subtotal = parseDecimal(body.subtotal, "0.00");
    const tax = parseDecimal(body.tax, "0.00");
    const discount = parseDecimal(body.discount, "0.00");
    const total = parseDecimal(body.total, "0.00");
    const currency = (parseString(body.Currency) || "INR").toUpperCase();

    const validStatuses = Object.values(InvoiceStatus);
    const finalStatus: InvoiceStatus = validStatuses.includes(
      body.paymentStatus as InvoiceStatus,
    )
      ? (body.paymentStatus as InvoiceStatus)
      : InvoiceStatus.PENDING;

    const newInvoice = await prisma.$transaction(
      async (tx) => {
        // 1. Quota Validation
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { plan: true, downloads: true },
        });

        if (!user) {
          throw new Error("USER_NOT_FOUND");
        }

        const MONTHLY_LIMIT = 5;
        if (user.plan !== "PRO" && user.downloads >= MONTHLY_LIMIT) {
          throw new Error("QUOTA_EXCEEDED");
        }

        // 2. Insert Invoice
        const created = await tx.invoice.create({
          data: {
            userId,
            invoiceNumber,
            CustomerName: parseString(body.CustomerName),
            CustomerEmail: parseString(body.CustomerEmail),
            CustomerAddress: parseString(body.CustomerAddress),
            Subject: parseString(body.Subject),
            IssueDate: parsedIssueDate,
            DueDate: parsedDueDate,
            Currency: currency,
            paymentStatus: finalStatus,
            subtotal,
            tax,
            discount,
            total,
          },
        });

        // 3. Increment User Telemetry Counters (downloads quota & active storage)
        await tx.user.update({
          where: { id: userId },
          data: {
            downloads: { increment: 1 },
            storage: { increment: 1 },
          },
        });

        return created;
      },
      {
        maxWait: 10000,
        timeout: 15000,
      },
    );

    return NextResponse.json(
      { message: "Invoice saved successfully", invoice: newInvoice },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("[INVOICE_CREATE_ERROR]:", error);

    if (error instanceof Error) {
      if (error.message === "QUOTA_EXCEEDED") {
        return NextResponse.json(
          { error: "Monthly download limit reached. Upgrade to Pro." },
          { status: 403 },
        );
      }
      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json(
          { error: "User not found in database." },
          { status: 404 },
        );
      }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "An invoice with this invoice number already exists." },
          { status: 409 },
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid userId. Foreign key constraint failed." },
          { status: 400 },
        );
      }
    }

    const message =
      error instanceof Error ? error.message : "Internal Server Error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── PATCH: Update Payment Status ─────────────────────────────────────────────
export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as PatchInvoicePayload;
    const cleanInvoiceId = parseString(body.invoiceId);
    const newStatus = body.paymentStatus as InvoiceStatus;

    if (!cleanInvoiceId || !newStatus) {
      return NextResponse.json(
        { error: "Missing invoiceId or paymentStatus." },
        { status: 400 },
      );
    }

    if (!Object.values(InvoiceStatus).includes(newStatus)) {
      return NextResponse.json(
        { error: "Invalid paymentStatus value provided." },
        { status: 400 },
      );
    }

    const updated = await prisma.invoice.update({
      where: { InvoiceId: cleanInvoiceId },
      data: { paymentStatus: newStatus },
    });

    return NextResponse.json({ invoice: updated }, { status: 200 });
  } catch (error: unknown) {
    console.error("[INVOICE_PATCH_ERROR]:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update invoice status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE: Remove Invoice & Decrement User Storage ──────────────────────────
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let invoiceId = searchParams.get("invoiceId");

    // Fallback check if passed in body
    if (!invoiceId) {
      const body = await req.json().catch(() => ({}));
      invoiceId = parseString(body?.invoiceId);
    }

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Missing invoiceId parameter." },
        { status: 400 },
      );
    }

    const deletedInvoice = await prisma.$transaction(
      async (tx) => {
        // 1. Locate existing invoice to identify owner
        const existing = await tx.invoice.findUnique({
          where: { InvoiceId: invoiceId },
          select: { InvoiceId: true, userId: true },
        });

        if (!existing) {
          throw new Error("INVOICE_NOT_FOUND");
        }

        // 2. Delete the Invoice record
        const removed = await tx.invoice.delete({
          where: { InvoiceId: invoiceId },
        });

        // 3. Decrement user active storage tracking (protected >= 0)
        const user = await tx.user.findUnique({
          where: { id: existing.userId },
          select: { storage: true },
        });

        if (user && user.storage > 0) {
          await tx.user.update({
            where: { id: existing.userId },
            data: { storage: { decrement: 1 } },
          });
        }

        return removed;
      },
      {
        maxWait: 10000,
        timeout: 15000,
      },
    );

    return NextResponse.json(
      { message: "Invoice deleted successfully", invoice: deletedInvoice },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("[INVOICE_DELETE_ERROR]:", error);

    if (error instanceof Error && error.message === "INVOICE_NOT_FOUND") {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to delete invoice.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

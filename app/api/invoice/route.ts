import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { InvoiceStatus, Prisma } from "@prisma/client";

interface CreateInvoicePayload {
  userId?: string;
  invoiceNumber?: string;
  InvoiceNo?: string;
  customerName?: string;
  CustomerName?: string;
  customerEmail?: string;
  CustomerEmail?: string;
  customerAddress?: string;
  CustomerAddress?: string;
  subject?: string;
  Subject?: string;
  issueDate?: string;
  IssueDate?: string;
  dueDate?: string;
  DueDate?: string;
  currency?: string;
  Currency?: string;
  paymentStatus?: string;
  subtotal?: number | string;
  tax?: number | string;
  discount?: number | string;
  total?: number | string;
}

interface PatchInvoicePayload {
  invoiceId?: string;
  paymentStatus?: string;
}

function parseNumber(
  value: number | string | undefined | null,
  fallback = 0
): number {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "number") return isNaN(value) ? fallback : value;

  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : parsed;
}

function parseString(value: unknown): string | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

const ALLOWED_SORT_FIELDS = new Set<keyof Prisma.InvoiceOrderByWithRelationInput>([
  "createdAt",
  "updatedAt",
  "IssueDate",
  "DueDate",
  "total",
  "invoiceNumber",
]);

// ─── GET: Fetch Paginated & Filtered Invoices ─────────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const yearParam = searchParams.get("year");
    const sortByParam = searchParams.get("sortBy") || "IssueDate";
    const sortOrderParam = searchParams.get("sortOrder") || "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    
    const defaultLimit = yearParam ? "1000" : "10";
    const limit = Math.max(1, parseInt(searchParams.get("limit") || defaultLimit, 10));

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId parameter" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const sortBy = ALLOWED_SORT_FIELDS.has(
      sortByParam as keyof Prisma.InvoiceOrderByWithRelationInput
    )
      ? sortByParam
      : "IssueDate";
    const sortOrder: Prisma.SortOrder =
      sortOrderParam.toLowerCase() === "asc" ? "asc" : "desc";

    const andConditions: Prisma.InvoiceWhereInput[] = [];

    // 1. Search Filter
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

    // 2. Status Filter
    if (
      status !== "ALL" &&
      Object.values(InvoiceStatus).includes(status as InvoiceStatus)
    ) {
      andConditions.push({ paymentStatus: status as InvoiceStatus });
    }

    // 3. Robust Year Filter
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

// ─── POST: Create Invoice & Atomic Summary Increment ──────────────────────────
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateInvoicePayload;

    const userId = parseString(body.userId);
    const invoiceNumber = parseString(body.invoiceNumber || body.InvoiceNo);
    const issueDate = body.issueDate || body.IssueDate;
    const dueDate = body.dueDate || body.DueDate;

    if (!userId || !invoiceNumber || !issueDate || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields: userId, invoiceNumber, issueDate, or dueDate." },
        { status: 400 }
      );
    }

    const parsedIssueDate = new Date(issueDate);
    const parsedDueDate = new Date(dueDate);

    if (isNaN(parsedIssueDate.getTime()) || isNaN(parsedDueDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid Issue Date or Due Date format." },
        { status: 400 }
      );
    }

    const numericSubtotal = parseNumber(body.subtotal, 0);
    const numericTax = parseNumber(body.tax, 0);
    const numericDiscount = parseNumber(body.discount, 0);
    const numericTotal = parseNumber(body.total, 0);

    const validStatuses = Object.values(InvoiceStatus);
    const finalStatus: InvoiceStatus = validStatuses.includes(
      body.paymentStatus as InvoiceStatus
    )
      ? (body.paymentStatus as InvoiceStatus)
      : InvoiceStatus.PENDING;

    // Configured with extended timeouts for Neon DB connection pool locks
    const newInvoice = await prisma.$transaction(
      async (tx) => {
        const created = await tx.invoice.create({
          data: {
            userId,
            invoiceNumber,
            CustomerName: parseString(body.customerName || body.CustomerName),
            CustomerEmail: parseString(body.customerEmail || body.CustomerEmail),
            CustomerAddress: parseString(body.customerAddress || body.CustomerAddress),
            Subject: parseString(body.subject || body.Subject),
            IssueDate: parsedIssueDate,
            DueDate: parsedDueDate,
            Currency: parseString(body.currency || body.Currency) || "INR",
            paymentStatus: finalStatus,
            subtotal: numericSubtotal.toFixed(2),
            tax: numericTax.toFixed(2),
            discount: numericDiscount.toFixed(2),
            total: numericTotal.toFixed(2),
          },
        });

        const summaryUpdate: Prisma.InvoiceSummaryUpdateInput = {
          totalCount: { increment: 1 },
        };

        if (finalStatus === InvoiceStatus.PAID) {
          summaryUpdate.totalPaid = { increment: numericTotal };
          summaryUpdate.paidCount = { increment: 1 };
        } else if (finalStatus === InvoiceStatus.OVERDUE) {
          summaryUpdate.totalOverdue = { increment: numericTotal };
          summaryUpdate.overdueCount = { increment: 1 };
        } else if (finalStatus === InvoiceStatus.PENDING) {
          summaryUpdate.totalPending = { increment: numericTotal };
          summaryUpdate.pendingCount = { increment: 1 };
        }

        await tx.invoiceSummary.upsert({
          where: { userId },
          create: {
            userId,
            totalCount: 1,
            totalPaid: finalStatus === InvoiceStatus.PAID ? numericTotal : 0,
            totalOverdue: finalStatus === InvoiceStatus.OVERDUE ? numericTotal : 0,
            totalPending: finalStatus === InvoiceStatus.PENDING ? numericTotal : 0,
            paidCount: finalStatus === InvoiceStatus.PAID ? 1 : 0,
            overdueCount: finalStatus === InvoiceStatus.OVERDUE ? 1 : 0,
            pendingCount: finalStatus === InvoiceStatus.PENDING ? 1 : 0,
          },
          update: summaryUpdate,
        });

        return created;
      },
      {
        maxWait: 10000, // Wait up to 10 seconds to acquire connection
        timeout: 15000, // Allow transaction up to 15 seconds to finish
      }
    );

    return NextResponse.json(
      { message: "Invoice saved successfully", invoice: newInvoice },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[INVOICE_CREATE_ERROR]:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "An invoice with this invoice number already exists." },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid userId. User does not exist in database." },
          { status: 400 }
        );
      }
    }

    const message =
      error instanceof Error ? error.message : "Internal Server Error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── PATCH: Update Payment Status & Atomic Shift ──────────────────────────────
export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as PatchInvoicePayload;
    const cleanInvoiceId = parseString(body.invoiceId);
    const newStatus = body.paymentStatus as InvoiceStatus;

    if (!cleanInvoiceId || !newStatus) {
      return NextResponse.json(
        { error: "Missing invoiceId or paymentStatus." },
        { status: 400 }
      );
    }

    if (!Object.values(InvoiceStatus).includes(newStatus)) {
      return NextResponse.json(
        { error: "Invalid paymentStatus value provided." },
        { status: 400 }
      );
    }

    const updatedInvoice = await prisma.$transaction(
      async (tx) => {
        const existing = await tx.invoice.findUnique({
          where: { InvoiceId: cleanInvoiceId },
        });

        if (!existing) {
          throw new Error("INVOICE_NOT_FOUND");
        }

        const oldStatus = existing.paymentStatus;
        if (oldStatus === newStatus) return existing;

        const amount = existing.total;

        const updated = await tx.invoice.update({
          where: { InvoiceId: cleanInvoiceId },
          data: { paymentStatus: newStatus },
        });

        const summaryUpdate: Prisma.InvoiceSummaryUpdateInput = {};

        if (oldStatus === InvoiceStatus.PAID) {
          summaryUpdate.totalPaid = { decrement: amount };
          summaryUpdate.paidCount = { decrement: 1 };
        } else if (oldStatus === InvoiceStatus.OVERDUE) {
          summaryUpdate.totalOverdue = { decrement: amount };
          summaryUpdate.overdueCount = { decrement: 1 };
        } else if (oldStatus === InvoiceStatus.PENDING) {
          summaryUpdate.totalPending = { decrement: amount };
          summaryUpdate.pendingCount = { decrement: 1 };
        }

        if (newStatus === InvoiceStatus.PAID) {
          summaryUpdate.totalPaid = { increment: amount };
          summaryUpdate.paidCount = { increment: 1 };
        } else if (newStatus === InvoiceStatus.OVERDUE) {
          summaryUpdate.totalOverdue = { increment: amount };
          summaryUpdate.overdueCount = { increment: 1 };
        } else if (newStatus === InvoiceStatus.PENDING) {
          summaryUpdate.totalPending = { increment: amount };
          summaryUpdate.pendingCount = { increment: 1 };
        }

        await tx.invoiceSummary.update({
          where: { userId: existing.userId },
          data: summaryUpdate,
        });

        return updated;
      },
      {
        maxWait: 10000,
        timeout: 15000,
      }
    );

    return NextResponse.json({ invoice: updatedInvoice }, { status: 200 });
  } catch (error: unknown) {
    console.error("[INVOICE_PATCH_ERROR]:", error);

    if (error instanceof Error && error.message === "INVOICE_NOT_FOUND") {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    const message =
      error instanceof Error ? error.message : "Failed to update invoice status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
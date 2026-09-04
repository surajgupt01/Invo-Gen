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
  fileSizeBytes?: number | string; // Size of the generated PDF in bytes
}

interface PatchInvoicePayload {
  invoiceId?: string;
  paymentStatus?: string;
}

function parseDecimal(value: number | string | undefined | null, fallback = "0.00"): Prisma.Decimal {
  if (value === undefined || value === null) return new Prisma.Decimal(fallback);
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  return cleaned && !isNaN(Number(cleaned)) ? new Prisma.Decimal(cleaned) : new Prisma.Decimal(fallback);
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
      return NextResponse.json({ error: "Missing required userId parameter" }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    const sortBy = ALLOWED_SORT_FIELDS.has(sortByParam as keyof Prisma.InvoiceOrderByWithRelationInput)
      ? sortByParam
      : "IssueDate";
    const sortOrder: Prisma.SortOrder = sortOrderParam.toLowerCase() === "asc" ? "asc" : "desc";

    const andConditions: Prisma.InvoiceWhereInput[] = [];

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

    if (status !== "ALL" && Object.values(InvoiceStatus).includes(status as InvoiceStatus)) {
      andConditions.push({ paymentStatus: status as InvoiceStatus });
    }

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
    const message = error instanceof Error ? error.message : "Failed to fetch invoices";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── POST: Create Invoice & Atomic Summary/Quota/Storage Update ───────────────
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateInvoicePayload;

    const userId = parseString(body.userId);
    const invoiceNumber = parseString(body.invoiceNumber);
    const issueDateStr = body.IssueDate;
    const dueDateStr = body.DueDate;

    if (!userId || !invoiceNumber || !issueDateStr || !dueDateStr) {
      return NextResponse.json(
        { error: "Missing required fields: userId, invoiceNumber, IssueDate, or DueDate." },
        { status: 400 },
      );
    }

    const parsedIssueDate = new Date(issueDateStr);
    const parsedDueDate = new Date(dueDateStr);

    if (isNaN(parsedIssueDate.getTime()) || isNaN(parsedDueDate.getTime())) {
      return NextResponse.json({ error: "Invalid IssueDate or DueDate format." }, { status: 400 });
    }

    // Decimal financial amounts matching schema types
    const subtotal = parseDecimal(body.subtotal, "0.00");
    const tax = parseDecimal(body.tax, "0.00");
    const discount = parseDecimal(body.discount, "0.00");
    const total = parseDecimal(body.total, "0.00");

    // File size in bytes for storage tracking (fallback to ~50KB estimate if not provided)
    const fileSizeBytes = Math.max(0, parseInt(String(body.fileSizeBytes || 50000), 10));

    const validStatuses = Object.values(InvoiceStatus);
    const finalStatus: InvoiceStatus = validStatuses.includes(body.paymentStatus as InvoiceStatus)
      ? (body.paymentStatus as InvoiceStatus)
      : InvoiceStatus.PENDING;

    const newInvoice = await prisma.$transaction(
      async (tx) => {
        // 1. Fetch user to check Plan and Quota limits
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

        // 2. Create the Invoice
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
            Currency: parseString(body.Currency) || "INR",
            paymentStatus: finalStatus,
            subtotal,
            tax,
            discount,
            total,
          },
        });

        // 3. Update InvoiceSummary
        const summaryUpdate: Prisma.InvoiceSummaryUpdateInput = {
          totalCount: { increment: 1 },
        };

        if (finalStatus === InvoiceStatus.PAID) {
          summaryUpdate.totalPaid = { increment: total };
          summaryUpdate.paidCount = { increment: 1 };
        } else if (finalStatus === InvoiceStatus.OVERDUE) {
          summaryUpdate.totalOverdue = { increment: total };
          summaryUpdate.overdueCount = { increment: 1 };
        } else if (finalStatus === InvoiceStatus.PENDING) {
          summaryUpdate.totalPending = { increment: total };
          summaryUpdate.pendingCount = { increment: 1 };
        }

        await tx.invoiceSummary.upsert({
          where: { userId },
          create: {
            userId,
            totalCount: 1,
            totalPaid: finalStatus === InvoiceStatus.PAID ? total : new Prisma.Decimal("0.00"),
            totalOverdue: finalStatus === InvoiceStatus.OVERDUE ? total : new Prisma.Decimal("0.00"),
            totalPending: finalStatus === InvoiceStatus.PENDING ? total : new Prisma.Decimal("0.00"),
            paidCount: finalStatus === InvoiceStatus.PAID ? 1 : 0,
            overdueCount: finalStatus === InvoiceStatus.OVERDUE ? 1 : 0,
            pendingCount: finalStatus === InvoiceStatus.PENDING ? 1 : 0,
          },
          update: summaryUpdate,
        });

        // 4. Increment User downloads and storage consumption
        // Storage is tracked for ALL users; downloads quota counts toward limits
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
        return NextResponse.json({ error: "User not found in database." }, { status: 404 });
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

    const message = error instanceof Error ? error.message : "Internal Server Error.";
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
        { status: 400 },
      );
    }

    if (!Object.values(InvoiceStatus).includes(newStatus)) {
      return NextResponse.json(
        { error: "Invalid paymentStatus value provided." },
        { status: 400 },
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
      },
    );

    return NextResponse.json({ invoice: updatedInvoice }, { status: 200 });
  } catch (error: unknown) {
    console.error("[INVOICE_PATCH_ERROR]:", error);

    if (error instanceof Error && error.message === "INVOICE_NOT_FOUND") {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    const message = error instanceof Error ? error.message : "Failed to update invoice status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
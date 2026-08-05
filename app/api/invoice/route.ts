import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { InvoiceStatus, Prisma } from "@prisma/client";

// Helper function to safely parse string numbers (e.g., "1,200.50" -> 1200.5)
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

// Helper function to sanitize string inputs
function parseString(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

// ─── GET: Fetch Paginated & Filtered Invoices ─────────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    // Type-safe dynamic Prisma query construction
    const whereClause: Prisma.InvoiceWhereInput = {
      userId,
      AND: [],
    };

    const andConditions = whereClause.AND as Prisma.InvoiceWhereInput[];

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

    // Parallel execution for records and count telemetry
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

// ─── POST: Create Invoice Record ──────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Support both camelCase and PascalCase payload variations
    const userId = body.userId;
    const invoiceNumber = body.invoiceNumber || body.InvoiceNo;
    const customerName = body.customerName || body.CustomerName;
    const customerEmail = body.customerEmail || body.CustomerEmail;
    const customerAddress = body.customerAddress || body.CustomerAddress;
    const subject = body.subject || body.Subject;
    const issueDate = body.issueDate || body.IssueDate;
    const dueDate = body.dueDate || body.DueDate;
    const currency = body.currency || body.Currency;
    const paymentStatus = body.paymentStatus;
    const subtotal = body.subtotal;
    const tax = body.tax;
    const discount = body.discount;
    const total = body.total;

    // 1. Mandatory Field Verification
    const cleanUserId = parseString(userId);
    const cleanInvoiceNumber = parseString(invoiceNumber);

    if (!cleanUserId) {
      return NextResponse.json(
        { error: "Missing required field: userId." },
        { status: 400 }
      );
    }

    if (!cleanInvoiceNumber || !issueDate || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields: invoiceNumber, issueDate, or dueDate." },
        { status: 400 }
      );
    }

    // 2. Parse and Validate Dates
    const parsedIssueDate = new Date(issueDate);
    const parsedDueDate = new Date(dueDate);

    if (isNaN(parsedIssueDate.getTime()) || isNaN(parsedDueDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid Issue Date or Due Date format." },
        { status: 400 }
      );
    }

    // 3. Parse Numerical Amounts
    const numericSubtotal = parseNumber(subtotal, 0);
    const numericTax = parseNumber(tax, 0);
    const numericDiscount = parseNumber(discount, 0);
    const numericTotal = parseNumber(total, 0);

    // 4. Parse Optional Strings & Validate Enum
    const cleanCustomerName = parseString(customerName);
    const cleanCustomerEmail = parseString(customerEmail);
    const cleanCustomerAddress = parseString(customerAddress);
    const cleanSubject = parseString(subject);
    const cleanCurrency = parseString(currency) || "INR";

    const validStatuses = Object.values(InvoiceStatus);
    const finalPaymentStatus: InvoiceStatus = validStatuses.includes(paymentStatus as InvoiceStatus)
      ? (paymentStatus as InvoiceStatus)
      : InvoiceStatus.PENDING;

    // 5. Create in Database
    const newInvoice = await prisma.invoice.create({
      data: {
        userId: cleanUserId,
        invoiceNumber: cleanInvoiceNumber,
        CustomerName: cleanCustomerName,
        CustomerEmail: cleanCustomerEmail,
        CustomerAddress: cleanCustomerAddress,
        Subject: cleanSubject,
        IssueDate: parsedIssueDate,
        DueDate: parsedDueDate,
        Currency: cleanCurrency,
        paymentStatus: finalPaymentStatus,
        subtotal: numericSubtotal.toFixed(2),
        tax: numericTax.toFixed(2),
        discount: numericDiscount.toFixed(2),
        total: numericTotal.toFixed(2),
      },
    });

    return NextResponse.json(
      { message: "Invoice saved successfully", invoice: newInvoice },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[INVOICE_CREATE_ERROR]:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Duplicate Invoice Number (Unique Constraint)
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "An invoice with this invoice number already exists." },
          { status: 409 }
        );
      }

      // Foreign Key Constraint Failed (User doesn't exist)
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid userId. User does not exist in database." },
          { status: 400 }
        );
      }
    }

    const message = error instanceof Error ? error.message : "Internal Server Error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── PATCH: Update Payment Status ─────────────────────────────────────────────
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { invoiceId, paymentStatus } = body;

    const cleanInvoiceId = parseString(invoiceId);

    if (!cleanInvoiceId || !paymentStatus) {
      return NextResponse.json(
        { error: "Missing invoiceId or paymentStatus." },
        { status: 400 }
      );
    }

    if (!Object.values(InvoiceStatus).includes(paymentStatus as InvoiceStatus)) {
      return NextResponse.json(
        { error: "Invalid paymentStatus value provided." },
        { status: 400 }
      );
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { InvoiceId: cleanInvoiceId },
      data: { paymentStatus: paymentStatus as InvoiceStatus },
    });

    return NextResponse.json({ invoice: updatedInvoice }, { status: 200 });
  } catch (error: unknown) {
    console.error("[INVOICE_PATCH_ERROR]:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Invoice not found." },
          { status: 404 }
        );
      }
    }

    const message = error instanceof Error ? error.message : "Failed to update invoice status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
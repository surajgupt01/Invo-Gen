import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { InvoiceStatus } from "@prisma/client";



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

    // Dynamic Filter Clauses
    const whereClause: any = {
      userId,
      AND: [],
    };

    if (search.trim()) {
      whereClause.AND.push({
        OR: [
          { invoiceNumber: { contains: search, mode: "insensitive" } },
          { CustomerName: { contains: search, mode: "insensitive" } },
          { CustomerEmail: { contains: search, mode: "insensitive" } },
          { Subject: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (status !== "ALL") {
      whereClause.AND.push({ paymentStatus: status });
    }

    // Parallel fetch for counts and records
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
  } catch (error: any) {
    console.error("[INVOICES_GET_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}





function parseNumber(
  value: number | string | undefined | null,
  fallback = 0,
): number {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "number") return isNaN(value) ? fallback : value;

  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : parsed;
}

function parseString(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Map both camelCase and PascalCase variations from frontend state
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

    // 1. Validate mandatory fields
    const cleanUserId = parseString(userId);
    const cleanInvoiceNumber = parseString(invoiceNumber);

    if (!cleanUserId) {
      return NextResponse.json(
        { error: "Missing required field: userId." },
        { status: 400 },
      );
    }

    if (!cleanInvoiceNumber || !issueDate || !dueDate) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: invoiceNumber, issueDate, or dueDate.",
        },
        { status: 400 },
      );
    }

    // 2. Parse and Validate Dates
    const parsedIssueDate = new Date(issueDate);
    const parsedDueDate = new Date(dueDate);

    if (isNaN(parsedIssueDate.getTime()) || isNaN(parsedDueDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid Issue Date or Due Date format." },
        { status: 400 },
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

    const validStatuses = ["DRAFT", "PENDING", "PAID", "OVERDUE", "CANCELLED"];
    const finalPaymentStatus: InvoiceStatus = validStatuses.includes(
      paymentStatus,
    )
      ? paymentStatus
      : "PENDING";

    // 5. Create in Database
    // app/api/invoice/route.ts

    const newInvoice = await prisma.invoice.create({
      data: {
        userId: cleanUserId,
        invoiceNumber: cleanInvoiceNumber, // Matches camelCase `invoiceNumber` in schema
        CustomerName: cleanCustomerName, // Matches PascalCase in schema
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
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[INVOICE_CREATE_ERROR]:", error);

    // Duplicate Invoice Number
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "An invoice with this invoice number already exists." },
        { status: 409 },
      );
    }

    // Invalid User ID Foreign Key Reference
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid userId. User does not exist in database." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal Server Error." },
      { status: 500 },
    );
  }
}



// app/api/invoice/route.ts

export async function PATCH(req: Request) {
  try {
    const { invoiceId, paymentStatus } = await req.json();

    if (!invoiceId || !paymentStatus) {
      return NextResponse.json(
        { error: "Missing invoiceId or paymentStatus" },
        { status: 400 }
      );
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { InvoiceId: invoiceId },
      data: { paymentStatus: paymentStatus as InvoiceStatus },
    });

    return NextResponse.json({ invoice: updatedInvoice }, { status: 200 });
  } catch (error: any) {
    console.error("[INVOICE_PATCH_ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to update invoice status" },
      { status: 500 }
    );
  }
}

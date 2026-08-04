import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type ItemsDetail = {
  description: string;
  qty: string;
  rate: string;
  discount: string;
  amt: string;
};

interface InvoiceDetails {
  OwnerName: string;
  PhNo: string;
  AccountNumber: string;
  BankName: string;
  BankCode: string;
  BankAddress: string;
  CustomerName: string;
  CustomerAddress: string;
  DueDate: string;
  InvoiceNo: string;
  Currency: string;
  Subject: string;
  InvoiceId: string;
  IssueDate: string;
  AdditionalInfo: string;
  Terms: string;
  ItemsTable: ItemsDetail[];
  subtotal: string;
  tax: string;
  discount?: string;
  total: string;
  BrandLogo: string;
  Signature?: string;
  userId: string;
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const Details: InvoiceDetails = await req.json();

    // console.log(Details);

    const response = await prisma.invoice.create({
      data: {
        InvoiceId: Details.InvoiceId,
        Currency: Details.Currency,
        Subject: Details.Subject,

        OwnerName: Details.OwnerName,
        OwnerPh: Details.PhNo,
        OwnerAccountNumber: Details.AccountNumber,
        OwnwerBankName: Details.BankName,
        OwerBankCode: Details.BankCode,
        OwnerBankAddress: Details.BankAddress,

        CustomerName: Details.CustomerName,
        CustomerAddress: Details.CustomerAddress,

        IssueDate: Details.IssueDate,
        DueDate: Details.DueDate,

        AdditionalInfo: Details.AdditionalInfo,
        Terms: Details.Terms,

        subtotal: Details.subtotal,
        tax: Details.tax,
        discount: Details.discount ? Details.discount : "0",
        total: Details.total,

        BrandLogo: Details.BrandLogo,
        Signature: Details.Signature,

        // userId: Details.userId,
        userId: session.user.id,

        ItemsTable: {
          create: Details.ItemsTable.map((item) => ({
            description: item.description,
            quantity: item.qty,
            unitPrice: item.rate,
            discount: item.discount,
            total: item.amt,
          })),
        },
      },
      include: {
        ItemsTable: true,
      },
    });

    return NextResponse.json({
      success: true,
      invoice: response,
    });
  } catch (error) {
    console.error("INVOICE CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Invoice creation failed" },
      { status: 500 },
    );
  }
}

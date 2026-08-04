import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (session?.user) {
    try {
      const Invoice = await prisma.invoice.findMany({
        where: {
          userId: session.user.id,
        },
      });

      return NextResponse.json({
        status: "success",
        Invoice: Invoice,
      });
    } catch (e) {
      console.log("Error fetching Invoices ", e);
      return NextResponse.json({
        status: "failure",
      });
    }
  }
}

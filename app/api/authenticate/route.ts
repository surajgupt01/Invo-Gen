import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // Fetch session in Better Auth by passing request headers
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      email: true,
      name: true,
      phoneNumber: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}
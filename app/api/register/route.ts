import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../prisma/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password, phNo, fullName } = await req.json();

  const Jwt_secret = "suraj-private";

  const UserExist = await prisma.user.findFirst({ where: { email: email } });

  if (!UserExist) {
    const payload = {
      email: email,
      phNo: phNo,
    };
    const hashed = await bcrypt.hash(password, 10);
    const token = jwt.sign(payload, Jwt_secret);

    try {
      await prisma.user.create({
        data: {
          email: email,
          password: hashed,
          phoneNumber: phNo,
          name: fullName,
          subscription: "Lite",
        },
      });
    } catch (error) {
      console.error(error);

      return NextResponse.json(
        { error: "User creation failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: "user signedIn", token: token });
  } else {
    return NextResponse.json({ error: "user exists" });
  }
}

import { hashPassword } from "@/lib/hash";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, userName } = body;

    if (!password) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Check if the password already exists
    const existingPassword = await prisma.password.findFirst({
      where: { password: password },
    });

    if (existingPassword) {
      return new NextResponse("Password already registered", { status: 409 });
    }

    // const hashedPassword = await hashPassword(password);

    const userPassword = await prisma.password.create({
      data: {
        password: password,
        userName: userName
      },
    });

    return NextResponse.json(userPassword);
  } catch (error) {
    console.log("[register_post]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
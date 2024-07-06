import { hashPassword, comparePassword } from "@/lib/hash";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { password } = body;

    if (!password) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const hashedPassword = await hashPassword(password);

    const userPassword = await prisma.password.create({
      data: {
        password: hashedPassword,
      },
    });
    return NextResponse.json(userPassword);
  } catch (error) {
    console.log("[data_post]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function LOGIN(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const userPassword = await prisma.password.findFirst({
      select: { password: true },
    });

    if (!userPassword) {
      return new NextResponse("Password not found", { status: 404 });
    }

    const isPasswordValid = await comparePassword(password, userPassword.password);

    if (!isPasswordValid) {
      return new NextResponse("Password not match", { status: 401 });
    }

    return new NextResponse("Login successful", { status: 201 });
  } catch (error) {
    console.log("[login_post]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

import { hashPassword } from "@/lib/hash";
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

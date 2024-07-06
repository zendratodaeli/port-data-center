import { encrypt } from "@/lib/encryption";
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

    // Find user by the encrypted password or some unique identifier
    const userPassword = await prisma.password.findUnique({
      where: { plainPassword: password }  // Change this to a unique identifier, not plain password
    });

    if (!userPassword) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const passwordMatch = await comparePassword(password, userPassword.password);

    if (!passwordMatch) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    return NextResponse.json({ message: "Authenticated" });
  } catch (error) {
    console.error("[POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

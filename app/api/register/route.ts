import { hashPassword } from "@/lib/hash";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const hashedPassword = await hashPassword(password);
    const encryptedPassword = encrypt(password);

    const userPassword = await prisma.password.create({
      data: {
        password: hashedPassword,
        encryptedPassword: encryptedPassword,
        plainPassword: password
      },
    });

    return NextResponse.json(userPassword);
  } catch (error) {
    console.log("[data_post]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

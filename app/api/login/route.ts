import { comparePassword } from "@/lib/hash";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.TOKEN_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const userPassword = await prisma.password.findUnique({
      where: { plainPassword: password }
    });

    if (!userPassword) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const passwordMatch = await comparePassword(password, userPassword.password);

    if (!passwordMatch) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const token = jwt.sign({ userId: userPassword.id }, JWT_SECRET, { expiresIn: '2h' });
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

    const response = NextResponse.json({ message: "Authenticated", token, expiresAt });

    response.cookies.set('access_granted', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60, // 2 hours in seconds
      path: '/'
    });

    return response;
  } catch (error) {
    console.error("[POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

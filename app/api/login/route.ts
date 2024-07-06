// Import necessary modules and functions
import { comparePassword } from "@/lib/hash";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret key for signing JWT

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Find user by plainPassword (assuming it's a unique identifier)
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

    return NextResponse.json({ message: "Authenticated", token });
  } catch (error) {
    console.error("[POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

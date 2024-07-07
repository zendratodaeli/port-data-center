import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, userName } = body;

    if (!password) {
      console.log("Missing password");
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const user = await prisma.password.findFirst({
      where: { password: password }
    });

    if (!user) {
      console.log("User not found");
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Set a cookie to indicate authentication
    const response = new NextResponse("Authenticated", { status: 200 });
    response.cookies.set('access_password', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 2 hours in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("[POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

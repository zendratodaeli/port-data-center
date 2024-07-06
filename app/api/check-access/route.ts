import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cookies = req.headers.get('cookie');
    const passwordCookie = cookies?.split(';').find(c => c.trim().startsWith('access_password='));

    if (!passwordCookie) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const password = passwordCookie.split('=')[1];
    
    // Check if the provided password matches any in the database
    const user = await prisma.password.findFirst({
      where: { password: password }
    });

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    return new NextResponse("Authenticated", { status: 200 });
  } catch (error) {
    console.error("[GET] /api/check-access", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

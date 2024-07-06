// import prisma from "@/lib/prismadb";
// import { NextResponse } from "next/server";
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.TOKEN_SECRET;

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { password } = body;

//     if (!password) {
//       console.log("Missing password");
//       return new NextResponse("Unauthenticated", { status: 401 });
//     }

//     const user = await prisma.password.findUnique({
//       where: { password: password }
//     });

//     if (!user) {
//       console.log("User not found");
//       return new NextResponse("Unauthenticated", { status: 401 });
//     }

//     if (password !== user.password) {
//       console.log("Password does not match");
//       return new NextResponse("Unauthenticated", { status: 401 });
//     }

//     const token = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: '2h' });
//     const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

//     console.log('expiresAt:', expiresAt.toISOString());

//     const response = NextResponse.json({ message: "Authenticated", token, expiresAt });

//     response.cookies.set('access_granted', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 2 * 60 * 60, // 2 hours in seconds
//       path: '/',
//     });

//     return response;
//   } catch (error) {
//     console.error("[POST]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }


import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

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

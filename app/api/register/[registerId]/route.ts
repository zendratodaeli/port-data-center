import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { registerId: string } }
) {
  try {
    if (!params.registerId) {
      return new NextResponse("Password Id is required", { status: 400 });
    }

    const password = await prismadb.password.findUnique({
      where: {
        id: params.registerId,
      },
    });

    return NextResponse.json(password);
  } catch (error) {
    console.log("[password_get]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { registerId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { userName, password } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!userName) {
      return new NextResponse("Username is required", { status: 400 });
    }

    if (!password) {
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!params.registerId) {
      return new NextResponse("password Id is required", { status: 400 });
    }

    const updatePassword = await prismadb.password.updateMany({
      where: {
        id: params.registerId,
      },
      data: {
        userName,
        password,
      },
    });
    return NextResponse.json(password);
  } catch (error) {
    console.log("[password_patch]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { registerId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.registerId) {
      return new NextResponse("password Id is required", { status: 400 });
    }

    const password = await prismadb.password.deleteMany({
      where: {
        id: params.registerId,
      },
    });

    return NextResponse.json(password);
  } catch (error) {
    console.log("[password_delete]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

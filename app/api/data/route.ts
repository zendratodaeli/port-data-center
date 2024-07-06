import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      portId,
      shipper,
      consignee,
      shipowner,
      vesselName,
      vesselType,
      built,
      imoNumber,
      imoClasses,
      flag,
      cargoQty,
      cargoType,
      nor,
      gt,
      nt,
      dwt,
      loa,
      beam,
      classification,
      activity,
      master,
      nationality,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!portId) {
      return new NextResponse("Topic Id is required", { status: 400 });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const data = await prismadb.data.create({
      data: {
        userId,
        portId,
        shipper,
        consignee,
        shipowner,
        vesselName,
        vesselType,
        built: new Date(built).toISOString(),
        imoNumber,
        imoClasses,
        flag,
        cargoQty,
        cargoType,
        nor: new Date(nor).toISOString(),
        gt,
        nt,
        dwt,
        loa,
        beam,
        classification,
        activity,
        master,
        nationality,
        createdAt: new Date().toISOString()
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log("[data_post]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const user = await currentUser();
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!user || !user.fullName) {
    return new NextResponse("User information is incomplete", { status: 400 });
  }

  const fullName = user.fullName.replace(/\s+/g, "").toLowerCase();

  try {
    const categories = await prismadb.data.findMany();

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[categories_get]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

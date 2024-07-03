import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { dataId: string } }
) {
  try {
    const category = await prismadb.data.findUnique({
      where: {
        id: params.dataId,
      },
      include: {
        port: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[category_get]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { dataId: string } }
) {
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

    if (!shipper) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!portId) {
      return new NextResponse("topic Id is required", { status: 400 });
    }

    const category = await prismadb.data.updateMany({
      where: {
        id: params.dataId,
      },
      data: {
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
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[category_patch]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { dataId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.dataId) {
      return new NextResponse("Category Id is required", { status: 400 });
    }

    const category = await prismadb.data.deleteMany({
      where: {
        id: params.dataId,
      },
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.log("[category_delete]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

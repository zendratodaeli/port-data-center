import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!Array.isArray(body)) {
      return new NextResponse("Invalid data format", { status: 400 });
    }

    const createData = body.map((item: any) => ({
      userId,
      portId: item.portId,
      shipper: item.shipper,
      consignee: item.consignee,
      shipowner: item.shipowner,
      vesselName: item.vesselName,
      vesselType: item.vesselType,
      built: new Date(item.built).toISOString(),
      imoNumber: parseInt(item.imoNumber, 10),
      imoClasses: item.imoClasses,
      flag: item.flag,
      cargoQty: parseInt(item.cargoQty, 10),
      cargoType: item.cargoType,
      nor: new Date(item.nor).toISOString(),
      gt: parseInt(item.gt, 10),
      nt: parseInt(item.nt, 10),
      dwt: parseInt(item.dwt, 10),
      loa: parseInt(item.loa, 10),
      beam: parseInt(item.beam, 10),
      classification: item.classification,
      activity: item.activity,
      master: item.master,
      nationality: item.nationality,
    }));

    const data = await prismadb.data.createMany({
      data: createData,
    });

    return NextResponse.json({ message: 'Data added successfully', data });
  } catch (error) {
    console.log("[data_post]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
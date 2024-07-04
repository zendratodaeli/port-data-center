import { format } from "date-fns";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import DataClient from "./components/client";
import { DataColumn } from "./components/columns";

const DataPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return (
      <div className="p-8 pt-6">
        <p className="text-center">You must be logged in!</p>
      </div>
    );
  }

  const listAdminId = [
    { adminId1: "user_2il1XkfhJFtxhMslrBq1JK6PapV" },
    { adminId2: "user_2il3sWCyhA35P1GvOuVsaPEsyrr" },
  ];

  const isAdmin = listAdminId.some((admin) =>
    Object.values(admin).includes(userId)
  );

  let data;

  if (userId && isAdmin) {
    // Fetch all data if the user is the list admin
    data = await prisma.data.findMany({
      include: {
        port: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    // Fetch only the data created by the authenticated user
    data = await prisma.data.findMany({
      where: {
        userId: userId,
      },
      include: {
        port: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  const formattedData: DataColumn[] = data.map((eachData) => ({
    id: eachData.id,
    vesselName: eachData.vesselName,
    vesselType: eachData.vesselType,
    imoNumber: eachData.imoNumber,
    flag: eachData.flag,
    built: format(eachData.built, "MMMM do, yyyy"),
    imoClasses: eachData.imoClasses,
    cargoQty: eachData.cargoQty,
    cargoType: eachData.cargoType,
    port: eachData.port.portName,
    shipper: eachData.shipper,
    consigne: eachData.consignee,
    shipowner: eachData.shipowner,
    nor: format(eachData.nor, "MMMM do, yyyy HH:mm"),
    gt: eachData.gt,
    nt: eachData.nt,
    dwt: eachData.dwt,
    loa: eachData.loa,
    beam: eachData.beam,
    classification: eachData.classification,
    activity: eachData.activity,
    master: eachData.master,
    nationality: eachData.nationality,
    createdAt: format(eachData.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DataClient data={formattedData} />
      </div>
    </div>
  );
};

export default DataPage;

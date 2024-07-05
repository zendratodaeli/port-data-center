
import PortPerformanceDataChartWithToggle from "@/components/port-performance-data-chart-toggle";
import VesselAndPortCard from "@/components/vessel-and-port-card";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { endOfToday, startOfToday } from "date-fns";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const { userId } = auth();

  const listAdminId = [
    { adminId1: "user_2il1XkfhJFtxhMslrBq1JK6PapV" },
    { adminId2: "user_2il3sWCyhA35P1GvOuVsaPEsyrr" },
  ];

  const isAdmin = listAdminId.some((admin) =>
    Object.values(admin).includes(userId)
  );

  if (!userId || !isAdmin) {
    redirect("/data")
  }

  const totalPorts = await prisma.port.findMany();
  const totalVessels = await prisma.data.findMany();
  
  const start = startOfToday();
  const end = endOfToday();

  const vesselsToday = await prisma.data.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  return (
    <div className="space-y-4 p-8 pt-6">
      <VesselAndPortCard
        totalVessel={totalVessels.length}
        totalPort={totalPorts.length}
        currentVessel={vesselsToday.length}
      />
      <PortPerformanceDataChartWithToggle totalVessels={totalVessels} />
    </div>
  );
};

export default DashboardPage;

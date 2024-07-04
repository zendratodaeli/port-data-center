import { transformDataForChart } from "@/actions/transform-data";
import PortPerformanceDataChart from "@/components/port-performance-data-chart";
import { Separator } from "@/components/ui/separator";
import VesselAndPortCard from "@/components/vessel-and-port-card";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { endOfToday, startOfToday } from "date-fns";

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
    return (
      <div className="space-y-4 p-8 pt-6">
        <p className="text-xl md:text-2xl lg:text-4xl text-center font-semibold">
          Access Denied
        </p>
        <Separator />
        <p className="text-center">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const totalPorts = await prisma.port.findMany();
  const totalVessels = await prisma.data.findMany();
  const chartData = transformDataForChart(totalVessels);

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
    <div className=" space-y-4 p-8 pt-6">
      <VesselAndPortCard
        totalVessel={totalVessels.length}
        totalPort={totalPorts.length}
        currentVessel={vesselsToday.length}
      />
      <PortPerformanceDataChart data={chartData} />
    </div>
  );
};

export default DashboardPage;

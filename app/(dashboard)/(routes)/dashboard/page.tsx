import { transformDataForChart } from "@/actions/transform-data";
import PortPerformanceData from "@/components/port-performance-data";
import { Separator } from "@/components/ui/separator";
import VesselAndPortCard from "@/components/vessel-and-port-card";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

const DashboardPage = async () => {
  const { userId } = auth();
  // const listAdminId = [
  //   "user_2il1XkfhJFtxhMslrBq1JK6PapV",
  //   "user_2il3sWCyhA35P1GvOuVsaPEsyrr",
  // ];

  // if (!userId || !listAdminId.includes(userId)) {
  //   return (
  //     <div className=" space-y-4 p-8 pt-6">
  //       <p className=" text-xl md:text-2xl lg:text-4xl text-center font-semibold">
  //         Access Denied
  //       </p>
  //       <Separator />
  //       <p className=" text-center">
  //         You do not have permission to view this page.
  //       </p>
  //     </div>
  //   );
  // }

  const listAdminId = [
    {"adminId1": "user_2il1XkfhJFtxhMslrBq1JK6PapV"},
    {"adminId2": "user_2il3sWCyhA35P1GvOuVsaPEsyrr"},
  ];
  
  const isAdmin = listAdminId.some(admin => Object.values(admin).includes(userId));
  
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

  return (
    <div className=" space-y-4 p-8 pt-6">
      <VesselAndPortCard
        totalVessel={totalVessels.length}
        totalPort={totalPorts.length}
      />
      <PortPerformanceData data={chartData} />
    </div>
  );
};

export default DashboardPage;

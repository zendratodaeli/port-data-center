import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface VesselAndPortCard {
  totalVessel: number;
  totalPort: number;
  currentVessel: number
}

const VesselAndPortCard = ({totalVessel, totalPort, currentVessel}: VesselAndPortCard) => {
  return (
    <div className=" flex-col">
      <h1> {format(new Date(), "MMMM do, yyyy")}</h1>
      <div className=" flex-1 space-y-4 ">
        <Heading title="Port Performance" description="Analyzing the productivity of the port" />
        <Separator />
        <div className=" grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className=" text-sm font-medium">
              <CardTitle className="flex flex-row items-center justify-between space-y-0 pb-2">
                Total Vessels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className=" text-2xl font-bold">{totalVessel}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className=" text-sm font-medium">
              <CardTitle className="flex flex-row items-center justify-between space-y-0 pb-2">
                Total Ports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className=" text-2xl font-bold">{totalPort}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className=" text-sm font-medium">
              <CardTitle className="flex flex-row items-center justify-between space-y-0 pb-2">
                Current Vessels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className=" text-2xl font-bold">{currentVessel}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default VesselAndPortCard;

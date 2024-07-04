import { format } from 'date-fns';

interface VesselData {
  id: string;
  userId: string;
  portId: string;
  shipper: string;
  consignee: string;
  shipowner: string;
  vesselName: string;
  vesselType: string;
  built: Date;
  imoNumber: number;
  imoClasses: string;
  flag: string;
  cargoQty: number;
  cargoType: string;
  nor: Date;
  gt: number;
  nt: number;
  dwt: number;
  loa: number;
  beam: number;
  classification: string;
  activity: string;
  master: string;
  nationality: string;
  statusData: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChartData {
  name: string;
  vesselCount: number;
}

export const transformDataForChart = (data: VesselData[]): ChartData[] => {
  const weeklyData: { [key: string]: number } = {};

  data.forEach((vessel) => {
    const date = format(new Date(vessel.createdAt), 'yyyy-MM-dd');
    if (weeklyData[date]) {
      weeklyData[date]++;
    } else {
      weeklyData[date] = 1;
    }
  });

  const sortedDates = Object.keys(weeklyData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return sortedDates.map(date => ({
    name: date,
    vesselCount: weeklyData[date],
  }));
};

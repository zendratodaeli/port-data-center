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

export const transformDataForChart = (data: VesselData[], period: 'weekly' | 'monthly' | 'yearly' | 'all'): ChartData[] => {
  const periodData: { [key: string]: number } = {};

  data.forEach((vessel) => {
    let date: string;
    if (period === 'weekly') {
      date = format(new Date(vessel.createdAt), 'yyyy-MM-dd');
    } else if (period === 'monthly') {
      date = format(new Date(vessel.createdAt), 'yyyy-MM');
    } else if (period === 'yearly') {
      date = format(new Date(vessel.createdAt), 'yyyy');
    } else {
      // Group by year-month for the 'all' period to keep the chart manageable
      date = format(new Date(vessel.createdAt), 'yyyy-MM');
    }
    
    if (periodData[date]) {
      periodData[date]++;
    } else {
      periodData[date] = 1;
    }
  });

  const sortedDates = Object.keys(periodData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return sortedDates.map(date => ({
    name: date,
    vesselCount: periodData[date],
  }));
};


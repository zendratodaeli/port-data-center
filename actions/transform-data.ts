import { format, addDays, addMonths, addYears, startOfWeek, startOfMonth, startOfYear, eachDayOfInterval, eachMonthOfInterval, eachYearOfInterval } from 'date-fns';

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

const getNextDate = (date: Date, period: 'weekly' | 'monthly' | 'yearly' | 'all'): Date => {
  if (period === 'weekly') return addDays(date, 7);
  if (period === 'monthly') return addMonths(date, 1);
  if (period === 'yearly') return addYears(date, 1);
  if (period === 'all') return addMonths(date, 1); // Group by month for 'all'
  throw new Error('Invalid period');
};

const getStartOfDate = (date: Date, period: 'weekly' | 'monthly' | 'yearly' | 'all'): Date => {
  if (period === 'weekly') return startOfWeek(date);
  if (period === 'monthly') return startOfMonth(date);
  if (period === 'yearly') return startOfYear(date);
  if (period === 'all') return startOfMonth(date); // Group by month for 'all'
  throw new Error('Invalid period');
};

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
    } else if (period === 'all') {
      date = format(new Date(vessel.createdAt), 'yyyy-MM');
    } else {
      throw new Error('Invalid period');
    }
    
    if (periodData[date]) {
      periodData[date]++;
    } else {
      periodData[date] = 1;
    }
  });

  const sortedDates = Object.keys(periodData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  if (sortedDates.length === 0) {
    return [];
  }

  const startDate = getStartOfDate(new Date(sortedDates[0]), period);
  const endDate = new Date();

  const intervals = {
    'weekly': eachDayOfInterval({ start: startDate, end: endDate }).map(date => format(date, 'yyyy-MM-dd')),
    'monthly': eachMonthOfInterval({ start: startDate, end: endDate }).map(date => format(date, 'yyyy-MM')),
    'yearly': eachYearOfInterval({ start: startDate, end: endDate }).map(date => format(date, 'yyyy')),
    'all': eachMonthOfInterval({ start: startDate, end: endDate }).map(date => format(date, 'yyyy-MM')), // Group by month for 'all'
  };

  const intervalDates = intervals[period];

  return intervalDates.map(date => ({
    name: date,
    vesselCount: periodData[date] || 0,
  }));
};

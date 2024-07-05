'use client';

import React, { useState, useEffect } from 'react';
import { transformDataForChart } from "@/actions/transform-data";
import PortPerformanceDataChart from "@/components/port-performance-data-chart";
import { Button } from './ui/button';

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

interface PortPerformanceDataChartWithToggleProps {
  totalVessels: VesselData[];
}

const PortPerformanceDataChartWithToggle: React.FC<PortPerformanceDataChartWithToggleProps> = ({ totalVessels }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [dataPeriod, setDataPeriod] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const transformedData = transformDataForChart(totalVessels, dataPeriod);
    setChartData(transformedData);
  }, [dataPeriod, totalVessels]);

  const handleToggle = () => {
    const newPeriod = dataPeriod === 'weekly' ? 'monthly' : 'weekly';
    setDataPeriod(newPeriod);
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <Button onClick={handleToggle} className="mb-4 p-2 bg-blue-500 text-black rounded">
        Toggle to {dataPeriod === 'weekly' ? 'Monthly' : 'Weekly'} Data
      </Button>
      <PortPerformanceDataChart data={chartData} />
    </div>
  );
};

export default PortPerformanceDataChartWithToggle;

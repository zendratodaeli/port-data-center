"use client";

import React, { useState, useEffect } from 'react';
import { transformDataForChart } from "@/actions/transform-data";
import PortPerformanceDataChart from "@/components/port-performance-data-chart";

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
  const [dataPeriod, setDataPeriod] = useState<'weekly' | 'monthly' | 'yearly' | 'all'>('weekly');

  useEffect(() => {
    const transformedData = transformDataForChart(totalVessels, dataPeriod);
    console.log('Transformed Data:', transformedData);  // Debugging log
    setChartData(transformedData);
  }, [dataPeriod, totalVessels]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDataPeriod(event.target.value as 'weekly' | 'monthly' | 'yearly' | 'all');
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <select 
        onChange={handleSelectChange} 
        value={dataPeriod} 
        className="mb-4 p-2 text-black rounded border"
      >
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
        <option value="all">All</option>
      </select>
      <PortPerformanceDataChart data={chartData} />
    </div>
  );
};

export default PortPerformanceDataChartWithToggle;

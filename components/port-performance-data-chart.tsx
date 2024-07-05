'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  vesselCount: number;
}

interface PortPerformanceDataChartProps {
  data: ChartData[];
}

const PortPerformanceDataChart: React.FC<PortPerformanceDataChartProps> = ({ data }) => (
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 0,
          left: -15,
          bottom: 0,
        }}
        className='overflow-x-auto'
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="vesselCount" stroke="#8884d8" fill="#008000" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default PortPerformanceDataChart;

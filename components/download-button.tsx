"use client";

import { Button } from "@/components/ui/button";
import { DataColumn } from '@/app/(dashboard)/(routes)/data/components/columns';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Download } from "lucide-react";

interface DownloadButtonProps {
  data: DataColumn[];
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onExportLocal = () => {
    const fileName = 'Vessel_Data.xlsx';

    // Define the headers
    const headers = [
      "Number","Vessel Name", "Vessel Type", "IMO Number", "Flag", "Built", "IMO Classes", 
      "Cargo Quantity", "Cargo Type", "Port", "Shipper", "Consignee", 
      "Shipowner", "NOR", "GT", "NT", "DWT", "LOA", "Beam", "Classification", 
      "Activity", "Master", "Nationality", "Created At"
    ];

    // Map the data to match the headers
    const formattedData = data.map((eachData, index) => ({
      "Number": index + 1,
      "Vessel Name": eachData.vesselName,
      "Vessel Type": eachData.vesselType,
      "IMO Number": eachData.imoNumber,
      "Flag": eachData.flag,
      "Built": eachData.built,
      "IMO Classes": eachData.imoClasses,
      "Cargo Quantity": eachData.cargoQty,
      "Cargo Type": eachData.cargoType,
      "Port": eachData.port,
      "Shipper": eachData.shipper,
      "Consignee": eachData.consigne,
      "Shipowner": eachData.shipowner,
      "NOR": eachData.nor,
      "GT": eachData.gt,
      "NT": eachData.nt,
      "DWT": eachData.dwt,
      "LOA": eachData.loa,
      "Beam": eachData.beam,
      "Classification": eachData.classification,
      "Activity": eachData.activity,
      "Master": eachData.master,
      "Nationality": eachData.nationality,
      "Created At": eachData.createdAt,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Function to convert a binary string to an array buffer
    const s2ab = (s: any) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    };

    // Create a Blob from the array buffer and trigger the download
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Button onClick={onExportLocal} variant={"outline"}>
      <Download className=" mr-2 h-4 w-4"/>
      Download Existing Data
    </Button>
  );
};

export default DownloadButton;

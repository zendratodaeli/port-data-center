"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { DataColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";

interface DataClientProps {
  data: DataColumn[];
}

const DataClient: React.FC<DataClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title={`Data (${data.length})`}
          description="Manage your data"
        />
        <Button
          onClick={() =>
            router.push(`/data/new`)
          }
        >
          <Plus className=" mr-2 h-4 w-4" />
          Add Data
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="vesselName" dateKey="createdAt" columns={columns} data={data} />
    </>
  );
};

export default DataClient;

"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { DataColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface DataClientProps {
  data: DataColumn[];
}

const DataClient: React.FC<DataClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const { user } = useUser();
  const userId = user?.id;

  const listAdminId = [
    "user_2il1XkfhJFtxhMslrBq1JK6PapV",
    "user_2il3sWCyhA35P1GvOuVsaPEsyrr",
  ];

  if (!userId) {
    return null;
  }

  const isAdmin = listAdminId.includes(userId);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Data of Vessel`} description="Manage your data" />
        {!isAdmin && (
          <Button onClick={() => router.push(`/data/new`)} className="md:w-[150px]">
            <Plus className="mr-2 h-4 w-4" />
            Add Data
          </Button>
        )}
      </div>
      <Separator />
      <DataTable vesselKey="vesselName" dateKey="createdAt" portKey="port" columns={columns} data={data} />
      <div>
        <h1 className=" text-red-600 font-extrabold">Attention!</h1>
        <p className=" underline hover:font-bold cursor-pointer">
          Template File
        </p>
        <Link
        href="./template-file.xlsx" 
        target="_blank" 
        rel="nooponer noreferrer"
        className=" font-bold text-slate-700 hover:text-slate-400"
        >
        <Button>
          Download
        </Button>
      </Link>
      </div>
    </>
  );
};

export default DataClient;
"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Eye, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, PasswordColumn } from "./columns";
import { DataTablePassword } from "@/components/ui/data-table-password";

interface PasswordClientProps {
  data: PasswordColumn[];
}

const PasswordClient: React.FC<PasswordClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className=" flex md:items-center justify-between">
        <Heading
          title={`User Passwords (${data.length})`}
          description="Manage User Passwords"
        />
        <Button
          onClick={() => router.push(`/register/new`)}
        >
          <Plus className=" mr-2 h-4 w-4" />
          Add Password
        </Button>
      </div>
      <Separator />
      <DataTablePassword dateKey="createdAt" searchKey="userName" columns={columns} data={data} />
    </>
  );
};

export default PasswordClient;

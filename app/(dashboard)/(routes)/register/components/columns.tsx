"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type PasswordColumn = {
  id: string;
  userName: string;
  password: string;
  createdAt: string;
};

export const columns: ColumnDef<PasswordColumn>[] = [
  {
    accessorKey: "userName",
    header: "Username",
  },
  {
    accessorKey: "password",
    header: "Password",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

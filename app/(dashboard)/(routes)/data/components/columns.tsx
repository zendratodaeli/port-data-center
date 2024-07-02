"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type DataColumn = {
  id: string
  vesselName: string
  vesselType: string
  imoNumber: number
  flag: string
  built: string
  imoClasses: string
  cargoQty: number
  cargoType: string
  port: string
  shipper: string
  consigne: string
  shipowner: string
  nor: string
  gt: number
  nt: number
  dwt: number
  loa: number
  beam: number
  classification: string
  activity: string
  master: string
  nationality: string
  createdAt: string
}

export const columns: ColumnDef<DataColumn>[] = [
  {
    accessorKey: "vesselName",
    header: "Name of Vessel",
  },
  {
    accessorKey: "vesselType",
    header: "Type of Vessel",
  },
  {
    accessorKey: "imoNumber",
    header: "IMO Number",
  },
  {
    accessorKey: "flag",
    header: "Flag",
  },
  {
    accessorKey: "built",
    header: "Built",
    cell: ({ row }) => row.original.built
  },
  {
    accessorKey: "imoClasses",
    header: "IMO Classes",
  },
  {
    accessorKey: "cargoQty",
    header: "Quantity of Cargo (MT)",
  },
  {
    accessorKey: "cargoType",
    header: "Type of Cargo",
  },
  {
    accessorKey: "port",
    header: "Port",
    cell: ({ row }) => row.original.port
  },
  {
    accessorKey: "shipper",
    header: "Shipper",
  },
  {
    accessorKey: "consigne",
    header: "Consignee",
  },
  {
    accessorKey: "shipowner",
    header: "Shipowner",
  },
  {
    accessorKey: "nor",
    header: "Notice of Readiness (NOR)",
    cell: ({ row }) => row.original.nor
  },
  {
    accessorKey: "gt",
    header: "Gross Tonnage (GT)",
  },
  {
    accessorKey: "nt",
    header: "Net Tonnage (NT)",
  },
  {
    accessorKey: "dwt",
    header: "Dead Weight Ton (DWT)",
  },
  {
    accessorKey: "loa",
    header: "LOA (M)",
  },
  {
    accessorKey: "beam",
    header: "Beam (M)",
  },
  {
    accessorKey: "classification",
    header: "Classification",
  },
  {
    accessorKey: "activity",
    header: "Activity",
  },
  {
    accessorKey: "master",
    header: "Master",
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]


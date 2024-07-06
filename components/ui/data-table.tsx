"use client";

import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { Input } from "./input";
import * as XLSX from "xlsx";
import axios from "axios";
import DOMPurify from "dompurify";
import { format, parse } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heading } from "./heading";
import { useUser } from "@clerk/nextjs";

interface DataItem {
  [key: string]: any;
}

interface DataTableProps<TData extends DataItem, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  vesselKey: string;
  dateKey: string;
  portKey: string;
}

export function DataTable<TData extends DataItem, TValue>({
  columns,
  data,
  vesselKey,
  dateKey,
  portKey,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateFilter, setDateFilter] = useState<string | undefined>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<TData[]>(data);
  const [selectedPort, setSelectedPort] = useState<string | null>(null);
  const [availablePorts, setAvailablePorts] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const router = useRouter();

  const { user } = useUser();
  const userId = user?.id;

  const rowNumberColumn: ColumnDef<TData, TValue> = {
    id: "rowNumber",
    header: "No.",
    cell: ({ row }) => row.index + 1,
  };

  const columnsWithRowNumber = [rowNumberColumn, ...columns];

  const table = useReactTable({
    data,
    columns: columnsWithRowNumber,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setDateFilter(format(new Date(), "yyyy-MM-dd"));

    // Extract unique ports from the data
    const ports = Array.from(new Set(data.map((item) => item[portKey])));
    setAvailablePorts(ports);
  }, [data, portKey]);

  useEffect(() => {
    setFilteredData(
      table.getFilteredRowModel().rows.map((row) => row.original)
    );
  }, [columnFilters, table]);

  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setDateFilter(value);

    if (value) {
      const parsedDate = new Date(value);
      const formattedDate = format(parsedDate, "MMMM do, yyyy");

      setColumnFilters((old) => {
        const newFilters = old.filter((filter) => filter.id !== dateKey);
        newFilters.push({
          id: dateKey,
          value: formattedDate,
        });
        return newFilters;
      });
    } else {
      setColumnFilters((old) => old.filter((filter) => filter.id !== dateKey));
    }
  };

  const handleFileUpload = async (uploadedFile: File | null) => {
    if (uploadedFile) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet, {
            raw: false,
            dateNF: "yyyy-mm-dd",
          });

          const parsedJson = json.map((item: any) => ({
            ...item,
            built: parseExcelDate(item.built),
            nor: parseExcelDate(item.nor),
            imoNumber: parseInt(item.imoNumber, 10),
          }));

          try {
            await axios.post("/api/data-upload", parsedJson);
            toast.success("Data uploaded successfully");

            router.push(`/data`);
            router.refresh();
          } catch (error) {
            console.error("Error uploading data:", error);
            toast.error("Error uploading data");
          } finally {
            setLoading(false);
          }
        }
      };
      reader.readAsBinaryString(uploadedFile);
    }
  };

  const parseExcelDate = (excelDate: string | number) => {
    if (typeof excelDate === "number" && !isNaN(excelDate)) {
      const date = new Date(Math.round((excelDate - 25569) * 864e5));
      return date.toISOString().split("T")[0];
    }
    if (typeof excelDate === "string") {
      const date = parse(excelDate, "yyyy-MM-dd", new Date());
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }
    return excelDate;
  };

  const listAdminId = [
    "user_2il1XkfhJFtxhMslrBq1JK6PapV",
    "user_2il3sWCyhA35P1GvOuVsaPEsyrr",
  ];

  if (!userId) {
    return null;
  }

  const isAdmin = listAdminId.includes(userId);

  if (!isMounted) {
    return null;
  }

  const handlePortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const port = event.target.value;
    setSelectedPort(port);

    setColumnFilters((old) => {
      const newFilters = old.filter((filter) => filter.id !== portKey);
      if (port) {
        newFilters.push({
          id: portKey,
          value: port,
        });
      }
      return newFilters;
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  return (
    <div>
      <div>
        <h2 className="text-xl md:text-3xl font-bold tracking-tight">
          Total {`(${filteredData.length})`}
        </h2>
        <p className="text-sm text-muted-foreground">
          {"Current vessels at the port"}
        </p>
      </div>
      <div className="grid grid-cols-1 w-full md:grid-cols-2 py-4 gap-2">
        <Input
          placeholder="Search by vessel"
          value={(table.getColumn(vesselKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(vesselKey)?.setFilterValue(event.target.value)
          }
          className="hidden md:flex md:w-[350px]"
        />
        <div className="flex gap-2 justify-between">
          <Input
            type="date"
            value={dateFilter ?? ""}
            onChange={handleDateChange}
            className="w-[144px]"
          />
          {!isAdmin ? (
            <Dialog>
              <DialogTrigger>
                <Button className="w-[115.84px] md:w-[150px]">
                  <Plus className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center mb-2">
                    Upload File
                  </DialogTitle>
                  <DialogDescription>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 cursor-pointer ${
                        isDragOver
                          ? "bg-gray-200 dark:bg-gray-600 border-gray-400 dark:border-gray-500"
                          : "bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("dropzone-file")?.click()
                      }
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16V12m0 0V8m0 4h4m4 0h.01M20 12h.01M4 12h.01M12 20l4-4m-8 4l4-4"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          XLS or XLSX files only
                        </p>
                      </div>
                      <Input
                        id="dropzone-file"
                        type="file"
                        accept=".xls,.xlsx"
                        className="hidden"
                        onChange={handleInputChange}
                      />
                    </div>
                    {file && (
                      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Selected file: {file.name}
                      </p>
                    )}
                    <Button
                      onClick={() => handleFileUpload(file)}
                      disabled={loading}
                      className="w-full mt-4"
                    >
                      {loading ? "Uploading in progress..." : "Upload"}
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex gap-2 justify-between">
              <select
                value={selectedPort ?? ""}
                onChange={handlePortChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All Ports</option>
                {availablePorts.map((port) => (
                  <option key={port} value={port}>
                    {port}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <Input
          placeholder="Search by vessel"
          value={(table.getColumn(vesselKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(vesselKey)?.setFilterValue(event.target.value)
          }
          className="flex w-full md:hidden"
        />
      </div>
      <div className="rounded-md border w-full">
        <Table className="whitespace-nowrap">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {typeof cell.getValue() === "string" ? (
                        <div
                          dangerouslySetInnerHTML={createMarkup(
                            cell.getValue() as string
                          )}
                        />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithRowNumber.length}
                  className="h-24 text-center"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

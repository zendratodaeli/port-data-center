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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  dateKey: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  dateKey,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateFilter, setDateFilter] = useState<string | undefined>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<TData[]>(data); // Track filtered data

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
  }, []);

  useEffect(() => {
    setFilteredData(table.getFilteredRowModel().rows.map((row) => row.original));
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

  const handleFileUpload = async () => {
    if (file) {
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
      reader.readAsBinaryString(file);
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

  return (
    <div>
      <div>
        <h2 className=" text-xl md:text-3xl font-bold tracking-tight">Total {`(${filteredData.length})`}</h2>
        <p className=" text-sm text-muted-foreground">{"Current vessels at the port"}</p>
      </div>
      <div className="grid grid-cols-1 w-full md:grid-cols-2 py-4 gap-2">
        <Input
          placeholder="Search by vessel's name"
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="hidden md:flex w-full md:w-[350px]"
        />
        <div className="flex gap-2 justify-between">
          <Input
            type="date"
            value={dateFilter ?? ""}
            onChange={handleDateChange}
            className="w-[144px]"
          />
          {!isAdmin && (
          <Dialog>
            <DialogTrigger>
              <Button className="w-[115.84px] md:w-[150px]">
                <Plus className=" mr-2 h-4 w-4" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  Importing Data
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center justify-center w-full mt-4">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        
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
                        onChange={(e) =>
                          setFile(e.target.files ? e.target.files[0] : null)
                        }
                      />
                    </label>
                  </div>
                  <Button
                    onClick={handleFileUpload}
                    disabled={loading}
                    className="w-full mt-4"
                  >
                    {loading ? "Uploading on progress..." : " Upload"}
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          )}
        </div>
        <Input
          placeholder="Search by vessel's name"
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
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


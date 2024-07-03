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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  const router = useRouter();

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

  if (!isMounted) {
    return null;
  }

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
            imoNumber: parseInt(item.imoNumber, 10), // Ensure imoNumber is an integer
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

  return (
    <div className="">
      <div className="grid grid-cols-1 w-full md:grid-cols-3 py-4 gap-2">
        <Input
          placeholder="Search by vessel's name"
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="w-full md:w-[400px]"
        />
        <div className=" md:flex justify-center">
          <Input
            type="date"
            value={dateFilter ?? ""}
            onChange={handleDateChange}
            className="w-[144px]"
          />
        </div>
        <div className="flex flex-row-reverse gap-2">
          <Dialog>
            <DialogTrigger>
              <Button>Import XLS</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  Importing Data
                </DialogTitle>
                <DialogDescription>
                  <div className="flex justify-between gap-2 mt-5">
                    <Input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={(e) =>
                        setFile(e.target.files ? e.target.files[0] : null)
                      }
                      className="w-full"
                    />
                    <Button
                      onClick={handleFileUpload}
                      disabled={loading}
                      className=" w-[150px]"
                    >
                      <Plus className=" mr-2 h-4 w-4" />
                      {loading ? "On progress..." : " Upload Data"}
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
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

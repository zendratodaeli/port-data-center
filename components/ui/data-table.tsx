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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./button";
import { Input } from "./input";
import * as XLSX from "xlsx";
import axios from "axios";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  const [dateFilter, setDateFilter] = useState<string | undefined>(format(new Date(), "yyyy-MM-dd"));
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
    // Set initial date filter to current date
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
          const json = XLSX.utils.sheet_to_json(workSheet);

          try {
            await axios.post('/api/data-upload', json);
            toast.success('Data uploaded successfully');

            router.push(`/data`);
            router.refresh();

          } catch (error) {
            console.error("Error uploading data:", error);
            toast.error('Error uploading data');
          } finally {
            setLoading(false);
          }
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Search by vessel's name"
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="w-full sm:w-[310px] hover:w-[500px] transition"
        />
        <Input
          type="date"
          value={dateFilter ?? ""}
          onChange={handleDateChange}
          className="w-full sm:w-[210px]"
        />
        <Input
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <Button onClick={handleFileUpload} className="bg-purple-400" disabled={loading}>
          {loading ? "On progress..." : "Import Data"}
        </Button>
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
                        flexRender(cell.column.columnDef.cell, cell.getContext())
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

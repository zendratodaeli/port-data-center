"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./button"
import { useEffect, useState } from "react"
import { Input } from "./input"
import DOMPurify from 'dompurify'
import { format } from "date-fns"

interface DataTablePasswordProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  dateKey: string;
}

export function DataTablePassword<TData, TValue>({
  columns,
  data,
  searchKey,
  dateKey,
}: DataTablePasswordProps<TData, TValue>) {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [dateFilter, setDateFilter] = useState<string | undefined>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [filteredData, setFilteredData] = useState<TData[]>(data);

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
  })

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setDateFilter(format(new Date(), "yyyy-MM-dd"));

  }, []);

  useEffect(() => {
    setFilteredData(
      table.getFilteredRowModel().rows.map((row) => row.original)
    );
  }, [columnFilters, table]);


  if(!isMounted) {
    return null;
  }

  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  }

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

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="grid grid-cols-1 w-full md:grid-cols-2 py-4 gap-2">
          <Input
            placeholder="Search username"
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className=" w-full sm:w-[310px]"
          />
          <div className=" flex gap-2 justify-between">
            <Input
                type="date"
                value={dateFilter ?? ""}
                onChange={handleDateChange}
                className="w-[144px]"
            />
          </div>
        </div>
      </div>
      <div className="rounded-md border w-full">
        <Table className=" whitespace-nowrap">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof cell.getValue() === 'string' ? (
                        <div dangerouslySetInnerHTML={createMarkup(cell.getValue() as string)} />
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
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
  )
}

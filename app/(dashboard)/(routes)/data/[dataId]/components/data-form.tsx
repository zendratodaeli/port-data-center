"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modal/alert-modal";
import { useUser } from "@clerk/nextjs";
import { Data, Port } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatDate = (date: Date) => date.toISOString().split(".")[0];

const formSchema = z.object({
  userId: z.string().min(1),
  portId: z.string().min(1),
  shipper: z.string().min(1),
  consignee: z.string().min(1),
  shipowner: z.string().min(1),
  vesselName: z.string().min(1),
  vesselType: z.string().min(1),
  built: z.string().min(1),
  imoNumber: z.preprocess((val) => Number(val), z.number().positive()),
  imoClasses: z.string().min(1),
  flag: z.string().min(1),
  cargoQty: z.preprocess(
    (val) => Number(val),
    z.number().positive().min(1)
  ),
  cargoType: z.string().min(1),
  nor: z.string().min(1),
  gt: z.preprocess((val) => Number(val), z.number().positive().min(1)),
  nt: z.preprocess((val) => Number(val), z.number().positive().min(1)),
  dwt: z.preprocess((val) => Number(val), z.number().positive().min(1)),
  loa: z.preprocess((val) => Number(val), z.number().positive().min(1)),
  beam: z.preprocess((val) => Number(val), z.number().positive().min(1)),
  classification: z.string().min(1),
  activity: z.string().min(1),
  master: z.string().min(1),
  nationality: z.string().min(1),
});

type DataFormValues = z.infer<typeof formSchema>;

interface DataFormProps {
  initialData: Data | null;
  ports: Port[];
}

const DataForm: React.FC<DataFormProps> = ({ initialData, ports }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Data" : "Add Data";
  const description = initialData
    ? "Edit existing data entry"
    : "Add a new data entry";
  const toastMessage = initialData ? "Data updated" : "Data Add.";
  const action = initialData ? "Save changes" : "Add";

  const form = useForm<DataFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          built: formatDate(new Date(initialData.built)),
          nor: formatDate(new Date(initialData.nor)),
        }
      : {
          userId: "",
          portId: "",
          shipper: "",
          consignee: "",
          shipowner: "",
          vesselName: "",
          vesselType: "",
          built: "",
          imoNumber: 0,
          imoClasses: "",
          flag: "",
          cargoQty: 0,
          cargoType: "",
          nor: "",
          gt: 0,
          nt: 0,
          dwt: 0,
          loa: 0,
          beam: 0,
          classification: "",
          activity: "",
          master: "",
          nationality: "",
        },
  });

  useEffect(() => {
    if (userId) {
      form.setValue("userId", userId);
    }
  }, [userId, form]);

  const onSubmit = async (data: DataFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/data/${params.dataId}`, data);
      } else {
        await axios.post(`/api/data`, data);
      }

      router.push(`/data`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/data/${params.dataId}`);

      router.push(`/data`);
      router.refresh();
      toast.success("Data deleted");
    } catch (error) {
      toast.error("Make sure you removed all contents first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="portId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ports</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl className=" w-full sm:w-full">
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a port"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ports.map((port) => (
                        <SelectItem key={port.id} value={port.id}>
                          {port.portName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipper"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipper</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Shipper..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consignee</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Consignee..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipowner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipowner</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Shipowner..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vesselName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vessel Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Vessel Name..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vesselType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vessel Type</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Vessel Type..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="built"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Built</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={loading}
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imoNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMO Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="IMO Number..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imoClasses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMO Classes</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="IMO Classes..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="flag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flag</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Flag..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cargoQty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo Quantity (MT)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Cargo Quantity..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cargoType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo Type</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Cargo Type..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NOR</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      disabled={loading}
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GT</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="GT..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NT</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="NT..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dwt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DWT (MT)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="DWT..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LOA (M)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="LOA..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beam (M)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Beam..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classification</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Classification..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity (Loading / Unloading)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Loading or Unloading..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="master"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Master</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Name of Master..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nationality of the Master..."
                      {...field}
                      className="w-full sm:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default DataForm;

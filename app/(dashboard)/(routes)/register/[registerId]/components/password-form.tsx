"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
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
import { Password } from "@prisma/client";

const formSchema = z.object({
  userName: z.string().min(1),
  password: z.string().min(1),
});

type PasswordFormValues = z.infer<typeof formSchema>;

interface PasswordFormProps {
  initialData: Password | null;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit a Password" : "Create a Password";
  const description = initialData ? "Edit a Password" : "Add a new Password";
  const toastMessage = initialData ? "Password Updated" : "Password created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: initialData?.userName || "",
      password: initialData?.password || "",
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/register/${params.registerId}`, data);
      } else {
        await axios.post(`/api/register`, data);
      }

      router.push(`/register`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong from Password form component");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/register/${params.registerId}`);

      router.push(`/register`);
      router.refresh();
      toast.success("Password deleted");
    } catch (error) {
      toast.error("Something went wrong");
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
          <div className="grid gap-8">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Username label..."
                      {...field}
                      className="w-full sm:w-[310px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Password..."
                      {...field}
                      className="w-full sm:w-[310px]"
                      type="password"
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

export default PasswordForm;

"use client";

import { FormItem_Input } from "~/components/FormItem_Input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { accountFormSchema } from "~/lib/formSchema/account";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";


export default function AccountUserInformation({userData}) {

    const { id, first_name, last_name, email } = userData;


  const formSchema = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof accountFormSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex h-full w-full justify-center border border-1 p-2 dark:border-gray-700">
      <div className="m-2 w-full">
        <div className="m-2">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-sm text-gray-500">Manage your account settings</p>
          <div className="m-2 flex flex-row flex-wrap gap-2">
            <Badge variant="secondary">User Active</Badge>
            <Badge variant="secondary">Verified User</Badge>
            <Badge variant="secondary">Two Factor Enabled</Badge>
            <Badge variant="secondary">Awsome</Badge>
            <Badge variant="secondary">Last Login: 10 July</Badge>
          </div>
        </div>

        <div className="m-2">
          <h2 className="text-xl font-bold">User Information</h2>
          <div className="flex flex-row items-center justify-center p-2">
            <Avatar className="h-18 w-18">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button className="ml-2" variant="outline">
              Change Avatar
            </Button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-wrap">
                <FormItem_Input
                  className="p-2 md:w-full lg:w-1/2"
                  control={form.control}
                  name="first_name"
                  label="First Name"
                  type="text"
                  placeholder="John"
                />
                <FormItem_Input
                  className="p-2 md:w-full lg:w-1/2"
                  control={form.control}
                  name="last_name"
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                />
                <FormItem_Input
                  className="p-2 md:w-full"
                  control={form.control}
                  name="email_address"
                  label="Email Address"
                  type="text"
                  placeholder="JonnyD@email.com"
                  disabled={true}
                />
                <FormItem_Input
                  className="p-2 md:w-full lg:w-1/2"
                  control={form.control}
                  name="phone_number"
                  label="Phone Number"
                  type="phone"
                  placeholder="03 1234 5678"
                />
                <FormItem_Input
                  className="p-2 md:w-full lg:w-1/2"
                  control={form.control}
                  name="mobile_number"
                  label="Mobile Number"
                  type="phone"
                  placeholder="0403 123 456"
                />
              </div>

              <Button type="submit">Save</Button>
            </form>
          </Form>
        </div>

        <div className="m-2">
          <h2 className="text-xl font-bold">Site </h2>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

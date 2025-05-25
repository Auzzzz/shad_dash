"use client";

import { FormItem_Input } from "~/components/FormItem_Input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Form,
} from "~/components/ui/form";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import type { UserData } from "~/lib/types/fusionAuth";
import toast from "react-hot-toast";

//TODO: create userData ts
export default function AccountUserInformation({
  userData,
  updateUser,
}: {
  userData: UserData;
  updateUser: (data: any) => Promise<any>;
}) {
  var {
    id,
    first_name,
    last_name,
    email,
    verified,
    last_login,
    active,
    username,
    mobile_number,
    imageUrl,
  } = userData;

  // Set Date into readable format
  const loginDate = new Date(last_login);
  const displayDate = loginDate.toLocaleDateString("en-AU", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // values for form items
  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      first_name: first_name || "",
      last_name: last_name || "",
      email: email || "",
      mobile_number: mobile_number || "",
      username: username || "",
      imageUrl: imageUrl || "",
    },
  });
  const [disabled, setDisabled] = useState(false);
  // Take the values from the forms submit to updateUser from parent then update userdata with response
  const onSubmit = async (data: z.infer<typeof accountFormSchema>) => {    
    setDisabled(true);
    const formData = form.getValues();
    updateUser({
      id: id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      mobile_number: formData.mobile_number || "",
      username: formData.username,
      imageUrl: formData.imageUrl,
    })
      .then((response) => {
        userData = {
          ...userData,
          first_name: response.user.firstName,
          last_name: response.user.lastName,
          username: response.user.username,
          mobile_number: response.user.mobilePhone,
        };

        toast.success("User has been updated", {position: "bottom-center"});

        setDisabled(false);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        toast.error("An error occurred when updating user", {position: "bottom-center"});

        setDisabled(false);
      });
  };

  //TODO: Two Factor Authentication
  //TODO: generic user img
  return (
    <div className="flex h-full w-full justify-center border border-1 p-2 dark:border-gray-700">
      <div className="m-2 w-full">
        <div className="m-2">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-sm text-gray-500">Manage your account settings</p>
          <div className="m-2 flex flex-row flex-wrap gap-2">
            {active ? (
              <Badge variant="secondary">Active User</Badge>
            ) : (
              <Badge variant="destructive">Inactive User</Badge>
            )}
            {verified ? (
              <Badge variant="secondary">Verified User</Badge>
            ) : (
              <Badge variant="destructive">Not Verified</Badge>
            )}
            <Badge variant="secondary">Two Factor Enabled</Badge>
            <Badge variant="secondary">Awsome</Badge>
            <Badge variant="secondary">Last Login: {displayDate}</Badge>
          </div>
        </div>

        <div className="m-2">
          <h2 className="text-xl font-bold">User Information</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-row p-2">
                <FormItem_Input
                  className="p-2 md:w-full lg:w-1/2"
                  control={form.control}
                  name="username"
                  label="Usermame"
                  type="text"
                  placeholder="Octopusman"
                  disabled={disabled}
                />
                <div className="flex flex-row items-center p-2">
                  {/* Change Avatar */}
                  <Avatar className="ml-2 h-18 w-18">
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="ml-4 flex">
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Change Avatar</DialogTitle>
                        <DialogDescription>
                          Upload your new avatar image here. Click save when
                          you're done.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Image Url
                        </Label>
                        <FormItem_Input
                          className="col-span-3"
                          control={form.control}
                          name="imageUrl"
                          type="url"
                          placeholder="https://example.com/avatar.jpg"
                          disabled={disabled}
                        />
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="flex flex-wrap">
                <FormItem_Input
                  className="p-2 md:w-full lg:w-1/2"
                  control={form.control}
                  name="first_name"
                  label="First Name"
                  type="text"
                  placeholder="John"
                  disabled={disabled}
                />
                <FormItem_Input
                  className="p-2 md:w-full lg:w-1/2"
                  control={form.control}
                  name="last_name"
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  disabled={disabled}
                />
                <FormItem_Input
                  className="p-2 md:w-full"
                  control={form.control}
                  name="email"
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
                  disabled={disabled}
                />
                <FormItem_Input
                  className="p-2 md:w-full lg:w-1/2"
                  control={form.control}
                  name="mobile_number"
                  label="Mobile Number"
                  type="phone"
                  placeholder="0403 123 456"
                  disabled={disabled}
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

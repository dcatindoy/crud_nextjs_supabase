"use client";

import { CustomTable } from "@/components/CustomTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlertCircle, Plus } from "lucide-react";
import { z } from "zod";
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

export default function BreadPage() {
  const headers = ["ID", "Name", "Price"];
  const invoices = [
    {
      ID: "INV001",
      Name: "Cheese Bread",
      Price: "$250.00",
    },
    {
      ID: "INV002",
      Name: "Pandesal",
      Price: "$150.00",
    },
    {
      ID: "INV003",
      Name: "Ensaymada",
      Price: "$350.00",
    },
  ];

  const handleEdit = (row: Record<string, any>) => {
    console.log("Editing:", row);
  };

  const handleDelete = (row: Record<string, any>) => {
    console.log("Deleting:", row);
  };

  const BreadSchema = z.object({
    name: z.string().min(2).max(50),
    price: z.coerce.number().min(1),
  });
  const form = useForm<z.infer<typeof BreadSchema>>({
    resolver: zodResolver(BreadSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  function onSubmit(values: z.infer<typeof BreadSchema>) {
    console.log(values);
  }

  return (
    <div className="flex justify-center mt-20">
      <div className="p4 w-[70%]">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold mb-4">Manage Breads</h1>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg">
                <Plus /> Add Bread
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Bread</SheetTitle>
                <SheetDescription>
                  Add a new bread that will be available in the store.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Eg: Ensaymada" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" size="lg">
                      Add
                    </Button>
                  </form>
                </Form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">Alert</AlertTitle>
          <AlertDescription>
            You're out of stocks for these products: Cheese Bread, Pandesal,
            Ensaymada.
          </AlertDescription>
        </Alert>
        <CustomTable
          caption="A list of available breads."
          headers={headers}
          data={invoices}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

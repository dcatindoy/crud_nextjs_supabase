"use client";

import { CustomTable } from "@/components/CustomTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";

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

  return (
    <div className="flex justify-center mt-20">
      <div className="p4 w-[70%]">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold mb-4">Manage Breads</h1>
          <Button>
            <Plus /> Add Bread
          </Button>
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

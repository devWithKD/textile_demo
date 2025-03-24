import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewOrderForm } from "@/components/sales/new-order-form";
import { getProducts } from "@/lib/actions/inventory";
import { getCustomers } from "@/lib/actions/sales";

export const metadata: Metadata = {
  title: "Create Order - Textile ERP",
  description: "Create a new customer order",
};

export default async function NewOrderPage() {
  const { success: productsSuccess, data: products = [] } = await getProducts();
  const { success: customersSuccess, data: customers = [] } =
    await getCustomers();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/sales">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to orders
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Create Order</h2>
        <p className="text-muted-foreground">Create a new customer order</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Enter the details for the new order</CardDescription>
        </CardHeader>
        <CardContent>
          <NewOrderForm products={products} customers={customers} />
        </CardContent>
      </Card>
    </div>
  );
}

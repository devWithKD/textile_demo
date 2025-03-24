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
import { NewWorkOrderForm } from "@/components/production/new-work-order-form";
import { getProducts } from "@/lib/actions/inventory";
import { getMaterials } from "@/lib/actions/materials";

export const metadata: Metadata = {
  title: "Create Work Order - Textile ERP",
  description: "Create a new production work order",
};

export default async function NewWorkOrderPage() {
  const { success: materialsSuccess, data: materials = [] } =
    await getMaterials();
  const { success: productsSuccess, data: products = [] } = await getProducts();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/production">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to work orders
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Create Work Order</h2>
        <p className="text-muted-foreground">Plan a new production run</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Order Details</CardTitle>
          <CardDescription>
            Enter the details for the new work order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewWorkOrderForm materials={materials} products={products} />
        </CardContent>
      </Card>
    </div>
  );
}

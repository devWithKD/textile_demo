import { Metadata } from "next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductsTable } from "@/components/inventory/products-table";
import { InventoryStats } from "@/components/inventory/inventory-stats";
import { getProducts } from "@/lib/actions/inventory";

export const metadata: Metadata = {
  title: "Inventory - Textile ERP",
  description: "Inventory management for the textile ERP system",
};

export default async function InventoryPage() {
  const { success, data: products = [], error } = await getProducts();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <InventoryStats products={products} />
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Products Inventory</CardTitle>
            <CardDescription>
              Manage your finished goods inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <ProductsTable products={products} />
            ) : (
              <p>Error loading products: {error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

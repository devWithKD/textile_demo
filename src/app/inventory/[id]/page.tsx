import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileEdit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductDetails } from "@/components/inventory/product-details";
import { StockUpdateForm } from "@/components/inventory/stock-update-form";
import { getProductById } from "@/lib/actions/inventory";

export const metadata: Metadata = {
  title: "Product Details - Textile ERP",
  description: "View and manage product details",
};

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { success, data: product, error } = await getProductById(params.id);

  if (!success || !product) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/inventory">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to inventory
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{product.name}</h2>
          <p className="text-muted-foreground">SKU: {product.sku}</p>
        </div>
        <Button>
          <FileEdit className="mr-2 h-4 w-4" /> Edit Product
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Complete information about this product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductDetails product={product} />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Update Stock</CardTitle>
            <CardDescription>Adjust inventory levels</CardDescription>
          </CardHeader>
          <CardContent>
            <StockUpdateForm
              productId={product.id}
              currentStock={product.currentStock}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

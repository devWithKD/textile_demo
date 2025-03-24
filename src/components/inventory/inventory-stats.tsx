import { Product } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InventoryStatsProps {
  products: Product[];
}

export function InventoryStats({ products }: InventoryStatsProps) {
  const totalProducts = products.length;

  const LOW_STOCK_THRESHOLD = 10;
  const lowStockProducts = products.filter(
    (product) => product.currentStock < LOW_STOCK_THRESHOLD,
  );

  const totalStockValue = products.reduce(
    (sum, product) => sum + product.currentStock * product.basePrice,
    0,
  );

  const categoryCounts = products.reduce(
    (acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const categories = Object.keys(categoryCounts).length;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            Across {categories} categories
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Low Stock Products
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockProducts.length}</div>
          <p className="text-xs text-muted-foreground">Need to restock soon</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalStockValue)}
          </div>
          <p className="text-xs text-muted-foreground">Total product value</p>
        </CardContent>
      </Card>
    </>
  );
}

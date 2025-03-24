import { Metadata } from "next";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrdersTable } from "@/components/sales/orders-table";
import { SalesStats } from "@/components/sales/sales-stats";
import { getOrders } from "@/lib/actions/sales";

export const metadata: Metadata = {
  title: "Sales - Textile ERP",
  description: "Sales management for the textile ERP system",
};

export default async function SalesPage() {
  const { success, data: orders = [], error } = await getOrders();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        <Button asChild>
          <Link href="/sales/new">
            <Plus className="mr-2 h-4 w-4" /> Create Order
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <SalesStats orders={orders} />
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <OrdersTable orders={orders} />
            ) : (
              <p>Error loading orders: {error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
import { WorkOrdersTable } from "@/components/production/work-orders-table";
import { ProductionStats } from "@/components/production/production-stats";
import { getWorkOrders } from "@/lib/actions/production";

export const metadata: Metadata = {
  title: "Production - Textile ERP",
  description: "Production management for the textile ERP system",
};

export default async function ProductionPage() {
  const { success, data: workOrders = [], error } = await getWorkOrders();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Production</h2>
        <Button asChild>
          <Link href="/production/new">
            <Plus className="mr-2 h-4 w-4" /> Create Work Order
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <ProductionStats workOrders={workOrders} />
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Work Orders</CardTitle>
            <CardDescription>Manage production work orders</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <WorkOrdersTable workOrders={workOrders} />
            ) : (
              <p>Error loading work orders: {error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

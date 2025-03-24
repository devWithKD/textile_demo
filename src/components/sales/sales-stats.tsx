import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, Truck, Package, CreditCard } from "lucide-react";
import { Order, OrderStatus } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

interface SalesStatsProps {
  orders: Order[];
}

export function SalesStats({ orders }: SalesStatsProps) {
  // Count orders by status
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const inProductionCount = orders.filter(
    (o) => o.status === "IN_PRODUCTION",
  ).length;
  const readyForDeliveryCount = orders.filter(
    (o) => o.status === "READY_FOR_DELIVERY",
  ).length;

  // Calculate total sales value
  const totalSales = orders.reduce((sum, order) => {
    // Only count confirmed, in production, ready for delivery, or delivered orders
    if (
      [
        "CONFIRMED",
        "IN_PRODUCTION",
        "READY_FOR_DELIVERY",
        "DELIVERED",
      ].includes(order.status)
    ) {
      return sum + order.totalAmount;
    }
    return sum;
  }, 0);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
          <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Production</CardTitle>
          <Package className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProductionCount}</div>
          <p className="text-xs text-muted-foreground">Being manufactured</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {readyForDeliveryCount > 0 ? "Ready for Delivery" : "Total Sales"}
          </CardTitle>
          {readyForDeliveryCount > 0 ? (
            <Truck className="h-4 w-4 text-green-500" />
          ) : (
            <CreditCard className="h-4 w-4 text-green-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {readyForDeliveryCount > 0
              ? readyForDeliveryCount
              : formatCurrency(totalSales)}
          </div>
          <p className="text-xs text-muted-foreground">
            {readyForDeliveryCount > 0 ? "Ready to ship" : "Total order value"}
          </p>
        </CardContent>
      </Card>
    </>
  );
}

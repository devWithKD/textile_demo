import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileEdit, ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderDetails } from "@/components/sales/order-details";
import { OrderItems } from "@/components/sales/order-items";
import { OrderStatusUpdate } from "@/components/sales/order-status-update";
import { getOrderById } from "@/lib/actions/sales";

export const metadata: Metadata = {
  title: "Order Details - Textile ERP",
  description: "View and manage order details",
};

export default async function OrderPage({
  params,
}: {
  params: { id: string };
}) {
  const { success, data: order, error } = await getOrderById(params.id);

  if (!success || !order) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/sales">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to orders
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Order: {order.orderNumber}
          </h2>
          <p className="text-muted-foreground">Status: {order.status}</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href={`/production/new?orderId=${order.id}`}>
              <ClipboardList className="mr-2 h-4 w-4" /> Create Work Order
            </Link>
          </Button>
          <OrderStatusUpdate order={order} />
          <Button>
            <FileEdit className="mr-2 h-4 w-4" /> Edit Order
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              Complete information about this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderDetails order={order} />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold">Company</h4>
                <p>{order.customer.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Contact Person</h4>
                <p>{order.customer.contactName || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Email</h4>
                <p>{order.customer.email || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Phone</h4>
                <p>{order.customer.phone || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Address</h4>
                <p>{order.customer.address || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Products included in this order</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderItems items={order.items} />
        </CardContent>
      </Card>

      {order.workOrders && order.workOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Work Orders</CardTitle>
            <CardDescription>
              Production work orders for this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {order.workOrders.map((workOrder) => (
                <div
                  key={workOrder.id}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div>
                    <div className="font-medium">
                      <Link
                        href={`/production/${workOrder.id}`}
                        className="hover:underline"
                      >
                        {workOrder.workOrderNumber}
                      </Link>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Status: {workOrder.status}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    Due: {new Date(workOrder.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

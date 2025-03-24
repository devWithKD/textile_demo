import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface OrderDetailsProps {
  order: any; // Using any because we need all the relations
}

export function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-1">Order Date</h4>
          <p>{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Delivery Date</h4>
          <p>
            {order.deliveryDate
              ? new Date(order.deliveryDate).toLocaleDateString()
              : "Not specified"}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Status</h4>
          <Badge className="text-sm">{order.status}</Badge>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Total Amount</h4>
          <p className="text-lg font-semibold">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Created By</h4>
          <p>{order.createdBy.name}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Work Orders</h4>
          <p>
            {order.workOrders ? order.workOrders.length : 0} associated work
            orders
          </p>
        </div>
      </div>
    </div>
  );
}

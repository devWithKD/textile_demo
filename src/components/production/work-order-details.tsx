import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface WorkOrderDetailsProps {
  workOrder: any; // Using any because we need all the relations
}

export function WorkOrderDetails({ workOrder }: WorkOrderDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-1">Description</h4>
          <p className="text-sm text-muted-foreground">
            {workOrder.description || "No description provided."}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Status</h4>
          <Badge className="text-sm">{workOrder.status}</Badge>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Start Date</h4>
          <p>{new Date(workOrder.startDate).toLocaleDateString()}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Due Date</h4>
          <p>{new Date(workOrder.dueDate).toLocaleDateString()}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Created By</h4>
          <p>{workOrder.createdBy.name}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Assigned To</h4>
          <p>
            {workOrder.assignedTo ? workOrder.assignedTo.name : "Not assigned"}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Products to Produce</h4>
        <div className="space-y-4">
          {workOrder.products.map((productItem: any) => (
            <div
              key={productItem.id}
              className="flex justify-between items-center p-3 border rounded-md"
            >
              <div>
                <div className="font-medium">{productItem.product.name}</div>
                <div className="text-sm text-muted-foreground">
                  SKU: {productItem.product.sku}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {productItem.producedQuantity} / {productItem.plannedQuantity}{" "}
                  produced
                </div>
                <div className="text-sm text-muted-foreground">
                  {(
                    (productItem.producedQuantity /
                      productItem.plannedQuantity) *
                    100
                  ).toFixed(0)}
                  % completed
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {workOrder.order && (
        <div>
          <h4 className="text-sm font-medium mb-1">Related Order</h4>
          <div className="p-3 border rounded-md">
            <div className="font-medium">
              Order #{workOrder.order.orderNumber}
            </div>
            <div className="text-sm text-muted-foreground">
              Customer: {workOrder.order.customer?.name || "Unknown"}
            </div>
            <div className="text-sm text-muted-foreground">
              Order Total: {formatCurrency(workOrder.order.totalAmount)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

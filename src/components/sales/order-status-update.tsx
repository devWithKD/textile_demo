"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateOrderStatus } from "@/lib/actions/sales";
import { Order, OrderStatus } from "@prisma/client";

interface OrderStatusUpdateProps {
  order: Order;
}

export function OrderStatusUpdate({ order }: OrderStatusUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Define available status transitions based on current status
  const getAvailableStatusOptions = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case "PENDING":
        return [
          { value: "CONFIRMED", label: "Confirm Order" },
          { value: "CANCELLED", label: "Cancel Order" },
        ];
      case "CONFIRMED":
        return [
          { value: "IN_PRODUCTION", label: "Mark as In Production" },
          { value: "CANCELLED", label: "Cancel Order" },
        ];
      case "IN_PRODUCTION":
        return [
          { value: "READY_FOR_DELIVERY", label: "Mark as Ready for Delivery" },
        ];
      case "READY_FOR_DELIVERY":
        return [{ value: "DELIVERED", label: "Mark as Delivered" }];
      case "DELIVERED":
        return []; // No transitions from delivered
      case "CANCELLED":
        return [{ value: "PENDING", label: "Reactivate Order" }];
      default:
        return [];
    }
  };

  const availableOptions = getAvailableStatusOptions(
    order.status as OrderStatus,
  );

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true);

    const promise = updateOrderStatus(order.id, newStatus);

    toast.promise(promise, {
      loading: "Updating order status...",
      success: "Status updated successfully",
      error: "Failed to update status",
    });

    const result = await promise;

    setIsUpdating(false);

    if (result.success) {
      router.refresh();
    }
  };

  if (availableOptions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isUpdating}>
          Update Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusUpdate(option.value as OrderStatus)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

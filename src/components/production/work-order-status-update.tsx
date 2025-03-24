("use client");

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
import { updateWorkOrderStatus } from "@/lib/actions/production";
import { WorkOrder, WorkOrderStatus } from "@prisma/client";

interface WorkOrderStatusUpdateProps {
  workOrder: WorkOrder;
}

export function WorkOrderStatusUpdate({
  workOrder,
}: WorkOrderStatusUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Define available status transitions based on current status
  const getAvailableStatusOptions = (currentStatus: WorkOrderStatus) => {
    switch (currentStatus) {
      case "PLANNED":
        return [
          { value: "IN_PROGRESS", label: "Start Production" },
          { value: "CANCELLED", label: "Cancel Work Order" },
        ];
      case "IN_PROGRESS":
        return [
          { value: "ON_HOLD", label: "Put On Hold" },
          { value: "COMPLETED", label: "Mark as Completed" },
        ];
      case "ON_HOLD":
        return [
          { value: "IN_PROGRESS", label: "Resume Production" },
          { value: "CANCELLED", label: "Cancel Work Order" },
        ];
      case "COMPLETED":
        return []; // No transitions from completed
      case "CANCELLED":
        return [{ value: "PLANNED", label: "Reactivate Work Order" }];
      default:
        return [];
    }
  };

  const availableOptions = getAvailableStatusOptions(workOrder.status);

  const handleStatusUpdate = async (newStatus: WorkOrderStatus) => {
    setIsUpdating(true);

    const promise = updateWorkOrderStatus(workOrder.id, newStatus);

    toast.promise(promise, {
      loading: "Updating work order status...",
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
            onClick={() => handleStatusUpdate(option.value as WorkOrderStatus)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

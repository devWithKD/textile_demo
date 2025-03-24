("use client");

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { WorkOrder, WorkOrderStatus } from "@prisma/client";

interface WorkOrdersTableProps {
  workOrders: any[]; // Using any because we're including relations
}

export function WorkOrdersTable({ workOrders }: WorkOrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkOrders = workOrders.filter(
    (order) =>
      order.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.assignedTo &&
        order.assignedTo.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())),
  );

  // Helper function to render status badge with the right color
  const getStatusBadge = (status: WorkOrderStatus) => {
    switch (status) {
      case "PLANNED":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Planned
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            In Progress
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      case "ON_HOLD":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200"
          >
            On Hold
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case "PLANNED":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "ON_HOLD":
        return <PauseCircle className="h-4 w-4 text-orange-500" />;
      case "CANCELLED":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search work orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Planned</DropdownMenuItem>
            <DropdownMenuItem>In Progress</DropdownMenuItem>
            <DropdownMenuItem>On Hold</DropdownMenuItem>
            <DropdownMenuItem>Completed</DropdownMenuItem>
            <DropdownMenuItem>Cancelled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Work Order</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkOrders.map((workOrder) => (
              <TableRow key={workOrder.id}>
                <TableCell>
                  <div className="font-medium">
                    <Link
                      href={`/production/${workOrder.id}`}
                      className="hover:underline flex items-center"
                    >
                      {getStatusIcon(workOrder.status)}
                      <span className="ml-2">{workOrder.workOrderNumber}</span>
                    </Link>
                    <div className="text-xs text-muted-foreground mt-1">
                      {workOrder.description
                        ? workOrder.description.length > 50
                          ? `${workOrder.description.substring(0, 50)}...`
                          : workOrder.description
                        : "No description"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {workOrder.products.map((wp: any) => (
                      <div key={wp.id}>
                        {wp.product.name} ({wp.plannedQuantity})
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(workOrder.status)}</TableCell>
                <TableCell>
                  {new Date(workOrder.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(workOrder.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {workOrder.assignedTo ? workOrder.assignedTo.name : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link href={`/production/${workOrder.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem>Add Quality Check</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

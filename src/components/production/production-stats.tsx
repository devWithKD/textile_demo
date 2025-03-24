import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, Calendar, AlertTriangle } from "lucide-react";
import { WorkOrder, WorkOrderStatus } from "@prisma/client";

interface ProductionStatsProps {
  workOrders: WorkOrder[];
}

export function ProductionStats({ workOrders }: ProductionStatsProps) {
  // Count work orders by status
  const plannedCount = workOrders.filter(
    (wo) => wo.status === "PLANNED",
  ).length;
  const inProgressCount = workOrders.filter(
    (wo) => wo.status === "IN_PROGRESS",
  ).length;
  const completedCount = workOrders.filter(
    (wo) => wo.status === "COMPLETED",
  ).length;

  // Find overdue work orders (due date is in the past but not completed)
  const overdueCount = workOrders.filter(
    (wo) =>
      (wo.status === "PLANNED" || wo.status === "IN_PROGRESS") &&
      new Date(wo.dueDate) < new Date(),
  ).length;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Planned</CardTitle>
          <Calendar className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{plannedCount}</div>
          <p className="text-xs text-muted-foreground">Scheduled work orders</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressCount}</div>
          <p className="text-xs text-muted-foreground">Active production</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {overdueCount > 0 ? "Overdue" : "Completed"}
          </CardTitle>
          {overdueCount > 0 ? (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overdueCount > 0 ? overdueCount : completedCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {overdueCount > 0 ? "Past due date" : "Successfully completed"}
          </p>
        </CardContent>
      </Card>
    </>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileEdit, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkOrderDetails } from "@/components/production/work-order-details";
import { WorkOrderMaterials } from "@/components/production/work-order-materials";
import { WorkOrderProcesses } from "@/components/production/work-order-processes";
import { WorkOrderQuality } from "@/components/production/work-order-quality";
import { WorkOrderStatusUpdate } from "@/components/production/work-order-status-update";
import { getWorkOrderById } from "@/lib/actions/production";

export const metadata: Metadata = {
  title: "Work Order Details - Textile ERP",
  description: "View and manage work order details",
};

export default async function WorkOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const { success, data: workOrder, error } = await getWorkOrderById(params.id);

  if (!success || !workOrder) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/production">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to work orders
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Work Order: {workOrder.workOrderNumber}
          </h2>
          <p className="text-muted-foreground">Status: {workOrder.status}</p>
        </div>
        <div className="flex space-x-2">
          <WorkOrderStatusUpdate workOrder={workOrder} />
          <Button>
            <FileEdit className="mr-2 h-4 w-4" /> Edit Work Order
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="processes">Processes</TabsTrigger>
          <TabsTrigger value="quality">Quality Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Order Details</CardTitle>
              <CardDescription>
                Complete information about this work order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkOrderDetails workOrder={workOrder} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Materials</CardTitle>
              <CardDescription>
                Materials required for this work order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkOrderMaterials workOrderMaterials={workOrder.materials} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Production Processes</CardTitle>
                <CardDescription>
                  Manufacturing processes for this work order
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Process
              </Button>
            </CardHeader>
            <CardContent>
              <WorkOrderProcesses processes={workOrder.processes} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Quality Checks</CardTitle>
                <CardDescription>Quality control checkpoints</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Quality Check
              </Button>
            </CardHeader>
            <CardContent>
              <WorkOrderQuality qualityChecks={workOrder.qualityChecks} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

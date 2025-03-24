import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface WorkOrderMaterialsProps {
  workOrderMaterials: any[]; // Using any for simplicity
}

export function WorkOrderMaterials({
  workOrderMaterials,
}: WorkOrderMaterialsProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Quantity Required</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workOrderMaterials.map((material) => {
            const progressPercentage =
              material.quantity > 0
                ? Math.min(100, (material.consumed / material.quantity) * 100)
                : 0;

            return (
              <TableRow key={material.id}>
                <TableCell>
                  <div className="font-medium">{material.material.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(material.material.price)} per{" "}
                    {material.material.unit}
                  </div>
                </TableCell>
                <TableCell>
                  {material.quantity} {material.material.unit}
                </TableCell>
                <TableCell>
                  {material.consumed} {material.material.unit}
                </TableCell>
                <TableCell>{material.material.unit}</TableCell>
                <TableCell>
                  <div className="w-full">
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {progressPercentage.toFixed(0)}% used
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

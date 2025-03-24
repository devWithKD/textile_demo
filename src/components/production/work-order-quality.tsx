import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

interface WorkOrderQualityProps {
  qualityChecks: any[]; // Using any for simplicity
}

export function WorkOrderQuality({ qualityChecks }: WorkOrderQualityProps) {
  if (qualityChecks.length === 0) {
    return (
      <p className="text-muted-foreground">
        No quality checks recorded for this work order yet.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Checkpoint</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qualityChecks.map((check) => (
            <TableRow key={check.id}>
              <TableCell>
                <div className="font-medium">{check.checkpoint}</div>
              </TableCell>
              <TableCell>
                {check.passed ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span>Passed</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-5 w-5 mr-1" />
                    <span>Failed</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {new Date(check.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{check.notes || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface WorkOrderProcessesProps {
  processes: any[]; // Using any for simplicity
}

export function WorkOrderProcesses({ processes }: WorkOrderProcessesProps) {
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-700">
            Pending
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            In Progress
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Completed
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (processes.length === 0) {
    return (
      <p className="text-muted-foreground">
        No processes defined for this work order yet.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Process</TableHead>
            <TableHead>Machine</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((process) => (
            <TableRow key={process.id}>
              <TableCell>
                <div className="font-medium">{process.processType}</div>
              </TableCell>
              <TableCell>{process.machine || "-"}</TableCell>
              <TableCell>
                {process.startTime
                  ? new Date(process.startTime).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>
                {process.endTime
                  ? new Date(process.endTime).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>{getStatusBadge(process.status)}</TableCell>
              <TableCell>{process.notes || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

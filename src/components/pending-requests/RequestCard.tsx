
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Request } from "@/types/request";

interface RequestCardProps {
  request: Request;
  onAction: (request: Request, action: "approve" | "reject") => void;
  formatDate: (date: string) => string;
}

export const RequestCard = ({ request, onAction, formatDate }: RequestCardProps) => {
  return (
    <Card key={request.id} className="overflow-hidden">
      <CardHeader className="bg-slate-50 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            {request.employeeName}
          </CardTitle>
          <Badge variant="outline" className="badge-pending">
            Pending
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{request.employeeEmail}</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Software</h4>
            <p>{request.software}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Access Level</h4>
            <p>{request.accessLevel}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Request Date</h4>
            <p>{formatDate(request.requestDate)}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground">Business Justification</h4>
          <p className="mt-1 rounded bg-muted/50 p-2">{request.reason}</p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={() => onAction(request, "reject")}
          >
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button 
            variant="outline" 
            className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
            onClick={() => onAction(request, "approve")}
          >
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

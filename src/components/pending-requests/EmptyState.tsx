
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck } from "lucide-react";

export const EmptyState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-4">
          <FileCheck className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-xl font-semibold">No Pending Requests</h3>
        <p className="mt-2 text-center text-muted-foreground">
          You don't have any pending access requests to review at the moment.
        </p>
      </CardContent>
    </Card>
  );
};

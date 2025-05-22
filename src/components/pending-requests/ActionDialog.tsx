
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { Request } from "@/types/request";

interface ActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: Request | null;
  action: "approve" | "reject" | null;
  comment: string;
  onCommentChange: (comment: string) => void;
  onConfirm: () => void;
  processing: boolean;
}

export const ActionDialog = ({
  open,
  onOpenChange,
  selectedRequest,
  action,
  comment,
  onCommentChange,
  onConfirm,
  processing,
}: ActionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "approve" ? "Approve" : "Reject"} Access Request
          </DialogTitle>
          <DialogDescription>
            You are about to {action === "approve" ? "approve" : "reject"} the access request from {selectedRequest?.employeeName}.
            {action === "reject" && " Please provide a reason for the rejection."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <h4 className="text-sm font-medium">Request Details:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li><span className="font-medium">Software:</span> {selectedRequest?.software}</li>
              <li><span className="font-medium">Access Level:</span> {selectedRequest?.accessLevel}</li>
            </ul>
          </div>
          
          <div>
            <label htmlFor="comment" className="text-sm font-medium">
              {action === "approve" ? "Comments (Optional)" : "Reason for Rejection"}
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder={action === "approve" ? "Add any comments..." : "Please explain why you're rejecting this request..."}
              className="mt-1"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={action === "reject" && !comment.trim() || processing}
            variant={action === "approve" ? "default" : "destructive"}
          >
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                {action === "approve" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

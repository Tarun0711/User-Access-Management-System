
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Request } from "@/types/request";

// Mock data
const mockRequests = [
  {
    id: "1",
    employeeName: "Alex Johnson",
    employeeEmail: "alex@example.com",
    software: "Microsoft Office",
    accessLevel: "Write",
    reason: "I need to create and edit documents for my projects",
    status: "pending" as const,
    requestDate: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    employeeName: "Jamie Smith",
    employeeEmail: "jamie@example.com",
    software: "Salesforce",
    accessLevel: "Standard",
    reason: "Required for customer management and sales tracking",
    status: "pending" as const,
    requestDate: "2023-05-14T14:45:00Z",
  },
  {
    id: "3",
    employeeName: "Morgan Lee",
    employeeEmail: "morgan@example.com",
    software: "Adobe Creative Cloud",
    accessLevel: "Edit",
    reason: "Need to edit marketing materials and create graphics",
    status: "pending" as const,
    requestDate: "2023-05-13T09:15:00Z",
  },
];

export const usePendingRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch requests
    const fetchRequests = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRequests(mockRequests);
      } catch (error) {
        toast({
          title: "Failed to load requests",
          description: "An error occurred while loading pending requests.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [toast]);

  const handleAction = (request: Request, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setAction(action);
    setComment("");
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest || !action) return;
    
    setProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update request status - map "approve" to "approved" and "reject" to "rejected"
      setRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { 
                ...req, 
                status: action === "approve" ? "approved" : "rejected", 
                managerComment: comment 
              } 
            : req
        )
      );
      
      // Show toast notification
      toast({
        title: `Request ${action === "approve" ? "approved" : "rejected"}`,
        description: `You have ${action === "approve" ? "approved" : "rejected"} the access request from ${selectedRequest.employeeName}.`,
        variant: action === "approve" ? "default" : "destructive",
      });
      
      // Close dialog
      setDialogOpen(false);
      
    } catch (error) {
      toast({
        title: "Action failed",
        description: `Failed to ${action} the request. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Filter only pending requests
  const pendingRequests = requests.filter(req => req.status === "pending");

  return {
    isLoading,
    pendingRequests,
    selectedRequest,
    dialogOpen,
    setDialogOpen,
    action,
    comment,
    setComment,
    processing,
    handleAction,
    confirmAction,
  };
};

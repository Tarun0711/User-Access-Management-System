
import React from "react";
import { Layout } from "@/components/Layout";
import { RequestCard } from "@/components/pending-requests/RequestCard";
import { EmptyState } from "@/components/pending-requests/EmptyState";
import { LoadingState } from "@/components/pending-requests/LoadingState";
import { ActionDialog } from "@/components/pending-requests/ActionDialog";
import { usePendingRequests } from "@/hooks/usePendingRequests";
import { useFormatDate } from "@/hooks/useFormatDate";

const PendingRequests = () => {
  const {
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
  } = usePendingRequests();
  
  const formatDate = useFormatDate();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="page-title">Pending Access Requests</h2>
          <p className="text-muted-foreground">
            Review and approve or reject access requests from your team members.
          </p>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : pendingRequests.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <RequestCard 
                key={request.id}
                request={request}
                onAction={handleAction}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
      
      <ActionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedRequest={selectedRequest}
        action={action}
        comment={comment}
        onCommentChange={setComment}
        onConfirm={confirmAction}
        processing={processing}
      />
    </Layout>
  );
};

export default PendingRequests;

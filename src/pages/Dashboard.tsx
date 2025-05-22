
import React from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus, FileCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h2 className="page-title">Welcome, {user.name}</h2>
          <p className="text-muted-foreground">
            This is your dashboard for the User Access Management System.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {user.role === "employee" && (
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FilePlus className="mr-2 h-5 w-5 text-primary" />
                  Request Access
                </CardTitle>
                <CardDescription>
                  Request access to software applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  Need access to a software application? Submit a request and your manager will review it.
                </p>
                <Button onClick={() => navigate("/request-access")}>
                  New Request
                </Button>
              </CardContent>
            </Card>
          )}

          {user.role === "manager" && (
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FileCheck className="mr-2 h-5 w-5 text-primary" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>
                  Review access requests from your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  Team members are waiting for your approval on their access requests.
                </p>
                <Button onClick={() => navigate("/pending-requests")}>
                  Review Requests
                </Button>
              </CardContent>
            </Card>
          )}

          {user.role === "admin" && (
            <>
              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-primary" />
                    Manage Software
                  </CardTitle>
                  <CardDescription>
                    Add or update software applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">
                    Add new software to the catalog or update existing ones.
                  </p>
                  <Button onClick={() => navigate("/create-software")}>
                    Add Software
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-primary" />
                    Manage Users
                  </CardTitle>
                  <CardDescription>
                    View and manage user accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">
                    Manage user accounts and permissions.
                  </p>
                  <Button onClick={() => navigate("/manage-users")}>
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </section>

        <section>
          <h3 className="section-title">Quick Guide</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {user.role === "employee" && (
                  <>
                    <h4 className="font-medium">How to request access:</h4>
                    <ol className="ml-6 list-decimal space-y-2">
                      <li>Navigate to the Request Access page</li>
                      <li>Select the software you need access to</li>
                      <li>Choose the appropriate access level</li>
                      <li>Provide a reason for your request</li>
                      <li>Submit your request for manager approval</li>
                    </ol>
                  </>
                )}

                {user.role === "manager" && (
                  <>
                    <h4 className="font-medium">How to review requests:</h4>
                    <ol className="ml-6 list-decimal space-y-2">
                      <li>Navigate to the Pending Requests page</li>
                      <li>Review the details of each request</li>
                      <li>Approve or reject the request</li>
                      <li>Add comments if needed</li>
                    </ol>
                  </>
                )}

                {user.role === "admin" && (
                  <>
                    <h4 className="font-medium">Admin responsibilities:</h4>
                    <ol className="ml-6 list-decimal space-y-2">
                      <li>Add new software to the catalog</li>
                      <li>Define access levels for each software</li>
                      <li>Manage user accounts and permissions</li>
                      <li>Review system logs and reports</li>
                    </ol>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import RequestAccess from "./pages/RequestAccess";
import PendingRequests from "./pages/PendingRequests";
import CreateSoftware from "./pages/CreateSoftware";
import ManageUsers from "./pages/ManageUsers";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

// Home route redirect based on authentication
const HomeRoute = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/request-access" element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <RequestAccess />
              </ProtectedRoute>
            } />
            <Route path="/pending-requests" element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <PendingRequests />
              </ProtectedRoute>
            } />
            <Route path="/create-software" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateSoftware />
              </ProtectedRoute>
            } />
            <Route path="/manage-users" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            } />
            
            {/* Redirect from root to login or dashboard depending on auth state */}
            <Route path="/" element={<HomeRoute />} />
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

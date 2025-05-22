
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold">Redirecting...</h2>
      </div>
    </div>
  );
};

export default Index;


import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Define types
export type UserRole = "employee" | "manager" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Mock API for demo (would be replaced with actual API calls)
const mockUsers = [
  {
    id: "1",
    name: "John Employee",
    email: "employee@example.com",
    password: "password123",
    role: "employee" as UserRole,
  },
  {
    id: "2",
    name: "Mary Manager",
    email: "manager@example.com",
    password: "password123",
    role: "manager" as UserRole,
  },
  {
    id: "3",
    name: "Adam Admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin" as UserRole,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function - mocked for demo
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Create user object without password
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
          variant: "default",
        });
        
        // Redirect based on role
        if (foundUser.role === "employee") {
          navigate("/dashboard");
        } else if (foundUser.role === "manager") {
          navigate("/pending-requests");
        } else if (foundUser.role === "admin") {
          navigate("/create-software");
        }
        
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function - mocked for demo
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.find(u => u.email === email)) {
        toast({
          title: "Signup failed",
          description: "User with this email already exists",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user (in a real app, this would be done server-side)
      const newUser = {
        id: String(mockUsers.length + 1),
        name,
        email,
        password,
        role: "employee" as UserRole,
      };
      
      mockUsers.push(newUser);
      
      // Login the user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Signup successful",
        description: "Welcome to Access Manager!",
        variant: "default",
      });
      
      navigate("/dashboard");
      return true;
      
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "An error occurred during signup",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

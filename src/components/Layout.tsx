
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, 
  User, 
  Users, 
  Settings, 
  FileCheck, 
  FilePlus, 
  Menu,
  X,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const menuItems = [
    { 
      role: ["employee", "manager", "admin"],
      label: "Dashboard",
      icon: <Home className="mr-3 h-5 w-5" />,
      href: "/dashboard"
    },
    {
      role: ["employee"],
      label: "Request Access",
      icon: <FilePlus className="mr-3 h-5 w-5" />,
      href: "/request-access"
    },
    {
      role: ["manager"],
      label: "Pending Requests",
      icon: <FileCheck className="mr-3 h-5 w-5" />,
      href: "/pending-requests"
    },
    {
      role: ["admin"],
      label: "Create Software",
      icon: <Settings className="mr-3 h-5 w-5" />,
      href: "/create-software"
    },
    {
      role: ["admin"],
      label: "Manage Users",
      icon: <Users className="mr-3 h-5 w-5" />,
      href: "/manage-users"
    }
  ];

  const filteredMenuItems = menuItems.filter(
    item => item.role.includes(user.role)
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for larger screens */}
      <div className={`
        fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-sidebar
        transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Close button (mobile only) */}
        <button 
          onClick={closeSidebar}
          className="absolute right-4 top-4 rounded-full p-1 text-white md:hidden"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* User info */}
        <div className="flex flex-col items-center px-4 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sidebar">
            <User className="h-6 w-6" />
          </div>
          <div className="mt-3 text-center">
            <p className="font-medium text-white">{user.name}</p>
            <p className="text-sm text-sidebar-foreground opacity-75">{user.email}</p>
            <span className="mt-1 inline-block rounded bg-sidebar-accent px-2 py-1 text-xs font-medium capitalize">
              {user.role}
            </span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 flex-1 px-2">
          <ul className="space-y-1">
            {filteredMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className="flex w-full items-center rounded-md px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                  onClick={closeSidebar}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout button */}
        <div className="p-4">
          <Button 
            variant="outline" 
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <h1 className="text-xl font-bold">Access Management System</h1>
          
          <div className="flex items-center space-x-2">
            <span className="hidden text-sm text-muted-foreground md:inline-block">
              {user.name}
            </span>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" 
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
};

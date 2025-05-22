import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Search, User, Users, MoreHorizontal, UserPlus, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define strongly typed mock data
const mockUsers = [
  {
    id: "1",
    name: "John Employee",
    email: "employee@example.com",
    role: "employee" as const,
    department: "Marketing",
  },
  {
    id: "2",
    name: "Mary Manager",
    email: "manager@example.com",
    role: "manager" as const,
    department: "Sales",
  },
  {
    id: "3",
    name: "Adam Admin",
    email: "admin@example.com",
    role: "admin" as const,
    department: "IT",
  },
  {
    id: "4",
    name: "Sarah Jones",
    email: "sarah@example.com",
    role: "employee" as const,
    department: "Finance",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "manager" as const,
    department: "Operations",
  },
  {
    id: "6",
    name: "Jennifer Smith",
    email: "jennifer@example.com",
    role: "employee" as const,
    department: "Customer Support",
  },
];

interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "manager" | "admin";
  department: string;
}

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["employee", "manager", "admin"], {
    required_error: "Please select a role",
  }),
  department: z.string().min(2, "Department must be at least 2 characters"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const ManageUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "employee",
      department: "",
    },
  });

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Since mockUsers is already correctly typed, we can assign directly
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        toast({
          title: "Failed to load users",
          description: "An error occurred while loading users.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = users.filter(
        user =>
          user.name.toLowerCase().includes(lowercasedSearch) ||
          user.email.toLowerCase().includes(lowercasedSearch) ||
          user.department.toLowerCase().includes(lowercasedSearch) ||
          user.role.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  const handleAddUser = async (data: UserFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: String(users.length + 1),
        ...data,
      };
      
      setUsers(prev => [...prev, newUser]);
      
      toast({
        title: "User added successfully",
        description: `${data.name} has been added as a ${data.role}.`,
      });
      
      setIsAddUserOpen(false);
      form.reset();
      
    } catch (error) {
      toast({
        title: "Failed to add user",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (data: UserFormValues) => {
    if (!editingUser) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev =>
        prev.map(user =>
          user.id === editingUser.id ? { ...user, ...data } : user
        )
      );
      
      toast({
        title: "User updated successfully",
        description: `${data.name}'s information has been updated.`,
      });
      
      setEditingUser(null);
      form.reset();
      
    } catch (error) {
      toast({
        title: "Failed to update user",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });
  };

  const handleSubmit = (data: UserFormValues) => {
    if (editingUser) {
      handleEditUser(data);
    } else {
      handleAddUser(data);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-accent text-accent-foreground";
      case "manager":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="page-title">Manage Users</h2>
            <p className="text-muted-foreground">
              Add, edit, and manage user accounts and permissions.
            </p>
          </div>
          <Button onClick={() => {
            setEditingUser(null);
            form.reset({
              name: "",
              email: "",
              role: "employee",
              department: "",
            });
            setIsAddUserOpen(true);
          }}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, department or role..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users list */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="text-lg font-medium">Loading users...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">No Users Found</h3>
              <p className="mt-2 text-center text-muted-foreground">
                {searchTerm
                  ? "No users match your search criteria."
                  : "There are no users in the system yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Users ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4 border-b font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 border-b font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 border-b font-medium text-muted-foreground">Department</th>
                      <th className="text-left py-3 px-4 border-b font-medium text-muted-foreground">Role</th>
                      <th className="text-right py-3 px-4 border-b font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/50">
                        <td className="py-3 px-4 border-b">
                          <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <User className="h-4 w-4" />
                            </div>
                            <span className="ml-3">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b">{user.email}</td>
                        <td className="py-3 px-4 border-b">{user.department}</td>
                        <td className="py-3 px-4 border-b">
                          <Badge className={getRoleBadgeClass(user.role)} variant="outline">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 border-b text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={isAddUserOpen || !!editingUser} onOpenChange={(open) => {
        if (!open) {
          setIsAddUserOpen(false);
          setEditingUser(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Edit user details and permissions."
                : "Fill in the details to create a new user account."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="IT, Marketing, Sales, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddUserOpen(false);
                    setEditingUser(null);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span>{editingUser ? "Update User" : "Add User"}</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ManageUsers;

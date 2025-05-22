
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Plus, X } from "lucide-react";

const softwareSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  vendor: z.string().min(2, "Vendor must be at least 2 characters"),
});

type SoftwareFormValues = z.infer<typeof softwareSchema>;

const CreateSoftware = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessLevels, setAccessLevels] = useState<string[]>([]);
  const [newAccessLevel, setNewAccessLevel] = useState("");

  const form = useForm<SoftwareFormValues>({
    resolver: zodResolver(softwareSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      vendor: "",
    },
  });

  const onSubmit = async (data: SoftwareFormValues) => {
    if (accessLevels.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one access level",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Combine form data with access levels
      const softwareData = {
        ...data,
        accessLevels,
      };
      
      console.log("Software created:", softwareData);
      
      toast({
        title: "Software added successfully",
        description: `${data.name} has been added to the software catalog.`,
      });
      
      // Reset form and access levels
      form.reset();
      setAccessLevels([]);
      
    } catch (error) {
      toast({
        title: "Failed to add software",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAccessLevel = () => {
    if (newAccessLevel.trim() === "") return;
    
    if (accessLevels.includes(newAccessLevel.trim())) {
      toast({
        title: "Duplicate access level",
        description: "This access level already exists",
        variant: "destructive",
      });
      return;
    }
    
    setAccessLevels([...accessLevels, newAccessLevel.trim()]);
    setNewAccessLevel("");
  };

  const handleRemoveAccessLevel = (level: string) => {
    setAccessLevels(accessLevels.filter(l => l !== level));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="page-title">Add New Software</h2>
          <p className="text-muted-foreground">
            Add a new software application to the catalog. Users will be able to request access to this software.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Software Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Software Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Microsoft Office" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Microsoft" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Productivity, Design, Communication" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the software and its purpose..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Access Levels</FormLabel>
                  <div className="mt-2 flex items-center space-x-2">
                    <Input
                      placeholder="e.g., Read, Write, Admin"
                      value={newAccessLevel}
                      onChange={(e) => setNewAccessLevel(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddAccessLevel();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddAccessLevel}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  
                  {accessLevels.length === 0 && (
                    <p className="mt-2 text-sm text-red-500">
                      Please add at least one access level
                    </p>
                  )}
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {accessLevels.map((level, index) => (
                      <div
                        key={index}
                        className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm"
                      >
                        <span>{level}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAccessLevel(level)}
                          className="ml-2 rounded-full p-1 hover:bg-secondary-foreground/10"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting || accessLevels.length === 0}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Software...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Software
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateSoftware;

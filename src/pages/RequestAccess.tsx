
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Mock data for software list
const softwareList = [
  { id: "1", name: "Microsoft Office", accessLevels: ["Read", "Write", "Admin"] },
  { id: "2", name: "Salesforce", accessLevels: ["Basic", "Standard", "Admin"] },
  { id: "3", name: "Adobe Creative Cloud", accessLevels: ["View", "Edit", "Admin"] },
  { id: "4", name: "Slack", accessLevels: ["Member", "Admin"] },
  { id: "5", name: "Jira", accessLevels: ["Read", "Write", "Admin"] },
];

const requestSchema = z.object({
  software: z.string().nonempty("Please select a software"),
  accessLevel: z.string().nonempty("Please select an access level"),
  reason: z.string()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must not exceed 500 characters"),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const RequestAccess = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSoftwareId, setSelectedSoftwareId] = useState<string | null>(null);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      software: "",
      accessLevel: "",
      reason: "",
    },
  });

  const onSubmit = async (data: RequestFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Request submitted successfully",
        description: `Your request for ${data.software} with ${data.accessLevel} access has been sent to your manager for review.`,
      });
      
      // Reset form
      form.reset();
      setSelectedSoftwareId(null);
      
    } catch (error) {
      toast({
        title: "Failed to submit request",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get access levels for the selected software
  const getAccessLevels = () => {
    if (!selectedSoftwareId) return [];
    const software = softwareList.find(s => s.id === selectedSoftwareId);
    return software ? software.accessLevels : [];
  };

  // Update selected software when software field changes
  const handleSoftwareChange = (value: string) => {
    setSelectedSoftwareId(value);
    form.setValue("accessLevel", ""); // Reset access level when software changes
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="page-title">Request Software Access</h2>
          <p className="text-muted-foreground">
            Submit a request for access to a software application. Your request will be reviewed by your manager.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FilePlus className="mr-2 h-5 w-5 text-primary" />
              New Access Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="software"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Software</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleSoftwareChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select software" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {softwareList.map((software) => (
                            <SelectItem key={software.id} value={software.id}>
                              {software.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedSoftwareId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              selectedSoftwareId
                                ? "Select access level"
                                : "Select software first"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAccessLevels().map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Justification</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please explain why you need access to this software..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="mt-1 text-right text-sm text-muted-foreground">
                        {form.watch("reason")?.length || 0}/500
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FilePlus className="mr-2 h-4 w-4" />
                        Submit Request
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

export default RequestAccess;

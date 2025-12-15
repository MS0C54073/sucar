
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }).optional(),
  phone: z.string().optional(),
  nrc: z.string().optional(),
  licenseNo: z.string().optional(),
});

export function ProfileForm() {
  const { user, role } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
    values: user ? {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        // Add other fields based on role later
    } : undefined
  });


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Profile Updated",
      description: "Your information has been saved successfully.",
    });
  }

  if (!user) {
    return (
        <Card className="max-w-2xl mt-4">
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Update your personal information here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {role === 'client' && (
               <FormField
                control={form.control}
                name="nrc"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>NRC Number</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. 123456/10/1" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
             {role === 'driver' && (
               <FormField
                control={form.control}
                name="licenseNo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Driver's License No.</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" readOnly disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

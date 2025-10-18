"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

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
import { useAuth } from "@/context/auth-provider";
import { Separator } from "@/components/ui/separator";
import type { UserRole } from "@/lib/types";
import { Car, Shield, Wrench, UserCog, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState<UserRole | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Assuming a default role of 'client' for email/password login
      // You might want a role selection dropdown for this form too.
      await login("client", values.email, values.password);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleRoleLogin = async (role: UserRole) => {
    setRoleLoading(role);
    try {
      await login(role);
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Login Failed",
        description: `Could not log in as ${role}. Ensure a test account exists.`,
      });
    } finally {
      setRoleLoading(null);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {(["admin", "client", "driver", "provider"] as UserRole[]).map(
          (role) => (
            <Button
              key={role}
              variant="outline"
              onClick={() => handleRoleLogin(role)}
              disabled={!!roleLoading}
            >
              {roleLoading === role ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <>
                  {role === "admin" && <UserCog className="mr-2" />}
                  {role === "client" && <Car className="mr-2" />}
                  {role === "driver" && <Shield className="mr-2" />}
                  {role === "provider" && <Wrench className="mr-2" />}
                </>
              )}
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          )
        )}
      </div>

      <div className="relative mb-6">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">
          OR
        </span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login as Client
          </Button>
        </form>
      </Form>
    </div>
  );
}

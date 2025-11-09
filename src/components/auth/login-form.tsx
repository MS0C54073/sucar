
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
import { MOCK_USERS } from "@/lib/mock-data";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const roleIcons: Record<UserRole, React.ReactNode> = {
  admin: <UserCog className="mr-2" />,
  client: <Car className="mr-2" />,
  driver: <Shield className="mr-2" />,
  provider: <Wrench className="mr-2" />,
};

export function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState<UserRole | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "client@sucar.com",
      password: "password",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Hardcoded to client for the form submission
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
      <div className="space-y-3 mb-6">
        {(["admin", "client", "driver", "provider"] as UserRole[]).map(
          (role) => {
            const mockUser = MOCK_USERS.find(u => u.role === role);
            return (
              <Button
                key={role}
                variant="outline"
                className="w-full justify-start h-12"
                onClick={() => handleRoleLogin(role)}
                disabled={!!roleLoading}
              >
                {roleLoading === role ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  roleIcons[role]
                )}
                <div className="text-left">
                  <p className="font-bold">
                    Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                  </p>
                  <p className="text-xs text-muted-foreground -mt-0.5">{mockUser?.email}</p>
                </div>
              </Button>
            )
          }
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
          <fieldset disabled>
            <p className="text-sm text-center text-muted-foreground mb-4">The form below is for demonstration purposes.</p>
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
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login as Client
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}


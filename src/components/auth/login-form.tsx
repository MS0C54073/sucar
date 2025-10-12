"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Car, Shield, Wrench, UserCog } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you'd call a Firebase auth method here.
    // For now, we'll default to client login on form submit.
    console.log(values);
    login("client");
  }

  const handleRoleLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button variant="outline" onClick={() => handleRoleLogin("admin")}><UserCog className="mr-2"/> Admin</Button>
        <Button variant="outline" onClick={() => handleRoleLogin("client")}><Car className="mr-2"/> Client</Button>
        <Button variant="outline" onClick={() => handleRoleLogin("driver")}><Shield className="mr-2"/> Driver</Button>
        <Button variant="outline" onClick={() => handleRoleLogin("provider")}><Wrench className="mr-2"/> Provider</Button>
      </div>

      <div className="relative mb-6">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">OR</span>
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
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}

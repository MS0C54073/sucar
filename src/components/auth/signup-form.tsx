
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { UserRole } from "@/lib/types";

const formSchema = z.object({
  nickname: z.string().min(3, { message: "Nickname must be at least 3 characters." }).refine(s => !s.includes('@'), "Nickname cannot contain an '@' symbol."),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["client", "driver", "provider"], {
    required_error: "You must select a role.",
  }),
});

export function SignUpForm() {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      password: "",
      role: "client",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Synthesize the email from the nickname for Firebase Auth
      const email = `${values.nickname.toLowerCase()}@sucar.app`;
      await signup(values.nickname, email, values.password, values.role);
      
      if (values.role === "client") {
        toast({
            title: "Account Created!",
            description: "You have been successfully signed up. Redirecting...",
        });
      } else {
        toast({
            title: "Registration Submitted",
            description: "Your account is pending approval from an administrator.",
        });
      }
      // The auth provider will redirect to the dashboard automatically
    } catch (error: any) {
      let description = "An unexpected error occurred.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This nickname is already taken. Please choose another one.";
      }
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I am a...</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="provider">Service Provider</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder="e.g. zuluwarrior" {...field} />
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
          Create Account
        </Button>
      </form>
    </Form>
  );
}


"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState }from "react";

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

const lusakaLocations = [
    "Acacia Park",
    "Arcades Shopping Mall",
    "Avondale",
    "Bauleni",
    "Brentwood",
    "Buckley",
    "Caledonia",
    "Castle",
    "Cathedral Hill",
    "Chaisa",
    "Chakunkula",
    "Chainama",
    "Chamba Valley",
    "Chandamali",
    "Chelston",
    "Chibolya",
    "Chilenje",
    "Chipata",
    "Chiwala",
    "Chudleigh",
    "Civic Centre",
    "East Park Mall",
    "Emmasdale",
    "Fairview",
    "Garden",
    "George",
    "Handsworth",
    "Helen Kaunda",
    "Ibex Hill",
    "Industrial Area",
    "Kabulonga",
    "Kabwata",
    "Kalingalinga",
    "Kalundu",
    "Kamanga",
    "Kamwala",
    "Kanyama",
    "Kaunda Square",
    "Leopards Hill",
    "Lilayi",
    "Longacres",
    "Luburma",
    "Lunda",
    "Makeni",
    "Mandevu",
    "Matero",
    "Mbabala",
    "Meanwood",
    "Misisi",
    "Mtendere",
    "Mumbwa",
    "Munali",
    "Mutendere",
    "New Avondale",
    "New Kasama",
    "Ng'ombe",
    "Northmead",
    "Nyumba Yanga",
    "Olympia",
    "PHI",
    "President's Lane",
    "Prospect Hill",
    "Rhodes Park",
    "Roma",
    "Salama Park",
    "Sikanze",
    "Silverest",
    "State Lodge",
    "Teagle",
    "Thornpark",
    "Twin Palm",
    "Villa Elizabetha",
    "Woodlands",
    "ZAF",
    "Zanimuone"
];


const baseSchema = z.object({
  nickname: z.string().min(3, { message: "Nickname must be at least 3 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["client", "driver", "provider"], {
    required_error: "You must select a role.",
  }),
});

const providerSchema = baseSchema.extend({
    businessName: z.string().min(3, { message: "Business name is required." }),
    location: z.string().min(1, { message: "Location is required." }),
});

export function SignUpForm() {
  const { signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  
  const formSchema = selectedRole === 'provider' ? providerSchema : baseSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      password: "",
      role: "client",
    },
  });

  const roleValue = form.watch('role');

  useState(() => {
    setSelectedRole(roleValue);
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await signup(values);
      toast({
        title: "Account Created!",
        description: "You have been successfully signed up.",
      });
    } catch (error: any) {
        let description = "An unexpected error occurred.";
        if (error.code === 'auth/email-already-in-use') {
            description = "This nickname is already taken. Please choose another one."
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
              <Select onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedRole(value as UserRole);
              }} defaultValue={field.value}>
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

        {selectedRole === 'provider' && (
            <>
                <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Sparkle Car Wash" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your business location" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {lusakaLocations.map(loc => (
                                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </>
        )}

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


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
_QUOTED_CONTENT_
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

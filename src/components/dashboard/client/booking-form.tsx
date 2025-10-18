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
  FormDescription,
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
import { toast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Car, Send } from "lucide-react";
import { useCollection, useFirebase, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Service } from "@/lib/types";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  bookingType: z.enum(["self-drive", "request-driver"], {
    required_error: "You need to select a booking type.",
  }),
  car: z.string().min(1, { message: "Please select a car." }),
  service: z.string().min(1, { message: "Please select a service." }),
  pickupLocation: z
    .string()
    .min(5, { message: "Please enter a valid pickup address." }),
});

export function BookingForm() {
  const { firestore } = useFirebase();
  const servicesCollection = useMemoFirebase(() => collection(firestore, "services"), [firestore]);
  const { data: services } = useCollection<Service>(servicesCollection);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingType: "request-driver",
      car: "ABC-123", // This should be dynamic based on user's cars
      service: "",
      pickupLocation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // This is where you would create a new booking document in Firestore.
    // For now, we just show a toast.
    toast({
      title: "Booking Requested!",
      description: "We're finding a driver for you.",
    });
    form.reset();
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Schedule a Pickup</CardTitle>
            <CardDescription>
              Fill in the details below to get your car sparkling clean.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="bookingType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>How do you want to get your car washed?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="self-drive"
                            id="self-drive"
                            className="sr-only"
                          />
                        </FormControl>
                        <Label
                          htmlFor="self-drive"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <Car className="mb-3 h-6 w-6" />
                          Self-Drive
                        </Label>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="request-driver"
                            id="request-driver"
                            className="sr-only"
                          />
                        </FormControl>
                        <Label
                          htmlFor="request-driver"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <Send className="mb-3 h-6 w-6" />
                          Request Driver
                        </Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="car"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Car</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a car to wash" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* This should be populated from the user's cars in Firestore */}
                      <SelectItem value="ABC-123">
                        2021 Toyota Camry (ABC-123)
                      </SelectItem>
                      <SelectItem value="TRK-456">
                        2020 Ford F-150 (TRK-456)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a wash service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services?.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.price.toFixed(2)}
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
              name="pickupLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 123 Main St, Anytown"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your current location.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Request Pickup
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}


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
import { MOCK_VEHICLES } from "@/lib/mock-data";
import { Label } from "@/components/ui/label";
import { useBooking } from "@/context/booking-provider";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  bookingType: z.enum(["self-drive", "request-driver"], {
    required_error: "You need to select a booking type.",
  }),
  vehicleId: z.string().min(1, { message: "Please select a car." }),
  providerId: z.string().min(1, { message: "Please select a car wash." }),
  pickupLocation: z
    .string()
    .min(5, { message: "Please enter a valid pickup address." }),
});

export function BookingForm() {
  const { providers, addBooking } = useBooking();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingType: "request-driver",
      vehicleId: "", 
      providerId: "",
      pickupLocation: "Lusaka, Zambia",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newBookingId = `booking-${Date.now()}`;
    const vehicle = MOCK_VEHICLES.find(v => v.vehicleId === values.vehicleId);
    
    if (!vehicle) {
        toast({ variant: "destructive", title: "Error", description: "Selected vehicle not found."});
        return;
    }

    const newBooking = {
        bookingId: newBookingId,
        clientId: 'client-01', // Mocked client
        driverId: 'driver-01-data', // Mocked driver for now
        pickupLocation: values.pickupLocation,
        status: 'requested' as const,
        createdAt: new Date(),
        vehicle,
        providerId: values.providerId,
        cost: 150.00, // Mock cost
        paymentStatus: 'pending' as const,
    }

    addBooking(newBooking);
    
    toast({
      title: "Booking Requested!",
      description: "We're finding a driver for you. Please proceed to payment.",
    });
    form.reset();
    router.push(`/dashboard/payment?bookingId=${newBookingId}`);
  }

  const approvedProviders = providers.filter(p => p.approved);

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
                            className="peer sr-only"
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
                            className="peer sr-only"
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
              name="vehicleId"
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
                      {MOCK_VEHICLES.map(car => (
                        <SelectItem key={car.vehicleId} value={car.vehicleId}>
                            {car.make} {car.model} ({car.plate_no})
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
              name="providerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Wash Provider</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a car wash" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {approvedProviders.map((provider) => (
                        <SelectItem key={provider.providerId} value={provider.providerId}>
                          {provider.name} - ({provider.location})
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
              Request Pickup & Pay
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

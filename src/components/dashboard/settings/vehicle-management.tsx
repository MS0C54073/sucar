
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { MOCK_VEHICLES } from "@/lib/mock-data"; 
import { PlusCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { toast } from "@/hooks/use-toast";
import type { Car } from "@/lib/types";
import { VEHICLE_MAKES, VEHICLE_COLORS } from "@/lib/vehicle-data";

const vehicleSchema = z.object({
  make: z.string().min(2, "Make is required."),
  model: z.string().min(1, "Model is required."),
  plate_no: z.string().min(3, "Plate number is required."),
  color: z.string().min(3, "Color is required."),
});

export function VehicleManagement() {
  const { user } = useAuth();
  // In a real app, this would come from a context or a fetch call.
  const [vehicles, setVehicles] = useState<Car[]>(MOCK_VEHICLES.filter(v => v.clientId === user?.userId));

  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      plate_no: "",
      color: "",
    },
  });

  function onSubmit(values: z.infer<typeof vehicleSchema>) {
    if (!user) return;
    const newVehicle: Car = {
      vehicleId: `veh-${Date.now()}`,
      clientId: user.userId,
      ...values,
    };
    setVehicles((prev) => [...prev, newVehicle]);
    toast({
      title: "Vehicle Added",
      description: `${values.make} ${values.model} has been added to your profile.`,
    });
    form.reset();
  }

  function deleteVehicle(vehicleId: string) {
    setVehicles(prev => prev.filter(v => v.vehicleId !== vehicleId));
     toast({
      title: "Vehicle Removed",
      description: `The vehicle has been removed from your profile.`,
    });
  }

  return (
    <div className="grid gap-8 md:grid-cols-3 mt-4">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Vehicles</CardTitle>
            <CardDescription>
              A list of all vehicles associated with your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make & Model</TableHead>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.vehicleId}>
                    <TableCell className="font-medium">
                      {vehicle.make} {vehicle.model}
                    </TableCell>
                    <TableCell>{vehicle.plate_no}</TableCell>
                    <TableCell>{vehicle.color}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteVehicle(vehicle.vehicleId)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {vehicles.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            You have not added any vehicles yet.
                        </TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Add a New Vehicle</CardTitle>
                <CardDescription>
                  Add a new car to your profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a make" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {VEHICLE_MAKES.map((make) => (
                                    <SelectItem key={make} value={make}>{make}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mark X" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plate_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plate Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ABC 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {VEHICLE_COLORS.map((color) => (
                                    <SelectItem key={color} value={color}>{color}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

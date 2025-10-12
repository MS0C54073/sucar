"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  optimizeDriverRoutes,
  type OptimizeDriverRoutesOutput,
} from "@/ai/flows/optimize-driver-routes";
import { ListOrdered, Loader2, Map, Clock, Route, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  currentLocation: z
    .string()
    .min(3, { message: "Current location is required." }),
  destinations: z
    .array(z.object({ value: z.string().min(3, "Destination required.") }))
    .min(1, { message: "At least one destination is required." }),
  trafficConditions: z.string().optional(),
  roadClosures: z.string().optional(),
});

export function RouteOptimizerTool() {
  const [result, setResult] = useState<OptimizeDriverRoutesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLocation: "",
      destinations: [{ value: "" }],
      trafficConditions: "",
      roadClosures: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "destinations",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const input = {
      ...values,
      destinations: values.destinations.map((d) => d.value),
      roadClosures: values.roadClosures
        ? values.roadClosures.split("\n")
        : [],
    };

    try {
      const output = await optimizeDriverRoutes(input);
      setResult(output);
    } catch (error) {
      console.error("Error optimizing route:", error);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: "Could not calculate the route. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Plan Your Route</CardTitle>
          <CardDescription>
            Add locations to find the best path.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Point</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Main St, Anytown" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Destinations</FormLabel>
                <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`destinations.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder={`Stop ${index + 1}`} {...field} />
                        </FormControl>
                        {fields.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4"/></Button>}
                      </FormItem>
                    )}
                  />
                ))}
                </div>
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ value: "" })}
                  >
                    Add Destination
                  </Button>
              </div>

              <FormField
                control={form.control}
                name="trafficConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Traffic Conditions (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Heavy traffic on I-5 North" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roadClosures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Road Closures (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter one closure per line" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Optimize Route
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Optimized Route</CardTitle>
          <CardDescription>
            Your most efficient path based on AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4">Calculating best route...</p>
            </div>
          )}
          {!isLoading && !result && (
             <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
              <Map className="h-12 w-12" />
              <p className="mt-4 text-center">Your optimized route will appear here.</p>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Estimated Travel Time</h3>
                </div>
                <p className="text-lg font-bold">{result.estimatedTravelTime}</p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <ListOrdered className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Optimized Stop Order</h3>
                </div>
                <ol className="space-y-2 list-decimal list-inside bg-muted p-4 rounded-lg">
                    {result.optimizedRoute.map((stop, index) => (
                        <li key={index} className="font-medium">{stop}</li>
                    ))}
                </ol>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Route className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Instructions</h3>
                </div>
                <p className="text-sm whitespace-pre-wrap font-code bg-muted p-4 rounded-lg">{result.instructions}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

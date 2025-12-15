
"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/context/booking-provider";
import { format } from "date-fns";
import { Lightbulb, AlertTriangle, MessageSquare, Bell, Settings } from "lucide-react";
import type { Booking } from "@/lib/types";

const COLORS = {
  delivered: "hsl(var(--chart-2))",
  cancelled: "hsl(var(--destructive))",
};

interface AdminHistoryProps {
  allBookings: Booking[];
}

export function AdminHistory({ allBookings }: AdminHistoryProps) {
  const { drivers, users } = useBooking();

  const chartData = useMemo(() => {
    const statusCounts = allBookings.reduce(
      (acc, booking) => {
        if (booking.status === "delivered" || booking.status === "cancelled") {
          acc[booking.status] = (acc[booking.status] || 0) + 1;
        }
        return acc;
      },
      {} as Record<"delivered" | "cancelled", number>
    );

    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [allBookings]);

  const getClientName = (clientId: string) => users.find((u) => u.userId === clientId)?.name || "N/A";
  const getDriverName = (driverId: string) => drivers.find((d) => d.driverId === driverId)?.name || "N/A";

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold font-headline">Platform History & Analytics</h1>
            <p className="text-muted-foreground">
                A complete overview of all activities, analytics, and system status.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><Bell /><span className="sr-only">Notifications</span></Button>
            <Button variant="outline" size="icon"><MessageSquare /><span className="sr-only">Chat</span></Button>
            <Button variant="outline" size="icon"><Settings /><span className="sr-only">Settings</span></Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>All-Time Booking History</CardTitle>
                    <CardDescription>A log of every booking on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {allBookings.map((booking) => (
                        <TableRow key={booking.bookingId}>
                        <TableCell>{format(booking.createdAt, "PPP")}</TableCell>
                        <TableCell>{getClientName(booking.clientId)}</TableCell>
                        <TableCell>{getDriverName(booking.driverId)}</TableCell>
                        <TableCell>
                            {booking.vehicle.make} {booking.vehicle.model}
                        </TableCell>
                        <TableCell>
                            <Badge
                            variant={
                                booking.status === "cancelled"
                                ? "destructive"
                                : booking.status === "delivered"
                                ? "secondary"
                                : "outline"
                            }
                            >
                            {booking.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            K{booking.cost.toFixed(2)}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>

        {/* Sidebar Analytics Area */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Booking Analysis</CardTitle>
              <CardDescription>Completed vs. Cancelled bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader className="flex-row items-center gap-3 space-y-0">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                <CardTitle>AI Financial Advice</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-sm text-muted-foreground">
                    Based on current trends, projecting a 15% increase in revenue next month. Consider offering a 'first-wash' discount to boost new client acquisition by a potential 25%.
                </p>
             </CardContent>
          </Card>

          <Card>
             <CardHeader className="flex-row items-center gap-3 space-y-0">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <CardTitle>System Error Reports</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-3 text-sm font-mono">
                    <p className="text-red-500">[ERROR] Payment gateway timeout for booking #BK-05.</p>
                    <p className="text-yellow-500">[WARN] Mapbox API latency high (2.1s) for driver #DR-02.</p>
                    <p className="text-red-500">[ERROR] Firestore permission denied for client #CL-01 on history read.</p>
                </div>
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

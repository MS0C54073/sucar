
"use client";

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
import { Switch } from "@/components/ui/switch";
import { useBooking } from "@/context/booking-provider";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DriversPage() {
  const { drivers } = useBooking();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-headline">Manage Drivers</h1>
        <p className="text-muted-foreground">
          Approve, monitor, and manage all drivers on the platform.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
          <CardDescription>
            A list of all registered drivers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>License No.</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Approval Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.driverId}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{driver.licenseNo}</TableCell>
                  <TableCell>
                      <Badge variant={driver.availability ? "secondary" : "outline"}>
                          {driver.availability ? "Available" : "Unavailable"}
                      </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Switch id={`approve-${driver.driverId}`} checked={driver.approved} />
                        <label htmlFor={`approve-${driver.driverId}`}>{driver.approved ? "Approved" : "Pending"}</label>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>View Active Trip</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


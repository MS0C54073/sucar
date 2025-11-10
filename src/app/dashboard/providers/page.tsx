
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/context/booking-provider";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

export default function ProvidersPage() {
  const { providers, setProviders } = useBooking();

  const handleApprovalChange = (providerId: string, approved: boolean) => {
    setProviders(prevProviders => 
        prevProviders.map(provider => 
            provider.providerId === providerId ? { ...provider, approved } : provider
        )
    );
     toast({
        title: `Provider ${approved ? 'Approved' : 'Blocked'}`,
        description: `The provider's status has been updated.`,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-headline">Manage Providers</h1>
        <p className="text-muted-foreground">
          View and approve car wash service providers.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Service Providers</CardTitle>
          <CardDescription>
            A list of all registered car wash providers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Wash Bays</TableHead>
                <TableHead>Approval Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.providerId}>
                  <TableCell className="font-medium">{provider.name}</TableCell>
                  <TableCell>{provider.location}</TableCell>
                  <TableCell>{provider.baysCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`approve-provider-${provider.providerId}`}
                        checked={provider.approved}
                        onCheckedChange={(checked) => handleApprovalChange(provider.providerId, checked)}
                      />
                      <label htmlFor={`approve-provider-${provider.providerId}`}>
                        {provider.approved ? "Approved" : "Blocked"}
                      </label>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Manage Services</DropdownMenuItem>
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

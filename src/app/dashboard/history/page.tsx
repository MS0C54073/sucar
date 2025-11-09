
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
import { MOCK_BOOKINGS } from "@/lib/mock-data";
import { format } from "date-fns";
import { Star } from "lucide-react";

export default function HistoryPage() {
  const completedBookings = MOCK_BOOKINGS.filter(
    (b) => b.status === "delivered" || b.status === "cancelled"
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-headline">Booking History</h1>
        <p className="text-muted-foreground">
          Review your past car wash services.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Completed Bookings</CardTitle>
          <CardDescription>
            A list of all your completed and cancelled bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                 <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedBookings.map((booking) => (
                <TableRow key={booking.bookingId}>
                  <TableCell>{format(booking.createdAt, "PPP")}</TableCell>
                  <TableCell>
                    {booking.vehicle.make} {booking.vehicle.model}
                  </TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'cancelled' ? 'destructive' : 'secondary'}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    K{booking.cost.toFixed(2)}
                  </TableCell>
                   <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                        <Star className="mr-2 h-4 w-4" />
                        Rate Service
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {completedBookings.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No completed bookings yet.</TableCell>
                </TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

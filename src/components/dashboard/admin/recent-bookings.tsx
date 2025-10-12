import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockBookings, mockUsers } from "@/lib/placeholder-data";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

export function RecentBookings() {
    const recentBookings = mockBookings.slice(0, 5);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>You made 265 bookings this month.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {recentBookings.map((booking) => {
          const client = mockUsers.find((u) => u.userId === booking.clientId);
          return (
            <div key={booking.bookingId} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={client?.avatarUrl} alt="Avatar" />
                <AvatarFallback>{client ? getInitials(client.name) : 'NA'}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {booking.clientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {client?.email}
                </p>
              </div>
              <div className="ml-auto font-medium">+${booking.cost.toFixed(2)}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

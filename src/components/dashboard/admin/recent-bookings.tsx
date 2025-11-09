
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_BOOKINGS, MOCK_USERS } from "@/lib/mock-data";

const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

export function RecentBookings() {
  const recentBookings = MOCK_BOOKINGS.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>
          The latest {recentBookings.length} bookings across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {recentBookings.map((booking) => {
          const client = MOCK_USERS.find((u) => u.userId === booking.clientId);
          return (
            <div key={booking.bookingId} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={client?.avatarUrl} alt="Avatar" />
                <AvatarFallback>
                  {client ? getInitials(client.name) : "NA"}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{client?.name}</p>
                <p className="text-sm text-muted-foreground">{booking.vehicle.make} {booking.vehicle.model}</p>
              </div>
              <div className="ml-auto font-medium">+${booking.cost.toFixed(2)}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

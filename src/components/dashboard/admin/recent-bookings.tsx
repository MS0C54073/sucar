import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { Booking, User } from "@/lib/types";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

function RecentBookingItem({ booking }: { booking: Booking }) {
  const { firestore } = useFirebase();
  const userRef = useMemoFirebase(
    () => (booking.clientId ? doc(firestore, "users", booking.clientId) : null),
    [booking.clientId, firestore]
  );
  const { data: client, isLoading } = useDoc<User>(userRef);

  if (isLoading) {
    return (
       <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="grid gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-5 w-12 ml-auto" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="hidden h-9 w-9 sm:flex">
        <AvatarImage src={client?.avatarUrl} alt="Avatar" />
        <AvatarFallback>
          {client ? getInitials(client.name) : "NA"}
        </AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">{client?.name}</p>
        <p className="text-sm text-muted-foreground">{client?.email}</p>
      </div>
      <div className="ml-auto font-medium">+${booking.cost.toFixed(2)}</div>
    </div>
  );
}

export function RecentBookings() {
  const { firestore } = useFirebase();

  const bookingsQuery = useMemoFirebase(() => {
    return query(
      collection(firestore, "bookings"),
      orderBy("timestamps.createdAt", "desc"),
      limit(5)
    );
  }, [firestore]);

  const { data: recentBookings, isLoading } =
    useCollection<Booking>(bookingsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>
          The latest 5 bookings across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {isLoading && (
          <>
            {[...Array(5)].map((_, i) => (
               <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="grid gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-5 w-12 ml-auto" />
              </div>
            ))}
          </>
        )}
        {recentBookings?.map((booking) => (
          <RecentBookingItem key={booking.id} booking={booking} />
        ))}
      </CardContent>
    </Card>
  );
}

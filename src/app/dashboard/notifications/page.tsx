
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, CheckCircle } from "lucide-react";

const notifications = [
    {
        title: "Booking Confirmed!",
        description: "Your booking for the Toyota Mark X has been confirmed. Driver Bob W. is on the way.",
        time: "5 minutes ago",
    },
    {
        title: "Payment Successful",
        description: "Your payment of $25.00 for booking #BK-5829 has been processed.",
        time: "1 day ago",
    },
    {
        title: "Driver Arrived",
        description: "Your driver has arrived at the pickup location.",
        time: "3 days ago",
    }
]

export default function NotificationsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-headline">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest alerts about your bookings.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            Here's a list of your recent notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {notifications.map((notification, index) => (
                <div key={index} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                       <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <time className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</time>
                </div>
            ))}
             {notifications.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                    <Bell className="mx-auto h-12 w-12" />
                    <p className="mt-4">You have no new notifications.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

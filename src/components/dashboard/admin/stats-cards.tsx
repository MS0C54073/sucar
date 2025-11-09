import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, BookOpen, UserCheck, Users } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "K45,231.89",
    change: "+20.1% from last month",
    icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
  },
  {
    title: "Bookings",
    value: "+2350",
    change: "+180.1% from last month",
    icon: <BookOpen className="h-5 w-5 text-muted-foreground" />,
  },
  {
    title: "Active Drivers",
    value: "+12",
    change: "+19% from last month",
    icon: <UserCheck className="h-5 w-5 text-muted-foreground" />,
  },
  {
    title: "New Clients",
    value: "+573",
    change: "+201 since last hour",
    icon: <Users className="h-5 w-5 text-muted-foreground" />,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

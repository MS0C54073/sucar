
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Shield,
  Book,
  Route,
  LogOut,
  Settings,
  Bell,
  History,
  PlusCircle,
  Map,
} from "lucide-react";

import {
  SidebarHeader,
  SidebarContent as SidebarContentArea,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

export function SidebarContent() {
  const { user, role, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const adminNav = [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/tracking", label: "Fleet Tracking", icon: Map },
    { href: "/dashboard/bookings", label: "Bookings", icon: Book },
    { href: "/dashboard/drivers", label: "Drivers", icon: Users },
    { href: "/dashboard/providers", label: "Providers", icon: Wrench },
    { href: "/dashboard/route-optimizer", label: "Route Optimizer", icon: Route },
  ];

  const clientNav = [
    { href: "/dashboard/client", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/my-bookings", label: "My Bookings", icon: Book },
    { href: "/dashboard/new-booking", label: "New Booking", icon: PlusCircle },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  ];

  const driverNav = [
    { href: "/dashboard/driver", label: "My Trips", icon: Route },
    { href: "/dashboard/route-optimizer", label: "Route Optimizer", icon: Route },
  ];

  const providerNav = [
    { href: "/dashboard/provider", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/provider/tracking", label: "Incoming", icon: Map },
    { href: "/dashboard/services", label: "Services", icon: Wrench },
  ];
  
  const navItems = { admin: adminNav, client: clientNav, driver: driverNav, provider: providerNav }[role || 'client'];


  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContentArea>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContentArea>
      <SidebarFooter className="gap-4">
        <SidebarSeparator />
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/dashboard/settings" passHref>
                    <SidebarMenuButton isActive={isActive('/dashboard/settings')} tooltip="Settings">
                        <Settings />
                        <span>Settings</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-2 rounded-lg">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</p>
            </div>
        </div>
      </SidebarFooter>
    </>
  );
}

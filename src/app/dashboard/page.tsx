"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (role) {
        // Redirect to the role-specific dashboard
        const dashboardPath = `/dashboard/${role}`;
        router.replace(dashboardPath);
      } else {
        // If no role, but somehow on this page, redirect to login
        router.replace("/login");
      }
    }
  }, [role, loading, router]);

  return (
    <div className="space-y-8">
      <Skeleton className="h-12 w-1/4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

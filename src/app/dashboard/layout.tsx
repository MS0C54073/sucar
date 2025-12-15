import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  // This layout is now simplified as the header logic is more universal
  return <DashboardLayout>{children}</DashboardLayout>;
}

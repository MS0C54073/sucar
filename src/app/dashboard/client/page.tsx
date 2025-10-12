import { BookingForm } from "@/components/dashboard/client/booking-form";
import { BookingStatus } from "@/components/dashboard/client/booking-status";
import { Separator } from "@/components/ui/separator";

export default function ClientDashboardPage() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Book a New Wash</h1>
        <BookingForm />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-6">Live Status</h2>
        <BookingStatus />
      </div>
    </div>
  );
}

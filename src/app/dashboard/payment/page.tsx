
"use client";

import { PaymentScreen } from "@/components/dashboard/payment/payment-screen";
import { useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  if (!bookingId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: No booking ID provided.</p>
      </div>
    );
  }

  return (
    <div>
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold font-headline">Complete Your Payment</h1>
            <p className="text-muted-foreground mt-2">
                Securely pay for your car wash booking.
            </p>
        </div>
        <PaymentScreen bookingId={bookingId} />
    </div>
  );
}

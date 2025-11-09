
"use client";

import { BookingForm } from "@/components/dashboard/client/booking-form";

export default function NewBookingPage() {
  return (
    <div className="max-w-2xl mx-auto">
       <div className="mb-8">
        <h1 className="text-2xl font-bold font-headline">Book a New Wash</h1>
        <p className="text-muted-foreground">
            Let’s help you book your car wash.
        </p>
      </div>
      <BookingForm />
    </div>
  );
}


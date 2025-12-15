
"use client";

import Link from "next/link";
import { CheckCircle, Download } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Booking } from "@/lib/types";
import type { PaymentDetails } from "@/lib/payment-types";
import { format } from "date-fns";

interface PaymentReceiptProps {
    booking: Booking;
    paymentDetails: PaymentDetails;
}

export function PaymentReceipt({ booking, paymentDetails }: PaymentReceiptProps) {
    const serviceFee = booking.cost * 0.05;
    const total = booking.cost + serviceFee;

    const getPaymentDetail = () => {
        if ('phone' in paymentDetails) {
            return `Paid with ${paymentDetails.provider} Mobile Money from ${paymentDetails.phone}`;
        }
        if ('cardNumber' in paymentDetails) {
            return `Paid with card ending in ${paymentDetails.cardNumber.slice(-4)}`;
        }
        return "Payment details unavailable";
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="mt-4">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <p className="text-4xl font-bold">K{total.toFixed(2)}</p>
                    <p className="text-muted-foreground">Paid on {format(new Date(), "PPPp")}</p>
                </div>
                <Separator />
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Booking ID:</span>
                        <span className="font-mono">#{booking.bookingId.slice(-6)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span className="font-medium">{getPaymentDetail()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Vehicle:</span>
                        <span>{booking.vehicle.make} {booking.vehicle.model}</span>
                    </div>
                </div>
                 <Separator />
                 <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                        <span>Service Cost:</span>
                        <span>K{booking.cost.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Service Fee:</span>
                        <span>K{serviceFee.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between font-bold text-base">
                        <span>Total Paid:</span>
                        <span>K{total.toFixed(2)}</span>
                    </div>
                 </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <div className="flex gap-4 w-full">
                    <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Receipt
                    </Button>
                    <Button asChild className="w-full">
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </div>
                 <p className="text-xs text-muted-foreground text-center">A receipt has also been sent to your registered email address.</p>
            </CardFooter>
        </Card>
    );
}

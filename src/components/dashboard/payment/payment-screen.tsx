
"use client";

import { useState } from "react";
import { useBooking } from "@/context/booking-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethodSelection } from "./payment-method-selection";
import { OrderSummary } from "./order-summary";
import { MobileMoneyForm } from "./mobile-money-form";
import { CardPaymentForm } from "./card-payment-form";
import { PaymentProcessing } from "./payment-processing";
import { PaymentReceipt } from "./payment-receipt";
import type { PaymentMethod, PaymentDetails } from "@/lib/payment-types";


interface PaymentScreenProps {
    bookingId: string;
}

export function PaymentScreen({ bookingId }: PaymentScreenProps) {
    const { bookings, updateBookingPaymentStatus } = useBooking();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

    const booking = bookings.find(b => b.bookingId === bookingId);

    if (!booking) {
        return <p>Booking not found.</p>;
    }

    const handlePaymentSubmit = (details: PaymentDetails) => {
        setPaymentDetails(details);
        setPaymentStatus('processing');
        updateBookingPaymentStatus(bookingId, 'processing');
        // Simulate API call
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate
            if (success) {
                updateBookingPaymentStatus(bookingId, 'paid');
                setPaymentStatus('success');
            } else {
                updateBookingPaymentStatus(bookingId, 'failed');
                setPaymentStatus('error');
            }
        }, 3000);
    };
    
    if (paymentStatus === 'processing') {
        return <PaymentProcessing />;
    }

    if (paymentStatus === 'success' && paymentDetails) {
        return <PaymentReceipt booking={booking} paymentDetails={paymentDetails} />;
    }

    return (
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
            <div>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>1. Choose Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PaymentMethodSelection onSelectMethod={setSelectedMethod} selectedMethod={selectedMethod} />
                    </CardContent>
                </Card>

                {selectedMethod === 'mtn_money' && (
                    <MobileMoneyForm 
                        provider="MTN"
                        onSubmit={handlePaymentSubmit}
                    />
                )}
                 {selectedMethod === 'airtel_money' && (
                    <MobileMoneyForm 
                        provider="Airtel"
                        onSubmit={handlePaymentSubmit}
                    />
                )}
                 {selectedMethod === 'card' && (
                    <CardPaymentForm 
                        onSubmit={handlePaymentSubmit}
                    />
                )}
                 {selectedMethod === 'cash' && (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">You have selected to pay with cash. Please pay the driver upon vehicle delivery.</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
                <OrderSummary booking={booking} />
            </div>
        </div>
    )
}

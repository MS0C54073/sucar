
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Booking } from "@/lib/types";

interface OrderSummaryProps {
    booking: Booking;
}

export function OrderSummary({ booking }: OrderSummaryProps) {
    const serviceFee = booking.cost * 0.05; // 5% service fee
    const total = booking.cost + serviceFee;
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between">
                    <span>{booking.vehicle.make} {booking.vehicle.model} Wash</span>
                    <span>K{booking.cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Service Fee</span>
                    <span>K{serviceFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>K{total.toFixed(2)}</span>
                </div>
            </CardContent>
            <CardFooter>
                 <p className="text-xs text-muted-foreground">
                    All prices are in Zambian Kwacha (ZMW). A service fee is applied to cover driver and platform costs.
                </p>
            </CardFooter>
        </Card>
    );
}

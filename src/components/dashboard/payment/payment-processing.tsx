
import { Loader2 } from "lucide-react";

export function PaymentProcessing() {
    return (
        <div className="flex flex-col items-center justify-center text-center h-96">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
            <h2 className="text-2xl font-bold">Processing Your Payment...</h2>
            <p className="text-muted-foreground mt-2">
                Please do not close this window. We are securely processing your transaction.
            </p>
        </div>
    );
}

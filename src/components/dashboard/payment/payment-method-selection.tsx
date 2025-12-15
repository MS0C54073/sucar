
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import type { PaymentMethod } from "@/lib/payment-types";
import { PAYMENT_METHODS } from "@/lib/payment-types";

interface PaymentMethodSelectionProps {
    onSelectMethod: (method: PaymentMethod) => void;
    selectedMethod: PaymentMethod | null;
}

export function PaymentMethodSelection({ onSelectMethod, selectedMethod }: PaymentMethodSelectionProps) {
    return (
        <RadioGroup
            value={selectedMethod || ""}
            onValueChange={(value) => onSelectMethod(value as PaymentMethod)}
            className="grid grid-cols-2 gap-4"
        >
            {PAYMENT_METHODS.map((method) => (
                <div key={method.id}>
                    <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                    <Label
                        htmlFor={method.id}
                        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                    >
                        {method.id === 'card' ? 
                            <CreditCard className="mb-3 h-8 w-8" /> :
                            <Image src={method.logo} alt={`${method.name} Logo`} width={40} height={40} className="mb-3" />
                        }
                        <span className="text-sm font-medium">{method.name}</span>
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );
}

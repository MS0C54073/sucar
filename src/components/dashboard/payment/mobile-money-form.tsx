
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { isValidZambianMobile } from "@/lib/payment-types";

interface MobileMoneyFormProps {
    provider: 'MTN' | 'Airtel';
    onSubmit: (details: { provider: 'MTN' | 'Airtel'; phone: string }) => void;
}

export function MobileMoneyForm({ provider, onSubmit }: MobileMoneyFormProps) {

    const formSchema = z.object({
        phone: z.string().refine(phone => isValidZambianMobile(phone, provider), {
            message: `Please enter a valid ${provider} Zambia mobile number (e.g., 096... or 076...).`
        })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { phone: "" },
    });

    function handleFormSubmit(values: z.infer<typeof formSchema>) {
        onSubmit({ provider, phone: values.phone });
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <CardHeader>
                        <CardTitle>Pay with {provider} Mobile Money</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder={`Your ${provider} number`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Confirm and Pay
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

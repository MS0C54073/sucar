
export type PaymentMethod = "mtn_money" | "airtel_money" | "card" | "cash";

export interface PaymentMethodDetails {
    id: PaymentMethod;
    name: string;
    logo: string;
    feePercent: number;
}

export const PAYMENT_METHODS: PaymentMethodDetails[] = [
    {
        id: 'mtn_money',
        name: 'MTN MoMo',
        logo: '/mtn-momo-logo.png',
        feePercent: 1.5,
    },
    {
        id: 'airtel_money',
        name: 'Airtel Money',
        logo: '/airtel-money-logo.png',
        feePercent: 1.5,
    },
    {
        id: 'card',
        name: 'Card',
        logo: '', // No logo for generic card
        feePercent: 2.9,
    },
    {
        id: 'cash',
        name: 'Cash',
        logo: '/cash-logo.png',
        feePercent: 0,
    }
];

export const isValidZambianMobile = (phone: string, provider: 'MTN' | 'Airtel'): boolean => {
    const phoneRegex = /^(0|260)?(96|76|97|77)\d{7}$/;
    if (!phoneRegex.test(phone)) return false;

    const mtnPrefixes = ['096', '076'];
    const airtelPrefixes = ['097', '077'];

    const prefix = phone.startsWith('260') ? phone.substring(3, 6) : phone.substring(0, 3);
    
    if (provider === 'MTN') {
        return mtnPrefixes.includes('0' + prefix.slice(1));
    }
    if (provider === 'Airtel') {
        return airtelPrefixes.includes('0' + prefix.slice(1));
    }

    return false;
}

export type PaymentDetails = 
    | { provider: 'MTN' | 'Airtel'; phone: string }
    | { cardNumber: string; expiryDate: string; cvv: string; nameOnCard: string };

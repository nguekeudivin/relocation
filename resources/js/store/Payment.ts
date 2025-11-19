import { apiClient } from '@/lib/http';
import { createResourceStore, ResourceStore } from '@/lib/resource';
import { User } from './User';

export interface Payment {
    id: number; // Internal DB ID
    user_id: number; // Foreign key to User
    amount: number; // Payment amount
    method: 'paypal' | 'card' | 'mobile_money'; // Payment method
    phone_number?: string | null; // Optional phone number for some payment methods
    transaction_id?: string | null; // Optional transaction ID from payment gateway
    status: 'pending' | 'completed' | 'failed'; // Payment status
    processed_at?: string | Date | null; // Timestamp when payment was processed
    callback?: Record<string, any> | null; // Optional JSON callback data
    created_at?: string | Date;
    updated_at?: string | Date;
    user: User;
}

interface PaymentStore extends ResourceStore<Payment> {
    stats: any;
    getStats: (year: string) => Promise<any>;
}

export const usePayment = createResourceStore<Payment, PaymentStore>('payments', (set, get) => ({
    stats: {},
    getStats: (year: string) => {
        return apiClient()
            .get(`/stats/user?year=${year}`)
            .then((res) => {
                set(() => ({ stats: res.data }));
                return res.data;
            });
    },
}));

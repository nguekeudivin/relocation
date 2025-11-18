import { apiClient } from '@/lib/http';
import { createResourceStore, ResourceStore } from '@/lib/resource';

export interface Booking {
    id: number; // Internal DB ID
    user_id: number; // Foreign key to user
    date: string | Date; // Booking datetime
    origin_id: number; // ID of origin location
    destination_id: number; // ID of destination location
    workers: number; // Number of workers
    cars?: number; // Number of cars (optional, default 0)
    duration: number; // Duration in hours
    amount: number; // Total price
    observation?: string | null; // Optional notes
    created_at?: string | Date; // Timestamp
    updated_at?: string | Date; // Timestamp
    origin: Address;
    destination: Address;
}

interface BookingStore extends ResourceStore<Booking> {
    stats: any;
    getStats: (year: string) => Promise<any>;
}

export const useBooking = createResourceStore<Booking, BookingStore>('bookings', (set, get) => ({
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

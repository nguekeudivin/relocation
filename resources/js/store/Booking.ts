import { apiClient } from '@/lib/http';
import { createResourceStore, ResourceStore } from '@/lib/resource';

export interface Booking {
    id: number;
    user_id: number;
    date: string | Date;
    origin_id: number; // ID of origin location
    destination_id: number; // ID of destination location
    workers: number; // Number of workers
    duration: number; // Duration in hours
    amount: number; // Total price
    email: string;
    car_type: string;
    observation?: string | null; // Optional notes
    origin: Address;
    destination: Address;
    created_at?: string | Date; // Timestamp
    updated_at?: string | Date; // Timestamp
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

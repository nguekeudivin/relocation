import { apiClient } from '@/lib/http';
import { createResourceStore, ResourceStore } from '@/lib/resource';
import { getDay, startOfDay } from 'date-fns';
import { User } from './User';

export interface Booking {
    id: number;
    user_id: number;
    date: string | Date;
    origin_id: number; // ID of origin location
    destination_id: number; // ID of destination location
    workers: number; // Number of workers
    duration: number; // Duration in hours
    amount: number; // Total price
    distance: number;
    tax: number;
    email: string;
    status: string;
    car_type: string;
    observation?: string | null; // Optional notes
    origin: Address;
    destination: Address;
    created_at?: string | Date; // Timestamp
    updated_at?: string | Date; // Timestamp
    user: User;
    //
    token: string;
    first_name: string;
    last_name: string;
}

interface BookingStore extends ResourceStore<Booking> {
    stats: any;
    getStats: (year: string) => Promise<any>;
    cancel: (id: number) => Promise<any>;
    reject: (id: number) => Promise<any>;
    confirm: (id: number) => Promise<any>;
    complete: (id: number) => Promise<any>;
    notifyPayment: (id: number) => Promise<any>;
}

export const useBooking = createResourceStore<Booking, BookingStore>('bookings', (set, get) => ({
    stats: {},
    getStats: (year: string) => {
        return apiClient()
            .get(`/stats/booking?year=${year}`)
            .then((res) => {
                set(() => ({ stats: res.data }));
                return res.data;
            });
    },
    cancel: (id: number) => {
        return apiClient().post(`/bookings/${id}/cancel`);
    },
    reject: (id: number) => {
        return apiClient().post(`/bookings/${id}/reject`);
    },
    confirm: (id: number) => {
        return apiClient().post(`/bookings/${id}/confirm`);
    },
    complete: (id: number) => {
        return apiClient().post(`/bookings/${id}/complete`);
    },
    notifyPayment: (id: number) => {
        return apiClient().post(`/bookings/${id}/notify`);
    },
}));

export const getTransportBasePrice = ({ date, settings }: { date: any; settings: any }) => {
    const selectedDate = startOfDay(new Date(date));
    const dayOfWeek = getDay(selectedDate); // 0=Sunday, 1=Monday, ..., 6=Saturday

    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 4; // Mon–Thu
    const basePrice = isWeekday ? settings.car_price_weekday_job : settings.car_price_weekend_job;

    // Update form values
    return basePrice;
};

export const getWorkerTax = (form: any, settings: any) => {
    return parseFloat(form.values.workers) * parseFloat(settings.worker_tax);
};

export const getVehicleTax = (form: any, settings: any) => {
    return parseFloat(form.values.transport_price) + parseFloat(settings.fee_per_km) * parseInt(form.values.distance) * 2;
};

export const getDurationCost = (form: any, settings: any) => {
    return parseFloat(form.values.workers) * form.values.duration * parseFloat(settings.price_per_hour);
};

export const createBookingInstance = (form: any, settings: any) => {
    return {
        origin: {
            city: form.values.from_city,
            street: form.values.from_street,
        },
        destination: {
            city: form.values.to_city,
            street: form.values.to_street,
        },
        workers: form.values.workers,
        duration: form.values.duration,
        car_type: form.values.car_type,
        distance: form.values.distance,
        amount: getWorkerTax(form, settings) + getVehicleTax(form, settings) + getDurationCost(form, settings),
        tax: getWorkerTax(form, settings) + getVehicleTax(form, settings),
    };
};

import { apiClient } from '@/lib/http';
import { createResourceStore, ResourceStore } from '@/lib/resource';
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

export const getTransportBasePrice = (form: any, settings: any, isWeekday: any) => {
    if (form.values.car_type == 'van') {
        return isWeekday ? settings.van_price_weekday : settings.van_price_weekend;
    } else if (form.values.car_type == 'bus') {
        return isWeekday ? settings.bus_price_weekday : settings.bus_price_weekend;
    }

    return 0;
};

export const getWorkerTax = (form: any, settings: any) => {
    return parseFloat(form.values.workers) * parseFloat(settings.worker_tax);
};

export const getCarTax = (form: any, settings: any) => {
    return form.values.car_type != undefined ? parseFloat(settings.car_tax) : 0;
};

export const getCarTransport = (form: any, settings: any) => {
    return form.values.car_type != undefined
        ? parseFloat(form.values.transport_price) + parseFloat(settings.fee_per_km) * parseInt(form.values.distance) * 2
        : 0;
};

export const getPaderbornTransport = (form: any, settings: any) => {
    return parseFloat(settings.fee_per_km) * parseInt(form.values.distance_paderborn) * 2;
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
        amount: getWorkerTax(form, settings) + getCarTax(form, settings) + getDurationCost(form, settings),
        tax: getWorkerTax(form, settings) + getCarTax(form, settings),
        car_transport: getCarTransport(form, settings),
        distance_paderborn: form.values.distance_paderborn,
        paderborn_transport: getPaderbornTransport(form, settings),
    };
};

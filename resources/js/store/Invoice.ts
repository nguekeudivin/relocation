import { createResourceStore } from '@/lib/resource';
import { Booking } from './Booking';

interface Invoice {
    id: number;
    booking_id: number;
    booking: Booking;
}

export const useInvoice = createResourceStore('invoices');

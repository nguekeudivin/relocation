import { CreateBookingModal } from './create-booking-modal';
import { DeleteBookingModal } from './delete-booking-modal';
import { ViewBookingModal } from './view-booking-modal';

export function BookingModals() {
    return (
        <>
            <CreateBookingModal />
            <ViewBookingModal />
            <DeleteBookingModal />
        </>
    );
}

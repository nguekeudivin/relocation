import { CreateBookingModal } from "./create-booking-modal";
import { EditBookingModal } from "./edit-booking-modal";
import { ViewBookingModal } from "./view-booking-modal";
import { DeleteBookingModal } from "./delete-booking-modal";

export function BookingModals() {
  return (
    <>
      <CreateBookingModal />
      <EditBookingModal />
      <ViewBookingModal />
      <DeleteBookingModal />
    </>
  );
}

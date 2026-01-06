import { Modal } from '@/components/ui/modal';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { Booking } from '@/store/Booking';
import BookingCard from '../booking-card';

export function ViewBookingModal() {
    const name = 'view_booking';
    const store = useAppStore();
    const { t } = useTranslation();
    const booking = store.booking.current as Booking | null;

    if (!booking) return null;

    return (
        <Modal title={t('Booking Details')} name={name} className="w-[700px] max-w-[95vw]">
            <BookingCard mode="admin" booking={booking} />
        </Modal>
    );
}

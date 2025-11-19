import { Modal } from '@/components/ui/modal';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
// import { useTranslation } from '@/hooks/use-translation';
import useAppStore from '@/store';
import { Booking } from '@/store/Booking';
import { useEffect } from 'react';

export function EditBookingModal() {
    const name = 'edit_booking';
    const store = useAppStore();
    const { t } = useTranslation();
    const booking = store.booking.current as Booking | null;

    const form = useSimpleForm({
        date: '',
        origin_id: '',
        destination_id: '',
        workers: 1,
        cars: 0,
        duration: 1,
        amount: 0,
        observation: '',
    });

    useEffect(() => {
        if (booking && store.display.visible[name]) {
            form.setValues({
                date: booking.date,
                origin_id: booking.origin_id,
                destination_id: booking.destination_id,
                workers: booking.workers,
                cars: booking.cars ?? 0,
                duration: booking.duration,
                amount: booking.amount,
                observation: booking.observation ?? '',
            });
        }
    }, [store.display.visible[name], booking]);

    const submit = async () => {
        if (!booking) return;
        await store.booking.update(booking.id, form.values);
        store.booking.fetch();
        store.display.hide(name);
    };

    return (
        <Modal
            title={t('Edit Booking')}
            name={name}
            className="w-[900px] max-w-[95vw]"
            footer={{ name, submit, loading: store.booking.loading('update') }}
        >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos neque exercitationem amet molestiae laborum porro repellendus hic
            aliquam assumenda vel, consectetur repellat. Impedit aspernatur incidunt, porro sit maxime nihil cupiditate?
            {/* <BookingForm form={form} /> */}
        </Modal>
    );
}

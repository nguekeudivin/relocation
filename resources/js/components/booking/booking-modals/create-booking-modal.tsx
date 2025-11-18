import { Sheet } from '@/components/ui/sheet';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { BookingForm } from '../booking-form';

export function CreateBookingModal() {
    const name = 'create_booking';
    const store = useAppStore();
    const { t } = useTranslation();

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

    const submit = async () => {
        await store.booking.create(form.values);
        store.booking.fetch();
        store.display.hide(name);
    };

    return (
        <Sheet
            title={t('Create Booking')}
            name={name}
            className="w-[900px] max-w-[95vw]"
            footer={{ name, submit, loading: store.booking.loading('create') }}
        >
            <BookingForm form={form} />
        </Sheet>
    );
}

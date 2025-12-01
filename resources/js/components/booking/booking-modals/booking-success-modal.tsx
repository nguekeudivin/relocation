import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { CheckCircle2 } from 'lucide-react';

export function SuccessBookingModal() {
    const name = 'success_booking';
    const { t } = useTranslation();
    const store = useAppStore();
    const booking = store.booking.current;

    if (!booking) return null;

    const close = () => {
        store.display.hide(name);
    };

    return (
        <Modal title={t('Booking confirmation')} name={name} className="w-[520px]">
            <div className="flex flex-col items-center py-10 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-14 w-14 text-green-600" />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-gray-900">{t('Your booking has been successfully registered!')}</h3>

                <div className="mt-4 max-w-md space-y-3 text-sm text-gray-600">
                    <p>
                        {t('A confirmation email has been sent to')} <span className="font-medium text-gray-900">{booking.email}</span>.
                    </p>
                    <p>{t('One of our professionals will contact you shortly to confirm the details and arrange pickup.')}</p>
                </div>

                <div className="mt-10">
                    <Button onClick={close}>{t('Got it, thanks!')}</Button>
                </div>
            </div>
        </Modal>
    );
}

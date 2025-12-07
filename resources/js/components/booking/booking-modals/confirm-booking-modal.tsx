import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import useTranslation from '@/hooks/use-translation';
import { formatNumber } from '@/lib/utils';
import useAppStore from '@/store';
import { AlertTriangle } from 'lucide-react';

export function ConfirmBookingModal() {
    const name = 'confirm_booking';
    const store = useAppStore();
    const { t } = useTranslation();
    const booking = store.booking.current;

    const submit = async () => {
        if (!booking) return;
        store.loading.start(name);

        store.booking
            .confirm(booking.id)
            .then(() => {
                window.location.reload();
            })
            .catch(store.errors.catch)
            .finally(() => {
                store.loading.stop(name);
            });
    };

    if (!booking) return null;

    return (
        <Modal name={name} className="w-[500px]" header={<></>}>
            <div className="flex flex-col items-center text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <AlertTriangle className="h-10 w-10 text-green-600" />
                </div>

                <>{store.errors.render()}</>

                <h3 className="mt-4 text-lg font-semibold">{t('Confirm this booking?')}</h3>
                <p className="mt-2 text-sm text-gray-600">
                    {t('You are about to confirm this booking. The customer will receive a confirmation email.')}
                </p>

                <div className="mt-4 w-full space-y-2 rounded bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    <div className="flex justify-between">
                        <span>{t('Pick-up')}</span>
                        <span className="font-semibold">{booking.origin.city}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t('Delivery')}</span>
                        <span className="font-semibold">{booking.destination.city}</span>
                    </div>
                    <div className="flex justify-between border-t border-green-200 pt-2">
                        <span>
                            {formatNumber(booking.amount)} € • {booking.workers} {t('workers')}
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <Button color="neutral" onClick={() => store.display.hide(name)}>
                        {t('Keep pending')}
                    </Button>
                    <Button color="green" onClick={submit} loading={store.loading.status[name]}>
                        {t('Yes, confirm booking')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

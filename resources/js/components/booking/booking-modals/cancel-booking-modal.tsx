import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import useTranslation from '@/hooks/use-translation';
import { formatNumber } from '@/lib/utils';
import useAppStore from '@/store';
import { AlertTriangle } from 'lucide-react';

export function CancelBookingModal() {
    const name = 'cancel_booking';
    const store = useAppStore();
    const { t } = useTranslation();
    const booking = store.booking.current;

    const submit = async () => {
        if (!booking) return;
        store.loading.start('cancel_booking');
        store.booking
            .cancel(booking.id)
            .then((updated) => {
                window.location.reload();
            })
            .catch(store.errors.catch)
            .finally(() => {
                store.loading.stop('cancel_booking');
            });
    };

    if (!booking) return null;

    return (
        <Modal name={name} className="w-[500px]" header={<></>}>
            <div className="flex flex-col items-center text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
                <>{store.errors.render()}</>

                <h3 className="mt-4 text-lg font-semibold">{t('Cancel this move?')}</h3>
                <p className="mt-2 text-sm text-gray-600">{t('You are about to cancel this moving booking. This action cannot be undone.')}</p>

                <div className="mt-4 w-full space-y-2 rounded bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <div className="flex justify-between">
                        <span>{t('Pick-up')}</span>
                        <span className="font-semibold">{booking.origin.city}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t('Delivery')}</span>
                        <span className="font-semibold">{booking.destination.city}</span>
                    </div>
                    <div className="flex justify-between border-t border-red-200 pt-2">
                        <span>
                            {formatNumber(booking.amount)} € • {booking.workers} {t('workers')}
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <Button color="neutral" onClick={() => store.display.hide(name)}>
                        {t('Keep booking')}
                    </Button>
                    <Button color="red" onClick={submit} loading={store.loading.status.cancel_booking}>
                        {t('Yes, cancel move')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

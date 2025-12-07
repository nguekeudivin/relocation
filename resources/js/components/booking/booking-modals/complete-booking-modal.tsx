import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import useTranslation from '@/hooks/use-translation';
import { formatNumber } from '@/lib/utils';
import useAppStore from '@/store';
import { AlertTriangle } from 'lucide-react';

export function CompleteBookingModal() {
    const name = 'complete_booking';
    const store = useAppStore();
    const { t } = useTranslation();
    const booking = store.booking.current;

    const submit = async () => {
        if (!booking) return;
        store.loading.start(name);

        store.booking
            .complete(booking.id)
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
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                    <AlertTriangle className="h-10 w-10 text-blue-600" />
                </div>

                <>{store.errors.render()}</>

                <h3 className="mt-4 text-lg font-semibold">{t('Mark booking as completed?')}</h3>
                <p className="mt-2 text-sm text-gray-600">{t('This will confirm that the moving job has been successfully completed.')}</p>

                <div className="mt-4 w-full space-y-2 rounded bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                    <div className="flex justify-between">
                        <span>{t('Pick-up')}</span>
                        <span className="font-semibold">{booking.origin.city}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t('Delivery')}</span>
                        <span className="font-semibold">{booking.destination.city}</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-200 pt-2">
                        <span>
                            {formatNumber(booking.amount)} € • {booking.workers} {t('workers')}
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <Button color="neutral" onClick={() => store.display.hide(name)}>
                        {t('Cancel')}
                    </Button>
                    <Button onClick={submit} loading={store.loading.status[name]}>
                        {t('Yes, mark as completed')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

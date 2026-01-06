import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { CheckCircle2, FileText } from 'lucide-react';

export function BookingSuccessModal() {
    const name = 'success_booking';
    const { t } = useTranslation();
    const store = useAppStore();
    const booking = store.booking.current;

    const downloadInvoice = () => {
        if (booking?.id) {
            // Using the route generated in Laravel to view the PDF
            window.open(`/invoice?token=${booking.token}`, '_blank');
        }
    };

    return (
        <Modal title={t('Booking confirmation')} name={name} className="max-w-[500px]">
            <div className="flex flex-col items-center py-4 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>

                <h3 className="mt-8 text-xl font-bold text-gray-900">{t('Your booking has been successfully registered!')}</h3>

                <div className="mt-4 max-w-md space-y-4 text-sm text-gray-600">
                    <p>
                        {t('Invoice (AR-:no) has been sent to ', { no: booking?.id as any })}
                        <span className="font-semibold text-gray-900">{booking?.email}</span>.
                    </p>

                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800">
                        <p className="font-medium">
                            {t(
                                `Important: As soon as we receive the booking costs ( :tax€ ), we will firmly record the appointment in our calendar.`,
                                { tax: booking?.tax as any },
                            )}
                        </p>
                    </div>

                    <p>{t('Please review the payment terms and general terms and conditions attached to your invoice.')}</p>
                </div>

                <div className="mt-10 flex w-full flex-col gap-3 px-10">
                    <Button onClick={downloadInvoice} className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t('View my invoice now')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

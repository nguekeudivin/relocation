import { InfoElement } from '@/components/shared/details';
import { Modal } from '@/components/ui/modal';
import useTranslation from '@/hooks/use-translation';
import { formatDate } from '@/lib/utils';
import useAppStore from '@/store';
import { Payment } from '@/store/Payment';

export function ViewPaymentModal() {
    const name = 'view_payment';
    const store = useAppStore();
    const { t } = useTranslation();
    const payment = store.payment.current as Payment | null;

    if (!payment) return null;

    const statusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const details = [
        { label: t('Amount'), value: payment.amount.toFixed(2) },
        { label: t('Method'), value: t(payment.method) },
        // { label: t('Status'), value: <Badge variant={statusColor(payment.status)}>{t(payment.status)}</Badge> },
        { label: t('Phone Number'), value: payment.phone_number || '—' },
        { label: t('Transaction ID'), value: payment.transaction_id || '—' },
        { label: t('Processed At'), value: payment.processed_at ? formatDate(payment.processed_at) : '—' },
        { label: t('Created At'), value: formatDate(payment.created_at) },
        { label: t('Updated At'), value: formatDate(payment.updated_at) },
    ];

    return (
        <Modal title={`${payment.amount.toFixed(2)} Payment`} name={name} className="w-[650px] max-w-[95vw]">
            <div className="space-y-6">
                <section className="rounded-lg bg-gray-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold">{t('Payment Details')}</h3>
                    <ul className="grid grid-cols-2 gap-4 text-sm">
                        {details.map((d) => (
                            <InfoElement key={d.label} detail={{ label: d.label, value: d.value }} />
                        ))}
                    </ul>
                </section>

                {payment.callback && Object.keys(payment.callback).length > 0 && (
                    <section className="rounded-lg bg-gray-50 p-5">
                        <h3 className="mb-3 text-lg font-semibold">{t('Callback Data')}</h3>
                        <pre className="overflow-x-auto rounded border bg-white p-3 text-xs">{JSON.stringify(payment.callback, null, 2)}</pre>
                    </section>
                )}
            </div>
        </Modal>
    );
}

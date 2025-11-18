import TableActions from '@/components/shared/table-actions';
// import { Badge } from '@/components/ui/badge';
import useTranslation from '@/hooks/use-translation';
import { formatDate } from '@/lib/utils';
import { Payment } from '@/store/Payment';

export const PaymentTableColumns = ({ onView, onDelete }: { onView?: any; onDelete?: any }) => {
    const { t } = useTranslation();

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

    const methodIcon = (method: string) => {
        switch (method) {
            case 'paypal':
                return 'PayPal';
            case 'card':
                return 'Card';
            case 'mobile_money':
                return 'Mobile Money';
            default:
                return method;
        }
    };

    return [
        {
            header: t('Amount'),
            name: 'amount',
            row: (payment: Payment) => (
                <p onClick={() => onView(payment)} className="cursor-pointer font-semibold hover:text-blue-800 hover:underline">
                    {payment.amount.toFixed(2)}
                </p>
            ),
        },
        {
            header: t('Method'),
            name: 'method',
            row: (payment: Payment) => <span className="capitalize">{methodIcon(payment.method)}</span>,
        },
        {
            header: t('Status'),
            name: 'status',
            row: (payment: Payment) => <span>{t(payment.status)}</span>,
        },
        {
            header: t('Processed At'),
            name: 'processed_at',
            row: (payment: Payment) => <span>{payment.processed_at ? formatDate(payment.processed_at) : '—'}</span>,
        },
        {
            header: t('Created At'),
            name: 'created_at',
            row: (payment: Payment) => <span>{formatDate(payment.created_at)}</span>,
        },
        {
            header: t('Actions'),
            name: 'actions',
            row: (payment: Payment) => <TableActions item={payment} resourceName="payments" onView={onView} onDelete={onDelete} />,
        },
    ];
};

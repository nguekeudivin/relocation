// import { Badge } from '@/components/ui/badge';
import useTranslation from '@/hooks/use-translation';
import { cn, formatDate } from '@/lib/utils';
import { Payment } from '@/store/Payment';

// --- Payment Status Mappings ---
export const PaymentStatusMap: any = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
};

export const PaymentStatusOptions: any = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
];

export const PaymentStatusColors: any = {
    pending: 'bg-orange-500/30 text-orange-800',
    completed: 'bg-green-500/30 text-green-800',
    failed: 'bg-red-500/30 text-red-800',
};

export const PaymentMethodMap: any = {
    paypal: 'PayPal',
    // card: 'Card',
    stripe: 'Stripe',
};

export const PaymentMethodOptions = [
    { value: 'paypal', label: 'PayPal' },
    // { value: 'card', label: 'Card' },
    { value: 'stripe', label: 'Stripe' },
];

export const PaymentMethodColors: any = {
    paypal: 'bg-blue-500/30 text-blue-800',
    // card: 'bg-purple-500/30 text-purple-800',
    stripe: 'bg-indigo-500/30 text-indigo-800',
};

export const PaymentTableColumns = ({ onView, onDelete }: { onView?: any; onDelete?: any }) => {
    const { t } = useTranslation();

    return [
        {
            header: t('Amount'),
            name: 'amount',
            row: (payment: Payment) => (
                <p onClick={() => onView(payment)} className="cursor-pointer font-semibold hover:text-blue-800 hover:underline">
                    {payment.amount} {` €`}
                </p>
            ),
        },
        {
            header: t('Method'),
            name: 'method',
            row: (order: Payment) => (
                <span className={cn('rounded-full px-2 py-1 text-sm', PaymentMethodColors[order.method])}>{t(PaymentMethodMap[order.method])}</span>
            ),
        },
        {
            header: t('Status'),
            name: 'status',
            row: (order: Payment) => (
                <span className={cn('rounded-full px-2 py-1 text-sm', PaymentStatusColors[order.status])}>{t(PaymentStatusMap[order.status])}</span>
            ),
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
        // {
        //     header: t('Actions'),
        //     name: 'actions',
        //     row: (payment: Payment) => <TableActions item={payment} resourceName="payments" onView={onView} onDelete={onDelete} />,
        // },
    ];
};

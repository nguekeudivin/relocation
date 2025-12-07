// import { Badge } from '@/components/ui/badge';
import useTranslation from '@/hooks/use-translation';
import { cn, formatDate } from '@/lib/utils';
import { Payment } from '@/store/Payment';
import { getFullName } from '@/store/User';
import Avatar from '../ui/avatar';

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
    card: 'Card',
};

export const PaymentMethodOptions = [
    { value: 'paypal', label: 'PayPal' },
    { value: 'card', label: 'Card' },
];

export const PaymentMethodColors: any = {
    paypal: 'bg-blue-500/30 text-blue-800',
    card: 'bg-indigo-500/30 text-indigo-800',
};

export const PaymentTableColumns = ({ onView, onDelete }: { onView?: any; onDelete?: any }) => {
    const { t } = useTranslation();

    return [
        {
            header: t('Client'),
            name: 'user_id',
            row: (item: Payment) => (
                <div className="flex items-center gap-2">
                    <div onClick={() => onView(item)} className="cursor-pointer">
                        <Avatar name={getFullName(item.user)} url={undefined} className="h-12 w-12 hover:border-1 hover:border-blue-200" />
                    </div>

                    <div className="text-gray-800">
                        <p onClick={() => onView(item)} className="cursor-pointer hover:text-blue-800 hover:underline">
                            {getFullName(item.user)}
                        </p>
                        <p className="text-gray-500"> {item.user.email}</p>
                    </div>
                </div>
            ),
        },
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
        // {
        //     header: t('Created At'),
        //     name: 'created_at',
        //     row: (payment: Payment) => <span>{formatDate(payment.created_at)}</span>,
        // },
        // {
        //     header: t('Actions'),
        //     name: 'actions',
        //     row: (payment: Payment) => <TableActions item={payment} resourceName="payments" onView={onView} onDelete={onDelete} />,
        // },
    ];
};

export const UserPaymentTableColumns = ({ onView, onDelete }: { onView?: any; onDelete?: any }) => {
    const { t } = useTranslation();

    return [
        // {
        //     header: t('Client'),
        //     name: 'user_id',
        //     row: (item: Payment) => (
        //         <div className="flex items-center gap-2">
        //             <div onClick={() => onView(item)} className="cursor-pointer">
        //                 <Avatar name={getFullName(item.user)} url={undefined} className="h-12 w-12 hover:border-1 hover:border-blue-200" />
        //             </div>

        //             <div className="text-gray-800">
        //                 <p onClick={() => onView(item)} className="cursor-pointer hover:text-blue-800 hover:underline">
        //                     {getFullName(item.user)}
        //                 </p>
        //                 <p className="text-gray-500"> {item.user.email}</p>
        //             </div>
        //         </div>
        //     ),
        // },
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
        // {
        //     header: t('Created At'),
        //     name: 'created_at',
        //     row: (payment: Payment) => <span>{formatDate(payment.created_at)}</span>,
        // },
        // {
        //     header: t('Actions'),
        //     name: 'actions',
        //     row: (payment: Payment) => <TableActions item={payment} resourceName="payments" onView={onView} onDelete={onDelete} />,
        // },
    ];
};

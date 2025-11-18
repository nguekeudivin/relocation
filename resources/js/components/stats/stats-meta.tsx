import { HeartHandshake, Users } from 'lucide-react';
import { BanknoteArrowDown, BanknoteArrowUp, BanknoteX } from '../ui/icons';

export const overviewElements = [
    {
        label: 'Membres actifs',
        key: 'total_actives',
        value: 12,
        surfix: '',
        color: 'text-blue-600',
        bg: 'bg-blue-100/70',
        icon: Users,
    },
    {
        label: 'Contributions Payees',
        key: 'total_paid_amount',
        value: 0,
        surfix: 'XAF',
        color: 'text-green-600',
        bg: 'bg-green-100/70',
        icon: BanknoteArrowDown,
    },
    {
        label: 'Total des impayees',
        key: 'total_overdue_amount',
        value: 0,
        surfix: 'XAF',
        color: 'text-green-600',
        bg: 'bg-green-100/70',
        icon: BanknoteX,
    },
    {
        label: 'Total entraides',
        key: 'total_approved_amount',
        value: 0,
        surfix: 'XAF',
        color: 'text-pink-600',
        bg: 'bg-pink-100/70',
        icon: HeartHandshake,
    },
    {
        label: 'Depenses Total',
        key: 'total_expenses',
        value: 0,
        surfix: 'XAF',
        color: 'text-orange-600',
        bg: 'bg-orange-100/70',
        icon: BanknoteArrowUp,
    },
];

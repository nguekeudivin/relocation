import { Caravan, Users } from 'lucide-react';
import { BanknoteArrowDown } from '../ui/icons';

export const overviewElements = [
    {
        label: 'Total bookings',
        key: 'total_bookings',
        value: 12,
        surfix: '',
        color: 'text-blue-600',
        bg: 'bg-blue-100/70',
        icon: Caravan,
    },
    {
        label: 'Total clients',
        key: 'total_new_users',
        value: 0,
        surfix: '',
        color: 'text-indigo-600',
        bg: 'bg-indigo-100/70',
        icon: Users,
    },

    {
        label: 'Total revenue',
        key: 'total_revenue',
        value: 0,
        surfix: '€',
        color: 'text-green-600',
        bg: 'bg-green-100/70',
        icon: BanknoteArrowDown,
    },
];

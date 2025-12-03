import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

import Logo from '@/components/common/Logo';
import { Link } from '@inertiajs/react';
import { BanknoteIcon, CalendarDays, Caravan, LayoutDashboard, LogOut, MessageCircle, Settings, Users } from 'lucide-react';
import { Menu } from './menu';
import TopBar from './top-bar';

interface AppSidebarProps {
    children: ReactNode;
    breadcrumbds?: any;
}

const menu = [
    {
        route: '/admin/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
    },
    {
        route: '/admin/users',
        label: 'Users',
        icon: Users,
    },
    {
        route: '/admin/payments',
        label: 'Payments',
        icon: BanknoteIcon,
    },
    {
        route: '/admin/bookings',
        label: 'Bookings',
        icon: Caravan,
    },
    {
        route: '/admin/calendar',
        label: 'Calendrier',
        icon: CalendarDays,
    },
    {
        route: '/admin/settings',
        label: 'Settings',
        icon: Settings,
    },
    {
        route: '/admin/messages',
        label: 'Messages',
        icon: MessageCircle,
    },
];

export default function AppLayout({ breadcrumbds, children }: AppSidebarProps) {
    const menuBottom = [
        {
            route: '/logout',
            label: 'Logout',
            icon: LogOut,
            method: 'post',
        },
    ];

    return (
        <div className="">
            <div className={cn('fixed top-0 left-0 hidden h-screen w-full border-r border-gray-200 md:block md:w-[250px]', 'bg-gray-100', {})}>
                <div className="px-8 pt-8">
                    <Link href="/">
                        <Logo className="text-start text-2xl md:text-3xl" />
                    </Link>
                </div>

                <div className="mt-8 px-2">
                    <Menu menu={menu} className="" />
                </div>

                <div className="mt-6 w-full px-2">
                    <Menu menu={menuBottom} className="mt-4" />
                </div>
            </div>

            <main className={cn('pl-0 md:pl-[250px]')}>
                <div id="navbar-top">
                    <TopBar menu={menu} className="items-center border-b border-gray-300 bg-white px-4 py-4 md:h-16" />
                </div>
                <div className={cn('mx-auto mb-12 max-w-7xl px-2 py-8 md:px-8')}>{children}</div>
            </main>
        </div>
    );
}

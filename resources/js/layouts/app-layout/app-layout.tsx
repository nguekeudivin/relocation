import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useState } from 'react';

import Logo from '@/components/common/Logo';
import useAppStore from '@/store';
import { Profile } from '@/store/User';
import { MenuItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { BanknoteIcon, CalendarDays, Caravan, CircleDollarSign, HeartHandshake, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';
import { Menu } from './menu';
import TopBar from './top-bar';

interface AppSidebarProps {
    children: ReactNode;
    breadcrumbds: any;
}

const adminMenu = [
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
        route: '/admin/calender',
        label: 'Calendrier',
        icon: CalendarDays,
    },
    {
        route: '/admin/settings',
        label: 'Settings',
        icon: Settings,
    },
];

const memberMenu = [
    {
        route: '/admin/dashboard',
        label: 'Tableau de board',
        icon: LayoutDashboard,
    },
    {
        route: '/admin/members',
        label: 'Membres',
        icon: Users,
    },
    {
        route: '/admin/contributions/listing',
        label: 'Mes Contributions',
        icon: CircleDollarSign,
    },
    {
        route: '/admin/helps',
        label: 'Mes Aides',
        icon: HeartHandshake,
    },

    {
        route: '/admin/expenses',
        label: 'Dépenses',
        icon: BanknoteIcon,
    },
    {
        route: '/admin/meetings',
        label: 'Réunions',
        icon: CalendarDays,
    },
];

export default function AppLayout({ breadcrumbds, children }: AppSidebarProps) {
    const { auth } = usePage<any>().props;
    const [menu, setMenu] = useState<MenuItemType[]>(memberMenu);
    const [isReduce, setIsReduce] = useState<boolean>(false);
    const store = useAppStore();

    const currentProfile = auth.profiles.find((item: Profile) => item.role_id == auth.user.current_user_role_id);

    const menuBottom = [
        {
            route: '/logout',
            label: 'Logout',
            icon: LogOut,
            method: 'post',
        },
    ];

    const menuTypes: Record<string, any> = {
        admin: adminMenu,
        member: memberMenu,
    };

    useEffect(() => {
        setMenu(menuTypes[currentProfile.type]);
    }, [currentProfile]);

    return (
        <div className="">
            <div
                className={cn('fixed top-0 left-0 hidden h-screen w-full border-r border-gray-200 md:block md:w-[250px]', 'bg-gray-100', {
                    'w-[100px]': isReduce,
                })}
            >
                <div className="flex items-center justify-center pt-8">
                    <Logo className="h-36 w-36" />
                </div>

                <div className="px-2">
                    {/* <h3 className="px-6 text-gray-600"> Menu </h3> */}
                    <Menu menu={menu} className="" />
                </div>

                <div className="mt-6 w-full px-2">
                    <Menu menu={menuBottom} className="mt-4" />
                </div>
            </div>

            <main
                className={cn('pl-0 md:pl-[250px]', {
                    'md:pl-[115px]': isReduce,
                })}
            >
                <TopBar className="items-center border-b border-gray-300 bg-white px-4 py-4 md:h-16" />
                <div className={cn('mx-auto mb-12 max-w-7xl px-2 py-8 md:px-8')}>{children}</div>
            </main>
        </div>
    );
}

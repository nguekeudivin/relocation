import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Banknote, Caravan, LogOut, MessageCircle, X } from 'lucide-react';

import { SimpleButtonForm } from '@/components/common/ButtonForm';
import Logo from '@/components/common/Logo';
import { useDisplay } from '@/hooks/use-display';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { Profile } from '@/store/User';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

interface AppSidebarProps {
    children: ReactNode;
    breadcrumbds: any;
}

const menu = [
    {
        route: '/user/bookings',
        label: 'My bookings',
        icon: Caravan,
    },

    {
        route: '/user/payments',
        label: 'My payments',
        icon: Banknote,
    },
    // {
    //     route: '/user/profile',
    //     label: 'My profile',
    //     icon: User,
    // },
    {
        route: '/user/messages',
        label: 'My messages',
        icon: MessageCircle,
    },
];

export default function MemberLayout({ breadcrumbds, children }: AppSidebarProps) {
    const display = useDisplay();
    const { auth } = usePage<any>().props;
    const store = useAppStore();
    const [showMenu, setShowMenu] = useState<boolean>(false);

    const currentProfile = auth.profiles.find((item: Profile) => item.role_id == auth.user.current_user_role_id);

    useEffect(() => {
        // store.notification.fetch({
        //     user_id: auth.user.id,
        // });
    }, []);

    const { t } = useTranslation();

    return (
        <div className="">
            <main>
                <div className="py-2">
                    <div className={cn('mx-auto flex h-full max-w-6xl items-center justify-between px-4 py-2 md:px-0')}>
                        <div className="flex gap-4">
                            <button
                                className="md:hidden"
                                onClick={() => {
                                    setShowMenu(true);
                                }}
                            >
                                <Menu className="text-muted-foreground h-5 w-5" />
                            </button>
                            <Link href="/" className="">
                                <Logo className="" />
                            </Link>
                        </div>
                        <ul className="hidden items-center gap-8 md:flex">
                            {menu.map((item) => (
                                <li key={`menu${item.route}`}>
                                    <Link href={item.route}>
                                        <button className="flex items-center gap-1.5">
                                            <item.icon className="text-secondary-600 h-4 w-4" />
                                            {item.label}
                                        </button>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="flex h-full items-center space-x-6">
                            <div className="hidden md:block">
                                <button
                                    onClick={() => {
                                        if (store.notification.items.length != 0) store.display.show('notifications');
                                    }}
                                    className="relative rounded-full p-2 hover:bg-gray-100"
                                >
                                    <Bell />
                                    <div className="bg-secondary-200 absolute -top-2 -right-1 h-6 w-6 rounded-full">
                                        {store.notification.items.length}
                                    </div>
                                </button>
                            </div>
                            <div className="flex cursor-pointer items-center gap-4" onClick={() => {}}>
                                <Avatar className="border-primary-600 flex h-10 w-10 items-center justify-center rounded-full border-2">
                                    <AvatarImage src="/images/avatar/avatar-1.webp" alt={currentProfile.name} className="rounded-full" />
                                    <AvatarFallback>{currentProfile.name.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="hidden md:block">
                                    <h2 className="text-sm font-semibold">{currentProfile.name}</h2>
                                    <SimpleButtonForm route="/logout" className="hover:text-primary-600 text-sm">
                                        {t('Logout')}
                                    </SimpleButtonForm>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cn('mx-auto mb-12 max-w-7xl px-2 py-8 md:px-8')}>{children}</div>
                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-50 flex justify-end bg-gray-900/80"
                        >
                            <motion.div
                                key="sidebar"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ duration: 0.3 }}
                                className="flex h-full w-64 flex-col bg-white p-6 shadow-lg"
                            >
                                <button onClick={() => setShowMenu(false)} aria-label="Close menu" className="mb-6 self-end">
                                    <X className="h-6 w-6 text-gray-600" />
                                </button>
                                <nav className="flex flex-col space-y-4">
                                    {menu.map((item: any, index: number) => (
                                        <Link
                                            key={`link${index}`}
                                            href={item.route}
                                            onClick={() => setShowMenu(false)}
                                            className={cn(
                                                'hover:bg-primary-100 flex items-center gap-2 rounded rounded-full px-3 py-2 transition',
                                                item.bg,
                                            )}
                                        >
                                            <span>
                                                <item.icon className="h-4 w-4" />
                                            </span>
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                    <Link
                                        href="/logout"
                                        className="hover:bg-primary-100 flex w-full items-center gap-2 rounded rounded-full bg-gray-100 px-3 py-2 transition"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span> Logout </span>
                                    </Link>
                                </nav>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

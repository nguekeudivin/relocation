'use client';

import { SelectProfileModal } from '@/components/users/select-profile-modal';
import { useDisplay } from '@/hooks/use-display';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { Profile } from '@/store/User';
import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Bell, Menu } from 'lucide-react';
import { useEffect } from 'react';

export default function TopBar({ className }: { className: string }) {
    const display = useDisplay();
    const { auth } = usePage<any>().props;
    const store = useAppStore();

    const currentProfile = auth.profiles.find((item: Profile) => item.role_id == auth.user.current_user_role_id);

    useEffect(() => {
        // store.notification.fetch({
        //     user_id: auth.user.id,
        // });
    }, []);

    return (
        <div id="topbar" className={cn(className)}>
            <SelectProfileModal />
            <div className={cn('mx-auto flex h-full max-w-7xl items-center justify-between')}>
                <div className="flex gap-4">
                    <button
                        className="md:hidden"
                        onClick={() => {
                            display.show('MobileMenu');
                        }}
                    >
                        <Menu className="text-muted-foreground h-5 w-5" />
                    </button>
                </div>
                <div className=""></div>

                <div className="flex h-full items-center space-x-6">
                    <div>
                        <button
                            onClick={() => {
                                if (store.notification.items.length != 0) store.display.show('notifications');
                            }}
                            className="relative rounded-full p-2 hover:bg-gray-100"
                        >
                            <Bell />
                            <div className="bg-secondary-200 absolute -top-2 -right-1 h-6 w-6 rounded-full">{store.notification.items.length}</div>
                        </button>
                    </div>
                    <div
                        className="flex cursor-pointer items-center gap-4"
                        onClick={() => {
                            store.display.show('SelectProfileModal');
                        }}
                    >
                        <Avatar className="border-primary-600 flex h-10 w-10 items-center justify-center rounded-full border-2">
                            <AvatarImage src="/images/avatar/avatar-1.webp" alt={currentProfile.name} className="rounded-full" />
                            <AvatarFallback>{currentProfile.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="">
                            <h2 className="text-sm font-semibold">{currentProfile.name}</h2>
                            <h3 className="text-xs">{currentProfile.label}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

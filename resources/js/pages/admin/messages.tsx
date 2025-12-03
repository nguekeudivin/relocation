import ChatView from '@/components/messaging/ChatView';
import AppLayout from '@/layouts/app-layout/app-layout';
import { useAuth } from '@/store/Auth';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function MyBookingPage() {
    const authStore = useAuth();

    const { auth } = usePage<any>().props;

    useEffect(() => {
        authStore.setUser(auth.user);
    }, []);

    return (
        <>
            <AppLayout breadcrumbds={[]}>
                <div className="mx-auto max-w-6xl">
                    <ChatView role={'admin'} />
                </div>
            </AppLayout>
        </>
    );
}

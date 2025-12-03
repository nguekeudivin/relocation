import { useDisplay } from '@/hooks/use-display';
import { createResourceStore, ResourceStore } from '@/lib/resource';
import { generateRandomString } from '@/lib/utils';
import { useAuth } from './Auth';

export interface Notification {
    id: number;
    user_id: number;
    notificable_id: number; // The ID of the associated model
    notificable_type: string; // The model type (e.g., 'Post', 'Comment')
    content: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}

interface NotificationState extends ResourceStore<Notification> {
    receiveMessage: (messageId: number) => void;
    handleNewNotification: (notif: any) => void;
}

export const useNotification = createResourceStore<Notification, NotificationState>('notifications', (set, get) => ({
    // Assuming 'notifications' is the resource name for the notification store
    receiveMessage: (messageId: number) => {
        get().add({
            id: generateRandomString(),
            user_id: useAuth.getState().user.id,
            notificable_id: messageId,
            notificable_type: 'AppModelsMessage',
            content: 'You have a new message in a chat',
            link: '/message',
            is_read: false,
            created_at: new Date().toLocaleString(),
            updated_at: new Date().toLocaleDateString(),
        });

        const display = useDisplay.getState();
        display.show('NotificationToast');
        setTimeout(() => {
            display.hide('NotificationToast');
        }, 10000);
    },
    handleNewNotification: (notification: any) => {
        // check if there is an existance first.
        const existance = get().items.find((item: any) => item.id == notification.id);
        if (!existance) get().add(notification);

        const display = useDisplay.getState();
        display.show('NotificationToast');
        setTimeout(() => {
            display.hide('NotificationToast');
        }, 10000);

        // If we are not a booking page we reload the page to view the new details.
        if (window.location.pathname.includes('bookings')) {
            window.location.reload();
        }
    },
}));

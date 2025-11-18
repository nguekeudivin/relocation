import { apiClient } from '@/lib/http';
import { createResourceStore, ResourceStore } from '@/lib/resource';

export interface Notification {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: string;
    data: any;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

interface ReadNotificationFormData {
    user_id: number;
    notification_id?: string;
}

interface NotificationStore extends ResourceStore<Notification> {
    markAsRead: (data: ReadNotificationFormData) => Promise<any>;
    deleteNotification: (data: ReadNotificationFormData) => Promise<any>;
}

export const useNotification = createResourceStore<Notification, NotificationStore>('notifications', (set, get) => ({
    markAsRead: (data: ReadNotificationFormData) => {
        return apiClient()
            .post('/notifications/mark-as-read', data)
            .then((res) => {
                return res.data;
            });
    },
    deleteNotification: (data: ReadNotificationFormData) => {
        return apiClient()
            .post('/notifications/remove', data)
            .then((res) => {
                return res.data;
            });
    },
}));

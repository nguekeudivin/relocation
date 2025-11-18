'use client';

import { useNotifs } from '@/store/interact';
import { Notification, useNotification } from '@/store/notification';
import { useUser } from '@/store/User';
import { Button } from 'flowbite-react';
import { Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import Notifs from '../ui/notifs';

interface NotificationListProps {
    linkRoute: string;
}

const NotificationsList: FC<NotificationListProps> = ({ linkRoute }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    const notifs = useNotifs();
    const user = useUser();
    const notificationStore = useNotification();

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await notificationStore.markAsRead(notificationId);
        } catch (error) {
            notifs.set('error', 'Le système de notifications est indisponible pour le moment');
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!user.current.id) return;
        try {
            await notificationStore.markAllAsRead(user.current.id);
        } catch (error) {
            console.error('Échec de marquer toutes les notifications comme lues:', error);
        }
    };

    const filteredNotifications = showUnreadOnly
        ? notificationStore.items.filter((notification: Notification) => !notification.est_lue)
        : notificationStore.items;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (isLoading) {
        return (
            <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <>
            <Notifs />
            <div className="d mx-auto overflow-hidden rounded-lg bg-white">
                <div className="flex items-center justify-between pb-4">
                    <div className="flex space-x-2">
                        <Button
                            color="alternate"
                            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                            className={` ${showUnreadOnly ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                            {showUnreadOnly ? 'Afficher toutes les notifications' : 'Afficher non lues seulement'}
                        </Button>
                        <Button onClick={handleMarkAllAsRead} disabled={filteredNotifications.every((n) => n.est_lue)}>
                            Tout marquer comme lu
                        </Button>
                    </div>
                </div>

                {filteredNotifications.length === 0 ? (
                    <div className="bg-gray-50 p-6 text-center text-gray-500">Aucune notification disponible</div>
                ) : (
                    <ul className="mt-4 divide-y divide-gray-200">
                        {filteredNotifications.map((notification) => (
                            <li key={notification.id} className={`p-4 ${!notification.est_lue ? 'bg-blue-50' : ''}`}>
                                <div className="flex justify-between">
                                    <div className="relative flex-1">
                                        {!notification.est_lue && (
                                            <Button
                                                onClick={() => {
                                                    handleMarkAsRead(notification.id);
                                                }}
                                                size="sm"
                                                className="absolute top-2 right-4"
                                            >
                                                Marquer comme lu
                                            </Button>
                                        )}

                                        <h3 className="text-lg font-medium text-gray-900">{notification.titre}</h3>
                                        <p className="mt-1 text-base text-gray-600">{notification.contenu}</p>

                                        <div className="mt-2 flex items-center gap-2 text-base text-gray-500">
                                            <span>{formatDate(notification.created_at)}</span>
                                            {notification.est_lue && (
                                                <span className="ml-2 flex items-center rounded-lg bg-gray-100 px-2">
                                                    <Check className="mr-1 h-3 w-3" />
                                                    Lu le {notification.date_lecture && formatDate(notification.date_lecture)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {notification.lien_cible && (
                                    <Link
                                        href={`${linkRoute}${notification.lien_cible}`}
                                        className="mt-2 inline-block text-base text-blue-600 hover:text-blue-800"
                                    >
                                        Voir les détails
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default NotificationsList;

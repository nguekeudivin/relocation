'use client';

import { useMessage } from '@/store/Message';
import { useNotification } from '@/store/Notification';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import SocketConnection from './socket-connection';

export default function CheckSession() {
    const { auth, notificationToSend } = usePage<any>().props;
    const messageStore = useMessage();
    const notificationStore = useNotification();
    const isLogged = auth.user != undefined;

    useEffect(() => {
        if (isLogged) {
            setInterval(() => {
                messageStore.sayIAMOnline(auth.user.id);
            }, 50000); // pull every 50 secondes

            // look for new notification
            notificationStore.fetch();

            // If there is a notification to send. search and send it.
            if (notificationToSend) {
                notificationStore.fetchOne(notificationToSend).then((notif) => {
                    messageStore.sendNotification(notif);
                });
            }
        }
    }, []);

    if (isLogged) return <SocketConnection />;
    else return null;
}

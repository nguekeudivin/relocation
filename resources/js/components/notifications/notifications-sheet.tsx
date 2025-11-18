import { cn, formatDate } from '@/lib/utils';
import useAppStore from '@/store';
import { usePage } from '@inertiajs/react';
import { CheckCheck, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet } from '../ui/sheet';

export default function NotificationSheet() {
    const store = useAppStore();
    const { auth } = usePage<any>().props;

    return (
        <Sheet
            title="Notifications"
            name="notifications"
            className="w-[500px] max-w-[500px]"
            footer={{
                name: '',
                submit: () => {},

                render: (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                store.notification.markAsRead({ user_id: auth.user.id }).then((items) => {
                                    store.notification.setItems(items);
                                });
                            }}
                        >
                            Marquer tout comme lu
                        </Button>
                        <Button
                            color="red"
                            className="bg-red-100 text-red-700 hover:bg-red-200"
                            onClick={() => {
                                store.notification.deleteNotification({ user_id: auth.user.id }).then((items) => {
                                    store.notification.setItems(items);
                                    if (items.length == 0) {
                                        store.display.hide('notifications');
                                    }
                                });
                            }}
                        >
                            Supprimer tout
                        </Button>
                    </div>
                ),
            }}
        >
            <div className="mt-4 space-y-4">
                {store.notification.items.map((item) => (
                    <div
                        className={cn('relative border-b border-gray-300 p-3', {
                            'bg-secondary-50': item.read_at == null,
                            'bg-white': item.read_at != null,
                        })}
                    >
                        <p className="text-sm text-gray-600">{formatDate(item.created_at)}</p>

                        <p className="mt-2">{item.data?.message}</p>
                        <div className="absolute top-3 right-3 flex gap-4">
                            <button
                                onClick={() => {
                                    store.notification
                                        .markAsRead({ user_id: auth.user.id, notification_id: item.id })
                                        .then((items) => store.notification.setItems(items));
                                }}
                                className="flex items-center gap-1.5 text-sm hover:text-blue-600 hover:underline"
                            >
                                <CheckCheck className="h-4 w-4" /> Marquer lu
                            </button>
                            <button
                                onClick={() => {
                                    store.notification
                                        .deleteNotification({ user_id: auth.user.id, notification_id: item.id })
                                        .then((items) => store.notification.setItems(items));
                                }}
                                className="flex items-center gap-1.5 p-1 text-sm hover:text-blue-600 hover:underline"
                            >
                                <Trash className="h-3 w-3" /> Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Sheet>
    );
}

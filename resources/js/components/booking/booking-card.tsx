import { BookingStatusColors, BookingStatusMap } from '@/components/booking/booking-meta';
import { Button } from '@/components/ui/button';
import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { Booking } from '@/store/Booking';
import { Link } from '@inertiajs/react';
import { Bus, Check, Clock, FileText, Map, Pencil, UserIcon, Users } from 'lucide-react';
import { ReactNode } from 'react';
import { Alert } from '../ui/alert';

interface Props {
    booking: Booking;
    header?: ReactNode;
    mode: 'user' | 'admin';
}

export default function BookingCard({ booking, header, mode }: Props) {
    const { t, formatDate } = useTranslation();
    const store = useAppStore();
    const notifyPayment = () => {
        store.booking
            .notifyPayment(booking.id)
            .then(() => {
                store.display.show('notify_payment_success');
            })
            .catch(store.errors.catch);
    };

    return (
        <div className="overflow-hidden border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div>{header}</div>
            <Alert name="notify_payment_success" message={t('Payment notification send with succeess')} />
            <div className="flex flex-col md:flex-row">
                {/* Partie gauche : trajet + date */}
                <div className="flex-1 p-6 md:relative">
                    {mode == 'admin' && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <UserIcon className="h-4 w-4" />
                            <span className="font-bold">
                                {booking.first_name} {booking.last_name}
                            </span>
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                        <time className="text-my-dark font-bold">{formatDate(new Date(booking.date), 'dd MMM yyyy, HH:mm')}</time>
                    </div>

                    <div className="mt-2 flex items-start gap-4">
                        <div className="flex flex-col items-center">
                            <div className="bg-my-dark h-3 w-3 rounded-full" />
                            <div className="bg-my-dark/30 my-2 h-20 w-0.5" />
                            <div className="border-my-dark h-3 w-3 rounded-full border-2 bg-white" />
                        </div>
                        <div className="flex-1 space-y-6">
                            <div>
                                <p className="text-my-dark/70 text-xs font-medium">{t('Pick-up')}</p>
                                <p className="text-my-dark font-semibold">{booking.origin.city}</p>
                                {booking.origin.street && <p className="text-sm text-gray-600">{booking.origin.street}</p>}
                            </div>
                            <div>
                                <p className="text-my-dark/70 text-xs font-medium">{t('Delivery')}</p>
                                <p className="text-my-dark font-semibold">{booking.destination.city}</p>
                                {booking.destination.street && <p className="text-sm text-gray-600">{booking.destination.street}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="absolute mt-8 flex items-center gap-4 text-sm md:bottom-6">
                        <Show when={mode == 'admin'}>
                            <Show when={booking.status == 'notified'}>
                                <button
                                    onClick={() => {
                                        store.booking.setCurrent(booking as any);
                                        store.display.show('confirm_booking');
                                    }}
                                    className="flex items-center gap-1 border-2 border-green-600 px-4 py-1.5 font-semibold text-green-600 hover:underline"
                                >
                                    <Check className="h-4 w-4" />
                                    {t('Confirm payment')}
                                </button>
                            </Show>
                            <Show when={booking.status == 'paid'}>
                                <button
                                    onClick={() => {
                                        store.booking.setCurrent(booking as any);
                                        store.display.show('complete_booking');
                                    }}
                                    className="flex items-center gap-1 border-2 border-blue-600 bg-sky-50 px-4 py-1.5 font-semibold text-blue-600 hover:underline"
                                >
                                    <Check className="h-4 w-4" />
                                    {t('Mark as complete')}
                                </button>
                            </Show>
                        </Show>

                        <Show when={booking.status == 'pending' && mode == 'user'}>
                            <Link href={`/user/bookings/${booking.id}/edit`} className="flex items-center gap-1 border-2 p-2 px-4 hover:underline">
                                <Pencil className="h-3 w-3" />
                                {t('Edit')}
                            </Link>
                            <Button onClick={notifyPayment}>{t('Notify paiement')}</Button>
                        </Show>
                    </div>
                </div>

                {/* Partie droite : détails + prix */}
                <div className="bg-my-gray relative flex-2 p-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Bus className="text-my-dark/70 h-5 w-5" />
                            <span className="text-my-dark font-medium capitalize">{booking.car_type === 'bus' ? t('bus') : t('van')}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Users className="text-my-dark/70 h-5 w-5" />
                            <span className="text-my-dark">
                                {booking.workers} {t('workers')}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock className="text-my-dark/70 h-5 w-5" />
                            <span className="text-my-dark">
                                {booking.duration} {t('hours')}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Map className="text-my-dark/70 h-5 w-5" />
                            <span className="text-my-dark">
                                {t('Distance')} {booking.distance}km x 2
                            </span>
                        </div>
                    </div>

                    <div className="border-my-dark/20 my-4 border-t border-dashed"></div>

                    <div className="">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t('Total HT')}</span>
                            <span className="font-semibold">{booking.amount} €</span>
                        </div>
                        <div className="my-1 border-t border-gray-300"></div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t('Reversation fee (workers and vehicle taxes):')}</span>
                            <span className="font-semibold">{booking.tax} €</span>
                        </div>
                    </div>

                    <div className="absolute top-4 right-4">
                        <span
                            className={cn(
                                'mt-6 rounded-full px-3 py-1 text-sm font-medium capitalize',
                                BookingStatusColors[booking.status] || 'bg-gray-100 text-gray-800',
                            )}
                        >
                            {t(BookingStatusMap[booking.status])}
                        </span>
                    </div>
                    <>
                        {mode == 'user' && (
                            <p className="mt-4 rounded-md bg-blue-50 p-2 text-sm text-blue-900">
                                {t('You paid only the tax online. The remaining amount will be pay to the workers at the end of the job')}
                            </p>
                        )}

                        <div className="mt-4">
                            <Button
                                color="secondary"
                                onClick={() => {
                                    window.open(`/bookings/${booking.id}/invoice`, '_blank');
                                }}
                                className="flex items-center gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                {t('View invoice')}
                            </Button>
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
}

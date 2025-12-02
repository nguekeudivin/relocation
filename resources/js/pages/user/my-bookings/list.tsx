import { BookingStatusColors, BookingStatusMap } from '@/components/booking/booking-meta';
import { CancelBookingModal } from '@/components/booking/booking-modals/cancel-booking-modal';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import Show from '@/components/ui/show';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import MemberLayout from '@/layouts/member-layout/member-layout';
import { cn, formatDate } from '@/lib/utils';
import useAppStore from '@/store';
import { Link, usePage } from '@inertiajs/react';
import { Bus, Clock, Pencil, Users, X } from 'lucide-react';
import { useEffect } from 'react';

export default function MyProfilePage() {
    const store = useAppStore();
    const { auth } = usePage<any>().props;

    const searchForm = useSimpleForm({ keyword: '' });

    const search = ({ page = 1, perPage = 10 } = {}) => {
        store.booking.fetch({ page, perPage, ...searchForm.values, user_id: auth.user.id });
    };

    useEffect(() => {
        search();
    }, []);

    const { t } = useTranslation();

    return (
        <>
            <CancelBookingModal />
            <MemberLayout breadcrumbds={[]}>
                <div className="mx-auto max-w-4xl px-4 md:px-0">
                    <PageTitle title={t('My bookings')} />

                    {/* <SearchEngine form={searchForm} onSubmit={undefined} selects={[]} /> */}

                    <div className="mt-6"></div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
                        {store.booking.pagination.data.map((booking) => (
                            <div className="overflow-hidden border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                                <div className="flex flex-col md:flex-row">
                                    {/* Partie gauche : trajet + date */}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-center justify-between">
                                            <time className="text-my-dark text-lg font-bold">
                                                {formatDate(new Date(booking.date), 'dd MMM yyyy, HH:mm')}
                                            </time>
                                        </div>

                                        <div className="mt-5 flex items-start gap-4">
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
                                                    {booking.destination.street && (
                                                        <p className="text-sm text-gray-600">{booking.destination.street}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Show when={booking.status == 'waiting_payment'}>
                                            <div className="mt-4 flex items-center gap-4 text-sm">
                                                <Link href={`/user/bookings/${booking.id}/edit`} className="flex items-center gap-1 hover:underline">
                                                    <Pencil className="h-3 w-3" />
                                                    {t('Edit')}
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        store.booking.setCurrent(booking as any);
                                                        store.display.show('cancel_booking');
                                                    }}
                                                    className="flex items-center gap-1 text-red-700 hover:underline"
                                                >
                                                    <X className="h-3 w-3" />
                                                    {t('Cancel')}
                                                </button>
                                            </div>
                                        </Show>
                                    </div>

                                    {/* Partie droite : détails + prix */}
                                    <div className="bg-my-gray relative flex-1 p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Bus className="text-my-dark/70 h-5 w-5" />
                                                <span className="text-my-dark font-medium capitalize">
                                                    {booking.car_type === 'bus' ? t('Bus') : t('Van')}
                                                </span>
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
                                        </div>

                                        <div className="border-my-dark/20 mt-4 border-t border-dashed pt-5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-my-dark/80 text-sm font-medium">{t('Total amount')}</span>
                                                <span className="text-my-dark text-xl font-bold">{booking.amount} €</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <span
                                                className={cn(
                                                    'mt-6 rounded-full px-3 py-1 text-xs font-medium capitalize',
                                                    BookingStatusColors[booking.status] || 'bg-gray-100 text-gray-800',
                                                )}
                                            >
                                                {t(BookingStatusMap[booking.status])}
                                            </span>
                                        </div>
                                        {booking.status == 'waiting_payment' && (
                                            <div className="mt-4">
                                                <Button color="secondary" className="px-2 py-2 text-sm">
                                                    Click to pay
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </MemberLayout>
        </>
    );
}

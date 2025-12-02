import { createEditBookingSchema } from '@/components/booking/booking-schema';
import BookingCostCard from '@/components/booking/steps/booking-cost-card';
import BookingDateStep from '@/components/booking/steps/booking-date-step';
import BookingDetailStep from '@/components/booking/steps/booking-detail-step';
import BookingLocationStep from '@/components/booking/steps/booking-location-step';
import PageTitle from '@/components/common/PageTitle';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import MemberLayout from '@/layouts/member-layout/member-layout';
import { cn, formatDate, pick } from '@/lib/utils';
import useAppStore from '@/store';
import { usePage } from '@inertiajs/react';
import { Clock, FileCheck, MapPinHouse } from 'lucide-react';
import { useState } from 'react';

export default function MyProfilePage() {
    const store = useAppStore();
    const { booking } = usePage<any>().props;
    const [activeTab, setActiveTab] = useState<any>('location');
    const { t } = useTranslation();

    const form = useSimpleForm(
        {
            //
            date: new Date(booking.date),
            time: new Date(booking.date),
            // Location.
            from_city: booking.origin.city,
            from_street: booking.origin.street,
            to_city: booking.destination.city,
            to_street: booking.destination.street,
            //
            workers: booking.workers,
            car_type: booking.car_type,
            duration: booking.duration,
            transport_price: 0,
        },
        {
            schema: createEditBookingSchema(t),
        },
    );

    const submit = () => {
        const validation = form.validate();
        if (!validation.valid) {
            console.log(validation.errors);
            store.errors.setMany(validation.errors);
            return 0;
        }
        store.booking
            .update(
                booking.id,
                pick(form.values, ['date', 'from_city', 'from_street', 'to_city', 'to_street', 'workers', 'car_type', 'duration', 'transport_price']),
            )
            .then(() => {
                store.display.show('edit_booking_success');
            })
            .catch(store.errors.catch);
    };

    return (
        <>
            <MemberLayout breadcrumbds={[]}>
                <div className="mx-auto max-w-5xl px-4 md:px-0">
                    <Alert message={t('The changes has been saved with success')} name={'edit_booking_success'} />
                    <PageTitle title={t('Edit my booking')} />

                    <div className="mt-6 gap-12 md:flex">
                        <div className="w-full md:w-3/5">
                            <div className="border-b border-gray-200">
                                <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500">
                                    {[
                                        { name: 'Location', icon: MapPinHouse, key: 'location' },
                                        {
                                            name: 'Date and time',
                                            icon: Clock,
                                            key: 'date',
                                        },
                                        {
                                            name: 'Details',
                                            icon: FileCheck,
                                            key: 'details',
                                        },
                                    ].map((tab: any) => {
                                        const isActive = activeTab === tab.key;
                                        return (
                                            <li key={tab.key} className="me-2">
                                                <button
                                                    onClick={() => setActiveTab(tab.key)}
                                                    className={`group inline-flex items-center justify-center rounded-t-lg border-b-2 p-4 ${isActive ? 'text-secondary-600 border-secondary-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'} ${tab.disabled ? 'cursor-not-allowed text-gray-400' : ''} `}
                                                >
                                                    <tab.icon
                                                        className={`me-2 h-4 w-4 ${
                                                            isActive ? 'text-secondary-600' : 'text-gray-400 group-hover:text-gray-500'
                                                        }`}
                                                    />
                                                    {tab.name}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="mt-4">
                                <div
                                    className={cn('hidden', {
                                        block: activeTab == 'location',
                                    })}
                                >
                                    <BookingLocationStep form={form} showError={false} />
                                </div>

                                <div
                                    className={cn('hidden', {
                                        block: activeTab == 'date',
                                    })}
                                >
                                    <BookingDateStep form={form} showError={false} />
                                </div>

                                <div
                                    className={cn('hidden', {
                                        block: activeTab == 'details',
                                    })}
                                >
                                    <BookingDetailStep form={form} showCost={false} showError={false} />
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-2/5">
                            <>{store.errors.render()}</>

                            <div className="flex items-center justify-between">
                                <time className="text-my-dark text-lg font-bold">{formatDate(new Date(form.values.date), 'dd MMM yyyy, HH:mm')}</time>
                            </div>
                            <div className="mt-4 flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="bg-my-dark h-3 w-3 rounded-full" />
                                    <div className="bg-my-dark/30 my-2 h-20 w-0.5" />
                                    <div className="border-my-dark h-3 w-3 rounded-full border-2 bg-white" />
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <p className="text-my-dark/70 text-xs font-medium">{t('Pick-up')}</p>
                                        <p className="text-my-dark font-semibold">{form.values.from_city}</p>
                                        <p className="text-sm text-gray-600">{form.values.from_street}</p>
                                    </div>
                                    <div>
                                        <p className="text-my-dark/70 text-xs font-medium">{t('Delivery')}</p>
                                        <p className="text-my-dark font-semibold">{form.values.to_city}</p>
                                        <p className="text-sm text-gray-600">{form.values.to_street}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4"></div>
                            <BookingCostCard form={form} />
                            <div className="mt-6">
                                <Button className="text-base" onClick={submit} loading={store.booking.loading('update', booking.id)}>
                                    {t('Save changes')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </MemberLayout>
        </>
    );
}

import { BookingSuccessModal } from '@/components/booking/booking-modals/booking-success-modal';
import { CreateBookingFormSchema } from '@/components/booking/booking-schema';
import BookingDateStep from '@/components/booking/steps/booking-date-step';
import BookingDetailStep from '@/components/booking/steps/booking-detail-step';
import BookingLocationStep from '@/components/booking/steps/booking-location-step';
import BookingRecapStep from '@/components/booking/steps/booking-recap-step';
import { Button } from '@/components/ui/button';
import Show from '@/components/ui/show';
import { useSimpleForm, validateObject } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import { pick } from '@/lib/utils';
import useAppStore from '@/store';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Clock, FileCheck, MapPinHouse, NotepadText } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BookingPage() {
    const store = useAppStore();
    const [reachedSteps, setReachedSteps] = useState<number[]>([0]);
    const [step, setStep] = useState<number>(0);
    const { t } = useTranslation();

    const form = useSimpleForm({
        date: new Date(),
        time: undefined,
        from_address: '',
        to_address: '',
        from_lat: undefined,
        from_lng: undefined,
        to_lat: undefined,
        to_lng: undefined,
        workers: 2,
        car_type: undefined,
        distance: 0,
        duration: 2,
        distance_paderborn: 0,
        amount: 0,
        transport_price: 0,
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
        password: '',
        with_account: false,
        user_id: undefined,
        accept: false,
    });

    useEffect(() => {
        store.setting.fetch({});
    }, []);

    const nextStep = () => {
        store.errors.reset();
        const schema = CreateBookingFormSchema(t, form.values)[step];

        if (schema) {
            const validation = validateObject(form.values, schema);
            if (!validation.valid) {
                store.errors.setMany(validation.errors);
                return;
            }
        }

        setStep((prev) => {
            const nextStep = Math.min(prev + 1, 3);
            if (!reachedSteps.includes(nextStep)) {
                setReachedSteps((values) => [...values, nextStep]);
            }
            return nextStep;
        });
    };

    const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

    const goToStep = (index: number) => {
        if (reachedSteps.includes(index)) {
            setStep(index);
        }
    };

    const submit = () => {
        store.errors.reset();

        if (!form.values.accept) {
            store.errors.set('accept', t('Please provide your confirmation'));
            return 0;
        }

        const data = {
            booking: pick(form.values, [
                'date',
                'time',
                'from_address',
                'to_address',
                'from_lat',
                'from_lng',
                'to_lat',
                'to_lng',
                'email',
                'workers',
                'distance',
                'distance_paderborn',
                'car_type',
                'duration',
                'transport_price',
                'user_id',
                'first_name',
                'last_name',
            ]),
            ...pick(form.values, ['first_name', 'last_name', 'phone_number', 'email', 'password']),
        };

        if (form.values.with_account) {
            store.loading.start('booking');
            router.post(route('register'), data, {
                onSuccess: () => {
                    store.loading.stop('booking');
                },
                onError: (error) => {
                    store.errors.setMany(error);
                    store.loading.stop('booking');
                },
            });
        } else {
            store.loading.start('booking');
            store.booking
                .create(data.booking)
                .then((created) => {
                    if (form.values.user_id != undefined) {
                        window.location.assign('/user/bookings');
                    } else {
                        store.booking.setCurrent(created);
                        store.display.show('success_booking');
                    }
                })
                .catch((error) => {
                    store.errors.catch(error);
                })
                .finally(() => {
                    store.loading.stop('booking');
                });
        }
    };

    return (
        <>
            <BookingSuccessModal />
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto flex max-w-6xl flex-col md:flex-row">
                    {/* Sidebar */}
                    <div className="bg-primary-500/70 w-full shrink-0 py-6 md:min-h-screen md:w-[250px]">
                        <h3 className="text-semibold mt-4 px-6 text-2xl font-semibold text-white">
                            <span className="font-light">{t('Book a relocation')} </span>
                            <span>{t('prestation')}</span>
                        </h3>
                        <ul className="mt-4">
                            {[
                                { text: t('Locations'), icon: MapPinHouse },
                                { text: t('Date and time'), icon: Clock },
                                { text: t('Details'), icon: FileCheck },
                                { text: t('Submission'), icon: NotepadText },
                            ].map((item, index: number) => (
                                <li
                                    key={`menu-item${index}`}
                                    onClick={() => goToStep(index)}
                                    className={`flex cursor-pointer items-center gap-2 px-6 py-2 text-white hover:bg-gray-800/50 hover:text-white ${
                                        index == step ? 'bg-gray-800 text-white' : ''
                                    }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span className="text-sm">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Content */}
                    <div className="relative w-full p-8">
                        <div className={step == 0 ? 'block' : 'hidden'}>
                            <BookingLocationStep form={form} />
                        </div>
                        <div className={step == 1 ? 'block' : 'hidden'}>
                            <BookingDateStep form={form} />
                        </div>
                        <div className={step == 2 ? 'block' : 'hidden'}>
                            <BookingDetailStep form={form} />
                        </div>
                        <div className={step == 3 ? 'block' : 'hidden'}>
                            <BookingRecapStep form={form} submit={submit} />
                        </div>
                        <div className="left-8 mt-8 flex gap-4">
                            <Show when={step < 3}>
                                {step > 0 && (
                                    <Button color="outline" onClick={prevStep}>
                                        {t('Back')} <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button color="dark" onClick={nextStep}>
                                    {t('Continue')} <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Show>
                            {step == 3 && (
                                <>
                                    <Button color="outline" onClick={prevStep}>
                                        {t('Back')} <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    {!store.display.visible.hide_submit && (
                                        <Button color="dark" onClick={submit} loading={store.loading.status.booking}>
                                            {t('Submit')} <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

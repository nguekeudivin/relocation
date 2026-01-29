import { Button } from '@/components/ui/button';
import Show from '@/components/ui/show';
import { useSimpleForm, validateObject } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import { cn, pick } from '@/lib/utils';
import useAppStore from '@/store';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Clock, FileCheck, MapPinHouse, NotepadText, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CreateBookingFormSchema } from '../booking-schema';
import BookingDateStep from '../steps/booking-date-step';
import BookingDetailStep from '../steps/booking-detail-step';
import BookingLocationStep from '../steps/booking-location-step';
import BookingRecapStep from '../steps/booking-recap-step';

export function CreateBookingModal() {
    const name = 'create_booking';
    const store = useAppStore();

    const display = store.display;
    const isVisible = display.visible[name];
    //const toggleModal = () => display.toggle(name);
    const [reachedSteps, setReachedSteps] = useState<number[]>([0]);
    const [step, setStep] = useState<number>(0);
    const modalRef = useRef<any>(undefined);

    const { t } = useTranslation();

    const form = useSimpleForm({
        date: new Date(),
        time: undefined,
        from_city: '',
        from_postal_code: '',
        from_street: '',
        to_city: '',
        to_street: '',
        to_postal_code: '',
        workers: 2,
        car_type: undefined,
        duration: 2,
        amount: 0,
        distance: 0,
        distance_paderborn: 0,
        transport_price: 0,
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        with_account: true,
        user_id: undefined,
        accept: false,
    });
    // const form = useSimpleForm({
    //     date: new Date('2025-02-15'),
    //     time: undefined,

    //     from_city: 'Berlin',
    //     from_street: 'Alexanderplatz 5',
    //     from_postal_code: '12345',

    //     to_city: 'Hamburg',
    //     to_street: 'Reeperbahn 120',
    //     to_postal_code: '12345',

    //     workers: 2,
    //     car_type: 'van',
    //     distance: 10,
    //     duration: 2,
    //     distance_paderborn: 10,
    //     amount: 300,
    //     transport_price: 150,

    //     first_name: 'Marie',
    //     last_name: 'Keller',
    //     email: 'marie.keller@example.com',
    //     phone_number: '+49 151 2345678',
    //     password: 'password',

    //     with_account: false,
    //     user_id: undefined,
    //     accept: true,
    // });

    useEffect(() => {
        store.setting.fetch({});
    }, []);

    useEffect(() => {
        if (isVisible) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [isVisible]);
    if (!isVisible) return null;

    const nextStep = () => {
        // If the step required validation. Write the validation here.
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
            store.errors.set('accept', 'Please confirmed the use');
            return 0;
        }

        const data = {
            booking: pick(form.values, [
                'date',
                'time',
                'from_city',
                'from_postal_code',
                'from_street',
                'to_city',
                'to_street',
                'to_postal_code',
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
            router.post(route('register'), data, {
                onSuccess: (res) => {
                    store.display.hide(name);
                },
                onError: (error) => {
                    modalRef.current.scrollTo({ top: 0 });
                    store.errors.setMany(error);
                },
            });
        } else {
            store.booking
                .create(data.booking)
                .then((created) => {
                    store.display.hide(name);
                    store.booking.setCurrent(created);
                    store.display.show('success_booking');
                })
                .catch((error) => {
                    modalRef.current.scrollTo({ top: 0 });
                    store.errors.catch(error);
                });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/50">
            <div
                ref={modalRef}
                className={cn('relative max-h-[100vh] overflow-y-auto bg-white md:min-h-[90vh] md:w-[1000px]')}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 z-40 text-white md:top-4 md:text-red-600"
                    onClick={() => {
                        store.display.hide(name);
                    }}
                >
                    <X />
                </button>
                <div className="md:flex">
                    <div className="bg-primary-500/70 w-full shrink-0 py-6 md:min-h-[90vh] md:w-[250px]">
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
                                    onClick={() => {
                                        goToStep(index);
                                    }}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-2 px-6 py-2 text-white hover:bg-gray-800/50 hover:text-white',
                                        {
                                            'bg-gray-800 text-white': index == step,
                                        },
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span className="text-sm">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative col-span-2 w-full p-8 md:min-h-[600px]">
                        <Show when={step == 0}>
                            <BookingLocationStep form={form} />
                        </Show>

                        <Show when={step == 1}>
                            <BookingDateStep form={form} />
                        </Show>

                        <Show when={step == 2}>
                            <BookingDetailStep form={form} />
                        </Show>

                        <Show when={step == 3}>
                            <BookingRecapStep form={form} />
                        </Show>

                        <div className="left-8 flex gap-4 md:absolute md:bottom-6">
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
                                    <Button color="dark" onClick={submit}>
                                        {t('Submit')} <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

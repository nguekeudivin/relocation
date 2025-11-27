import { Button } from '@/components/ui/button';
import Show from '@/components/ui/show';
import cities from '@/config/cities.json';
import { useSimpleForm, validateObject } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import { cn, pick } from '@/lib/utils';
import useAppStore from '@/store';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Clock, FileCheck, MapPinHouse, NotepadText, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreateBookingFormSchema } from '../booking-meta';
import BookingDateStep from '../steps/booking-date-step';
import BookingDetailStep from '../steps/booking-detail-step';
import BookingLocationStep from '../steps/booking-location-step';
import BookingRecapStep from '../steps/booking-recap-step';

export function CreateBookingModal() {
    const name = 'create_booking';
    const store = useAppStore();

    const display = store.display;
    const isVisible = display.visible[name];
    const toggleModal = () => display.toggle(name);

    const { t } = useTranslation();

    const form = useSimpleForm({
        date: new Date(),
        time: new Date(),
        from_city: cities[0],
        from_street: '',
        to_city: cities[0],
        to_street: '',
        workers: 1,
        cars: 0,
        duration: 1,
        amount: 0,
        observation: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
    });

    const [step, setStep] = useState<number>(0);

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
        const schema = CreateBookingFormSchema[step];
        if (schema) {
            const validation = validateObject(form.values, schema);
            if (!validation.valid) {
                store.errors.setMany(validation.errors);
                return;
            }
        }
        setStep((prev) => Math.min(prev + 1, 3));
    };
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

    const submit = () => {
        const data = {
            booking: pick(form.values, ['date', 'time', 'from_city', 'from_street', 'to_city', 'to_street', 'workers', 'cars', 'duration']),
            ...pick(form.values, ['first_name', 'last_name', 'phone_number', 'email', 'password']),
        };
        router.post(route('register'), data, {
            onSuccess: (res) => {
                store.display.hide(name);
            },
            onError: (error) => {
                store.errors.setMany(error);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/50" onClick={toggleModal}>
            <div
                className={cn('relative max-h-[100vh] overflow-y-auto bg-white md:max-h-[90vh] md:min-w-[900px]')}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-6 right-4 z-40 text-white md:top-4"
                    onClick={() => {
                        store.display.hide(name);
                    }}
                >
                    <X />
                </button>
                <div className="md:flex">
                    <div className="bg-primary-500/70 w-full shrink-0 py-6 md:w-[250px]">
                        <h3 className="text-semibold px-6 text-2xl font-semibold text-white">
                            <span className="font-light">{t('Book a relocation')} </span>
                            <span>{t('prestation')}</span>
                        </h3>
                        <ul className="mt-6">
                            {[
                                { text: t('Locations'), icon: MapPinHouse },
                                { text: t('Date and time'), icon: Clock },
                                { text: t('Details'), icon: FileCheck },
                                { text: t('Submission'), icon: NotepadText },
                            ].map((item, index: number) => (
                                <li
                                    key={`menu-item${index}`}
                                    onClick={() => {
                                        setStep(index);
                                    }}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-2 px-6 py-2 text-white hover:bg-gray-800/50 hover:text-white',
                                        {
                                            'bg-gray-800 text-white': index == step,
                                        },
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span className="text-base">{item.text}</span>
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
                                <Button color="dark" onClick={submit}>
                                    {t('Submit')} <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

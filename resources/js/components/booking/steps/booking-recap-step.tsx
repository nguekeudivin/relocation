import { InputField } from '@/components/ui/form';
import PhoneNumberField from '@/components/ui/form/phone-number-field';
import ToggleSwitch from '@/components/ui/form/toggle-switch';
import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { createBookingInstance } from '@/store/Booking';
import { usePage } from '@inertiajs/react';
import { Bus, Clock, Map, Users } from 'lucide-react';
import { useEffect } from 'react';

export default function BookingRecapStep({ form }: { form: any }) {
    const { t, formatDate } = useTranslation();
    const store = useAppStore();
    const { auth } = usePage<any>().props;

    useEffect(() => {
        if (auth.user != undefined) {
            form.setValue('with_account', false);
            form.setValue('user_id', auth.user.id);
        }
    }, [auth.user]);

    const booking = createBookingInstance(form, store.setting.values);

    return (
        <>
            <>{store.errors.render()}</>
            {/* <h3 className="text-lg font-semibold">{t('Submission')}</h3> */}
            <div>
                <div className="mt-4 overflow-hidden border border-gray-200 bg-white">
                    <div className="flex flex-col md:flex-row">
                        {/* Partie gauche : trajet + date */}
                        <div className="flex-1 p-4">
                            <div className="flex items-center justify-between">
                                <time className="text-my-dark text-lg font-bold">
                                    {formatDate(form.values.date, 'dd MMM yyyy')} {formatDate(form.values.time, 'HH:mm')}
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
                                        {booking.destination.street && <p className="text-sm text-gray-600">{booking.destination.street}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Partie droite : détails + prix */}
                        <div className="bg-my-gray relative flex-2 p-3">
                            <div className="space-y-1">
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
                                    <span className="text-sm font-medium">{t('Total amount')}</span>
                                    <span className="font-semibold">{parseFloat(booking.amount as any)} €</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{t('Reversation fee (workers and vehicle taxes)')}</span>
                                    <span className="font-semibold">{parseFloat(booking.tax as any)} €</span>
                                </div>
                            </div>
                            <p className="mt-4 rounded-md bg-blue-50 p-2 text-sm text-blue-900">
                                {t(
                                    'You paid only the reservation fee online. The remaining amount will be paid to the workers at the end of the job',
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Show when={auth.user == undefined}>
                <ToggleSwitch
                    className="mt-4"
                    checked={form.values.with_account}
                    label={t('Create an account and submit')}
                    onChange={(checked: boolean) => {
                        form.setValue('with_account', checked);
                        if (!checked) {
                            store.errors.reset();
                        } else {
                            form.setValue('car_type', 'van');
                        }
                    }}
                />

                <Show when={!form.values.with_account}>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                            name="first_name"
                            value={form.values.first_name}
                            onChange={form.handleChange}
                            label={t('Your first name')}
                            error={store.errors.values.first_name}
                        />
                        <InputField
                            name="last_name"
                            value={form.values.last_name}
                            onChange={form.handleChange}
                            label={t('Your last name')}
                            error={store.errors.values.last_name}
                        />
                    </div>

                    <InputField
                        className="mt-4"
                        name="email"
                        value={form.values.email}
                        onChange={form.handleChange}
                        label={t('Your email')}
                        error={store.errors.values.email}
                    />

                    <p className="mt-2 text-sm text-gray-600">{t('This email is use for booking confirmation')}</p>
                </Show>

                <Show when={form.values.with_account}>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                            name="first_name"
                            value={form.values.first_name}
                            onChange={form.handleChange}
                            label={t('Your first name')}
                            error={store.errors.values.first_name}
                        />
                        <InputField
                            name="last_name"
                            value={form.values.last_name}
                            onChange={form.handleChange}
                            label={t('Your last name')}
                            error={store.errors.values.last_name}
                        />

                        <InputField
                            name="email"
                            value={form.values.email}
                            onChange={form.handleChange}
                            label={t('Your email')}
                            error={store.errors.values.email}
                        />

                        <div>
                            <label className={cn('mb-1.5 block text-sm font-medium text-gray-900')}>{t('Phone number')}</label>
                            <PhoneNumberField
                                value={form.values.phone_number}
                                onValueChange={(value: string) => {
                                    form.setValue('phone_number', value);
                                }}
                                error={store.errors.values.phone_number}
                            />
                        </div>

                        <InputField
                            name="password"
                            canToggleType={true}
                            type="password"
                            value={form.values.password}
                            onChange={form.handleChange}
                            label={t('Choose a password to access your account')}
                            error={store.errors.values.password}
                        />
                    </div>
                </Show>
            </Show>

            <div className="h-8 md:h-20"></div>
        </>
    );
}

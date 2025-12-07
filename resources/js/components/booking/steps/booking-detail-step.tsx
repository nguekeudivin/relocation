import { InputField } from '@/components/ui/form';
import InputLabel from '@/components/ui/form/input-label';
import ToggleSwitch from '@/components/ui/form/toggle-switch';
import { Bus, Van } from '@/components/ui/icons';
import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { getSettingObject } from '@/store/Setting';
import { addDays, getDay, isBefore, startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';
import BookingCostCard from './booking-cost-card';

interface Props {
    form: any;
    showCost?: boolean;
    showError?: boolean;
}

export default function BookingDetailStep({ form, showCost = true, showError = true }: Props) {
    const { t } = useTranslation();
    const store = useAppStore();
    const [needCars, setNeedCars] = useState<boolean>(false);

    const [settings, setSettings] = useState<Record<string, any>>({
        car_price_weekday_job: 0,
        car_price_weekend_job: 0,
        fee_per_km: 0,
        available_workers: 0,
    });

    useEffect(() => {}, []);

    // Main logic: transport pricing + advance booking validation
    useEffect(() => {
        if (!needCars || !form.values.date) {
            form.setValue('transport_price', 0);
            store.errors.reset();
            return;
        }

        const selectedDate = startOfDay(new Date(form.values.date));
        const today = startOfDay(new Date());
        const dayOfWeek = getDay(selectedDate); // 0=Sunday, 1=Monday, ..., 6=Saturday

        const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 4; // Mon–Thu
        const requiredDays = isWeekday ? 5 : 14;
        const basePrice = isWeekday ? settings.car_price_weekday_job : settings.car_price_weekend_job;

        const minAllowedDate = addDays(today, requiredDays);

        // Update form values
        form.setValue('transport_price', basePrice);

        // Validation: not enough advance notice
        if (isBefore(selectedDate, minAllowedDate)) {
            const period = isWeekday ? t('weekday (Monday to Thursday)') : t('weekend (Friday to Sunday)');
            const message = t('Vehicle booking for a {{period}} job must be made at least {{days}} days in advance.', { period, days: requiredDays });
            store.errors.set('date', message);
        } else {
            store.errors.reset();
        }
    }, [needCars, form.values.date]);

    useEffect(() => {
        store.setting
            .fetch()
            .then((items: any) => {
                setSettings(getSettingObject(items));
                if (form.values.car_type != '' && form.values.car_type != null && form.values.car_type != undefined) {
                    setNeedCars(true);
                }
            })
            .catch(store.errors.catch);
    }, []);

    return (
        <>
            <h3 className="text-lg font-semibold">{t('Provide details about the service')}</h3>

            <Show when={showError}>{store.errors.render()}</Show>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <div className="col-span-2 mt-4 space-y-6">
                    <div>
                        <InputField
                            name="workers"
                            type="number"
                            label={t('How many workers do you need?')}
                            value={form.values.workers}
                            onChange={form.handleChange}
                        />
                        <p className="mt-1 text-xs text-gray-700">{t('Availables workers : :workers', { workers: settings.available_workers })}</p>
                    </div>

                    <InputField
                        name="duration"
                        type="number"
                        label={t('How long will the job take (in hours)?')}
                        value={form.values.duration}
                        onChange={form.handleChange}
                    />

                    <ToggleSwitch
                        checked={needCars}
                        label={t('Does the job require vehicles?')}
                        onChange={(checked: boolean) => {
                            setNeedCars(checked);
                            if (!checked) {
                                form.setValue('cars', 0);
                                form.setValue('car_type', '');
                                form.setValue('transport_price', 0);
                                store.errors.reset();
                            } else {
                                form.setValue('car_type', 'van');
                            }
                        }}
                    />
                </div>
                <Show when={showCost}>
                    <div className="col-span-2 hidden md:block">
                        <BookingCostCard form={form} />
                    </div>
                </Show>
            </div>

            <Show when={needCars}>
                <div className="mt-4 space-y-4">
                    <InputLabel>{t('Which type of vehicle do you need?')}</InputLabel>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => form.setValue('car_type', 'van')}
                            className={cn(
                                'flex flex-col items-center justify-center rounded-lg border-2 p-6 transition-all',
                                form.values.car_type === 'van' ? 'border-primary-500 bg-primary-50' : 'hover:border-primary-300 border-gray-300',
                            )}
                        >
                            <Van size={48} className="text-primary-500 mb-3" />
                            <span className="text-sm font-medium">{t('3.5-ton Van')}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => form.setValue('car_type', 'bus')}
                            className={cn(
                                'flex flex-col items-center justify-center rounded-lg border-2 p-6 transition-all',
                                form.values.car_type === 'bus' ? 'border-primary-500 bg-primary-50' : 'hover:border-primary-300 border-gray-300',
                            )}
                        >
                            <Bus size={48} className="text-primary-500 mb-3" />
                            <span className="text-sm font-medium">{t('Minibus / Coaster')}</span>
                        </button>
                    </div>

                    {/* Helpful info box */}
                    {form.values.date && (
                        <div className="rounded-lg bg-gray-50 p-4 text-sm text-blue-900">
                            {(() => {
                                const day = getDay(new Date(form.values.date));
                                const isWeekday = day >= 1 && day <= 4;
                                return isWeekday ? (
                                    <p>
                                        <strong>{t('Weekday job')}</strong> {'→'}
                                        {`${settings.car_price_weekday_job}€ + ${settings.fee_per_km}€/km`}
                                        <span className="ml-2">({t('booking required 5 days in advance')})</span>
                                    </p>
                                ) : (
                                    <p>
                                        <strong>{t('Weekend job')}</strong> {'→'}
                                        {`${settings.car_price_weekend_job}€ + ${settings.fee_per_km}€/km`}
                                        <span className="ml-2">({t('booking required 14 days in advance')})</span>
                                    </p>
                                );
                            })()}
                        </div>
                    )}
                </div>
            </Show>

            <Show when={showCost}>
                <div className="block md:hidden">
                    <div className="mt-4 md:mt-0"></div>
                    <BookingCostCard form={form} />
                </div>
            </Show>

            <div className="h-8 md:h-20" />
        </>
    );
}

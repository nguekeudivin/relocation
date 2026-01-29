import { InputField } from '@/components/ui/form';
import InputLabel from '@/components/ui/form/input-label';
import ToggleSwitch from '@/components/ui/form/toggle-switch';
import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { getTransportBasePrice } from '@/store/Booking';
import { addDays, getDay, isBefore, startOfDay } from 'date-fns';
import { useEffect } from 'react';
import BookingCostCard from './booking-cost-card';

interface Props {
    form: any;
    showCost?: boolean;
    showError?: boolean;
}

export default function BookingDetailStep({ form, showCost = true, showError = true }: Props) {
    const { t } = useTranslation();
    const store = useAppStore();
    const settings = store.setting.values;

    // Main logic: transport pricing + advance booking validation
    useEffect(() => {
        if (form.values.car_type == undefined || !form.values.date) {
            form.setValue('transport_price', 0);
            store.errors.reset();
            return;
        }

        const selectedDate = startOfDay(new Date(form.values.date));
        const today = startOfDay(new Date());
        const dayOfWeek = getDay(selectedDate); // 0=Sunday, 1=Monday, ..., 6=Saturday

        const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 4; // Mon–Thu
        const requiredDays = isWeekday ? 5 : 14;

        const basePrice = getTransportBasePrice(form, settings, isWeekday);

        const minAllowedDate = addDays(today, requiredDays);

        // Update form values
        form.setValue('transport_price', basePrice);

        // Validation: not enough advance notice
        if (isBefore(selectedDate, minAllowedDate)) {
            const period = isWeekday ? t('weekday (Monday to Thursday)') : t('weekend (Friday to Sunday)');
            const message = t('Vehicle booking for a :period job must be made at least :days days in advance.', { period, days: requiredDays });
            store.errors.set('date', message);
        } else {
            store.errors.reset();
        }
    }, [form.values.car_type, form.values.date, settings]);

    return (
        <>
            <h3 className="text-lg font-semibold">{t('Provide details about the service')}</h3>

            <Show when={showError}>{store.errors.render()}</Show>

            <div className="mt-4 mb-4 grid grid-cols-1 gap-8 md:grid-cols-4">
                <div className="col-span-2 space-y-4">
                    <div>
                        <InputField
                            name="workers"
                            type="number"
                            label={t('How many workers do you need?')}
                            value={form.values.workers}
                            onChange={(e: any) => {
                                const value = e.target.value;
                                if (value <= parseInt(settings.available_workers)) {
                                    form.setValue('workers', value);
                                }
                            }}
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
                    <div>
                        <InputField
                            name="distance_paderborn"
                            type="number"
                            label={t('What is the distance the pickup place you and Paterborn ?')}
                            value={form.values.distance_paderborn}
                            onChange={form.handleChange}
                        />
                        <small className="text-xs text-gray-600">{t('You pay transport if you are outside Paterbon')}</small>
                    </div>
                </div>

                <div className="col-span-2">
                    <div className="bg-gray-100 p-4">
                        <ToggleSwitch
                            checked={form.values.car_type != undefined}
                            label={t('Does the job require vehicles?')}
                            onChange={(checked: boolean) => {
                                if (!checked) {
                                    form.setValue('cars', 0);
                                    form.setValue('car_type', undefined);
                                    form.setValue('transport_price', 0);
                                    store.errors.reset();
                                } else {
                                    form.setValue('car_type', 'van');
                                }
                            }}
                        />
                    </div>

                    <Show when={form.values.car_type != undefined}>
                        <div className="mt-4 space-y-4">
                            <InputField
                                name="distance"
                                type="number"
                                label={t('How long is the distance in km ?')}
                                value={form.values.distance}
                                onChange={form.handleChange}
                            />
                            <InputLabel>{t('Which type of vehicle do you need?')}</InputLabel>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => form.setValue('car_type', 'van')}
                                    className={cn(
                                        'flex w-[150px] flex-col items-center justify-center rounded-lg border-2 p-2 transition-all',
                                        form.values.car_type === 'van'
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'hover:border-primary-300 border-gray-300',
                                    )}
                                >
                                    <img src="/images/van.svg" />
                                    <span className="text-sm font-medium">{t('3.5-ton Van')}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => form.setValue('car_type', 'bus')}
                                    className={cn(
                                        'flex w-[150px] flex-col items-center justify-center rounded-lg border-2 p-2 transition-all',
                                        form.values.car_type === 'bus'
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'hover:border-primary-300 border-gray-300',
                                    )}
                                >
                                    <img src="/images/bus.svg" />
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
                                                {`${getTransportBasePrice(form, settings, true)}€ + ${settings.fee_per_km}€/km`}
                                                <span className="ml-2">({t('booking required 5 days in advance')})</span>
                                            </p>
                                        ) : (
                                            <p>
                                                <strong>{t('Weekend job')}</strong> {'→'}
                                                {`${getTransportBasePrice(form, settings, false)}€ + ${settings.fee_per_km}€/km`}
                                                <span className="ml-2">({t('booking required 14 days in advance')})</span>
                                            </p>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </Show>
                </div>
            </div>

            <Show when={showCost}>
                <div className="hidden md:block">
                    <BookingCostCard form={form} />
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

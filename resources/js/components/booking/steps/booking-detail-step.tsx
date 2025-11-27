import { InputField } from '@/components/ui/form';
import ToggleSwitch from '@/components/ui/form/toggle-switch';
import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { useState } from 'react';
import BookingCostCard from './booking-cost-card';

export default function BookingDetailStep({ form }: { form: any }) {
    const { t } = useTranslation();
    const store = useAppStore();

    const [needCars, setNeedCars] = useState<boolean>(false);

    return (
        <>
            <h3 className="text-lg font-semibold">{t('Provide details about the prestation')}</h3>

            <>{store.errors.render()}</>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <div className="col-span-2 mt-4 space-y-4">
                    <InputField
                        name="workers"
                        type="number"
                        label={t('How many workers do you need?')}
                        value={form.values.workers}
                        onChange={form.handleChange}
                    />
                    <InputField
                        name="duration"
                        type="number"
                        label={t('How long will the process take (in hours)?')}
                        value={form.values.duration}
                        onChange={form.handleChange}
                    />
                    <ToggleSwitch
                        checked={needCars}
                        label={t('Does the process require vehicles?')}
                        onChange={(checked: boolean) => {
                            setNeedCars(checked);
                            if (!checked) {
                                form.setValue('cars', 0);
                            }
                        }}
                    />
                    <Show when={needCars}>
                        <InputField
                            name="cars"
                            type="number"
                            label={t('How many vehicles are needed?')}
                            value={form.values.cars}
                            onChange={form.handleChange}
                        />
                    </Show>
                </div>
                <div className="col-span-2">
                    <BookingCostCard form={form} />
                </div>
            </div>

            <div className="h-8 md:h-20"></div>
        </>
    );
}

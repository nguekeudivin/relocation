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
            <h3 className="text-lg font-semibold">{t('Provide detail about the prestation')}</h3>

            <div className="grid grid-cols-4 gap-8">
                <div className="col-span-2 mt-4 space-y-4">
                    <InputField
                        name="workers"
                        type="integer"
                        label="How many workers to you need ?"
                        value={form.values.workers}
                        onChange={form.handleChange}
                    />
                    <InputField
                        name="duration"
                        label="How much time the process may take (in hours)?"
                        value={form.values.duration}
                        onChange={form.handleChange}
                    />
                    <ToggleSwitch
                        checked={needCars}
                        label="The process required vehicles ?"
                        onChange={(checked: boolean) => {
                            setNeedCars(checked);
                            if (!checked) {
                                form.setValue('cars', 0);
                            }
                        }}
                    />
                    <Show when={needCars}>
                        <InputField name="cars" label="How many vehicles are needed" value={form.values.cars} onChange={form.handleChange} />
                    </Show>
                </div>
                <div className="col-span-2">
                    <BookingCostCard form={form} />
                </div>
            </div>

            <div className="h-20"></div>
        </>
    );
}

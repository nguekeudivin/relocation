import { InputField, SelectField, TextAreaField } from '@/components/ui/form';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';

export function BookingForm({ form }: { form: any }) {
    const store = useAppStore();
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
                label={t('Date & Time')}
                name="date"
                type="datetime-local"
                value={form.values.date}
                onChange={form.handleChange}
                error={store.errors.values.date}
            />
            <SelectField
                label={t('Origin')}
                name="origin_id"
                value={form.values.origin_id}
                onChange={form.handleChange}
                error={store.errors.values.origin_id}
                options={[]}
            />
            <SelectField
                label={t('Destination')}
                name="destination_id"
                value={form.values.destination_id}
                onChange={form.handleChange}
                error={store.errors.values.destination_id}
                options={[]}
            />
            <InputField
                label={t('Workers')}
                name="workers"
                type="number"
                value={form.values.workers}
                onChange={form.handleChange}
                error={store.errors.values.workers}
            />
            <InputField
                label={t('Cars')}
                name="cars"
                type="number"
                value={form.values.cars ?? ''}
                onChange={form.handleChange}
                error={store.errors.values.cars}
                placeholder={t('Optional')}
            />
            <InputField
                label={t('Duration (hours)')}
                name="duration"
                type="number"
                step="0.5"
                value={form.values.duration}
                onChange={form.handleChange}
                error={store.errors.values.duration}
            />
            <InputField
                label={t('Amount')}
                name="amount"
                type="number"
                step="0.01"
                value={form.values.amount}
                onChange={form.handleChange}
                error={store.errors.values.amount}
            />
            <TextAreaField
                label={t('Observation')}
                name="observation"
                value={form.values.observation ?? ''}
                onChange={form.handleChange}
                error={store.errors.values.observation}
                className="md:col-span-2"
                placeholder={t('Optional notes')}
            />
        </div>
    );
}

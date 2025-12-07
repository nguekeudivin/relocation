import { InputField, TextAreaField } from '@/components/ui/form';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';

export function SlotForm({ form }: { form: any }) {
    const store = useAppStore();
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
            <InputField
                label={t('Start Date')}
                name="date"
                type="date"
                value={form.values.date}
                onChange={form.handleChange}
                error={store.errors.values.date}
            />
            <InputField
                label={t('From Hour')}
                name="from_hour"
                type="time"
                value={form.values.from_hour}
                onChange={form.handleChange}
                error={store.errors.values.from_hour}
            />
            <InputField
                label={t('To Hour')}
                name="to_hour"
                type="time"
                value={form.values.to_hour}
                onChange={form.handleChange}
                error={store.errors.values.to_hour}
            />
            <TextAreaField
                label={t('Description')}
                name="description"
                value={form.values.description ?? ''}
                onChange={form.handleChange}
                error={store.errors.values.description}
                placeholder={t('Optional description')}
            />
        </div>
    );
}

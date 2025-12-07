import { InputField } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';

// Format JS Date → "YYYY-MM-DDTHH:mm" (required by datetime-local)
function formatForInput(date: string) {
    return new Date(date).toISOString().split('T')[0];
}

export function CreateManySlotModal() {
    const name = 'create_many_slots';
    const store = useAppStore();
    const { t } = useTranslation();

    const form = useSimpleForm({
        start_date: formatForInput('2025-12-01T08:00'),
        end_date: formatForInput('2025-12-10T08:00'),
    });

    const submit = async () => {
        // Convert for backend (ISO8601)
        const start = new Date(form.values.start_date).toISOString();
        const end = new Date(form.values.end_date).toISOString();

        await store.slot.createMany(start, end);
        window.location.reload();
    };

    return (
        <Modal
            title={t('Add disponibility')}
            name={name}
            className="w-[450px] max-w-[95vw]"
            footer={{ name, submit, loading: store.slot.loading('create') }}
        >
            <div className="space-y-4">
                <InputField
                    label={t('Start Date')}
                    name="start_date"
                    type="date"
                    value={form.values.start_date}
                    onChange={form.handleChange}
                    error={store.errors.values.start_date}
                />

                <InputField
                    label={t('End Date')}
                    name="end_date"
                    type="date"
                    value={form.values.end_date}
                    onChange={form.handleChange}
                    error={store.errors.values.end_date}
                />
            </div>
        </Modal>
    );
}

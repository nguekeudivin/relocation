import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { Slot } from '@/store/Slot';
import { X } from 'lucide-react';
import { useEffect } from 'react';

// Format a datetime → "HH:MM"
const formatTime = (value: string) => (value ? value.slice(11, 16) : '');

// Format a date → "YYYY-MM-DD"
const formatDate = (value: string) => (value ? value.slice(0, 10) : '');

export function EditSlotModal() {
    const name = 'edit_slot';
    const { t } = useTranslation();
    const store = useAppStore();
    const slot = store.slot.current as Slot | null;

    const form = useSimpleForm({
        date: '',
        from_hour: '',
        to_hour: '',
        description: '',
    });

    // When modal opens & slot exists → preload values
    useEffect(() => {
        if (!slot) return;
        if (!store.display.visible[name]) return;

        form.setValues({
            date: formatDate(slot.date),
            from_hour: formatTime(slot.from_hour),
            to_hour: formatTime(slot.to_hour),
            description: slot.description ?? '',
        });
    }, [slot, store.display.visible[name]]);

    const submit = async () => {
        if (!slot) return;

        await store.slot.update(slot.id, {
            ...form.values,
        });

        store.slot.fetch();
        store.display.hide(name);
    };

    return (
        <Modal
            title={t('Edit disponibility')}
            name={name}
            className="w-[500px] max-w-[95vw]"
            footer={{ name, submit, loading: store.slot.loading('update') }}
        >
            <div className="space-y-4">
                <InputField
                    label={t('Date')}
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

                <div>
                    <Button
                        onClick={async () => {
                            await store.slot.destroy(slot?.id as any);
                            store.slot.fetch({});
                            store.display.hide(name);
                        }}
                        loading={store.slot.loading('destroy')}
                        className="flex items-center gap-1 border border-red-200 bg-red-50 px-4 py-1.5 font-medium text-red-600 hover:bg-red-100 hover:underline"
                    >
                        <X className="h-4 w-4" />
                        {t('Delete')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

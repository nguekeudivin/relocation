import { Modal } from '@/components/ui/modal';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { Slot } from '@/store/Slot';
import { useEffect } from 'react';
import { SlotForm } from '../slot-form';

export function EditSlotModal() {
    const name = 'edit_slot';
    const store = useAppStore();
    const { t } = useTranslation();
    const slot = store.slot.current as Slot | null;

    const form = useSimpleForm({
        date: '',
        from_hour: '',
        to_hour: '',
        description: '',
    });

    useEffect(() => {
        if (slot && store.display.visible[name]) {
            form.setValues({
                date: slot.date,
                from_hour: slot.from_hour.slice(0, 5),
                to_hour: slot.to_hour.slice(0, 5),
                description: slot.description ?? '',
            });
        }
    }, [store.display.visible[name], slot]);

    const submit = async () => {
        if (!slot) return;
        await store.slot.update(slot.id, form.values);
        store.slot.fetch();
        store.display.hide(name);
    };

    return (
        <Modal title={t('Edit Slot')} name={name} className="w-[700px] max-w-[95vw]" footer={{ name, submit, loading: store.slot.loading('update') }}>
            <SlotForm form={form} />
        </Modal>
    );
}

import { Modal } from '@/components/ui/modal';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { SlotForm } from '../slot-form';

export function CreateSlotModal() {
    const name = 'create_slot';
    const store = useAppStore();
    const { t } = useTranslation();

    const form = useSimpleForm({
        date: '',
        from_hour: '',
        to_hour: '',
        description: '',
    });

    const submit = async () => {
        await store.slot.create(form.values);
        store.slot.fetch();
        store.display.hide(name);
    };

    return (
        <Modal
            title={t('Add disponibility')}
            name={name}
            className="w-[450px] max-w-[95vw]"
            footer={{ name, submit, loading: store.slot.loading('create') }}
        >
            <SlotForm form={form} />
        </Modal>
    );
}

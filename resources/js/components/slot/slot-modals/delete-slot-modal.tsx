import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { TriangleAlert } from 'lucide-react';

export function DeleteSlotModal() {
    const name = 'delete_slot';
    const store = useAppStore();
    const { t } = useTranslation();
    const slot = store.slot.current;

    const submit = async () => {
        if (!slot) return;
        await store.slot.destroy(slot.id);
        store.slot.fetch();
        store.display.hide(name);
    };

    if (!slot) return null;

    return (
        <Modal name={name} className="w-[500px]" header={<></>}>
            <div className="flex flex-col items-center text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <TriangleAlert className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{t('Delete Slot?')}</h3>
                <p className="mt-2 text-sm text-gray-600">{t('This action cannot be undone.')}</p>
                <div className="mt-4 rounded bg-red-50 px-4 py-2 font-medium text-red-700">
                    {slot.date} • {slot.from_hour.slice(0, 5)} → {slot.to_hour.slice(0, 5)}
                </div>
                <div className="mt-6 flex gap-3">
                    <Button color="neutral" onClick={() => store.display.hide(name)}>
                        {t('Cancel')}
                    </Button>
                    <Button color="red" onClick={submit} loading={store.slot.loading('destroy')}>
                        {t('Delete')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

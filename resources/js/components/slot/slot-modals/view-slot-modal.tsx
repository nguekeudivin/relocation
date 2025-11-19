import { InfoElement } from '@/components/shared/details';
import { Modal } from '@/components/ui/modal';
import useTranslation from '@/hooks/use-translation';
import { formatDate } from '@/lib/utils';
import useAppStore from '@/store';
import { Slot } from '@/store/Slot';

export function ViewSlotModal() {
    const name = 'view_slot';
    const store = useAppStore();
    const { t } = useTranslation();
    const slot = store.slot.current as Slot | null;

    if (!slot) return null;

    const details = [
        { label: t('Date'), value: formatDate(slot.date) },
        { label: t('From'), value: slot.from_hour.slice(0, 5) },
        { label: t('To'), value: slot.to_hour.slice(0, 5) },
        { label: t('Description'), value: slot.description || '—' },
        { label: t('Created At'), value: slot.created_at ? formatDate(slot.created_at) : '—' },
        { label: t('Updated At'), value: slot.updated_at ? formatDate(slot.updated_at) : '—' },
    ];

    return (
        <Modal title={t('Disponibility Details')} name={name} className="w-[600px] max-w-[95vw]">
            <div className="space-y-6">
                <section className="rounded-lg bg-gray-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold">{t('Disponibility Information')}</h3>
                    <ul className="grid grid-cols-2 gap-4 text-sm">
                        {details.map((d) => (
                            <InfoElement key={d.label} detail={d} />
                        ))}
                    </ul>
                </section>
            </div>
        </Modal>
    );
}
